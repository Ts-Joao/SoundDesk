from uuid import UUID

from app.downloads.models import DownloadJob
from app.downloads.repository import DownloadJobRepository
from app.enums.download_status import DownloadStatus
from app.enums.track_status import TrackStatus
from app.exceptions.exceptions import BadRequestException, ForbiddenException, NotFoundException
from app.playlists.repository import PlaylistRepository


class DownloadJobService:
    def __init__(self, repository: DownloadJobRepository, playlist_repository: PlaylistRepository):
        self.repository = repository
        self.playlist_repository = playlist_repository

    def download_playlist(self, playlist_id: UUID, user_id: UUID) -> int:
        from app.playlists.service import PlaylistService

        playlist = PlaylistService(self.playlist_repository).find_by_id(playlist_id, user_id)
        jobs_to_enqueue: list[DownloadJob] = []
        jobs_created = 0
        try:
            for playlist_track in playlist.tracks:
                track = self.repository.lock_track(playlist_track.id)
                if track is None or track.status == TrackStatus.READY:
                    continue

                already_running = self.repository.has_active_job(track.id)
                job = self.repository.create(track.id, user_id)
                jobs_created += 1
                if not already_running:
                    jobs_to_enqueue.append(job)
            self.repository.db.commit()
        except Exception:
            self.repository.db.rollback()
            raise

        for job in jobs_to_enqueue:
            self._enqueue(job)
        return jobs_created

    def _enqueue(self, job: DownloadJob) -> None:
        from app.workers.tasks import process_download

        task = process_download.delay(str(job.id), str(job.track_id))
        try:
            self.repository.set_celery_task_id(job.id, task.id)
            self.repository.db.commit()
        except Exception:
            self.repository.db.rollback()
            raise

    def find_all(self, user_id: UUID, status: DownloadStatus | None = None) -> list[DownloadJob]:
        return self.repository.find_all(user_id, status)

    def find_by_id(self, job_id: UUID, user_id: UUID | None = None) -> DownloadJob:
        job = self.repository.find_by_id(job_id)
        if job is None:
            raise NotFoundException("Download job not found")
        if user_id is not None:
            self._verify_ownership(job, user_id)
        return job

    def start(self, job_id: UUID) -> bool:
        job = self.find_by_id(job_id)
        if not self.repository.claim(job_id):
            self.repository.db.rollback()
            return False
        self.repository.mark_pending_siblings_processing(job.track_id, job_id)
        self.repository.db.commit()
        return True

    def complete_track(self, track_id: UUID) -> None:
        self.repository.finish_active_jobs(track_id, DownloadStatus.COMPLETED)
        self.repository.db.commit()

    def fail_track(self, track_id: UUID, error_message: str) -> None:
        self.repository.finish_active_jobs(track_id, DownloadStatus.FAILED, error_message[:2000])
        self.repository.db.commit()

    def retry(self, job_id: UUID, user_id: UUID) -> DownloadJob:
        old_job = self.find_by_id(job_id, user_id)
        if old_job.status != DownloadStatus.FAILED:
            raise BadRequestException("Only failed jobs can be retried")

        try:
            track = self.repository.lock_track(old_job.track_id)
            if track is None:
                raise NotFoundException("Track not found")
            active = self.repository.has_active_job(track.id)
            new_job = self.repository.create(track.id, user_id)
            self.repository.db.commit()
        except Exception:
            self.repository.db.rollback()
            raise
        if not active:
            self._enqueue(new_job)
        return new_job

    def cancel(self, job_id: UUID, user_id: UUID) -> DownloadJob:
        job = self.find_by_id(job_id, user_id)
        if job.status not in (DownloadStatus.PENDING, DownloadStatus.PROCESSING):
            raise BadRequestException("Only pending or processing jobs can be canceled")

        try:
            track = self.repository.lock_track(job.track_id)
            if track is None:
                raise NotFoundException("Track not found")
            self.repository.cancel(job.id)
            still_active = self.repository.has_active_job(job.track_id)
            if not still_active:
                track.status = TrackStatus.CANCELED
            self.repository.db.commit()
        except Exception:
            self.repository.db.rollback()
            raise

        if not still_active and job.celery_task_id:
            from app.workers.celery import celery_app
            celery_app.control.revoke(job.celery_task_id, terminate=True)
        return self.find_by_id(job.id, user_id)

    @staticmethod
    def _verify_ownership(job: DownloadJob, user_id: UUID) -> None:
        if job.user_id != user_id:
            raise ForbiddenException("You don't have permission to perform this action")

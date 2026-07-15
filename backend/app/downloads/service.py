from uuid import UUID

from app.exceptions.exceptions import NotFoundException, BadRequestException, ForbiddenException
from app.enums.download_status import DownloadStatus
from app.enums.track_status import TrackStatus
from app.downloads.models import DownloadJob
from app.downloads.repository import DownloadJobRepository
from app.playlists.repository import PlaylistRepository


class DownloadJobService:
    def __init__(
            self,
            repository: DownloadJobRepository,
            playlist_repository: PlaylistRepository,
    ):
        self.repository = repository
        self.playlist_repository = playlist_repository

    def download_playlist(
            self,
            playlist_id: UUID,
    ):
        from app.workers.tasks import process_download

        playlist = self.playlist_repository.find_by_id(playlist_id)
        jobs_created = 0

        for track in playlist.tracks:
            if track.status == TrackStatus.READY:
                continue
            if self.repository.find_active_job_by_track(track_id=track.id):
                continue

            job = self.repository.create(track_id=track.id)
            task = process_download.delay(
                str(job.id),
                str(track.id)
            )
            self.repository.update_celery_task_id(job.id, task.id)

            jobs_created += 1
        return jobs_created

    def find_all(
            self,
            user_id: UUID,
            status: DownloadStatus | None = None,
    ):
        return self.repository.find_all(user_id, status)

    def find_by_id(
            self,
            job_id: UUID,
            user_id: UUID
    ):
        job = self.repository.find_by_id(job_id)

        if not job:
            raise NotFoundException("Download job not found")

        self._verify_ownership(job, user_id)

        return job

    def start(self, job_id: UUID):
        self.repository.find_by_id(job_id)

        self.repository.update_status(job_id, DownloadStatus.PROCESSING)

    def complete(self, job_id: UUID):
        self.repository.find_by_id(job_id)

        self.repository.update_status(job_id, DownloadStatus.COMPLETED)

    def fail(self, job_id: UUID, error_msg: str):
        self.repository.find_by_id(job_id)

        self.repository.update_status(job_id, DownloadStatus.FAILED, error_msg)

    def retry(self, job_id: UUID):
        job = self.repository.find_by_id(job_id)

        if job.status != DownloadStatus.FAILED:
            raise BadRequestException("Only failed jobs can be retried")

        self.repository.update_status(job_id, DownloadStatus.RETRYING)

        new_job = self.repository.create(track_id=job.track_id)

        from app.workers.tasks import process_download
        task = process_download.delay(str(new_job.id), str(new_job.track_id))

        self.repository.update_celery_task_id(new_job.id, task.id)

        return new_job

    def cancel(self, job_id: UUID):
        job = self.repository.find_by_id(job_id)

        if job.status not in (DownloadStatus.PENDING, DownloadStatus.PROCESSING):
            raise BadRequestException("Only pending or processing jobs can be canceled")

        if job.celery_task_id:
            from app.workers.celery import celery_app
            celery_app.control.revoke(job.celery_task_id, terminate=True)

        self.repository.update_status(job_id, DownloadStatus.CANCELED)
        return self.find_by_id(job_id)

    @staticmethod
    def _verify_ownership(
            job: DownloadJob,
            user_id: UUID
    ) -> None:
        if job.user_id != user_id:
            raise ForbiddenException("You don't have permission to perform this action")
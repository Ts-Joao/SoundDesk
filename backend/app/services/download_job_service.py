from uuid import UUID

from app.core.exceptions import NotFoundException
from app.enums.download_status import DownloadStatus
from app.enums.track_status import TrackStatus
from app.repositories.download_job_repository import DownloadJobRepository
from app.repositories.playlist_repository import PlaylistRepository


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

            existing_job = (
                self.repository
                .find_active_job_by_track(track_id=track.id)
            )

            if existing_job:
                continue

            job = self.repository.create(
                track_id=track.id
            )

            process_download(job.id, track.id)

            jobs_created += 1

        return jobs_created

    def find_all(
            self,
            status: DownloadStatus | None = None,
    ):
        return self.repository.find_all(status)

    def find_by_id(
            self,
            job_id: UUID
    ):
        job = self.repository.find_by_id(job_id)

        if not job:
            raise NotFoundException("Download job not found")

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
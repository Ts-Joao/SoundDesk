from uuid import UUID

from app.core.exceptions import NotFoundException, ConflictException
from app.enums.download_status import DownloadStatus
from app.repositories.download_job_repository import DownloadJobRepository
from app.repositories.playlist_repository import PlaylistRepository
from app.workers.tasks import process_download


class DownloadJobService:
    def __init__(
            self,
            repository: DownloadJobRepository,
            playlist_repository: PlaylistRepository
    ):
        self.repository = repository
        self.playlist_repository = playlist_repository

    def download_playlist(
            self,
            playlist_id: UUID,
    ):
        playlist = self.playlist_repository.find_by_id(playlist_id)

        jobs_created = 0

        for track in playlist.tracks:
            if track.status == DownloadStatus.COMPLETED:
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

            self.repository.update_status(
                job_id=job.id,
                status=DownloadStatus.PROCESSING
            )

            process_download.delay(
                str(job.id)
            )

            self.repository.update_status(
                job_id=job.id,
                status=DownloadStatus.COMPLETED
            )

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
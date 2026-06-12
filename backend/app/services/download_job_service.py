from uuid import UUID

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
            job = self.repository.create(
                track_id=track.id
            )

            process_download.delay(
                str(job.id)
            )

            jobs_created += 1

        return jobs_created
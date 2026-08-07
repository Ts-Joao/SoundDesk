from uuid import UUID

from app.downloads.repository import DownloadJobRepository
from app.exports.repository import ExportJobRepository
from app.playlists.repository import PlaylistRepository
from app.tracks.repository import TrackRepository


class DashboardService:
    def __init__(
            self,
            track_repo: TrackRepository,
            playlist_repo: PlaylistRepository,
            download_repo: DownloadJobRepository,
            export_repo: ExportJobRepository
    ):
        self.playlist_repo = playlist_repo
        self.track_repo = track_repo
        self.download_repo = download_repo
        self.export_repo = export_repo

    def get_dashboard(self, user_id: UUID):
        stats = {
            "total_tracks": self.track_repo.count_by_user(user_id),
            "total_playlists": self.playlist_repo.count_by_user(user_id),
            "completed_downloads": self.download_repo.count_completed(user_id),
            "processing_downloads": self.download_repo.count_processing(user_id),
            "failed_downloads": self.download_repo.count_failed(user_id),
            "completed_exports": self.export_repo.count_completed(user_id),
            "processing_exports": self.export_repo.count_processing(user_id),
        }

        recent_tracks = self.track_repo.find_recent(user_id)
        recent_playlists = self.playlist_repo.find_recent(user_id)
        recent_downloads = self.download_repo.find_recent(user_id)
        recent_exports = self.export_repo.find_recent(user_id)

        return {
            "stats": stats,
            "recent_tracks": recent_tracks,
            "recent_playlists": recent_playlists,
            "recent_downloads": recent_downloads,
            "recent_exports": recent_exports,
        }
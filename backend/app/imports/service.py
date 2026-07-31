from app.downloads.service import DownloadJobService
from app.imports.providers.factory import ImportProviderFactory
from app.playlists.service import PlaylistService
from app.playlists.track_service import PlaylistTrackService
from app.tracks.service import TrackService


class ImportService:
    def __init__(
            self,
            playlist_service: PlaylistService,
            track_service: TrackService,
            playlist_track_service: PlaylistTrackService,
            download_job_service: DownloadJobService,
    ):
        self.playlist_service = playlist_service
        self.track_service = track_service
        self.playlist_track_service = playlist_track_service
        self.download_job_service = download_job_service

    def import_playlist(self, url: str, user_id: UUID):
        provider = ImportProviderFactory.get_provider(url)
        imported = provider.extract_playlist(url)
        playlist = self.playlist_service.create(imported, user_id)

        for imported_track in imported.tracks:
            track = self.track_service.find_by_source_url(imported_track.source_url)

            if not track:
                track = self.track_service.create(imported_track)
                self.download_job_service.create(track)

            self.playlist_track_service.add_track(playlist.id, track.id, user_id)

        return playlist
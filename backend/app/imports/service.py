from uuid import UUID

from app.downloads.service import DownloadJobService
from app.imports.providers.factory import ImportProviderFactory
from app.playlists.service import PlaylistService
from app.playlists.track_service import PlaylistTrackService
from app.tracks.schemas import CreateTrackSchema
from app.tracks.service import TrackService
from app.matching.service import MatchingService


class ImportService:
    def __init__(
            self,
            playlist_service: PlaylistService,
            track_service: TrackService,
            playlist_track_service: PlaylistTrackService,
            download_job_service: DownloadJobService,
            matching_service: MatchingService,
    ):
        self.playlist_service = playlist_service
        self.track_service = track_service
        self.playlist_track_service = playlist_track_service
        self.download_job_service = download_job_service
        self.matching_service = matching_service

    def import_playlist(self, url: str, user_id: UUID):
        provider = ImportProviderFactory.get_provider(url)
        imported = provider.extract_playlist(url)

        if getattr(provider, "requires_matching", False):
            imported = self.matching_service.match_playlist(imported)

        playlist = self.playlist_service.create(imported, user_id)

        for imported_track in imported.tracks:
            track = self.track_service.find_by_source_url(imported_track.source_url)

            if not track:
                track = self.track_service.create(
                    CreateTrackSchema(
                        title=imported_track.title,
                        artist=imported_track.artist or "Unknown artist",
                        source_url=imported_track.source_url,
                        duration=imported_track.duration or 0,
                    )
                )

            self.playlist_track_service.add_track(playlist.id, track.id, user_id)

        self.download_job_service.download_playlist(playlist.id, user_id)
        return playlist

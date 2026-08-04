from uuid import UUID
from app.imports.providers.factory import ImportProviderFactory
from app.matching.service import MatchingService


class ImportService:

    def __init__(
        self,
        provider_factory: ImportProviderFactory,
        matching_service: MatchingService,
        playlist_service,
        track_service,
        playlist_track_service,
        download_job_service,
    ):
        self.provider_factory = provider_factory
        self.matching_service = matching_service
        self.playlist_service = playlist_service
        self.track_service = track_service
        self.playlist_track_service = playlist_track_service
        self.download_service = download_job_service

    def import_playlist(self, url: str, user_id: UUID):
        provider = self.provider_factory.get_provider(url)

        imported_data = provider.extract_playlist(url)

        if provider.requires_matching:
            imported_data = self.matching_service.match_playlist(imported_data)

        playlist = self.playlist_service.create(imported_data, user_id)

        for imported_track in imported_data.tracks:
            track, _ = self.track_service.get_or_create(imported_track)
            self.playlist_track_service.add_track(playlist.id, track.id, user_id)

        self.download_service.create_jobs(playlist.id, user_id)

        return playlist
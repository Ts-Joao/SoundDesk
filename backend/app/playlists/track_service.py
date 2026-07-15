from uuid import UUID

from app.exceptions.exceptions import NotFoundException, ConflictException
from app.playlists.repository import PlaylistRepository
from app.playlists.track_repository import PlaylistTrackRepository
from app.tracks.repository import TrackRepository


class PlaylistTrackService:
    def __init__(
            self,
            repository: PlaylistTrackRepository,
            playlist_repository: PlaylistRepository,
            track_repository: TrackRepository,
    ):
        self.repository = repository
        self.playlist_repository = playlist_repository
        self.track_repository = track_repository

    def add_track(
            self,
            playlist_id: UUID,
            track_id: UUID,
            user_id: UUID,
    ):
        from app.playlists.service import PlaylistService
        from app.common.file_service import FileService
        from app.tracks.service import TrackService

        playlist_service = PlaylistService(self.playlist_repository)
        playlist_service.find_by_id(playlist_id, user_id)

        track_service = TrackService(self.track_repository, FileService())
        track_service.find_by_id(track_id)

        relation = self.repository.find_relation(playlist_id, track_id)

        if relation:
            raise ConflictException("Track already exists in playlist")

        return self.repository.create(playlist_id, track_id)

    def find_tracks(
            self,
            playlist_id: UUID,
            user_id: UUID,
    ):
        from app.playlists.service import PlaylistService
        playlist_service = PlaylistService(self.playlist_repository)
        playlist = playlist_service.find_by_id(playlist_id, user_id)
        return playlist.tracks

    def remove_track(
            self,
            playlist_id: UUID,
            track_id: UUID,
            user_id: UUID,
    ):
        from app.playlists.service import PlaylistService
        from app.tracks.service import TrackService
        from app.common.file_service import FileService

        playlist_service = PlaylistService(self.playlist_repository)
        playlist_service.find_by_id(playlist_id, user_id)

        relation = self.repository.find_relation(playlist_id, track_id)

        if not relation:
            raise NotFoundException("Track is not found in playlist")

        self.repository.delete(relation)

        track_service = TrackService(self.track_repository, FileService())
        track_service.delete_if_orphan(track_id)

        playlist = self.playlist_repository.find_by_id(playlist_id)
        return playlist

from uuid import UUID

from app.core.exceptions import NotFoundException, ConflictException
from app.repositories.playlist_repository import PlaylistRepository
from app.repositories.playlist_track_repository import PlaylistTrackRepository
from app.repositories.track_repository import TrackRepository


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
    ):
        self.playlist_repository.find_by_id(playlist_id)

        self.track_repository.find_by_id(track_id)

        relation = self.repository.find_relation(
            playlist_id,
            track_id
        )

        if relation:
            raise ConflictException("Track already exists in playlist")

        return self.repository.create(
            playlist_id,
            track_id
        )

    def find_tracks(
            self,
            playlist_id: UUID,
    ):
        playlist = self.playlist_repository.find_by_id(playlist_id)

        return playlist.tracks

    def remove_track(
            self,
            playlist_id: UUID,
            track_id: UUID,
    ):
        relation = self.repository.find_relation(
            playlist_id,
            track_id
        )

        if not relation:
            raise NotFoundException("Track is not found in playlist")

        self.repository.delete(relation)

        playlist = self.playlist_repository.find_by_id(playlist_id)
        return playlist
from typing import List, Union
from uuid import UUID

from app.exceptions.exceptions import NotFoundException, ForbiddenException
from app.playlists.repository import PlaylistRepository
from app.playlists.schemas import CreatePlaylistSchema, UpdatePlaylistSchema
from app.playlists.models import Playlist
from app.imports.schemas import PlaylistImportSchema


class PlaylistService:
    def __init__(self, repository: PlaylistRepository):
        self.repository = repository

    def create(
        self,
        data: Union[CreatePlaylistSchema, PlaylistImportSchema],
        user_id: UUID
    ) -> Playlist:
        return self.repository.create(data, user_id)

    def find_all(
        self,
        user_id: UUID
    ) -> List[Playlist]:
        return self.repository.find_all(user_id)

    def find_by_id(
        self,
        playlist_id: UUID,
        user_id: UUID
    ) -> Playlist:
        playlist = self.repository.find_by_id(playlist_id)

        if not playlist:
            raise NotFoundException("Playlist not found")

        self._verify_ownership(playlist, user_id)

        return playlist

    def update(
        self,
        playlist_id: UUID,
        data: UpdatePlaylistSchema,
        user_id: UUID
    ) -> Playlist:
        playlist = self.find_by_id(playlist_id, user_id)
        return self.repository.update(playlist, data)

    def delete(
        self,
        playlist_id: UUID,
        user_id: UUID
    ) -> Playlist:
        playlist = self.find_by_id(playlist_id, user_id)
        track_ids = [track.id for track in playlist.tracks]

        self.repository.delete(playlist)

        from app.common.file_service import FileService
        from app.tracks.repository import TrackRepository
        from app.tracks.service import TrackService

        track_service = TrackService(TrackRepository(self.repository.db), FileService())
        for track_id in track_ids:
            track_service.delete_if_orphan(track_id)

        return playlist

    @staticmethod
    def _verify_ownership(
        playlist: Playlist,
        user_id: UUID
    ) -> None:
        if playlist.user_id != user_id:
            raise ForbiddenException("You don't have permission to perform this action")

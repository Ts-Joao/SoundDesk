from typing import List
from uuid import UUID

from app.exceptions.exceptions import NotFoundException, ForbiddenException
from app.playlists.repository import PlaylistRepository
from app.playlists.schemas import CreatePlaylistSchema, UpdatePlaylistSchema
from app.playlists.models import Playlist


class PlaylistService:
    def __init__(self, repository: PlaylistRepository):
        self.repository = repository

    def create(
            self, 
            data: CreatePlaylistSchema,
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

        self.repository.delete(playlist)

        return playlist

    @staticmethod
    def _verify_ownership(
            playlist: Playlist,
            user_id: UUID
    ) -> None:
        if playlist.user_id != user_id:
            raise ForbiddenException("You don't have permission to perform this action")
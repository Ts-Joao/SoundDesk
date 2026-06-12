from uuid import UUID

from app.core.exceptions import NotFoundException
from app.repositories.playlist_repository import PlaylistRepository
from app.schemas.playlist import CreatePlaylistSchema, UpdatePlaylistSchema


class PlaylistService:
    def __init__(self, repository: PlaylistRepository):
        self.repository = repository

    def create(self, data: CreatePlaylistSchema):
        return self.repository.create(data)

    def find_all(self):
        return self.repository.find_all()

    def find_by_id(self, playlist_id: UUID):
        playlist = self.repository.find_by_id(playlist_id)

        if not playlist:
            raise NotFoundException("Playlist not found")

        return playlist

    def update(
            self,
            playlist_id: UUID,
            data: UpdatePlaylistSchema,
    ):
        playlist = self.find_by_id(playlist_id)

        return self.repository.update(playlist, data)

    def delete(self, playlist_id: UUID):
        playlist = self.find_by_id(playlist_id)

        self.repository.delete(playlist)

        return playlist
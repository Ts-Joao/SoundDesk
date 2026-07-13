from uuid import UUID

from sqlalchemy.orm import Session

from app.playlists.model import Playlist
from app.playlists.schemas import CreatePlaylistSchema, UpdatePlaylistSchema


class PlaylistRepository():
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: CreatePlaylistSchema) -> Playlist:
        playlist = Playlist(**data.model_dump())

        self.db.add(playlist)
        self.db.commit()
        self.db.refresh(playlist)

        return playlist

    def find_all(self):
        return  self.db.query(Playlist).all()

    def find_by_id(self, playlist_id: UUID):
        return self.db.get(Playlist, playlist_id)

    def update(
            self,
            playlist: Playlist,
            data: UpdatePlaylistSchema
    ) -> Playlist:
        update_data = data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(playlist, field, value)

        self.db.commit()
        self.db.refresh(playlist)

        return playlist

    def delete(self, playlist: Playlist):
        self.db.delete(playlist)
        self.db.commit()
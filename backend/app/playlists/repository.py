from uuid import UUID

from sqlalchemy.orm import Session

from app.playlists.models import Playlist
from app.playlists.schemas import CreatePlaylistSchema, UpdatePlaylistSchema


class PlaylistRepository():
    def __init__(self, db: Session):
        self.db = db

    def create(
            self, 
            data: CreatePlaylistSchema, 
            user_id: UUID
    ) -> Playlist:
        # Imported playlists carry track metadata as Pydantic models.  Those
        # records are handled separately by ImportService; passing their
        # serialized dictionaries to the SQLAlchemy ``tracks`` relationship
        # makes SQLAlchemy try to treat a dict as a Track instance.
        playlist_data = data.model_dump(exclude={"tracks"})
        playlist = Playlist(**playlist_data, user_id=user_id)

        self.db.add(playlist)
        self.db.commit()
        self.db.refresh(playlist)

        return playlist

    def find_all(self, user_id: UUID):
        return self.db.query(Playlist).filter(Playlist.user_id == user_id).all()

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

    def count_by_user(self, user_id: UUID):
        return (
            self.db.query(Playlist)
            .filter(Playlist.user_id == user_id)
            .count()
        )

    def find_recent(
            self,
            user_id: UUID,
            limit: int = 5
    ):
        return (
            self.db.query(Playlist)
            .filter(Playlist.user_id == user_id)
            .order_by(Playlist.created_at.desc())
            .limit(limit)
            .all()
        )

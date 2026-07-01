import uuid

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin

class PlaylistTrack(Base, TimestampMixin):
    __tablename__ = "playlist_tracks"

    playlist_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("playlists.id"),
        primary_key=True
    )

    track_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("tracks.id"),
        primary_key=True
    )
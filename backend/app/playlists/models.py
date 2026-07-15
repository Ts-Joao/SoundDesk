from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin


if TYPE_CHECKING:
    from app.users.models import User

class Playlist(Base, TimestampMixin):
    __tablename__ = "playlists"

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    user: Mapped["User"] = relationship(
        back_populates="playlists",
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        String(),
        nullable=True
    )

    color: Mapped[str] = mapped_column(
        String(7),
        nullable=False,
        default="6C63FF",
    )

    tracks = relationship(
        "Track",
        secondary="playlist_tracks",
        back_populates="playlists",
    )


class PlaylistTrack(Base, TimestampMixin):
    __tablename__ = "playlist_tracks"

    playlist_id: Mapped[UUID] = mapped_column(
        ForeignKey("playlists.id"),
        primary_key=True
    )

    track_id: Mapped[UUID] = mapped_column(
        ForeignKey("tracks.id"),
        primary_key=True
    )
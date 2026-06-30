from sqlalchemy import String, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin


class Playlist(Base, TimestampMixin):
    __tablename__ = "playlists"

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        String(),
        nullable=False,
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
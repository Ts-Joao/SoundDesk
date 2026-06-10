import uuid
from sqlalchemy import String, Integer, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.enums.track_status import TrackStatus
from app.database.base import Base, TimestampMixin

class Track(Base, TimestampMixin):
    __tablename__ = "tracks"

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    artist: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    source_url: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    file_path: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    cover_path: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    duration: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    status: Mapped[TrackStatus] = mapped_column(
        Enum(TrackStatus, name="track_status"),
        nullable=False,
        default=TrackStatus.PENDING,
    )

    playlists = relationship(
        "Playlist",
        secondary="playlist_track",
        back_populates="tracks",
    )

    downloads = relationship(
        "DownloadJob",
        back_populates="track",
    )
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
        default="#6C63FF",
    )

    tracks = relationship(
        "Track",
        secondary="playlist_tracks",
        back_populates="playlists",
    )

    export_jobs = relationship(
        "ExportJob",
        back_populates="playlist",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    @property
    def track_count(self) -> int:
        return len(self.tracks)

    @property
    def completed_tracks(self) -> int:
        from app.enums.track_status import TrackStatus
        return sum(1 for t in self.tracks if t.status == TrackStatus.READY)

    @property
    def failed_tracks(self) -> int:
        from app.enums.track_status import TrackStatus
        return sum(1 for t in self.tracks if t.status in (TrackStatus.FAILED, TrackStatus.CANCELED))

    @property
    def pending_tracks(self) -> int:
        from app.enums.track_status import TrackStatus
        return sum(1 for t in self.tracks if t.status in (TrackStatus.PENDING, TrackStatus.PROCESSING))



class PlaylistTrack(Base, TimestampMixin):
    __tablename__ = "playlist_tracks"

    playlist_id: Mapped[UUID] = mapped_column(
        ForeignKey("playlists.id", ondelete="CASCADE"),
        primary_key=True
    )

    track_id: Mapped[UUID] = mapped_column(
        ForeignKey("tracks.id", ondelete="CASCADE"),
        primary_key=True
    )

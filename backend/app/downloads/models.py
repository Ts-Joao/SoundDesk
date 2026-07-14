from datetime import datetime
import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Text, TIMESTAMP, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.enums.download_status import DownloadStatus


if TYPE_CHECKING:
    from app.users.models import User

class DownloadJob(Base, TimestampMixin):
    __tablename__ = "download_job"

    user_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
    )

    user: Mapped["User"] = relationship(
        back_populates="downloads",
    )

    track_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("tracks.id"),
        nullable=False,
    )

    track = relationship(
        "Track",
        back_populates="downloads",
    )

    status: Mapped[DownloadStatus] = mapped_column(
        Enum(DownloadStatus, name="download_status"),
        nullable=False,
        default=DownloadStatus.PENDING,
    )

    celery_task_id: Mapped[uuid.UUID | None] = mapped_column(
        Text,
        nullable=True,
    )

    error_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    started_at: Mapped[datetime | None] = mapped_column(
        TIMESTAMP,
        nullable=True
    )

    finished_at: Mapped[datetime | None] = mapped_column(
        TIMESTAMP,
        nullable=True
    )
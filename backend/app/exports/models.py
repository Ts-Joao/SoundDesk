from typing import TYPE_CHECKING
from datetime import datetime
from uuid import UUID

from sqlalchemy import ForeignKey, Enum, Text, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.enums.export_status import ExportStatus


if TYPE_CHECKING:
    from app.users.models import User

class ExportJob(Base, TimestampMixin):
    __tablename__ = 'export_jobs'

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    user: Mapped["User"] = relationship(
        back_populates="exports"
    )

    playlist_id: Mapped[UUID] = mapped_column(
        ForeignKey("playlists.id"),
        nullable=False
    )

    status: Mapped[ExportStatus] = mapped_column(
        Enum(ExportStatus),
        nullable=False,
        default=ExportStatus.PENDING
    )

    celery_task_id: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    file_path: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
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

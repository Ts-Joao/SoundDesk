from datetime import datetime
from uuid import UUID

from sqlalchemy import ForeignKey, Enum, Text, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin
from app.enums.export_status import ExportStatus


class ExportJob(Base, TimestampMixin):
    __tablename__ = 'export_jobs'

    playlist_id: Mapped[UUID] = mapped_column(
        ForeignKey("playlists.id"),
        nullable=False
    )

    status: Mapped[ExportStatus] = mapped_column(
        Enum(ExportStatus),
        nullable=False,
        default=ExportStatus.PENDING
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
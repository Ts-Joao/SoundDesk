from datetime import datetime
import uuid

from sqlalchemy import Text, TIMESTAMP, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.enums.download_status import DownloadStatus

class DownloadJob(Base, TimestampMixin):
    __tablename__ = "download_job"

    track_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("tracks.id"),
        nullable=False,
    )

    tracks = relationship(
        "Tracks",
        back_populates="downloadJob",
    )

    status: Mapped[DownloadStatus] = mapped_column(
        Enum(DownloadStatus, name="download_status"),
        nullable=False,
        default=DownloadStatus.PENDING,
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
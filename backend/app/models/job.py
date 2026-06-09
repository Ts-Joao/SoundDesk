import datetime

from sqlalchemy import Text, TIMESTAMP, Enum
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin
from app.enums.job_status import JobStatus

class Job(Base, TimestampMixin):
    __tablename__ = "jobs"

    status: Mapped[JobStatus] = mapped_column(
        Enum(JobStatus, name="job_status"),
        nullable=False,
        default=JobStatus.PENDING,
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
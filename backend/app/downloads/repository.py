from datetime import datetime, UTC
from uuid import UUID

from sqlalchemy import Select, desc, select, update
from sqlalchemy.orm import Session

from app.downloads.models import DownloadJob
from app.enums.download_status import DownloadStatus
from app.tracks.models import Track


ACTIVE_STATUSES = (DownloadStatus.PENDING, DownloadStatus.PROCESSING)


class DownloadJobRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, track_id: UUID, user_id: UUID) -> DownloadJob:
        job = DownloadJob(track_id=track_id, user_id=user_id, status=DownloadStatus.PENDING)
        self.db.add(job)
        self.db.flush()
        return job

    def lock_track(self, track_id: UUID) -> Track | None:
        return self.db.execute(
            select(Track).where(Track.id == track_id).with_for_update()
        ).scalar_one_or_none()

    def find_all(self, user_id: UUID, status: DownloadStatus | None = None) -> list[DownloadJob]:
        statement: Select[tuple[DownloadJob]] = select(DownloadJob).where(DownloadJob.user_id == user_id)
        if status is not None:
            statement = statement.where(DownloadJob.status == status)
        return list(self.db.scalars(statement.order_by(desc(DownloadJob.created_at))))

    def find_by_id(self, job_id: UUID) -> DownloadJob | None:
        return self.db.get(DownloadJob, job_id)

    def has_active_job(self, track_id: UUID) -> bool:
        return self.db.scalar(
            select(DownloadJob.id)
            .where(DownloadJob.track_id == track_id, DownloadJob.status.in_(ACTIVE_STATUSES))
            .limit(1)
        ) is not None

    def claim(self, job_id: UUID) -> bool:
        """Atomically claims a pending job; a revoked/cancelled task cannot start it."""
        result = self.db.execute(
            update(DownloadJob)
            .where(DownloadJob.id == job_id, DownloadJob.status == DownloadStatus.PENDING)
            .values(status=DownloadStatus.PROCESSING, started_at=datetime.now(UTC), error_message=None)
        )
        return result.rowcount == 1

    def mark_pending_siblings_processing(self, track_id: UUID, job_id: UUID) -> None:
        self.db.execute(
            update(DownloadJob)
            .where(
                DownloadJob.track_id == track_id,
                DownloadJob.id != job_id,
                DownloadJob.status == DownloadStatus.PENDING,
            )
            .values(status=DownloadStatus.PROCESSING, started_at=datetime.now(UTC), error_message=None)
        )

    def finish_active_jobs(self, track_id: UUID, status: DownloadStatus, error_message: str | None = None) -> None:
        self.db.execute(
            update(DownloadJob)
            .where(DownloadJob.track_id == track_id, DownloadJob.status.in_(ACTIVE_STATUSES))
            .values(status=status, error_message=error_message, finished_at=datetime.now(UTC))
        )

    def set_celery_task_id(self, job_id: UUID, task_id: str) -> None:
        self.db.execute(
            update(DownloadJob).where(DownloadJob.id == job_id).values(celery_task_id=task_id)
        )

    def cancel(self, job_id: UUID) -> None:
        self.db.execute(
            update(DownloadJob)
            .where(DownloadJob.id == job_id, DownloadJob.status.in_(ACTIVE_STATUSES))
            .values(status=DownloadStatus.CANCELED, finished_at=datetime.now(UTC))
        )

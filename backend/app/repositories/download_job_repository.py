from uuid import UUID

from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.models.download_job import DownloadJob
from app.enums.download_status import DownloadStatus


class DownloadJobRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
            self,
            track_id: UUID
    ):
        job = DownloadJob(
            track_id=track_id,
            status=DownloadStatus.PENDING,
        )

        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)

        return job

    def find_all(
            self,
            status: DownloadStatus | None = None,
    ):
        query = self.db.query(DownloadJob)

        if status:
            query = query.filter_by(status=status)

        return (
            query
            .order_by(
                desc(DownloadJob.created_at)
            )
            .all()
        )

    def find_by_id(
            self,
            job_id: UUID
    ):
        return self.db.get(
            DownloadJob,
            job_id
        )

    def find_active_job_by_track(
            self,
            track_id: UUID
    ):
        return (
            self.db.query(DownloadJob)
            .filter(
                DownloadJob.track_id == track_id,
                DownloadJob.status.in_([
                    DownloadStatus.PENDING,
                    DownloadStatus.PROCESSING
                ])
            )
            .first()
        )
from uuid import UUID

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
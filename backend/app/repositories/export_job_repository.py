from uuid import UUID

from sqlalchemy.orm import Session

from app.enums.export_status import ExportStatus
from app.models.export_job import ExportJob


class ExportJobRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
            self,
            playlist_id: UUID
    ):
        job = ExportJob(
            playlist_id=playlist_id,
            status=ExportStatus.PENDING
        )

        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)

        return job

    def find_all(self):
        return self.db.query(ExportJob).all()

    def find_by_id(
            self,
            job_id: UUID
    ):
        return self.db.get(ExportJob, job_id)

    def update_status(
            self,
            job_id: UUID,
            status: ExportStatus,
            error_message: str | None = None
    ):
        job = self.find_by_id(job_id)

        job.status = status
        job.error_message = error_message

        self.db.commit()
        self.db.refresh(job)

        return job

    def update_path(
            self,
            job_id: UUID,
            path: str
    ):
        job = self.find_by_id(job_id)

        job.file_path = path
        self.db.commit()
        self.db.refresh(job)

        return job

    def delete(self, job_id: UUID):
        job = self.find_by_id(job_id)

        self.db.delete(job)
        self.db.commit()

        return job

    def update_celery_task_id(
            self,
            job_id: UUID,
            task_id: UUID
    ):
        job = self.find_by_id(job_id)
        job.celery_task_id = task_id

        self.db.commit()
        self.db.refresh(job)

        return job
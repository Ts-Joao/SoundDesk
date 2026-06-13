from uuid import UUID
import time

from app.database.session import SessionLocal
from app.enums.download_status import DownloadStatus
from app.repositories.download_job_repository import DownloadJobRepository
from app.workers.celery_app import celery_app


@celery_app.task
def test_task():
    print("Task executed")

@celery_app.task
def process_download(job_id: UUID):
    db = SessionLocal()
    repository = DownloadJobRepository(db)

    try:
        repository.update_status(
            job_id=job_id, status=DownloadStatus.PROCESSING
        )

        time.sleep(5)

        repository.update_status(job_id=job_id, status=DownloadStatus.COMPLETED)

    except Exception as exc:
        repository.update_status(
            job_id=job_id,
            status=DownloadStatus.FAILED,
            error_message=str(exc),
        )
        raise
    finally:
        db.close()
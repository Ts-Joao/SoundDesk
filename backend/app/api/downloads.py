from uuid import UUID

from fastapi import Depends, APIRouter, Query
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.enums.download_status import DownloadStatus
from app.repositories.download_job_repository import DownloadJobRepository
from app.repositories.playlist_repository import PlaylistRepository
from app.services.download_job_service import DownloadJobService
from app.schemas.download_job import DownloadJobResponseSchema


router = APIRouter(prefix="/downloads", tags=["Downloads"])

@router.post(
    "/{playlist_id}/download",
    status_code=202
)
def download_playlist(
        playlist_id: UUID,
        db: Session = Depends(get_db)
):
    playlist_repository = PlaylistRepository(db)
    download_repository = DownloadJobRepository(db)
    service = DownloadJobService(
        download_repository,
        playlist_repository,
    )

    jobs_created = service.download_playlist(playlist_id)

    return {
        "message": "Download started",
        "jobs_created": jobs_created,
    }

@router.post("/{job_id}/retry")
def retry_download(
        job_id: UUID,
        db: Session = Depends(get_db)
):
    playlist_repository = PlaylistRepository(db)
    download_repository = DownloadJobRepository(db)
    service = DownloadJobService(
        download_repository,
        playlist_repository,
    )
    return service.retry(job_id)

@router.post("/{job_id}/cancel")
def cancel_download(
        job_id: UUID,
        db: Session = Depends(get_db)
):
    playlist_repository = PlaylistRepository(db)
    download_repository = DownloadJobRepository(db)
    service = DownloadJobService(
        download_repository,
        playlist_repository,
    )

    return service.cancel(job_id)

@router.get(
    "/jobs",
    response_model=list[DownloadJobResponseSchema],
)
def find_jobs(
        status: DownloadStatus | None = Query(default=None),
        db: Session = Depends(get_db)
):
    playlist_repository = PlaylistRepository(db)
    download_repository = DownloadJobRepository(db)
    service = DownloadJobService(
        download_repository,
        playlist_repository,
    )

    return service.find_all(status)

@router.get(
    "/jobs/{job_id}",
    response_model=DownloadJobResponseSchema,
)
def find_job_by_id(
        job_id: UUID,
        db: Session = Depends(get_db)
):
    playlist_repository = PlaylistRepository(db)
    download_repository = DownloadJobRepository(db)
    service = DownloadJobService(
        download_repository,
        playlist_repository
    )

    return  service.find_by_id(job_id)
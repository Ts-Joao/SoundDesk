from uuid import UUID

from fastapi import Depends, APIRouter, Query, Request
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.dependencies import get_db
from app.users.models import User
from app.enums.download_status import DownloadStatus
from app.downloads.repository import DownloadJobRepository
from app.playlists.repository import PlaylistRepository
from app.downloads.service import DownloadJobService
from app.downloads.schemas import DownloadJobResponseSchema
from app.core.limiter import limiter


router = APIRouter(prefix="/downloads", tags=["Downloads"])

@router.post(
    "/{playlist_id}/download",
    status_code=202
)
@limiter.limit("20/minute")
def download_playlist(
        request: Request,
        playlist_id: UUID,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    playlist_repository = PlaylistRepository(db)
    download_repository = DownloadJobRepository(db)
    service = DownloadJobService(
        download_repository,
        playlist_repository,
    )

    jobs_created = service.download_playlist(playlist_id, current_user.id)

    return {
        "message": "Download started",
        "jobs_created": jobs_created,
    }

@router.post("/{job_id}/retry")
def retry_download(
        job_id: UUID,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    playlist_repository = PlaylistRepository(db)
    download_repository = DownloadJobRepository(db)
    service = DownloadJobService(
        download_repository,
        playlist_repository,
    )
    return service.retry(job_id, current_user.id)

@router.post("/{job_id}/cancel")
def cancel_download(
        job_id: UUID,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
):
    playlist_repository = PlaylistRepository(db)
    download_repository = DownloadJobRepository(db)
    service = DownloadJobService(
        download_repository,
        playlist_repository,
    )

    return service.cancel(job_id, current_user.id)

@router.get(
    "/jobs",
    response_model=list[DownloadJobResponseSchema],
)
def find_jobs(
        status: DownloadStatus | None = Query(default=None),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    playlist_repository = PlaylistRepository(db)
    download_repository = DownloadJobRepository(db)
    service = DownloadJobService(
        download_repository,
        playlist_repository,
    )

    return service.find_all(current_user.id, status)

@router.get(
    "/jobs/{job_id}",
    response_model=DownloadJobResponseSchema,
)
def find_job_by_id(
        job_id: UUID,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    playlist_repository = PlaylistRepository(db)
    download_repository = DownloadJobRepository(db)
    service = DownloadJobService(
        download_repository,
        playlist_repository
    )

    return  service.find_by_id(job_id, current_user.id)
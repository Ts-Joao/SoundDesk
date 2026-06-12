from uuid import UUID

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.repositories.download_job_repository import DownloadJobRepository
from app.repositories.playlist_repository import PlaylistRepository
from app.services.download_job_service import DownloadJobService

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
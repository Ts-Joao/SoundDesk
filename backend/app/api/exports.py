from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.repositories.export_job_repository import ExportJobRepository
from app.repositories.playlist_repository import PlaylistRepository
from app.schemas.export_job import ExportJobResponseSchema
from app.services.export_job_service import ExportJobService


router = APIRouter(prefix="/exports", tags=["exports"])

@router.post(
    "/playlists/{playlist_id}",
    response_model=ExportJobResponseSchema,
)
def export_playlist(
        playlist_id: UUID,
        db: Session = Depends(get_db)
):
    repository = ExportJobRepository(db)
    playlist_repository = PlaylistRepository(db)
    service = ExportJobService(repository, playlist_repository)

    return service.create(playlist_id)

@router.get(
    '/{job_id}',
    response_model=ExportJobResponseSchema,
)
def find_by_id(
        job_id: UUID,
        db: Session = Depends(get_db)
):
    repository = ExportJobRepository(db)
    playlist_repository = PlaylistRepository(db)
    service = ExportJobService(repository, playlist_repository)

    return service.find_by_id(job_id)
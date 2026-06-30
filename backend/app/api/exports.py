from pathlib import Path
from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.repositories.export_job_repository import ExportJobRepository
from app.repositories.playlist_repository import PlaylistRepository
from app.schemas.export_job import ExportJobResponseSchema
from app.services.export_job_service import ExportJobService
from app.services.file_service import FileService

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
    file_service = FileService()
    service = ExportJobService(
        repository,
        playlist_repository,
        file_service,
    )

    return service.create(playlist_id)

@router.post('/playlists/{job_id}/retry}')
def retry(
        job_id: UUID,
        db: Session = Depends(get_db)
):
    repository = ExportJobRepository(db)
    playlist_repository = PlaylistRepository(db)
    file_service = FileService()
    service = ExportJobService(
        repository,
        playlist_repository,
        file_service,
    )

    return service.retry(job_id)

@router.post('/playlists/{job_id}/cancel')
def cancel(
        job_id: UUID,
        db: Session = Depends(get_db)
):
    repository = ExportJobRepository(db)
    playlist_repository = PlaylistRepository(db)
    file_service = FileService()
    service = ExportJobService(
        repository,
        playlist_repository,
        file_service,
    )
    return service.cancel(job_id)

@router.get(
    "",
    response_model=list[ExportJobResponseSchema],
)
def find_all(db: Session = Depends(get_db)):
    repository = ExportJobRepository(db)
    playlist_repository = PlaylistRepository(db)
    file_service = FileService()
    service = ExportJobService(
        repository,
        playlist_repository,
        file_service,
    )

    return service.find_all()

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
    file_service = FileService()
    service = ExportJobService(
        repository,
        playlist_repository,
        file_service,
    )

    return service.find_by_id(job_id)

@router.get(
    '/{job_id}/download',
)
def get_zip(
        job_id: UUID,
        db: Session = Depends(get_db)
):
    repository = ExportJobRepository(db)
    playlist_repository = PlaylistRepository(db)
    file_service = FileService()
    service = ExportJobService(
        repository,
        playlist_repository,
        file_service,
    )

    path = service.get_zip(job_id)

    return FileResponse(
        path,
        filename=Path(path).name,
        media_type='application/zip',
    )
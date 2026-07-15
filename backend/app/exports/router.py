from pathlib import Path
from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.dependencies import get_db
from app.users.models import User
from app.exports.repository import ExportJobRepository
from app.playlists.repository import PlaylistRepository
from app.exports.schemas import ExportJobResponseSchema
from app.exports.service import ExportJobService
from app.common.file_service import FileService

router = APIRouter(prefix="/exports", tags=["exports"])

@router.post(
    "/playlists/{playlist_id}",
    response_model=ExportJobResponseSchema,
)
def export_playlist(
        playlist_id: UUID,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    repository = ExportJobRepository(db)
    playlist_repository = PlaylistRepository(db)
    file_service = FileService()
    service = ExportJobService(
        repository,
        playlist_repository,
        file_service,
    )

    return service.create(playlist_id, current_user.id)

@router.post('/playlists/{job_id}/retry')
def retry(
        job_id: UUID,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    repository = ExportJobRepository(db)
    playlist_repository = PlaylistRepository(db)
    file_service = FileService()
    service = ExportJobService(
        repository,
        playlist_repository,
        file_service,
    )

    return service.retry(job_id, current_user.id)

@router.post('/playlists/{job_id}/cancel')
def cancel(
        job_id: UUID,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    repository = ExportJobRepository(db)
    playlist_repository = PlaylistRepository(db)
    file_service = FileService()
    service = ExportJobService(
        repository,
        playlist_repository,
        file_service,
    )
    return service.cancel(job_id, current_user.id)

@router.get(
    "",
    response_model=list[ExportJobResponseSchema],
)
def find_all(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    repository = ExportJobRepository(db)
    playlist_repository = PlaylistRepository(db)
    file_service = FileService()
    service = ExportJobService(
        repository,
        playlist_repository,
        file_service,
    )

    return service.find_all(current_user.id)

@router.get(
    '/{job_id}',
    response_model=ExportJobResponseSchema,
)
def find_by_id(
        job_id: UUID,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    repository = ExportJobRepository(db)
    playlist_repository = PlaylistRepository(db)
    file_service = FileService()
    service = ExportJobService(
        repository,
        playlist_repository,
        file_service,
    )

    return service.find_by_id(job_id, current_user.id)

@router.get(
    '/{job_id}/download',
)
def get_zip(
        job_id: UUID,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    repository = ExportJobRepository(db)
    playlist_repository = PlaylistRepository(db)
    file_service = FileService()
    service = ExportJobService(
        repository,
        playlist_repository,
        file_service,
    )

    path = service.get_zip(job_id, current_user.id)

    return FileResponse(
        path,
        filename=Path(path).name,
        media_type='application/zip',
    )
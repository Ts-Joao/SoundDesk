from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.tracks.repository import TrackRepository
from app.common.file_service import FileService
from app.tracks.service import TrackService
from app.tracks.schemas import (
    CreateTrackSchema,
    UpdateTrackSchema,
    TrackResponseSchema
)

router = APIRouter(prefix="/tracks", tags=["Tracks"])

@router.post(
    "",
    response_model=TrackResponseSchema,
)
def create_track(
        data: CreateTrackSchema,
        db: Session = Depends(get_db)
):
    repository = TrackRepository(db)
    file_service = FileService()
    service =TrackService(repository, file_service)

    return  service.create(data)

@router.get(
    "",
    response_model=list[TrackResponseSchema],
)
def find_all(db: Session = Depends(get_db)):
    repository = TrackRepository(db)
    file_service = FileService()
    service =TrackService(repository, file_service)

    return service.find_all()

@router.get(
    "/{track_id}",
    response_model=TrackResponseSchema,
)
def find_by_id(
        track_id: UUID,
        db: Session = Depends(get_db)
):
    repository = TrackRepository(db)
    file_service = FileService()
    service =TrackService(repository, file_service)

    return service.find_by_id(track_id)

@router.patch(
    "/{track_id}",
    response_model=TrackResponseSchema,
)
def update(
        track_id: UUID,
        data: UpdateTrackSchema,
        db: Session = Depends(get_db)
):
    repository = TrackRepository(db)
    file_service = FileService()
    service =TrackService(repository, file_service)

    return service.update(track_id, data)

@router.delete(
    "/{track_id}",
    status_code=204
)
def delete(
        track_id: UUID,
        db: Session = Depends(get_db)
):
    repository = TrackRepository(db)
    file_service = FileService()
    service =TrackService(repository, file_service)

    service.delete(track_id)

@router.get(
    "/{track_id}/download",
)
def download_track(
        track_id: UUID,
        db: Session = Depends(get_db)
):
    repository = TrackRepository(db)
    file_service = FileService()
    service = TrackService(repository, file_service)
    track = service.find_by_id(track_id)

    if not track.file_path:
        from app.exceptions.exceptions import NotFoundException
        raise NotFoundException("Track file not found or not ready yet")

    path = file_service.BASE_DIR / track.file_path

    return FileResponse(
        path,
        filename=Path(path).name,
        media_type='audio/mpeg',
    )
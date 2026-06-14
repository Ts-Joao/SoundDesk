from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.repositories.track_repository import TrackRepository
from app.services.track_service import TrackService
from app.schemas.track import (
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
    service =TrackService(repository)

    return  service.create(data)

@router.get(
    "",
    response_model=list[TrackResponseSchema],
)
def find_all(db: Session = Depends(get_db)):
    repository = TrackRepository(db)
    service = TrackService(repository)

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
    service = TrackService(repository)

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
    service =TrackService(repository)

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
    service = TrackService(repository)

    service.delete(track_id)
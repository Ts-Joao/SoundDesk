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
    response_model=TrackResponseSchema,
)
def find_all(db: Session = Depends(get_db)):
    repository = TrackRepository(db)
    service = TrackService(repository)

    return service.find_all()
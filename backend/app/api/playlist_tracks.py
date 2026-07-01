from uuid import UUID

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.repositories.playlist_repository import PlaylistRepository
from app.repositories.playlist_track_repository import PlaylistTrackRepository
from app.repositories.track_repository import TrackRepository
from app.schemas.playlist import PlaylistResponseSchema
from app.schemas.track import TrackResponseSchema
from app.services.playlist_track_service import PlaylistTrackService


router = APIRouter(prefix="/playlist-tracks", tags=["Playlist Tracks"])

@router.post(
    "/{playlist_id}/tracks/{track_id}"
)
def add_track(
        playlist_id: UUID,
        track_id: UUID,
        db: Session = Depends(get_db)
):
    playlist_repository = PlaylistRepository(db)
    track_repository = TrackRepository(db)
    repository = PlaylistTrackRepository(db)
    service = PlaylistTrackService(
        repository,
        playlist_repository,
        track_repository,
    )

    return service.add_track(
        playlist_id,
        track_id,
    )

@router.get(
    "/{playlist_id}/tracks",
    response_model=list[TrackResponseSchema]
)
def find_tracks(
        playlist_id: UUID,
        db: Session = Depends(get_db)
):
    playlist_repository = PlaylistRepository(db)
    track_repository = TrackRepository(db)
    repository = PlaylistTrackRepository(db)
    service = PlaylistTrackService(
        repository,
        playlist_repository,
        track_repository,
    )

    return service.find_tracks(playlist_id)

@router.delete(
    "/{playlist_id}/tracks/{track_id}",
    response_model=PlaylistResponseSchema
)
def remove_track(
        playlist_id: UUID,
        track_id: UUID,
        db: Session = Depends(get_db)
):
    playlist_repository = PlaylistRepository(db)
    track_repository = TrackRepository(db)
    repository = PlaylistTrackRepository(db)
    service = PlaylistTrackService(
        repository,
        playlist_repository,
        track_repository,
    )

    return service.remove_track(playlist_id, track_id)
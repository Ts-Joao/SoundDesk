from uuid import UUID

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_active_user
from app.database.dependencies import get_db
from app.users.models import User
from app.playlists.repository import PlaylistRepository
from app.playlists.track_repository import PlaylistTrackRepository
from app.tracks.repository import TrackRepository
from app.playlists.schemas import PlaylistResponseSchema
from app.tracks.schemas import TrackResponseSchema
from app.playlists.track_service import PlaylistTrackService


router = APIRouter(prefix="/playlist-tracks", tags=["Playlist Tracks"])

@router.post(
    "/{playlist_id}/tracks/{track_id}",
    response_model=PlaylistResponseSchema,
)
def add_track(
        playlist_id: UUID,
        track_id: UUID,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_active_user),
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
        current_user.id,
    )

@router.get(
    "/{playlist_id}/tracks",
    response_model=list[TrackResponseSchema]
)
def find_tracks(
        playlist_id: UUID,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_active_user),
):
    playlist_repository = PlaylistRepository(db)
    track_repository = TrackRepository(db)
    repository = PlaylistTrackRepository(db)
    service = PlaylistTrackService(
        repository,
        playlist_repository,
        track_repository,
    )

    return service.find_tracks(playlist_id, current_user.id)

@router.delete(
    "/{playlist_id}/tracks/{track_id}",
    response_model=PlaylistResponseSchema
)
def remove_track(
        playlist_id: UUID,
        track_id: UUID,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_active_user),
):
    playlist_repository = PlaylistRepository(db)
    track_repository = TrackRepository(db)
    repository = PlaylistTrackRepository(db)
    service = PlaylistTrackService(
        repository,
        playlist_repository,
        track_repository,
    )

    return service.remove_track(playlist_id, track_id, current_user.id)

from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.repositories.playlist_repository import PlaylistRepository
from app.repositories.playlist_track_repository import PlaylistTrackRepository
from app.repositories.track_repository import TrackRepository
from app.schemas.track import TrackResponseSchema
from app.services.playlist_service import PlaylistService
from app.services.playlist_track_service import PlaylistTrackService
from app.schemas.playlist import (
    CreatePlaylistSchema,
    UpdatePlaylistSchema,
    PlaylistResponseSchema,
)


router = APIRouter(prefix="/playlists", tags=["Playlists"])

@router.post(
    "/",
    response_model=PlaylistResponseSchema,
)
def create_playlist(
        data: CreatePlaylistSchema,
        db: Session = Depends(get_db)
):
    repository = PlaylistRepository(db)
    service = PlaylistService(repository)

    return service.create(data)

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
    "/",
    response_model=list[PlaylistResponseSchema]
)
def find_all(db: Session = Depends(get_db)):
    repository = PlaylistRepository(db)
    service = PlaylistService(repository)

    return service.find_all()

@router.get(
    "/{playlist_id}",
    response_model=PlaylistResponseSchema
)
def find_by_id(
        playlist_id: UUID,
        db: Session = Depends(get_db)
):
    repository = PlaylistRepository(db)
    service = PlaylistService(repository)

    return service.find_by_id(playlist_id)

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

@router.patch(
    "/{playlist_id}",
    response_model=PlaylistResponseSchema
)
def update(
        playlist_id: UUID,
        data: UpdatePlaylistSchema,
        db: Session = Depends(get_db)
):
    repository = PlaylistRepository(db)
    service = PlaylistService(repository)

    return  service.update(playlist_id, data)

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

@router.delete(
    "/{playlist_id}",
    response_model=PlaylistResponseSchema
)
def delete(
        playlist_id: UUID,
        db:Session =Depends(get_db)
):
    repository = PlaylistRepository(db)
    service = PlaylistService(repository)

    return service.delete(playlist_id)
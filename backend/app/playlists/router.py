from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_active_user
from app.database.dependencies import get_db
from app.users.models import User
from app.playlists.repository import PlaylistRepository
from app.playlists.service import PlaylistService
from app.playlists.schemas import (
    CreatePlaylistSchema,
    UpdatePlaylistSchema,
    PlaylistResponseSchema,
)


router = APIRouter(prefix="/playlists", tags=["Playlists"])

@router.post(
    "",
    response_model=PlaylistResponseSchema,
)
def create_playlist(
        data: CreatePlaylistSchema,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_active_user),
):
    repository = PlaylistRepository(db)
    service = PlaylistService(repository)

    return service.create(data, current_user.id)

@router.get(
    "",
    response_model=list[PlaylistResponseSchema]
)
def find_all(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
):
    repository = PlaylistRepository(db)
    service = PlaylistService(repository)

    return service.find_all(current_user.id)

@router.get(
    "/{playlist_id}",
    response_model=PlaylistResponseSchema
)
def find_by_id(
        playlist_id: UUID,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_active_user),
):
    repository = PlaylistRepository(db)
    service = PlaylistService(repository)

    return service.find_by_id(playlist_id, current_user.id)

@router.patch(
    "/{playlist_id}",
    response_model=PlaylistResponseSchema
)
def update(
        playlist_id: UUID,
        data: UpdatePlaylistSchema,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_active_user),
):
    repository = PlaylistRepository(db)
    service = PlaylistService(repository)

    return  service.update(playlist_id, data, current_user.id)

@router.delete(
    "/{playlist_id}",
    response_model=PlaylistResponseSchema
)
def delete(
        playlist_id: UUID,
        db:Session =Depends(get_db),
        current_user: User = Depends(get_current_active_user),
):
    repository = PlaylistRepository(db)
    service = PlaylistService(repository)

    return service.delete(playlist_id, current_user.id)

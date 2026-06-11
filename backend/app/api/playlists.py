from uuid import UUID

from fastapi import APIRouter, Depends, Request, FastAPI
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse


from app.core.exceptions import AppException
from app.database.dependencies import get_db
from app.repositories.playlist_repository import PlaylistRepository
from app.services.playlist_service import PlaylistService
from app.schemas.playlist import (
    CreatePlaylistSchema,
    UpdatePlaylistSchema,
    PlaylistResponseSchema,
)


app = FastAPI()
router = APIRouter(prefix="/playlists", tags=["Playlists"])

@app.exception_handler(AppException)
async def app_exception_handler(
        request: Request,
        exc: AppException
):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "message": exc.message
        },
    )

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

    return service.crate(data)

@router.get(
    "/",
    response_model=list[PlaylistResponseSchema]
)
def find_all(db: Session = Depends(get_db)):
    repository = PlaylistRepository(db)
    service = PlaylistService(repository)

    return service.find_all()

@router.get(
    "/{playlist_id",
    response_model=PlaylistResponseSchema
)
def find_by_id(
        playlist_id: UUID,
        db: Session = Depends(get_db)
):
    repository = PlaylistRepository(db)
    service = PlaylistService(repository)

    return service.find_by_id(playlist_id)

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
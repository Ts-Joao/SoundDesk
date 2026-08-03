from pathlib import Path
from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_active_user
from app.database.dependencies import get_db
from app.users.models import User
from app.tracks.repository import TrackRepository
from app.common.file_service import FileService
from app.tracks.service import TrackService
from app.playlists.track_repository import PlaylistTrackRepository
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
        db: Session = Depends(get_db),
        _: User = Depends(get_current_active_user),
):
    repository = TrackRepository(db)
    file_service = FileService()
    service = TrackService(repository, file_service)

    return service.create(data)

@router.get(
    "",
    response_model=list[TrackResponseSchema],
)
def find_all(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_active_user),
):
    repository = TrackRepository(db)
    file_service = FileService()
    service = TrackService(repository, file_service)

    return service.find_all(current_user.id)

@router.get(
    "/{track_id}",
    response_model=TrackResponseSchema,
)
def find_by_id(
        track_id: UUID,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_active_user),
):
    repository = TrackRepository(db)
    file_service = FileService()
    service = TrackService(repository, file_service)

    return service.find_by_id(track_id, current_user.id)

@router.patch(
    "/{track_id}",
    response_model=TrackResponseSchema,
)
def update(
        track_id: UUID,
        data: UpdateTrackSchema,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_active_user),
):
    repository = TrackRepository(db)
    file_service = FileService()
    service = TrackService(repository, file_service)

    return service.update(track_id, data, current_user.id)

@router.delete(
    "/{track_id}",
    status_code=204
)
def delete(
        track_id: UUID,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_active_user),
):
    from app.playlists.repository import PlaylistRepository

    track_repo = TrackRepository(db)
    file_service = FileService()
    track_service = TrackService(track_repo, file_service)
    track_service.find_by_id(track_id, current_user.id)

    playlist_repo = PlaylistRepository(db)
    user_playlists = playlist_repo.find_all(current_user.id)
    pt_repo = PlaylistTrackRepository(db)

    for playlist in user_playlists:
        relation = pt_repo.find_relation(playlist.id, track_id)
        if relation:
            pt_repo.delete(relation)

    track_service.delete_if_orphan(track_id)

@router.get(
    "/{track_id}/download",
)
def download_track(
        track_id: UUID,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_active_user),
):
    repository = TrackRepository(db)
    file_service = FileService()
    service = TrackService(repository, file_service)
    track = service.find_by_id(track_id, current_user.id)

    if not track.file_path:
        from app.exceptions.exceptions import NotFoundException
        raise NotFoundException("Track file not found or not ready yet")

    path = file_service.BASE_DIR / track.file_path

    return FileResponse(
        path,
        filename=Path(path).name,
        media_type='audio/mpeg',
    )

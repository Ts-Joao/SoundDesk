from app.downloads.repository import DownloadJobRepository
from app.imports.providers.factory import ImportProviderFactory
from app.imports.schemas import ImportPlaylistRequest
from app.playlists.track_repository import PlaylistTrackRepository
from app.tracks.repository import TrackRepository
from app.playlists.repository import PlaylistRepository
from fastapi import Depends, APIRouter, Query
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.auth.dependencies import get_current_active_user
from app.imports.service import ImportService
from app.playlists.schemas import PlaylistResponseSchema
from app.playlists.service import PlaylistService
from app.playlists.track_service import PlaylistTrackService
from app.tracks.service import TrackService
from app.downloads.service import DownloadJobService
from app.common.file_service import FileService
from app.users.models import User
from app.matching.service import MatchingService


router = APIRouter(prefix="/imports", tags=["Imports"])

@router.post(
    "/",
    response_model=PlaylistResponseSchema,
    status_code=201,
)
def playlist_import(
    body: ImportPlaylistRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> PlaylistResponseSchema:
    playlist_repo = PlaylistRepository(db)
    track_repo = TrackRepository(db)
    playlist_track_repo = PlaylistTrackRepository(db)
    download_job_repo = DownloadJobRepository(db)

    playlist_service = PlaylistService(playlist_repo)
    track_service = TrackService(track_repo, file_service=FileService())
    playlist_track_service = PlaylistTrackService(playlist_track_repo, playlist_repo, track_repo)
    download_job_service = DownloadJobService(download_job_repo, playlist_repo)
    matching_service = MatchingService()
    provider_factory = ImportProviderFactory ()

    service = ImportService(
        provider_factory=provider_factory,
        playlist_service=playlist_service,
        track_service=track_service,
        playlist_track_service=playlist_track_service,
        download_job_service=download_job_service,
        matching_service=matching_service,
    )

    return service.import_playlist(body.playlist_url, current_user.id)

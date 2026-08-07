from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.dashboard.schemas import DashboardResponse
from app.dashboard.service import DashboardService
from app.database.dependencies import get_db
from app.downloads.repository import DownloadJobRepository
from app.exports.repository import ExportJobRepository
from app.playlists.repository import PlaylistRepository
from app.tracks.repository import TrackRepository
from app.users.models import User
from app.core.limiter import limiter

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get(
    '',
    response_model=DashboardResponse
)
@limiter.limit("60/minute")
def get_dashboard(
        request: Request,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    track_repo = TrackRepository(db)
    playlist_repo = PlaylistRepository(db)
    download_repo = DownloadJobRepository(db)
    export_repo = ExportJobRepository(db)
    service = DashboardService(track_repo, playlist_repo, download_repo, export_repo)

    return service.get_dashboard(current_user.id)
from fastapi import Depends, APIRouter

from app.auth.dependencies import get_current_active_user
from app.imports.schemas import PlaylistImportSchema
from app.users.models import User

router = APIRouter(prefix="/imports", tags=["Imports"])

@router.post(
    "/",
    response_model=PlaylistImportSchema,
)
def playlist_import(
        playlist_url: str,
        current_user: User = Depends(get_current_active_user),
) -> PlaylistImportSchema:
    service = PlaylistImportService()
    return service.playlist_import(playlist_url, current_user.id)
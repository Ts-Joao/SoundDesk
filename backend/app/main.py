from fastapi import FastAPI, Request, APIRouter
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from starlette.staticfiles import StaticFiles

from app.exports.router import router as export_playlist
from app.exceptions.exceptions import AppException
from app.playlists.router import router as playlist_router
from app.tracks.router import router as track_router
from app.playlists.track_router import router as playlist_tracks_router
from app.downloads.router import router as downloads_router
from app.users.router import router as user_router
from app.auth.router import router as auth_router


app = FastAPI(
    title="SoundDesk API",
    redirect_slashes=False
)
api_router = APIRouter(prefix="/api")
security_scheme = HTTPBearer()

app.mount("/storage", StaticFiles(directory="storage"), name="storage")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.18.97:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

app.include_router(user_router)
api_router.include_router(auth_router)
api_router.include_router(playlist_router)
api_router.include_router(track_router)
api_router.include_router(playlist_tracks_router)
api_router.include_router(downloads_router)
api_router.include_router(export_playlist)

app.include_router(api_router)
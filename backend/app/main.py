from fastapi import FastAPI, Request, APIRouter, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.exports.router import router as export_playlist
from app.exceptions.exceptions import AppException
from app.playlists.router import router as playlist_router
from app.tracks.router import router as track_router
from app.playlists.track_router import router as playlist_tracks_router
from app.downloads.router import router as downloads_router
from app.users.router import router as user_router
from app.auth.router import router as auth_router
from app.dashboard.router import router as dashboard_router
from app.imports.router import router as playlist_imports_router


app = FastAPI(
    title="SoundDesk API",
    redirect_slashes=False
)
api_router = APIRouter(prefix="/api")

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

@app.exception_handler(HTTPException)
async def http_exception_handler(
        request: Request,
        exc: HTTPException
):
    if exc.status_code == 403 and "Not authenticated" in str(exc.detail):
        return JSONResponse(
            status_code=401,
            content={"message": "Token not provided"},
        )
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": str(exc.detail)},
    )

api_router.include_router(user_router)
api_router.include_router(auth_router)
api_router.include_router(playlist_router)
api_router.include_router(track_router)
api_router.include_router(playlist_tracks_router)
api_router.include_router(playlist_imports_router)
api_router.include_router(downloads_router)
api_router.include_router(export_playlist)
api_router.include_router(dashboard_router)

app.include_router(api_router)
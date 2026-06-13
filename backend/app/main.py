from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.exceptions import AppException
from app.api.playlists import router as playlist_router
from app.api.tracks import router as track_router
from app.api.playlist_tracks import router as playlist_tracks_router
from app.api.downloads import router as downloads_router


app = FastAPI(title="SoundDesk API")

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

@app.get("/test")
def test():
    test_task.delay()

    return {
       "message": "Task sent successfully"
    }

app.include_router(playlist_router)
app.include_router(track_router)
app.include_router(playlist_tracks_router)
app.include_router(downloads_router)
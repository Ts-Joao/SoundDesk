from fastapi import FastAPI

from app.api.playlists import router as playlist_router


app = FastAPI(title="SoundDesk API")

app.include_router(playlist_router)
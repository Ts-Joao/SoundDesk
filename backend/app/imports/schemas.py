from pydantic import BaseModel


class ImportPlaylistRequest(BaseModel):
    playlist_url: str

class TrackImportSchema(BaseModel):
    title: str
    artist: str | None = None
    source_url: str
    duration: int | None = None
    cover_path: str | None = None

class PlaylistImportSchema(BaseModel):
    name: str
    description: str | None = None
    tracks: list[TrackImportSchema]

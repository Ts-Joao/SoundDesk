from pydantic import BaseModel


class TrackImportSchema(BaseModel):
    title: str
    artist: str | None = None
    source_url: str
    duration: int | None = None
    thumbnail_url: str | None = None

class PlaylistImportSchema(BaseModel):
    name: str
    description: str | None = None
    tracks: list[TrackImportSchema]

from pydantic import BaseModel


class TrackImportSchema(BaseModel):
    title: str
    artist: str | None = None
    source_uri: str
    duration: int | None = None
    thumbnail: str | None = None

class PlaylistImportSchema(BaseModel):
    title: str
    description: str | None = None
    tracks: list[TrackImportSchema]
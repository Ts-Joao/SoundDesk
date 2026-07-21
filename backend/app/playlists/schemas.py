from uuid import UUID

from pydantic import BaseModel, field_validator

ALLOWED_PLAYLIST_COLOR = {
    "#6C63FF",
    "#43D9AD",
    "#FF6584",
    "#F5A623",
    "#3498DB",
    "#E74C3C",
    "#9B59B6",
    "#1ABC9C",
}


class PlaylistBaseSchema(BaseModel):
    name: str
    description: str | None = None
    color: str = "#6C63FF"

    @field_validator("color")
    @classmethod
    def validate_color(cls, v: str) -> str:
        if v not in ALLOWED_PLAYLIST_COLOR:
            raise ValueError("Invalid playlist color")

        return v

class CreatePlaylistSchema(PlaylistBaseSchema):
    pass

class UpdatePlaylistSchema(BaseModel):
    name: str
    description: str | None = None
    color: str | None = None

    @field_validator("color")
    @classmethod
    def validate_color(cls, v: str | None):
        if v is None:
            return v

        if v not in ALLOWED_PLAYLIST_COLOR:
            raise ValueError("Invalid playlist color")

        return v

from datetime import datetime

class PlaylistResponseSchema(PlaylistBaseSchema):
    id: UUID
    user_id: UUID 
    created_at: datetime
    updated_at: datetime
    track_count: int
    completed_tracks: int
    failed_tracks: int
    pending_tracks: int

    model_config = {
        "from_attributes": True
    }
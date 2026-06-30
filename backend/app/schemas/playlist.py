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

class PlaylistColorSchema(BaseModel):
    @field_validator("color")
    @classmethod
    def validate_color(cls, v: str) -> str:
        if v not in ALLOWED_PLAYLIST_COLOR:
            raise ValueError("Invalid playlist color")

        return v

class PlaylistBaseSchema(PlaylistColorSchema):
    name: str
    description: str | None = None
    color: str = "#6C63FF"

class CreatePlaylistSchema(PlaylistBaseSchema):
    pass

class UpdatePlaylistSchema(PlaylistColorSchema):
    name: str
    description: str | None = None
    color: str | None = None

class PlaylistResponseSchema(PlaylistBaseSchema):
    id: UUID

    model_config = {
        "from_attributes": True
    }
from uuid import UUID

from pydantic import BaseModel


class PlaylistBaseSchema(BaseModel):
    name: str
    description: str | None = None

class CreatePlaylistSchema(PlaylistBaseSchema):
    pass

class UpdatePlaylistSchema(BaseModel):
    name: str
    description: str | None = None

class PlaylistResponseSchema(PlaylistBaseSchema):
    id: UUID

    model_config = {
        "from_attributes": True
    }
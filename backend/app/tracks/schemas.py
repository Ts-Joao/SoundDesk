from uuid import UUID

from pydantic import BaseModel

from app.enums.track_status import TrackStatus


class TrackBaseSchema(BaseModel):
    file_path: str | None = None
    cover_path: str | None = None

class CreateTrackSchema(TrackBaseSchema):
    title: str
    artist: str
    source_url: str
    duration: int
    status: TrackStatus = TrackStatus.PENDING

class UpdateTrackSchema(TrackBaseSchema):
    title: str | None = None
    artist: str | None = None
    source_url: str | None = None
    duration: int | None = None
    status: TrackStatus | None = None

class TrackResponseSchema(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    artist: str
    source_url: str
    duration: int
    status: TrackStatus
    file_path: str | None = None
    cover_path: str | None = None

    model_config = {
        "from_attributes": True
    }
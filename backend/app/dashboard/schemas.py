from uuid import UUID

from pydantic import BaseModel, field_validator

from app.enums.download_status import DownloadStatus
from app.enums.export_status import ExportStatus

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

class DashboardStatsSchema(BaseModel):
    total_tracks: int
    total_playlists: int

    completed_downloads: int
    processing_downloads: int
    failed_downloads: int

    completed_exports: int
    processing_exports: int

class RecentTrackSchema(BaseModel):
    id: UUID
    title: str
    artist: str
    cover_path: str | None = None
    duration: int

    model_config = {
        "from_attributes": True
    }

class RecentPlaylistSchema(BaseModel):
    id: UUID
    name: str
    color: str

    model_config = {
        "from_attributes": True
    }

    @field_validator("color")
    @classmethod
    def validate_color(cls, v: str) -> str:
        if v not in ALLOWED_PLAYLIST_COLOR:
            raise ValueError("Invalid playlist color")

        return v

class RecentDownloadSchema(BaseModel):
    id: UUID
    status: DownloadStatus
    track_name: str | None = None
    playlist_name: str | None = None

    model_config = {
        "from_attributes": True
    }

class RecentExportSchema(BaseModel):
    id: UUID
    playlist: str
    status: ExportStatus

    model_config = {
        "from_attributes": True
    }

class DashboardResponse(BaseModel):
    stats: DashboardStatsSchema

    recent_tracks: list[RecentTrackSchema]

    recent_playlists: list[RecentPlaylistSchema]

    recent_downloads: list[RecentDownloadSchema]

    recent_exports: list[RecentExportSchema]
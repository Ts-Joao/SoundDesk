from uuid import UUID
from datetime import datetime

from pydantic import BaseModel

from app.enums.download_status import DownloadStatus


class DownloadJobResponseSchema(BaseModel):
    id: UUID
    track_id: UUID

    status: DownloadStatus

    error_message: str | None = None

    started_at: datetime | None
    finished_at: datetime | None

    model_config = {
        "from_attributes": True
    }
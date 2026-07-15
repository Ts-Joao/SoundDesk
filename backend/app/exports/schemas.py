from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.enums.export_status import ExportStatus


class ExportJobResponseSchema(BaseModel):
    id: UUID
    playlist_id: UUID
    user_id: UUID

    status: ExportStatus

    file_path: str | None = None

    error_message: str | None = None

    started_at: datetime | None
    finished_at: datetime | None

    model_config = {
        "from_attributes": True
    }

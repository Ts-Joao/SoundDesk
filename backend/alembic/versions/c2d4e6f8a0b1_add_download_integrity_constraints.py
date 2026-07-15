"""add global track identity and download query indexes

Revision ID: c2d4e6f8a0b1
Revises: f1a2b3c4d5e6
Create Date: 2026-07-15 12:00:00.000000
"""

from typing import Sequence, Union

from alembic import op


revision: str = "c2d4e6f8a0b1"
down_revision: Union[str, Sequence[str], None] = "f1a2b3c4d5e6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Existing duplicate source_url rows must be reconciled before deployment.
    # The application now serializes all creation through this global identity.
    op.create_unique_constraint("uq_tracks_source_url", "tracks", ["source_url"])
    op.create_index("ix_download_job_track_status", "download_job", ["track_id", "status"])
    op.create_index("ix_download_job_user_created_at", "download_job", ["user_id", "created_at"])


def downgrade() -> None:
    op.drop_index("ix_download_job_user_created_at", table_name="download_job")
    op.drop_index("ix_download_job_track_status", table_name="download_job")
    op.drop_constraint("uq_tracks_source_url", "tracks", type_="unique")

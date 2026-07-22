"""add_email_change_to_auth_token_type

Revision ID: 4d57f3259835
Revises: 7ce48ff2f518
Create Date: 2026-07-22 16:13:51.266704

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4d57f3259835'
down_revision: Union[str, Sequence[str], None] = '7ce48ff2f518'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("ALTER TYPE authtokentype ADD VALUE IF NOT EXISTS 'EMAIL_CHANGE'")


def downgrade() -> None:
    """Downgrade schema."""
    pass

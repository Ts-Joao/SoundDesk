from datetime import datetime
from uuid import UUID

from sqlalchemy import Text, TIMESTAMP, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin


class RefreshToken(Base, TimestampMixin):
    __tablename__ = "refresh_token"

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id"),
        primary_key=True,
    )

    token_hash: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    expires_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        nullable=False
    )

    revoked_at: Mapped[datetime | None] = mapped_column(
        TIMESTAMP,
        nullable=True
    )
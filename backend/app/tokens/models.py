from datetime import datetime
from typing import TYPE_CHECKING, Any
from uuid import UUID

from sqlalchemy import Text, TIMESTAMP, ForeignKey, Enum, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.enums.token_types import AuthTokenType

if TYPE_CHECKING:
    from app.users.models import User

class AuthToken(Base, TimestampMixin):
    __tablename__ = "auth_tokens"

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="auth_tokens"
    )

    type: Mapped[AuthTokenType] = mapped_column(
        Enum(AuthTokenType),
        nullable=False
    )

    token_hash: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    payload: Mapped[dict[str, Any] | None] = mapped_column(
        JSON,
        nullable=True
    )

    expires_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        nullable=False
    )

    used_at: Mapped[datetime | None] = mapped_column(
        TIMESTAMP,
        nullable=True
    )
from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Text, TIMESTAMP, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin


if TYPE_CHECKING:
    from app.users.models import User

class EmailVerificationToken(Base, TimestampMixin):
    __tablename__ = "email_verification_tokens"

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="email_verification_tokens"
    )

    token_hash: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    expires_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        nullable=False
    )

    used_at: Mapped[datetime | None] = mapped_column(
        TIMESTAMP,
        nullable=True
    )
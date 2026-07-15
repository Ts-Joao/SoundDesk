from typing import TYPE_CHECKING
from sqlalchemy import String, Boolean, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.enums.user_roles import UserRoles


if TYPE_CHECKING:
    from app.downloads.models import DownloadJob
    from app.exports.models import ExportJob
    from app.playlists.models import Playlist

class User(Base, TimestampMixin):
    __tablename__ = "users"

    username: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        unique=True
    )

    display_name: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        unique=True,
    )

    password_hash: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    avatar: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    email_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    role: Mapped[UserRoles] = mapped_column(
        Enum(UserRoles, name="role"),
        default=UserRoles.USER,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    )

    refresh_tokens = relationship(
        "RefreshToken",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    playlists: Mapped[list["Playlist"]] = relationship(
        "Playlist",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    downloads: Mapped[list["DownloadJob"]] = relationship(
        "DownloadJob",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    exports: Mapped[list["ExportJob"]] = relationship(
        "ExportJob",
        back_populates="user",
        cascade="all, delete-orphan",
    )

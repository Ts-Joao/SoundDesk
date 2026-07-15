from typing import TYPE_CHECKING
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.enums.user_roles import UserRoles
from app.playlists.schemas import PlaylistResponseSchema
from app.downloads.schemas import DownloadJobResponseSchema
from app.exports.schemas import ExportJobResponseSchema

class UserBaseSchema(BaseModel):
    username: str = Field(
        min_length=3,
        max_length=50,
    )
    display_name: str = Field(
        min_length=2,
        max_length=100,
    )
    email: EmailStr
    avatar: str | None = None


class CreateUserSchema(UserBaseSchema):
    password_hash: str = Field(
        min_length=8,
        max_length=128,
    )


class UpdateUserSchema(BaseModel):
    username: str | None = Field(
        default=None,
        min_length=3,
        max_length=50,
    )
    display_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )
    email: EmailStr | None = None
    avatar: str | None = None


class ChangePasswordSchema(BaseModel):
    current_password: str
    new_password: str = Field(
        min_length=8,
        max_length=128,
    )


class UserResponseSchema(UserBaseSchema):
    id: UUID
    role: UserRoles
    email_verified: bool
    is_active: bool

    playlists: list["PlaylistResponseSchema"]
    downloads: list["DownloadJobResponseSchema"]
    exports: list["ExportJobResponseSchema"]

    model_config = ConfigDict(
        from_attributes=True,
    )

UserResponseSchema.model_rebuild()
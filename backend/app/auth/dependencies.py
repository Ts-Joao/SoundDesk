from uuid import UUID

from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.auth.jwt_handler import JWTService
from app.database.dependencies import get_db
from app.enums.user_roles import UserRoles
from app.exceptions.exceptions import UnauthorizedException, ForbiddenException
from app.users.models import User
from app.users.repository import UserRepository

http_bearer = HTTPBearer(auto_error=False)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(http_bearer),
    db: Session = Depends(get_db)
) -> User:
    if not credentials or not credentials.credentials:
        raise UnauthorizedException("Token not provided")

    token = credentials.credentials

    try:
        payload = JWTService.decode_token(token)
    except Exception:
        raise UnauthorizedException("Invalid token")

    if payload.get("type") != "access":
        raise UnauthorizedException("Unauthorized")

    user_id = UUID(payload["sub"])
    repository = UserRepository(db)
    user = repository.find_by_id(user_id)

    if not user:
        raise UnauthorizedException("Invalid credentials")

    return user

async def get_current_active_user(
        current_user: User = Depends(get_current_user)
):
    if not current_user.is_active:
        raise ForbiddenException("Inactive user")

    return current_user

async def get_admin_user(
        current_user: User = Depends(get_current_active_user)
):
    if current_user.role != UserRoles.ADMIN:
        raise ForbiddenException("Access denied")

    return current_user
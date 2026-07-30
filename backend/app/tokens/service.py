from datetime import UTC, datetime

from sqlalchemy.orm import Session

from app.auth.jwt_handler import JWTService
from app.auth.utils import hash_token
from app.config.settings import settings
from app.enums.token_types import AuthTokenType
from app.exceptions.exceptions import (
    ConflictException,
    ForbiddenException,
    UnauthorizedException,
)
from app.tokens.models import AuthToken
from app.tokens.repository import AuthTokenRepository
from app.tokens.schemas import AuthTokenCreateSchema
from app.users.models import User


class AuthTokenService:
    def __init__(self, db: Session):
        self.repository = AuthTokenRepository(db)

    def create(
        self,
        user: User,
        token_type: AuthTokenType,
        payload: dict | None = None,
    ) -> str:
        expiration = self._get_expiration_minutes(token_type)

        token, expires_at = JWTService.create_auth_token(
            user.id,
            user.role,
            str(expiration),
            token_type,
        )

        data = AuthTokenCreateSchema(
            token_hash=hash_token(token),
            expires_at=expires_at,
            type=token_type,
            payload=payload,
        )

        self.repository.create(data, user.id)

        return token

    def find_by_hash(self, token: str) -> AuthToken:
        hashed = hash_token(token)
        db_token = self.repository.find_by_hash(hashed)

        if not db_token:
            raise UnauthorizedException("Invalid token")

        return db_token

    def validate(
        self,
        token: str,
        token_type: AuthTokenType,
    ):
        payload = JWTService.decode_token(token)

        if payload["type"] != token_type.value:
            raise ForbiddenException("Access denied")

        db_token = self.find_by_hash(token)

        if db_token.used_at:
            raise ConflictException("Token already used")

        if db_token.expires_at < datetime.now(UTC).replace(tzinfo=None):
            raise UnauthorizedException("Expired token")

        return db_token

    def consume(self, token: str):
        db_token = self.find_by_hash(token)
        self.repository.mark_as_used(db_token.id)

    @staticmethod
    def _get_expiration_minutes(
        token_type: AuthTokenType,
    ) -> int:

        mapping = {
            AuthTokenType.VERIFY_EMAIL: settings.verify_email_expire_minutes,
            AuthTokenType.RESET_PASSWORD: settings.reset_password_expire_minutes,
            AuthTokenType.EMAIL_CHANGE: settings.reset_password_expire_minutes,
        }

        return mapping[token_type]
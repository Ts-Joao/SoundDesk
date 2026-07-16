from datetime import timedelta, datetime, UTC
from uuid import UUID

import jwt

from app.config.settings import settings
from app.enums.user_roles import UserRoles


class JWTService:
    @staticmethod
    def _create_token(
            user_id: UUID,
            role: UserRoles,
            expires_delta: timedelta,
            token_type: str,
    ) -> tuple[str, datetime]:
        expire = datetime.now(UTC) + expires_delta

        payload = {
            "sub": str(user_id),
            "role": role.value,
            "type": token_type,
            "iat": datetime.now(UTC),
            "exp": expire,
        }

        token = str(jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm))

        return token, expire

    @staticmethod
    def create_access_token(
            user_id: UUID,
            role: UserRoles,
    ):
        token, _ = JWTService._create_token(
            user_id,
            role,
            expires_delta=timedelta(minutes=int(settings.access_token_expire_minutes)),
            token_type="access"
        )
        return token

    @staticmethod
    def create_refresh_token(
            user_id: UUID,
            role: UserRoles,
    ) -> tuple[str, datetime]:
        return JWTService._create_token(
            user_id,
            role,
            expires_delta=timedelta(days=int(settings.refresh_token_expire_days)),
            token_type="refresh"
        )

    @staticmethod
    def create_verify_email_token(
            user_id: UUID,
            role: UserRoles,
    ) -> tuple[str, datetime]:
        return JWTService._create_token(
            user_id,
            role,
            expires_delta=timedelta(hours=int(settings.verify_email_expire_hours)),
            token_type="verify_email"
        )

    @staticmethod
    def decode_token(
            token: str,
    ) -> dict:
        return jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
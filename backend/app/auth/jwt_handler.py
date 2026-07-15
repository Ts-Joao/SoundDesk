from datetime import timedelta, datetime, UTC
from uuid import UUID

import jwt

from app.config.settings import ALGORITHM, SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS
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

        token = str(jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM))

        return token, expire

    @staticmethod
    def create_access_token(
            user_id: UUID,
            role: UserRoles,
    ):
        token, _ = JWTService._create_token(
            user_id,
            role,
            expires_delta=timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES)),
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
            expires_delta=timedelta(days=int(REFRESH_TOKEN_EXPIRE_DAYS)),
            token_type="refresh"
        )

    @staticmethod
    def decode_token(
            token: str,
    ) -> dict:
        return jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )
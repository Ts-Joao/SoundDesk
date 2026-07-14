from datetime import datetime

from sqlalchemy.orm import Session

from app.auth.jwt_handler import JWTService
from app.auth.password import verify_password
from app.auth.repository import RefreshTokenRepository
from app.auth.schemas import LoginSchema
from app.auth.utils import hash_refresh_token
from app.exceptions.exceptions import UnauthorizedException, ForbiddenException
from app.users.repository import UserRepository
from app.users.models import User


class AuthService:
    def __init__(self,db: Session):
        self.db = db
        self.repository = RefreshTokenRepository(db)
        self.user_repository = UserRepository(db)

    def login(self, data: LoginSchema):
        user = self.user_repository.find_by_email(data.email)

        if not user:
            raise UnauthorizedException("Invalid credentials")

        if not verify_password(data.password, user.password_hash):
            raise UnauthorizedException("Invalid credentials")

        if not user.is_active:
            raise ForbiddenException("Account disabled")

        tokens = self._generate_tokens(user)

        return {
            "access_token": tokens["access_token"],
            "refresh_token": tokens["refresh_token"],
            "token_type": "Bearer",
        }

    def refresh(self, token: str):
        self._is_refresh_token_valid(token)

        db_refresh_token = self._find_by_hash(token)

        if db_refresh_token.revoked_at:
            raise UnauthorizedException("Access denied")

        if db_refresh_token.expires_at < datetime.now():
            raise UnauthorizedException("Access denied")

        self.repository.revoke(db_refresh_token)

        tokens = self._generate_tokens(db_refresh_token.user)

        return {
            "access_token": tokens["access_token"],
            "refresh_token": tokens["refresh_token"],
            "token_type": "Bearer",
        }

    def logout(
            self,
            refresh_token: str,
    ):
        self._is_refresh_token_valid(refresh_token)

        token_hash = hash_refresh_token(refresh_token)

        token = self._find_by_hash(token_hash)

        self.repository.revoke(token)

    def _generate_tokens(self, user: User):
        access_token = JWTService.create_access_token(user.id, user.role)
        token, expires_at = JWTService.create_refresh_token(user.id, user.role)

        self.repository.create(
            user.id,
            hash_refresh_token(token),
            expires_at
        )

        return {
            "access_token": access_token,
            "refresh_token": token,
            "token_type": "bearer"
        }

    def _find_by_hash(self, token: str):
        token_hash = hash_refresh_token(token)
        refresh_token = self.repository.find_by_hash(token_hash)

        if not refresh_token:
            raise UnauthorizedException("Invalid credentials")

        return refresh_token

    @staticmethod
    def _is_refresh_token_valid(token: str):
        payload = JWTService.decode_token(token)

        if payload["type"] != "refresh":
            raise ForbiddenException("Access denied")

        return payload
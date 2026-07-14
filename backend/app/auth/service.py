from sqlalchemy.orm import Session

from app.auth.jwt_handler import JWTService
from app.auth.password import verify_password
from app.auth.repository import RefreshTokenRepository
from app.auth.schemas import LoginSchema, RefreshRequest
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
        payload = JWTService.decode_token(token)

        if payload["type"] != "refresh":
            raise ForbiddenException("Access denied")

        user = self.user_repository.find_by_id(payload["sub"])
        tokens = self._generate_tokens(user)

        return {
            "access_token": tokens["access_token"],
            "refresh_token": tokens["refresh_token"],
            "token_type": "Bearer",
        }

    def logout(self, token: str):
        token = self.repository.find_by_hash(token)

        if not token:
            raise UnauthorizedException("Invalid credentials")

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
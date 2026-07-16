from datetime import datetime, UTC

from sqlalchemy.orm import Session

from app.auth.jwt_handler import JWTService
from app.auth.password import verify_password, hash_password
from app.auth.repository import RefreshTokenRepository
from app.auth.schemas import LoginSchema
from app.auth.utils import hash_token
from app.config.settings import settings
from app.emails.repository import EmailVerificationTokenRepository
from app.emails.schemas import EmailVerificationSchema
from app.exceptions.exceptions import UnauthorizedException, ForbiddenException, ConflictException
from app.users.repository import UserRepository
from app.users.models import User
from app.users.schemas import CreateUserSchema


class AuthService:
    def __init__(self,db: Session):
        self.db = db
        self.repository = RefreshTokenRepository(db)
        self.user_repository = UserRepository(db)
        self.email_repository = EmailVerificationTokenRepository(db)

    def register(self, data: CreateUserSchema):
        from app.workers.tasks import send_verify_email_task

        if self.user_repository.find_by_email(data.email):
            raise ConflictException("Email already registered")

        if self.user_repository.find_by_username(data.username):
            raise ConflictException("Username already registered")

        user_data = data.model_dump()
        password = user_data.pop("password_hash")
        user_data["password_hash"] = hash_password(password)
        user = self.user_repository.create(user_data)
        token = self.create_verify_email_token(user)

        verification_url = (
            f"{settings.frontend_url}/verify-email?token={token}"
        )

        send_verify_email_task.delay(
            user.email,
            user.username,
            verification_url
        )

        return user

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

        if db_refresh_token.expires_at < datetime.now(UTC).replace(tzinfo=None):
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

        token = self._find_by_hash(refresh_token)

        self.repository.revoke(token)

    def _generate_tokens(self, user: User):
        access_token = JWTService.create_access_token(user.id, user.role)
        token, expires_at = JWTService.create_refresh_token(user.id, user.role)

        self.repository.create(
            user.id,
            hash_token(token),
            expires_at
        )

        return {
            "access_token": access_token,
            "refresh_token": token,
            "token_type": "bearer"
        }

    def _find_by_hash(self, token: str):
        token_hash = hash_token(token)
        refresh_token = self.repository.find_by_hash(token_hash)

        if not refresh_token:
            raise UnauthorizedException("Invalid credentials")

        return refresh_token

    def create_verify_email_token(self, user: User):
        token, expires_at = JWTService.create_verify_email_token(user.id, user.role)
        data = EmailVerificationSchema(token_hash=hash_token(token), expires_at=expires_at)

        self.email_repository.create(data, user.id)

        return {
            "sub": user.id,
            "token": token,
            "expires_at": expires_at,
        }

    @staticmethod
    def _is_refresh_token_valid(token: str):
        payload = JWTService.decode_token(token)

        if payload["type"] != "refresh":
            raise ForbiddenException("Access denied")

        return payload

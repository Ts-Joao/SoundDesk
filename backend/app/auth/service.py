from datetime import datetime, UTC

from sqlalchemy.orm import Session

from app.auth.jwt_handler import JWTService
from app.auth.password import verify_password, hash_password
from app.auth.repository import RefreshTokenRepository
from app.auth.schemas import LoginSchema
from app.auth.utils import hash_token
from app.config.settings import settings
from app.enums.token_types import AuthTokenType
from app.tokens.repository import AuthTokenRepository
from app.tokens.schemas import AuthTokenCreateSchema
from app.exceptions.exceptions import UnauthorizedException, ForbiddenException, ConflictException
from app.users.repository import UserRepository
from app.users.models import User
from app.users.schemas import CreateUserSchema


class AuthService:
    def __init__(self,db: Session):
        self.db = db
        self.repository = RefreshTokenRepository(db)
        self.user_repository = UserRepository(db)
        self.auth_token_repository = AuthTokenRepository(db)

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

    def verify_email(self, token):
        self._is_valid_email_token(token)
        hashed_token = hash_token(token)
        db_token = self.auth_token_repository.find_by_hash(hashed_token)
        self._validate_token(db_token.expires_at)

        if db_token.used_at:
            raise ConflictException("Token already used")

        self.auth_token_repository.mark_as_used(db_token.id)

        return self.user_repository.email_verified(db_token.user_id)

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

    def forgot_password(self, email: str):
        from app.workers.tasks import send_reset_password_email_task

        user = self.user_repository.find_by_email(email)
        token = self.create_reset_password_token(user)
        verification_url = (
            f"{settings.frontend_url}/forgot-password?token={token}"
        )

        send_reset_password_email_task.delay(
            user.email,
            user.name,
            verification_url,
            token
        )

    def refresh(self, token: str):
        self._is_refresh_token_valid(token)

        db_refresh_token = self._find_by_hash(token)

        self._validate_token(db_refresh_token.expires_at)

        if db_refresh_token.revoked_at:
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
        token, expires_at = JWTService.create_auth_token(
            user.id,
            user.role,
            settings.verify_email_expire_minutes,
            AuthTokenType.VERIFY_EMAIL
        )
        data = AuthTokenCreateSchema(
            token_hash=hash_token(token),
            expires_at=expires_at,
            type=AuthTokenType.VERIFY_EMAIL
        )

        self.auth_token_repository.create(data, user.id)
        return token

    def create_reset_password_token(self, user: User):
        token, expires_at = JWTService.create_auth_token(
            user.id,
            user.role,
            settings.forgot_password_expire_minutes,
            type=AuthTokenType.RESET_PASSWORD
        )
        data = AuthTokenCreateSchema(
            token_hash=hash_token(token),
            expires_at=expires_at,
            type=AuthTokenType.RESET_PASSWORD
        )

        self.auth_token_repository.create(data, user.id)
        return token

    @staticmethod
    def _is_refresh_token_valid(token: str):
        payload = JWTService.decode_token(token)

        if payload["type"] != "refresh":
            raise ForbiddenException("Access denied")

        return payload

    @staticmethod
    def _is_valid_email_token(token: str):
        payload = JWTService.decode_token(token)

        if payload["type"] != "verify_email":
            raise ForbiddenException("Access denied")

        return payload

    @staticmethod
    def _validate_token(expires_at: datetime):
        if expires_at < datetime.now(UTC).replace(tzinfo=None):
            raise UnauthorizedException("Expired token")
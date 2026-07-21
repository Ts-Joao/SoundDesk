from datetime import datetime, UTC
from uuid import UUID

from sqlalchemy.orm import Session

from app.auth.jwt_handler import JWTService
from app.auth.password import verify_password, hash_password
from app.auth.repository import RefreshTokenRepository
from app.auth.schemas import LoginSchema
from app.auth.utils import hash_token
from app.config.settings import settings
from app.emails.schemas import ConfirmEmailChangeSchema
from app.enums.token_types import AuthTokenType
from app.tokens.repository import AuthTokenRepository
from app.exceptions.exceptions import UnauthorizedException, ForbiddenException, ConflictException, BadRequestException
from app.tokens.service import AuthTokenService
from app.users.repository import UserRepository
from app.users.models import User
from app.users.schemas import CreateUserSchema, ChangePasswordSchema


class AuthService:
    def __init__(self,db: Session):
        self.db = db
        self.repository = RefreshTokenRepository(db)
        self.user_repository = UserRepository(db)
        self.auth_token_repository = AuthTokenRepository(db)
        self.auth_token_service = AuthTokenService(db)

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
        token = self.auth_token_service.create(user, AuthTokenType.VERIFY_EMAIL)

        url = (
            f"{settings.frontend_url}/verify-email?token={token}"
        )

        send_verify_email_task.delay(
            user.email,
            user.username,
            url
        )

        return user

    def verify_email(self, token: str):
        from app.workers.tasks import send_welcome_email_task

        db_token = self.auth_token_service.validate(token, AuthTokenType.VERIFY_EMAIL)
        self.auth_token_service.consume(token)
        user = self.user_repository.email_verified(db_token.user_id)

        send_welcome_email_task.delay(
            user.email,
            user.username,
        )

        return db_token.user_id

    def login(self, data: LoginSchema):
        user = self.user_repository.find_by_email(data.email)

        if not user:
            raise UnauthorizedException("Invalid credentials")

        if not verify_password(data.password, user.password_hash):
            raise UnauthorizedException("Invalid credentials")

        if not user.is_active:
            raise ForbiddenException("Account disabled")

        if not user.email_verified:
            raise ForbiddenException("Por favor, verifique seu e-mail antes de fazer login.")

        tokens = self._generate_tokens(user)

        return {
            "access_token": tokens["access_token"],
            "refresh_token": tokens["refresh_token"],
            "token_type": "Bearer",
        }

    def forgot_password(self, email: str):
        from app.workers.tasks import send_reset_password_email_task

        user = self.user_repository.find_by_email(email)
        token = self.auth_token_service.create(user, AuthTokenType.RESET_PASSWORD)
        url = (
            f"{settings.frontend_url}/reset-password?token={token}"
        )

        send_reset_password_email_task.delay(
            user.email,
            user.username,
            url,
            token
        )

    def reset_password(self, token: str, new_password: str):
        from app.workers.tasks import send_password_change_email_task

        db_token = self.auth_token_service.validate(token, AuthTokenType.RESET_PASSWORD)

        self.user_repository.reset_password(db_token.user_id, hash_password(new_password))
        self.auth_token_service.consume(db_token.id)
        self.repository.revoke_all(db_token.user_id)
        user = self.user_repository.find_by_id(db_token.user_id)
        url = (
            f"{settings.frontend_url}/login"
        )

        send_password_change_email_task.delay(
            user.email,
            user.username,
            url
        )

    def change_password(self, user_id: UUID, data: ChangePasswordSchema):
        from app.workers.tasks import send_password_change_email_task

        user = self.user_repository.find_by_id(user_id)
        password_match = verify_password(data.current_password, user.password_hash)

        if not password_match:
            raise BadRequestException("Password not match")

        self.user_repository.reset_password(user, password=hash_password(data.new_password))
        url = (
            f"{settings.frontend_url}/login"
        )

        send_password_change_email_task.delay(
            user.email,
            user.username,
            url
        )
        return user

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

    def change_email(
            self,
            new_email: str,
            user: User
    ):
        from app.workers.tasks import send_confirm_email_change

        if new_email == user.email:
            raise BadRequestException("Use a different email")

        email_exist =  self.user_repository.find_by_email(new_email)

        if email_exist:
            raise BadRequestException("Use a different email")

        payload = {
            "new_email": new_email,
        }

        token = self.auth_token_service.create(
            user,
            AuthTokenType.EMAIL_CHANGE,
            payload
        )

        url = (
            f"{settings.frontend_url}/change-email"
        )

        data = ConfirmEmailChangeSchema(
            email_to=user.email,
            username=user.username,
            frontend_url=url,
            token=token,
            new_email=new_email,
            current_email=user.email,
        )

        send_confirm_email_change.delay(data)

        return token

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

    @staticmethod
    def _is_refresh_token_valid(token: str):
        payload = JWTService.decode_token(token)

        if payload["type"] != "refresh":
            raise ForbiddenException("Access denied")

        return payload

    @staticmethod
    def verify_password(
            password: str,
            user_password: str
    ):
        password_match = verify_password(password, user_password)
        if not password_match:
            raise BadRequestException("Password not match")

        return True

    @staticmethod
    def _validate_token(expires_at: datetime):
        if expires_at < datetime.now(UTC).replace(tzinfo=None):
            raise UnauthorizedException("Expired token")
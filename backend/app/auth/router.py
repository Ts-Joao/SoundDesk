from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_active_user
from app.auth.schemas import (
    LoginResponse,
    RefreshResponse,
    LoginSchema,
    LogoutSchema,
    RefreshRequest,
    ForgotPasswordSchema,
    ResetPasswordSchema, ChangeEmailSchema,
)
from app.auth.service import AuthService
from app.database.dependencies import get_db
from app.users.schemas import UserResponseSchema, CreateUserSchema, ChangePasswordSchema
from app.users.models import User
from app.core.limiter import limiter


router = APIRouter(prefix="/auth", tags=["Auth"])

def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(db)

@router.post(
    "/register",
    response_model=UserResponseSchema,
    status_code=201,
)
@limiter.limit("3/minute")
def register(
        request: Request,
        data: CreateUserSchema,
        db: Session = Depends(get_db),
):
    service = AuthService(db)

    return service.register(data)

@router.post(
    "/login",
    response_model=LoginResponse
)
@limiter.limit("5/minute")
def login(
        request: Request,
        data: LoginSchema,
        db: Session = Depends(get_db),
):
    service = AuthService(db)

    return service.login(data)

@router.post(
    "/logout",
    status_code=204
)
def logout(
        data: LogoutSchema,
        service: AuthService = Depends(get_auth_service)
):
    return service.logout(data.refresh_token)

@router.post(
    "/refresh",
    response_model=RefreshResponse
)
def refresh(
        data: RefreshRequest,
        service: AuthService = Depends(get_auth_service)
):
    return service.refresh(data.refresh_token)

@router.post(
    "/verify-email",
    status_code=200,
    response_model=UserResponseSchema
)
@limiter.limit("10/minute")
def verify_email(
        request: Request,
        token: str,
        service: AuthService = Depends(get_auth_service)
):
    return service.verify_email(token)

@router.post(
    "/forgot-password",
    status_code=204,
)
@limiter.limit("2/minute")
def forgot_password(
        request: Request,
        data: ForgotPasswordSchema,
        service: AuthService = Depends(get_auth_service)
):
    service.forgot_password(data.email)

@router.post(
    "/reset-password",
    status_code=204,
)
def reset_password(
        data: ResetPasswordSchema,
        service: AuthService = Depends(get_auth_service)
):
    service.reset_password(data.token, data.password)

@router.patch(
    "/change-password",
    status_code=200,
)
def change_password(
        data: ChangePasswordSchema,
        current_user: User = Depends(get_current_active_user),
        service: AuthService = Depends(get_auth_service)
):
    service.change_password(current_user.id, data)

@router.post(
    "/verify-password",
    status_code=200,
)
@limiter.limit("10/minute")
def verify_password(
        password: str,
        current_user: User = Depends(get_current_active_user),
        service: AuthService = Depends(get_auth_service)
):
    service.verify_password(password, current_user.password_hash)

@router.patch(
    "/change-email",
    status_code=200,
)
@limiter.limit("2/minute")
def change_email(
        request: Request,
        data: ChangeEmailSchema,
        current_user: User = Depends(get_current_active_user),
        service: AuthService = Depends(get_auth_service)
):
    service.change_email(
        data.new_email,
        data.password,
        current_user
    )

@router.post(
    "/confirm-email-change",
    status_code=200
)
def confirm_email_change(
        token: str,
        service: AuthService = Depends(get_auth_service)
):
    service.confirm_email_changed(token)
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_active_user
from app.auth.schemas import (
    LoginResponse,
    RefreshResponse,
    LoginSchema,
    LogoutSchema,
    RefreshRequest,
    ForgotPasswordSchema,
    ResetPasswordSchema,
)
from app.auth.service import AuthService
from app.database.dependencies import get_db
from app.users.schemas import UserResponseSchema, CreateUserSchema
from app.users.models import User

router = APIRouter(prefix="/auth", tags=["Auth"])

def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(db)


@router.post(
    "/register",
    response_model=UserResponseSchema,
    status_code=201,
)
def register(
        data: CreateUserSchema,
        db: Session = Depends(get_db)
):
    service = AuthService(db)

    return service.register(data)

@router.get(
    "/verify-email",
    status_code=200,
    response_model=UserResponseSchema
)
def verify_email(
        token: str,
        service: AuthService = Depends(get_auth_service)
):
    return service.verify_email(token)

@router.post(
    "/login",
    response_model=LoginResponse
)
def login(
        data: LoginSchema,
        db: Session = Depends(get_db)
):
    service = AuthService(db)

    return service.login(data)

@router.post(
    "/forgot-password",
    status_code=204,
)
def forgot_password(
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

@router.post(
    "/refresh",
    response_model=RefreshResponse
)
def refresh(
        data: RefreshRequest,
        service: AuthService = Depends(get_auth_service)
):
    return service.refresh(data.refresh_token)

@router.get(
    "/me",
    response_model=UserResponseSchema
)
def me(
    current_user: User = Depends(get_current_active_user)
):
    return current_user

@router.post(
    "/logout",
    status_code=204
)
def logout(
        data: LogoutSchema,
        service: AuthService = Depends(get_auth_service)
):
    return service.logout(data.refresh_token)
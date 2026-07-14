from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_active_user
from app.auth.schemas import LoginResponse, RefreshResponse, LoginSchema, LogoutSchema
from app.auth.service import AuthService
from app.database.dependencies import get_db
from app.users.schemas import UserResponseSchema
from app.users.models import User

router = APIRouter(prefix="/auth", tags=["Auth"])

def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(db)


@router.post(
    "/login",
    response_model=RefreshResponse
)
def login(
        data: LoginSchema,
        db: Session = Depends(get_db)
):
    service = AuthService(db)

    return service.login(data)

@router.post(
    "/refresh",
    response_model=RefreshResponse
)
def refresh(
        data: str,
        service: AuthService = Depends(get_auth_service)
):
    return service.refresh(data)

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
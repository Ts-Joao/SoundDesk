from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.dependencies import get_db
from app.users.repository import UserRepository
from app.users.schemas import UserResponseSchema, UpdateUserSchema
from app.users.service import UserService
from app.users.models import User

router = APIRouter(prefix="/users", tags=["Users"])

@router.get(
    "",
    response_model=List[UserResponseSchema],
)
def get_all(db: Session = Depends(get_db)):
    repository = UserRepository(db)
    service = UserService(repository)
    return service.find_all()

@router.get(
    "/me",
    response_model=UserResponseSchema,
)
def get_me(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
):
    repository = UserRepository(db)
    service = UserService(repository)
    return service.find_by_id(current_user.id)

@router.patch(
    "/me",
    response_model=UserResponseSchema,
)
def update(
        data: UpdateUserSchema,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    repository = UserRepository(db)
    service = UserService(repository)
    return service.update(current_user.id, data)

@router.delete(
    "/me",
    status_code=200,
)
def delete_me(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
):
    repository = UserRepository(db)
    service = UserService(repository)
    return service.delete_user(current_user.id)

@router.delete(
    "/{user_id}",
)
def delete_user(
        user_id: UUID,
        db: Session = Depends(get_db)
):
    repository = UserRepository(db)
    service = UserService(repository)
    return service.delete_user(user_id)

@router.patch(
    "/me/avatar",
    status_code=200
)
def update_avatar(
        current_user: User = Depends(get_current_user),
        file: UploadFile = File(...),
        db: Session = Depends(get_db),
):
    repository = UserRepository(db)
    service = UserService(repository)
    return service.update_avatar(current_user.id, file)

@router.delete(
    "/me/avatar",
    status_code=200,
)
def remove_avatar(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
):
    repository = UserRepository(db)
    service = UserService(repository)
    return service.remove_avatar(current_user.id)
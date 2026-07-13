from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.users.repository import UserRepository
from app.users.schemas import UserResponseSchema, CreateUserSchema
from app.users.service import UserService

router = APIRouter(prefix="/users", tags=["users"])

@router.post(
    "",
    response_model=UserResponseSchema,
)
def create_user(
        data: CreateUserSchema,
        db: Session = Depends(get_db)
):
    repository = UserRepository(db)
    service = UserService(repository)

    return service.create(data)

@router.get(
    "",
    response_model=List[UserResponseSchema],
)
def get_all(db: Session = Depends(get_db)):
    repository = UserRepository(db)
    service = UserService(repository)
    return service.find_all()

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
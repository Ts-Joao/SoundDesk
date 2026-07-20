from uuid import UUID

from app.exceptions.exceptions import NotFoundException
from app.users.repository import UserRepository
from app.users.schemas import UpdateUserSchema


class UserService:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    def find_all(self):
        return self.repository.find_all()

    def find_by_id(self, user_id: UUID):
        user = self.repository.find_by_id(user_id)

        if not user:
            raise NotFoundException("User not found")

        return user

    def find_by_email(self, email: str):
        user = self.repository.find_by_email(email)

        if not user:
            raise NotFoundException("User not found")

        return user

    def find_by_username(self, username: str):
        user = self.repository.find_by_username(username)

        if not user:
            raise NotFoundException("User not found")

        return user

    def update(
            self,
            user_id: UUID,
            data: UpdateUserSchema
    ):
        user = self.find_by_id(user_id)
        return self.repository.update(user, data)

    def deactivate(self, user_id: UUID):
        user = self.find_by_id(user_id)
        self.repository.deactivate(user)
        return user

    def activate(self, user_id: UUID):
        user = self.find_by_id(user_id)
        self.repository.activate(user)
        return user

    def delete_user(self, user_id: UUID):
        user = self.find_by_id(user_id)
        return self.repository.delete(user)

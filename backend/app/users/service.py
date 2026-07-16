from uuid import UUID

from app.auth.password import hash_password, verify_password
from app.exceptions.exceptions import NotFoundException, BadRequestException
from app.users.repository import UserRepository
from app.users.schemas import UpdateUserSchema, ChangePasswordSchema


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

    def change_password(self, user_id: UUID, data: ChangePasswordSchema):
        user = self.find_by_id(user_id)
        password_match = verify_password(data.current_password, user.password_hash)

        if not password_match:
            raise BadRequestException("Password not match")

        self.repository.reset_password(user, password=hash_password(data.new_password))
        return user

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

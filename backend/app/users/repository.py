from uuid import UUID

from sqlalchemy.orm import Session

from app.users.schemas import CreateUserSchema, UpdateUserSchema
from app.users.models import User

class UserRepository():
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: dict) -> User:
        user = User(**data)

        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        return user

    def find_all(self):
        return self.db.query(User).all()

    def find_by_id(self, user_id: UUID):
        return self.db.get(User, user_id)

    def find_by_email(self, email: str):
        return self.db.get(User, email)

    def find_by_username(self, username: str):
        return self.db.get(User, username)

    def update(
            self,
            user: User,
            data: UpdateUserSchema
    ) -> User:
        update_data = data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(user, field, value)

        self.db.commit()
        self.db.refresh(user)

        return user

    def deactivate(self, user_id: UUID):
        user = self.find_by_id(user_id)
        user.is_active = False

        self.db.commit()
        self.db.refresh(user)
        return user

    def activate(self, user_id: UUID):
        user = self.find_by_id(user_id)
        user.is_active = True

        self.db.commit()
        self.db.refresh(user)
        return user

    def reset_password(self, user_id: UUID, password: str):
        user = self.find_by_id(user_id)
        user.password_hash = password
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete(self, user: User):
        self.db.delete(user)
        self.db.commit()
from uuid import UUID

from sqlalchemy.orm import Session

from app.tokens.models import AuthToken
from app.tokens.schemas import AuthTokenCreateSchema


class AuthTokenRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
            self,
            data: AuthTokenCreateSchema,
            user_id: UUID
    ) -> AuthToken:
        email_token = AuthToken(**data.model_dump(), user_id=user_id)

        self.db.add(email_token)
        self.db.commit()
        self.db.refresh(email_token)
        return email_token

    def find_by_hash(self, token_hash: str):
        return self.db.query(AuthToken).filter(
            AuthToken.token_hash == token_hash
        ).first()
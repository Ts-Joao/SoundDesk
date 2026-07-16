from uuid import UUID

from sqlalchemy.orm import Session

from app.emails.models import EmailVerificationToken
from app.emails.schemas import EmailVerificationSchema


class EmailVerificationTokenRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
            self,
            data: EmailVerificationSchema,
            user_id: UUID
    ) -> EmailVerificationToken:
        email_token = EmailVerificationToken(**data.model_dump(), user_id=user_id)

        self.db.add(email_token)
        self.db.commit()
        self.db.refresh(email_token)
        return email_token

    def find_by_hash(self, token_hash: str):
        return self.db.query(EmailVerificationToken).filter(
            EmailVerificationToken.token_hash == token_hash
        ).first()
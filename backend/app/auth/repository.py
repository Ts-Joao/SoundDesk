from uuid import UUID

from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.models import RefreshToken


class RefreshTokenRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
            self,
            user_id: UUID,
            token: str,
            expires_at: datetime
    ) -> RefreshToken:
        token = RefreshToken(
            user_id,
            token,
            expires_at
        )

        self.db.add(token)
        self.db.commit()
        self.db.refresh(token)
        return token

    def find_by_hash(self, token: str) -> RefreshToken | None:
        query = select(RefreshToken).where(RefreshToken.token_hash == token)
        return self.db.execute(query).scalar_one_or_none()

    def revoke(self, token: RefreshToken) -> None:
        token.revoked_at = datetime.now()
        self.db.commit()

    def revoke_all(self) -> None:
        self.db.query(RefreshToken).delete()
        self.db.commit()

    def delete_expired(self) -> None:
        self.db.query(RefreshToken).filter(RefreshToken.expires_at < datetime.now()).delete()
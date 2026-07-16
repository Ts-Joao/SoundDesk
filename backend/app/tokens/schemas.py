from datetime import datetime

from pydantic import BaseModel

from app.enums.token_types import AuthTokenType


class AuthTokenCreateSchema(BaseModel):
    token_hash: str
    type: AuthTokenType
    expires_at: datetime
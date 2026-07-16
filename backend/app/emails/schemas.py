from datetime import datetime

from pydantic import BaseModel


class EmailVerificationSchema(BaseModel):
    token_hash: str
    expires_at: datetime

class EmailBaseSchema(BaseModel):
    email_to: str
    username: str

class WelcomeEmailSchema(EmailBaseSchema):
    pass

class VerifyEmailSchema(EmailBaseSchema):
    verification_url: str

class ResetPasswordEmailSchema(EmailBaseSchema):
    token: str
    reset_password_url: str
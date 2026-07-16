from pydantic import BaseModel


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
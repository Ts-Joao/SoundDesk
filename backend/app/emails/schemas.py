from pydantic import BaseModel


class EmailBaseSchema(BaseModel):
    email_to: str
    username: str

class WelcomeEmailSchema(EmailBaseSchema):
    frontend_url: str

class VerifyEmailSchema(EmailBaseSchema):
    verification_url: str

class ResetPasswordEmailSchema(EmailBaseSchema):
    token: str
    reset_password_url: str

class PasswordChangedEmailSchema(EmailBaseSchema):
    pass
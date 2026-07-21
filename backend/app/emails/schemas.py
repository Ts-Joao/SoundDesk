from pydantic import BaseModel


class EmailBaseSchema(BaseModel):
    email_to: str
    username: str
    frontend_url: str

class WelcomeEmailSchema(EmailBaseSchema):
    pass

class VerifyEmailSchema(EmailBaseSchema):
    pass

class ResetPasswordEmailSchema(EmailBaseSchema):
    token: str

class PasswordChangedEmailSchema(EmailBaseSchema):
    pass

class ConfirmEmailChangeSchema(EmailBaseSchema):
    token: str
    new_email: str
    current_email: str
    pass

class EmailChangedSchema(BaseModel):
    username: str
    email_to: str
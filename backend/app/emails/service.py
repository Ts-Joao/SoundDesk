from pathlib import Path

from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

from app.config.settings import settings
from app.emails.schemas import (
    WelcomeEmailSchema,
    VerifyEmailSchema,
    ResetPasswordEmailSchema,
    PasswordChangedEmailSchema, ConfirmEmailChangeSchema
)

class EmailService:
    def __init__(self):
        template_path = Path(__file__).resolve().parent / "templates"

        self.config = ConnectionConfig(
            MAIL_USERNAME=settings.mail_username,
            MAIL_PASSWORD=settings.mail_password,
            MAIL_FROM=settings.mail_from,
            MAIL_PORT=settings.mail_port,
            MAIL_SERVER=settings.mail_server,
            MAIL_FROM_NAME=settings.mail_from_name,
            MAIL_STARTTLS=settings.mail_starttls,
            MAIL_SSL_TLS=settings.mail_ssl_tls,
            TEMPLATE_FOLDER=template_path,
        )

        self.fastmail = FastMail(self.config)

    async def send_welcome(self, data: WelcomeEmailSchema):
        message = MessageSchema(
            subject="Bem-vindo ao SoundDesk!",
            recipients=[data.email_to],     # type: ignore
            template_body=data.model_dump(),
            subtype=MessageType.html
        )
        await self.fastmail.send_message(message, template_name="welcome.html")

    async def verify_email(self, data: VerifyEmailSchema):
        subject = f"Falta apenas um passo para ativares a tua conta, {data.username}!"
        message = MessageSchema(
            subject=subject,
            recipients=[data.email_to],     # type: ignore
            template_body=data.model_dump(),
            subtype=MessageType.html
        )
        await self.fastmail.send_message(message, template_name="verify_email.html")

    async def reset_password(self, data: ResetPasswordEmailSchema):
        message = MessageSchema(
            subject="🔑 Recuperação de senha - SoundDesk",
            recipients=[data.email_to],     # type: ignore
            template_body=data.model_dump(),
            subtype=MessageType.html
        )
        await self.fastmail.send_message(message, template_name="reset_password.html")

    async def password_changed(self, data: PasswordChangedEmailSchema):
        message = MessageSchema(
            subject="🔒 A sua senha do SoundDesk foi redefinida com sucesso",
            recipients=[data.email_to],     # type: ignore
            template_body=data.model_dump(),
            subtype=MessageType.html
        )
        await self.fastmail.send_message(message, template_name="password_changed.html")

    async def confirm_email_change(self, data: ConfirmEmailChangeSchema):
        message = MessageSchema(
            subject="✉️ Confirma o seu novo endereço de e-mailo",
            recipients=[data.email_to],  # type: ignore
            template_body=data.model_dump(),
            subtype=MessageType.html
        )
        await self.fastmail.send_message(message, template_name="confirm_email_change.html")
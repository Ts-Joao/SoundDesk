from pathlib import Path

from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

from app.config.settings import settings
from app.emails.schemas import WelcomeEmailSchema


class EmailService:
    def __init__(self):
        template_path = Path(__file__).resolve().parent / "templates"

        self.config = ConnectionConfig(
            MAIL_USERNAME=settings.MAIL_USERNAME,
            MAIL_PASSWORD=settings.MAIL_PASSWORD,
            MAIL_FROM=settings.MAIL_FROM,
            MAIL_PORT=settings.MAIL_PORT,
            MAIL_SERVER=settings.MAIL_SERVER,
            MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
            MAIL_STARTTLS=settings.MAIL_STARTTLS,
            MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
            TEMPLATE_FOLDER=template_path,
        )

        self.fastmail = FastMail(self.config)



    async def send_email(self, data: WelcomeEmailSchema):
        message = MessageSchema(
            subject="Bem-vindo ao SoundDesk!",
            recipients=[data.email_to],     # type: ignore
            template_body=data.model_dump(),
            subtype=MessageType.html
        )
        await self.fastmail.send_message(message, template_name="welcome.html")
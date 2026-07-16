from dotenv import load_dotenv

import os

from pydantic import EmailStr
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()

SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM=os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES=os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
REFRESH_TOKEN_EXPIRE_DAYS=os.getenv("REFRESH_TOKEN_EXPIRE_DAYS")

class MailSettings(BaseSettings):
    MAIL_USERNAME: EmailStr = os.getenv("MAIL_USERNAME", "seu_email_de_teste@gmail.com")
    MAIL_PASSWORD: str = os.getenv("MAIL_PASSWORD")
    MAIL_FROM: str = os.getenv("MAIL_FROM")
    MAIL_FROM_NAME: str = os.getenv("MAIL_FROM_NAME")
    MAIL_SERVER: str = os.getenv("MAIL_SERVER")
    MAIL_PORT: int = os.getenv("MAIL_PORT")
    MAIL_STARTTLS: bool = os.getenv("MAIL_STARTTLS")
    MAIL_SSL_TLS: bool = os.getenv("MAIL_SSL_TLS")

    model_config = SettingsConfigDict(env_file='.env', extra='ignore')


settings = MailSettings()
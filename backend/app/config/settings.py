from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # API
    app_name: str = "SoundDesk"
    debug: bool = False

    # Frontend
    frontend_url: str

    # JWT
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7
    verify_email_expire_hours: int = 24
    reset_password_expire_minutes: int = 30

    # Email
    mail_username: str
    mail_password: str
    mail_from: str
    mail_from_name: str = "SoundDesk"

    mail_server: str
    mail_port: int

    mail_starttls: bool = True
    mail_ssl_tls: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


@lru_cache
def get_settings():
    return Settings()


settings = get_settings()
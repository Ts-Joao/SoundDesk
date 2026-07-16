from enum import Enum


class AuthTokenType(Enum):
    VERIFY_EMAIL = "verify_email"
    RESET_PASSWORD = "reset_password"
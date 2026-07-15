class AppException(Exception):
    status_code: int = 400
    message: str = "Application error"

    def __init__(self, message: str | None) -> None:
        if message:
            self.message = message
            super().__init__(self.message)

class NotFoundException(AppException):
    status_code = 404

class ConflictException(AppException):
    status_code = 409

class BadRequestException(AppException):
    status_code = 400

class UnauthorizedException(AppException):
    status_code = 401

class ForbiddenException(AppException):
    status_code = 403
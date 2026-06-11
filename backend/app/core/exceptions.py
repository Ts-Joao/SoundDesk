class AppException(Exception):
    status_code: int = 400
    message: str = "Application error"

    def __init__(self, message: str | None) -> None:
        if message:
            self.message = message

class NotFoundException(AppException):
    status_code = 404

class PlaylistNotFoundException(NotFoundException):
    message = "Playlist not found"
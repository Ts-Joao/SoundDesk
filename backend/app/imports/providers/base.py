from abc import ABC, abstractmethod

from app.exceptions.exceptions import BadRequestException
from app.imports.schemas import PlaylistImportSchema, TrackImportSchema


class ImportProvider(ABC):

    @property
    def playlist_options(self):
        return {
            "extract_flat": True,
            "quiet": True,
            "no_warnings": True,
        }

    @property
    def track_options(self):
        return {
            "quiet": True,
            "no_warnings": True,
        }

    @abstractmethod
    def validate_url(self, url: str) -> bool:
        raise BadRequestException("Not implemented")

    @abstractmethod
    def extract_playlist(self, url: str) -> PlaylistImportSchema:
        raise BadRequestException("Not implemented")

    @abstractmethod
    def extract_track(self, url: str) -> TrackImportSchema:
        raise BadRequestException("Not implemented")

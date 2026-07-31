from abc import ADBC, abstractmethod

from app.imports.schemas import PlaylistImportSchema


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
        raise NotImplementedError

    @abstractmethod
    def extract_playlist(self, url: str) -> PlaylistImportSchema:
        raise NotImplementedError

    @abstractmethod
    def extract_track(self, url: str) -> PlaylistImportSchema:
        raise NotImplementedError
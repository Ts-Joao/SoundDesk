from abc import ABC, abstractmethod

from app.exceptions.exceptions import BadRequestException
from app.imports.schemas import PlaylistImportSchema, TrackImportSchema


class ImportProvider(ABC):

    @property
    def requires_matching(self) -> bool:
        return False

    @abstractmethod
    def can_handle(self, url: str) -> bool:
        pass

    @abstractmethod
    def extract_playlist(self, url: str) -> PlaylistImportSchema:
        pass

    def extract_track(self, url: str) -> TrackImportSchema:
        raise BadRequestException("Extração individual de faixa não suportada.")
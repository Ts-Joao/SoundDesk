from app.exceptions.exceptions import BadRequestException
from app.imports.providers.base import ImportProvider
from app.imports.providers.spotify import SpotifyHttpClient, SpotifyProvider
from app.imports.providers.youtube import YoutubeProvider


class ImportProviderFactory:
    def __init__(self):
        pass

    @staticmethod
    def get_provider(url: str) -> ImportProvider:
        providers = (
            YoutubeProvider(),
            SpotifyProvider(http_client=SpotifyHttpClient()),
        )

        for provider in providers:
            if provider.can_handle(url):
                return provider

        raise BadRequestException(f"Nenhum provider suporta a URL: {url}")
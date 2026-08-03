from app.imports.providers.youtube import YoutubeProvider
from app.exceptions.exceptions import BadRequestException


class ImportProviderFactory:
    def __init__(self):
        pass

    providers = [
        YoutubeProvider(),
    ]

    @classmethod
    def get_provider(cls, url: str):
        for provider in cls.providers:

            if provider.validate_url(url):
                return provider

        raise BadRequestException("Unsupported import URL")

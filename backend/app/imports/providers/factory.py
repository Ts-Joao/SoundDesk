from app.imports.providers.youtube import YoutubeProvider


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

        raise Exception("Provider not supported")
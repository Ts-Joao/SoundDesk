from app.imports.schemas import (
    PlaylistImportSchema,
    TrackImportSchema,
)


class YoutubeProvider(ImportProvider):

    @staticmethod
    def can_handle(url: str) -> bool:
        return (
            "youtube.com" in url
            or "youtu.be" in url
        )

    def extract_playlist(self, url: str) -> PlaylistImportSchema:

        with YoutubeDL(self.playlist_options) as ydl:
            data = ydl.extract_info(url, download=False)

        tracks = []

        for entry in data["entries"]:

            tracks.append(
                TrackImportSchema(
                    title=entry["title"],
                    source_url=entry["url"],
                )
            )

        return PlaylistImportSchema(
            title=data["title"],
            description=data.get("description"),
            tracks=tracks,
        )

    def extract_track(self, url: str) -> TrackImportSchema:
        with YoutubeDL(self.track_options) as ydl:
            data = ydl.extract_info(url, download=False)

        return TrackImportSchema(
            title=data["title"],
            artist=data.get("uploader"),
            source_url=url,
            duration=data.get("duration"),
            thumbnail=data.get("thumbnail"),
        )
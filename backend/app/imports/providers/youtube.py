from urllib.parse import urlparse

from yt_dlp import YoutubeDL
from yt_dlp.utils import DownloadError

from app.exceptions.exceptions import BadRequestException
from app.imports.providers.base import ImportProvider
from app.imports.schemas import (
    PlaylistImportSchema,
    TrackImportSchema,
)


class YoutubeProvider(ImportProvider):
    def __init__(self):
        self.playlist_options: dict[str, Any] = {
            "extract_flat": "in_playlist",
            "skip_download": True,
            "quiet": True,
            "no_warnings": True,
        }

    @staticmethod
    def can_handle(url: str) -> bool:
        host = (urlparse(url).hostname or "").lower()
        return host == "youtu.be" or host == "youtube.com" or host.endswith(".youtube.com")

    def extract_playlist(self, url: str) -> PlaylistImportSchema:
        try:
            with YoutubeDL(self.playlist_options) as ydl:
                data = ydl.extract_info(url, download=False)
        except DownloadError as exc:
            raise BadRequestException("Could not read the YouTube playlist") from exc

        tracks = []

        for entry in data.get("entries") or []:
            if not entry:
                continue
            source_url = self._entry_url(entry)
            if not source_url:
                continue

            tracks.append(
                TrackImportSchema(
                    title=entry.get("title") or "Untitled track",
                    artist=entry.get("uploader") or entry.get("channel"),
                    source_url=source_url,
                    duration=entry.get("duration"),
                    thumbnail_url=entry.get("thumbnail"),
                )
            )

        if not tracks:
            raise BadRequestException("The YouTube playlist has no importable tracks")

        return PlaylistImportSchema(
            name=data.get("title") or "Imported YouTube playlist",
            description=data.get("description"),
            tracks=tracks,
        )

    def extract_track(self, url: str) -> TrackImportSchema:
        try:
            with YoutubeDL(self.track_options) as ydl:
                data = ydl.extract_info(url, download=False)
        except DownloadError as exc:
            raise BadRequestException("Could not read the YouTube track") from exc

        return TrackImportSchema(
            title=data.get("title") or "Untitled track",
            artist=data.get("uploader"),
            source_url=url,
            duration=data.get("duration"),
            cover_path=data.get("thumbnail"),
        )

    @staticmethod
    def _entry_url(entry: dict) -> str | None:
        webpage_url = entry.get("webpage_url") or entry.get("original_url")
        if webpage_url:
            return webpage_url

        entry_url = entry.get("url")
        if isinstance(entry_url, str) and entry_url.startswith(("https://", "http://")):
            return entry_url

        video_id = entry.get("id") or entry_url
        if video_id:
            return f"https://www.youtube.com/watch?v={video_id}"
        return None

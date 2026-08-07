from concurrent.futures import ThreadPoolExecutor
from yt_dlp import YoutubeDL
from app.imports.schemas import PlaylistImportSchema, TrackImportSchema


class YoutubeSearchProvider:

    def __init__(self):
        pass

    @staticmethod
    def search(title: str, artist: str | None = None) -> str | None:
        query = f"{artist} - {title}" if artist else title
        ydl_opts = {
            "extract_flat": True,
            "skip_download": True,
            "quiet": True,
        }
        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(f"ytsearch1:{query}", download=False)
            if info and "entries" in info and len(info["entries"]) > 0:
                entry = info["entries"][0]
                return entry.get("url") or f"https://www.youtube.com/watch?v={entry.get('id')}"
        return None


class MatchingService:

    def __init__(self, search_provider: YoutubeSearchProvider | None = None):
        self.search_provider = search_provider or YoutubeSearchProvider()

    def match_track(self, track: TrackImportSchema) -> TrackImportSchema:
        try:
            resolved_url = self.search_provider.search(track.title, track.artist)
        except Exception:
            resolved_url = None

        return TrackImportSchema(
            title=track.title,
            artist=track.artist,
            source_url=resolved_url or track.source_url,
            duration=track.duration,
            cover_path=track.cover_path,
        )

    def match_playlist(self, playlist: PlaylistImportSchema, max_workers: int = 10) -> PlaylistImportSchema:
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            matched_tracks = list(executor.map(self.match_track, playlist.tracks))

        return PlaylistImportSchema(
            name=playlist.name,
            description=playlist.description,
            tracks=matched_tracks,
        )
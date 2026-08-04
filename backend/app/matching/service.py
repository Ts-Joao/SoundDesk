from yt_dlp import YoutubeDL
from app.imports.schemas import PlaylistImportSchema


class MatchingService:

    def __init__(self):
        pass

    @staticmethod
    def search_youtube_url(title: str, artist: str | None = None) -> str | None:
        query = f"{artist} - {title}" if artist else title

        ydl_opts = {
            'extract_flat': True,
            'skip_download': True,
            'quiet': True,
        }

        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(f"ytsearch1:{query}", download=False)
            if info and 'entries' in info and len(info['entries']) > 0:
                entry = info['entries'][0]
                return entry.get("url") or f"https://www.youtube.com/watch?v={entry.get('id')}"
        return None

    def match_playlist(self, playlist: PlaylistImportSchema) -> PlaylistImportSchema:
        for track in playlist.tracks:
            yt_url = self.search_youtube_url(track.title, track.artist)
            if yt_url:
                track.source_url = yt_url

        return playlist
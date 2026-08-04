import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

from app.imports.providers.base import ImportProvider
from app.imports.schemas import PlaylistImportSchema, TrackImportSchema


class SpotifyProvider(ImportProvider):

    requires_matching = True

    def __init__(self, client_id: str, client_secret: str):
        auth_manager = SpotifyClientCredentials(
            client_id=client_id,
            client_secret=client_secret,
        )
        self.sp = spotipy.Spotify(auth_manager=auth_manager)

    def validate_url(self, url: str) -> bool:
        return "open.spotify.com/playlist" in url or "spotify:playlist:" in url

    def extract_playlist(self, url: str) -> PlaylistImportSchema:
        playlist_id = url.split("playlist/")[1].split("?")[0]

        spotify_playlist = self.sp.playlist(playlist_id)
        tracks_data = spotify_playlist.get("tracks", {}).get("items", [])

        tracks = []
        for item in tracks_data:
            track_info = item.get("track")
            if not track_info:
                continue

            artist_name = track_info["artists"][0]["name"] if track_info.get("artists") else "Unknown Artist"

            tracks.append(
                TrackImportSchema(
                    title=track_info["name"],
                    artist=artist_name,
                    source_uri=track_info["external_urls"]["spotify"],
                    duration=track_info["duration_ms"] // 1000,
                    thumbnail=track_info["album"]["images"][0]["url"] if track_info["album"].get("images") else None,
                )
            )

        return PlaylistImportSchema(
            title=spotify_playlist["name"],
            description=spotify_playlist.get("description"),
            tracks=tracks,
        )
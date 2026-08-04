import requests
import re

from app.exceptions.exceptions import BadRequestException
from app.imports.providers.base import ImportProvider
from app.imports.schemas import PlaylistImportSchema, TrackImportSchema


class SpotifyProvider(ImportProvider):
    requires_matching = True

    @staticmethod
    def clean_spotify_url(url: str) -> str:
        cleaned = re.sub(r'^(https?://)+', 'https://', url.strip())
        return cleaned

    def validate_url(self, url: str) -> bool:
        cleaned_url = clean_spotify_url(url)
        return "open.spotify.com" in cleaned_url or "spotify:playlist:" in cleaned_url

    @staticmethod
    def _extract_playlist_id(url: str) -> str:
        match = re.search(r"playlist[/:]([a-zA-Z0-9]{22})", url)
        if not match:
            raise BadRequestException("URL do Spotify inválida ou ID não encontrado.")
        return match.group(1)

    def extract_playlist(self, url: str) -> PlaylistImportSchema:
        playlist_id = self._extract_playlist_id(url)

        embed_url = f"https://open.spotify.com/embed/playlist/{playlist_id}"

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

        response = requests.get(embed_url, headers=headers)
        if response.status_code != 200:
            raise BadRequestException(f"Não foi possível acessar a playlist (Status {response.status_code})")

        match = re.search(r'<script id="resource" type="application/json">(.*?)</script>', response.text)

        if not match:
            raise BadRequestException("Não foi possível localizar os metadados no Embed do Spotify.")

        import json
        data = json.loads(match.group(1))

        playlist_title = data.get("title", "Spotify Playlist")
        playlist_desc = data.get("description", "")

        tracks = []
        track_list = data.get("tracks", [])

        for track_item in track_list:
            artists = track_item.get("artists", [])
            artist_name = artists[0].get("name") if artists else "Unknown Artist"

            tracks.append(
                TrackImportSchema(
                    title=track_item.get("title") or track_item.get("name"),
                    artist=artist_name,
                    source_url=f"https://open.spotify.com/track/{track_item.get('id')}",
                    duration=int(track_item.get("duration", 0) / 1000) if track_item.get("duration") else 0,
                    thumbnail=track_item.get("coverart", {}).get("sources", [{}])[0].get("url")
                )
            )

        return PlaylistImportSchema(
            name=playlist_title,
            description=playlist_desc,
            tracks=tracks
        )

    def extract_track(self, url: str) -> TrackImportSchema:
        raise BadRequestException("Extração individual não implementada.")
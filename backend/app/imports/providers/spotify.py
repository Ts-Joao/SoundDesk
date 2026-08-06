import json
import re
import requests
from app.config.settings import settings

from app.exceptions.exceptions import BadRequestException
from app.imports.providers.base import ImportProvider
from app.imports.schemas import PlaylistImportSchema, TrackImportSchema


class SpotifyHttpClient:

    def __init__(self):
        self.settings = settings
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        })

    def fetch_embed_html(self, playlist_id: str) -> str:
        embed_url = f"https://open.spotify.com/embed/playlist/{playlist_id}"
        response = self.session.get(embed_url, timeout=10)

        if response.status_code != 200:
            raise Exception(
                f"Falha ao acessar o Spotify Embed (Status {response.status_code})"
            )
        return response.text


class SpotifyProvider(ImportProvider):

    def __init__(self, http_client: SpotifyHttpClient | None = None):
        self.client = http_client or SpotifyHttpClient()

    @property
    def requires_matching(self) -> bool:
        return True

    def can_handle(self, url: str) -> bool:
        return "open.spotify.com/playlist" in url or "spotify:playlist:" in url

    @staticmethod
    def _extract_id(url: str) -> str:
        match = re.search(r"playlist[/:]([a-zA-Z0-9]{22})", url)
        if not match:
            raise BadRequestException("URL do Spotify inválida ou ID não encontrado.")
        return match.group(1)

    def extract_playlist(self, url: str) -> PlaylistImportSchema:
        playlist_id = self._extract_id(url)
        html_content = self.client.fetch_embed_html(playlist_id)

        match = re.search(
            r'<script\s+id="(?:resource|__NEXT_DATA__|session)"\s+type="application/json">(.*?)</script>',
            html_content,
            re.DOTALL,
        )

        if not match:
            raise BadRequestException(
                "Não foi possível processar os metadados da playlist. O Spotify pode ter alterado o layout do Embed.")

        try:
            data = json.loads(match.group(1))
        except json.JSONDecodeError:
            raise BadRequestException("Erro ao decodificar os dados JSON da playlist.")

        entity = data.get("props", {}).get("pageProps", {}).get("state", {}).get("data", {}).get("entity",
                                                                                                 {}) if "props" in data else data

        playlist_title = entity.get("title") or entity.get("name") or "Spotify Playlist"
        playlist_desc = entity.get("description", "")

        raw_tracks = entity.get("tracks") or entity.get("trackList", [])

        tracks = []
        for item in raw_tracks:
            artists = item.get("artists", [])
            artist_name = (
                artists[0].get("name") if artists and isinstance(artists[0], dict)
                else item.get("subtitle") or "Unknown Artist"
            )

            title = item.get("title") or item.get("name")
            if not title:
                continue

            track_id = item.get("id") or item.get("uri", "").split(":")[-1]

            tracks.append(
                TrackImportSchema(
                    title=title,
                    artist=artist_name,
                    source_url=f"https://open.spotify.com/track/{track_id}",
                    duration=int(item.get("duration", 0) / 1000) if item.get("duration") else 0,
                    cover_path=item.get("coverart", {}).get("sources", [{}])[0].get("url") or item.get("displayImage"),
                )
            )

        return PlaylistImportSchema(
            name=playlist_title,
            description=playlist_desc,
            tracks=tracks,
        )
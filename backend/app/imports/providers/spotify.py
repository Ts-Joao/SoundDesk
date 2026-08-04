import json
import re
import requests

from app.exceptions.exceptions import BadRequestException
from app.imports.providers.base import ImportProvider
from app.imports.schemas import PlaylistImportSchema, TrackImportSchema


class SpotifyProvider(ImportProvider):
    requires_matching = True

    def validate_url(self, url: str) -> bool:
        return "open.spotify.com/playlist" in url or "spotify:playlist:" in url

    def extract_playlist(self, url: str) -> PlaylistImportSchema:
        playlist_id = url.split("playlist/")[1].split("?")[0]
        embed_url = f"https://open.spotify.com/embed/playlist/{playlist_id}"

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }

        response = requests.get(embed_url, headers=headers)
        if response.status_code != 200:
            raise BadRequestException("Not possible to fetch playlist")

        match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', response.text)

        if not match:
            raise Exception("Erro ao extrair dados da playlist do Spotify.")

        data = json.loads(match.group(1))

        entity = data["props"]["pageProps"]["state"]["data"]["entity"]
        playlist_title = entity.get("name", "Spotify Playlist")
        playlist_desc = entity.get("description", "")

        tracks = []
        for track_item in entity.get("trackList", []):
            tracks.append(
                TrackImportSchema(
                    title=track_item.get("title"),
                    artist=track_item.get("subtitle"),
                    source_url=f"https://open.spotify.com/track/{track_item.get('uri', '').split(':')[-1]}",
                    duration=int(track_item.get("duration", 0) / 1000),
                    thumbnail_url=track_item.get("displayImage"),
                )
            )

        return PlaylistImportSchema(
            name=playlist_title,
            description=playlist_desc,
            tracks=tracks,
        )

    def extract_track(self, url: str) -> TrackImportSchema:
        raise BadRequestException("Not implemented")
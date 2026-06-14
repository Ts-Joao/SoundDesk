from pathlib import Path
from uuid import UUID
from typing import Any

import requests
import yt_dlp

from app.repositories.track_repository import TrackRepository
from app.schemas.track import UpdateTrackSchema
from app.services.download_job_service import DownloadJobService
from app.services.track_service import TrackService
from app.models.track import Track


class DownloaderService:
    DOWNLOADS_DIR = Path("storage/downloads")
    COVERS_DIR = Path("storage/covers")

    def __init__(
        self,
        download_job_service: DownloadJobService,
        track_service: TrackService,
        track_repository: TrackRepository,
    ):
        self.download_job_service = download_job_service
        self.track_service = track_service
        self.track_repository = track_repository

    def process_track(self, job_id: UUID, track_id: UUID):
        track = self.track_repository.find_by_id(track_id)

        try:
            self.download_job_service.start(job_id)

            metadata = self.get_metadata(track.source_url)

            self.track_service.update(
                track_id=track.id,
                data=UpdateTrackSchema(
                    title=metadata["title"],
                    artist=metadata["uploader"],
                    duration=metadata["duration"],
                )
            )

            audio_path = self.download_audio(track.source_url, track.title)

            self.track_service.update(
                track_id=track.id,
                data=UpdateTrackSchema(
                    file_path=audio_path,
                )
            )

            self.check_thumbnail(metadata, track)

            self.track_service.set_finished(track.id)
            self.download_job_service.complete(job_id)

        except Exception as exc:
            self.track_service.failed(track.id)
            self.download_job_service.fail(job_id, str(exc))
            raise

    @staticmethod
    def get_metadata(source_url: str) -> dict:
        with yt_dlp.YoutubeDL() as ydl:
            info = ydl.extract_info(url=source_url, download=False)

        return {
            "title": info.get("title"),
            "duration": info.get("duration"),
            "thumbnail_url": info.get("thumbnail"),
            "uploader": info.get("uploader"),
        }

    def download_audio(self, source_url: str, title: str) -> str:
        self.DOWNLOADS_DIR.mkdir(parents=True, exist_ok=True)

        output_template = self.DOWNLOADS_DIR / f"{title}.%(ext)s"

        options: dict[str, Any] = {
            "format": "bestaudio/best",
            "outtmpl": str(output_template),    # noqa: typo
            "postprocessors": [
                {
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",    # noqa: typo
                    "preferredquality": "192",  # noqa: typo
                }
            ],
        }

        with yt_dlp.YoutubeDL(options) as ydl: # type: ignore[arg-type]
            ydl.download([source_url])

        return f"downloads/{title}.mp3"

    def download_cover(self, thumbnail_url: str, title: str) -> str:
        self.COVERS_DIR.mkdir(parents=True, exist_ok=True)

        cover_path = self.COVERS_DIR / f"{title}.jpg"
        response = requests.get(thumbnail_url, timeout=30)
        response.raise_for_status()

        with open(cover_path, "wb") as file:
            file.write(response.content)

        return f"covers/{title}.jpg"

    def check_thumbnail(self, metadata, track: Track):
        try:
            thumbnail_url = metadata.get(
                "thumbnail_url"
            )

            if thumbnail_url:
                cover_path = self.download_cover(
                    thumbnail_url,
                    track.title,
                )

                self.track_service.update(
                    track_id=track.id,
                    data=UpdateTrackSchema(
                        cover_path=cover_path,
                    ),
                )

        except Exception as exc:
            print(
                f"Error downloading thumbnail for track {track.id}: {str(exc)} "
                f"{track.id}: {exc}"
            )
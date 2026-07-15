import logging
import re
from pathlib import Path
from typing import Any
from uuid import UUID

import requests
import yt_dlp

from app.common.file_service import FileService
from app.downloads.service import DownloadJobService
from app.enums.track_status import TrackStatus
from app.tracks.models import Track
from app.tracks.repository import TrackRepository
from app.tracks.service import TrackService

logger = logging.getLogger(__name__)


class DownloaderService:
    DOWNLOADS_DIR = Path("storage/downloads")
    COVERS_DIR = Path("storage/covers")

    def __init__(self, download_job_service: DownloadJobService, track_service: TrackService, track_repository: TrackRepository):
        self.download_job_service = download_job_service
        self.track_service = track_service
        self.track_repository = track_repository
        self.file_service = FileService()

    def process_track(self, job_id: UUID, track_id: UUID) -> None:
        if not self.download_job_service.start(job_id):
            return

        track = self.track_repository.find_by_id(track_id)
        if track is None:
            return
        audio_path: str | None = None
        cover_path: str | None = None
        try:
            self.track_repository.update_status(track, TrackStatus.PROCESSING)
            self.track_repository.db.commit()

            metadata = self.get_metadata(track.source_url)
            audio_path = self.download_audio(track.source_url, track.id, metadata["title"])
            cover_path = self.download_cover(metadata.get("thumbnail_url"), track.id)

            track.title = metadata["title"] or track.title
            track.artist = metadata["uploader"] or track.artist
            track.duration = metadata["duration"] or track.duration
            track.file_path = audio_path
            track.cover_path = cover_path
            self.download_job_service.repository.lock_track(track.id)
            if self.download_job_service.repository.has_active_job(track.id):
                track.status = TrackStatus.READY
                self.download_job_service.repository.finish_active_jobs(track.id, status=self._completed_status())
            else:
                self.file_service.delete_audio(audio_path)
                self.file_service.delete_cover(cover_path)
                track.file_path = None
                track.cover_path = None
                track.status = TrackStatus.CANCELED
            self.track_repository.db.commit()
        except Exception as exc:
            self.track_repository.db.rollback()
            if audio_path:
                self.file_service.delete_audio(audio_path)
            if cover_path:
                self.file_service.delete_cover(cover_path)
            self._mark_failed(track_id, str(exc))
            logger.exception("Download failed for track %s", track_id)
            raise

    def _mark_failed(self, track_id: UUID, message: str) -> None:
        track = self.download_job_service.repository.lock_track(track_id)
        if track is None:
            return
        if not self.download_job_service.repository.has_active_job(track_id):
            track.status = TrackStatus.CANCELED
            self.track_repository.db.commit()
            return
        track.status = TrackStatus.FAILED
        self.download_job_service.repository.finish_active_jobs(
            track_id, status=self._failed_status(), error_message=message[:2000]
        )
        self.track_repository.db.commit()

    @staticmethod
    def _completed_status():
        from app.enums.download_status import DownloadStatus
        return DownloadStatus.COMPLETED

    @staticmethod
    def _failed_status():
        from app.enums.download_status import DownloadStatus
        return DownloadStatus.FAILED

    @staticmethod
    def get_metadata(source_url: str) -> dict[str, Any]:
        with yt_dlp.YoutubeDL({"quiet": True, "noplaylist": True}) as ydl:
            info = ydl.extract_info(url=source_url, download=False)
        return {
            "title": info.get("title"),
            "duration": info.get("duration"),
            "thumbnail_url": info.get("thumbnail"),
            "uploader": info.get("uploader"),
        }

    def download_audio(self, source_url: str, track_id: UUID, title: str | None) -> str:
        self.DOWNLOADS_DIR.mkdir(parents=True, exist_ok=True)
        stem = f"{self.sanitize_filename(title or 'track')}-{track_id}"
        output_template = self.DOWNLOADS_DIR / f"{stem}.%(ext)s"
        options: dict[str, Any] = {
            "format": "bestaudio/best",
            "outtmpl": str(output_template),
            "noplaylist": True,
            "postprocessors": [{"key": "FFmpegExtractAudio", "preferredcodec": "mp3", "preferredquality": "192"}],
        }
        with yt_dlp.YoutubeDL(options) as ydl:
            ydl.download([source_url])
        return f"downloads/{stem}.mp3"

    def download_cover(self, thumbnail_url: str | None, track_id: UUID) -> str | None:
        if not thumbnail_url:
            return None
        self.COVERS_DIR.mkdir(parents=True, exist_ok=True)
        cover_path = self.COVERS_DIR / f"{track_id}.jpg"
        try:
            response = requests.get(thumbnail_url, timeout=(5, 30))
            response.raise_for_status()
            cover_path.write_bytes(response.content)
            return f"covers/{track_id}.jpg"
        except requests.RequestException:
            logger.warning("Could not download artwork for track %s", track_id, exc_info=True)
            return None

    @staticmethod
    def sanitize_filename(name: str) -> str:
        safe_name = re.sub(r"[^\w.-]+", "-", name, flags=re.UNICODE).strip(".-")
        return safe_name[:120] or "track"

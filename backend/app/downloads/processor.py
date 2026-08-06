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
from app.tracks.repository import TrackRepository
from app.tracks.service import TrackService

logger = logging.getLogger(__name__)


class DownloaderService:
    DOWNLOADS_DIR = Path("storage/downloads")
    COVERS_DIR = Path("storage/covers")
    COOKIES_PATH = Path("/app/youtube_cookies.txt")

    def __init__(
        self,
        download_job_service: DownloadJobService,
        track_service: TrackService,
        track_repository: TrackRepository,
    ):
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

            job = self.download_job_service.find_by_id(job_id)
            user_id = job.user_id if job else None

            metadata = self.get_metadata(track.source_url)

            audio_path = self.download_audio(
                track.source_url, track.id, metadata["title"], user_id=user_id
            )
            cover_path = self.download_cover(metadata.get("thumbnail_url"), track.id)

            track.title = metadata["title"] or track.title
            track.artist = metadata["uploader"] or track.artist
            track.duration = metadata["duration"] or track.duration
            track.file_path = audio_path
            track.cover_path = cover_path

            self.download_job_service.repository.lock_track(track.id)

            if self.download_job_service.repository.has_active_job(track.id):
                track.status = TrackStatus.READY
                self.download_job_service.repository.finish_active_jobs(
                    track.id, status=self._completed_status()
                )
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

    @classmethod
    def _get_base_yt_opts(cls) -> dict[str, Any]:
        opts: dict[str, Any] = {
            "quiet": True,
            "no_warnings": True,
            "noplaylist": True,
            "source_address": "0.0.0.0",
            "prefer_ffmpeg": True,
            "js_runtimes": {"node": {}},
            "extractor_args": {
                "youtube": {
                    "player_client": ["tv", "android", "web"],
                }
            },
            "http_headers": {
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/120.0.0.0 Safari/537.36"
                )
            },
        }

        if cls.COOKIES_PATH.exists() and cls.COOKIES_PATH.stat().st_size > 0:
            opts["cookiefile"] = str(cls.COOKIES_PATH)

        return opts

    @classmethod
    def get_metadata(cls, source_url: str) -> dict[str, Any]:
        options = cls._get_base_yt_opts()

        try:
            with yt_dlp.YoutubeDL(options) as ydl:
                info = ydl.extract_info(url=source_url, download=False)
        except yt_dlp.utils.DownloadError as err:
            if "cookiefile" in options:
                logger.warning(
                    "Falha ao obter metadados com cookies. Tentando sem cookies. Erro: %s",
                    err,
                )
                nocookie_opts = dict(options)
                nocookie_opts.pop("cookiefile", None)
                with yt_dlp.YoutubeDL(nocookie_opts) as ydl:
                    info = ydl.extract_info(url=source_url, download=False)
            else:
                raise

        return {
            "title": info.get("title") if info else None,
            "duration": info.get("duration") if info else None,
            "thumbnail_url": info.get("thumbnail") if info else None,
            "uploader": info.get("uploader") if info else None,
        }

    def download_audio(
        self, source_url: str, track_id: UUID, title: str | None, user_id: UUID | None = None
    ) -> str:
        if user_id:
            dest_dir = Path("storage/downloads") / str(user_id)
            rel_prefix = f"downloads/{user_id}"
        else:
            dest_dir = Path("storage/downloads")
            rel_prefix = "downloads"

        dest_dir.mkdir(parents=True, exist_ok=True)
        stem = f"{self.sanitize_filename(title or 'track')}-{track_id}"
        output_template = dest_dir / f"{stem}.%(ext)s"

        base_options = self._get_base_yt_opts()
        base_options.update(
            {
                "outtmpl": str(output_template),
                "postprocessors": [
                    {
                        "key": "FFmpegExtractAudio",
                        "preferredcodec": "mp3",
                        "preferredquality": "192",
                    }
                ],
            }
        )

        options = dict(base_options)
        options["format"] = "bestaudio/best"

        try:
            with yt_dlp.YoutubeDL(options) as ydl:
                ydl.download([source_url])
        except yt_dlp.utils.DownloadError as err:
            logger.warning(
                "Falha ao baixar 'bestaudio/best' para %s. Tentando fallback para 'best'. Erro: %s",
                source_url,
                err,
            )
            fallback_options = dict(base_options)
            fallback_options["format"] = "best"
            try:
                with yt_dlp.YoutubeDL(fallback_options) as ydl:
                    ydl.download([source_url])
            except yt_dlp.utils.DownloadError as fallback_err:
                if "cookiefile" in base_options:
                    logger.warning(
                        "Falha ao baixar com cookies. Tentando sem cookies. Erro: %s",
                        fallback_err,
                    )
                    nocookie_options = dict(base_options)
                    nocookie_options.pop("cookiefile", None)
                    nocookie_options["format"] = "bestaudio/best"
                    try:
                        with yt_dlp.YoutubeDL(nocookie_options) as ydl:
                            ydl.download([source_url])
                    except yt_dlp.utils.DownloadError as nocookie_err:
                        logger.warning(
                            "Falha ao baixar 'bestaudio/best' sem cookies. Tentando fallback para 'best' sem cookies. Erro: %s",
                            nocookie_err,
                        )
                        nocookie_fallback = dict(nocookie_options)
                        nocookie_fallback["format"] = "best"
                        with yt_dlp.YoutubeDL(nocookie_fallback) as ydl:
                            ydl.download([source_url])
                else:
                    raise

        return f"{rel_prefix}/{stem}.mp3"

    def download_cover(
        self, thumbnail_url: str | None, track_id: UUID
    ) -> str | None:
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
            logger.warning(
                "Could not download artwork for track %s", track_id, exc_info=True
            )
            return None

    @staticmethod
    def sanitize_filename(name: str) -> str:
        safe_name = re.sub(r"[^\w.-]+", "-", name, flags=re.UNICODE).strip(".-")
        return safe_name[:120] or "track"
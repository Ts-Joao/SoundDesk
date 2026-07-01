from uuid import UUID

from app.database.session import SessionLocal
from app.repositories.download_job_repository import DownloadJobRepository
from app.repositories.export_job_repository import ExportJobRepository
from app.repositories.playlist_repository import PlaylistRepository
from app.repositories.track_repository import TrackRepository
from app.services.file_service import FileService
from app.services.track_service import TrackService
from app.workers.celery_app import celery_app
from app.services.downloader_service import DownloaderService
from app.services.download_job_service import DownloadJobService


@celery_app.task(name="process_download")
def process_download(job_id: UUID, track_id: UUID):
    db = SessionLocal()
    try:
        track_repository = TrackRepository(db)
        download_job_repository = DownloadJobRepository(db)
        playlist_repository = PlaylistRepository(db)
        file_service = FileService()

        download_job_service = DownloadJobService(
            repository=download_job_repository,
            playlist_repository=playlist_repository,
        )
        track_service = TrackService(
            track_repository,
            file_service
        )

        downloader_service = DownloaderService(
            download_job_service=download_job_service,
            track_service=track_service,
            track_repository=track_repository,
        )

        downloader_service.process_track(job_id, track_id)
    finally:
        db.close()

@celery_app.task(name="process_export")
def process_export(
        job_id: UUID,
        playlist_id: UUID
):
    from app.services.export_job_service import ExportJobService
    db = SessionLocal()
    try:
        playlist_repository = PlaylistRepository(db)
        repository = ExportJobRepository(db)
        file_service = FileService()
        service = ExportJobService(
            playlist_repository=playlist_repository,
            repository=repository,
            file_service=file_service
        )

        service.process_export_playlist(job_id=job_id, playlist_id=playlist_id)
    finally:
        db.close()
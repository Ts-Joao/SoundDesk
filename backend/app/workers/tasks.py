from uuid import UUID

import asyncio

from app.config.settings import settings
from app.database.session import SessionLocal
from app.downloads.repository import DownloadJobRepository
from app.emails.schemas import ConfirmEmailChangeSchema
from app.exports.repository import ExportJobRepository
from app.playlists.repository import PlaylistRepository
from app.tracks.repository import TrackRepository
from app.common.file_service import FileService
from app.tracks.service import TrackService
from app.workers.celery import celery_app
from app.downloads.processor import DownloaderService
from app.downloads.service import DownloadJobService


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

        downloader_service.process_track(UUID(str(job_id)), UUID(str(track_id)))
    finally:
        db.close()

@celery_app.task(name="process_export")
def process_export(
        job_id: UUID,
        playlist_id: UUID
):
    from app.exports.service import ExportJobService
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

        service.process_export_playlist(
            job_id=UUID(str(job_id)),
            playlist_id=UUID(str(playlist_id)),
        )
    finally:
        db.close()

@celery_app.task(name="send_welcome_email_task")
def send_welcome_email_task(email_to: str, username: str):
    from app.emails.service import EmailService
    from app.emails.schemas import WelcomeEmailSchema

    data = WelcomeEmailSchema(
        email_to=email_to,
        username=username,
        frontend_url=settings.FRONTEND_URL + "/login"
    )

    email_service = EmailService()
    asyncio.run(email_service.send_welcome(data))

@celery_app.task(name="send_verify_email_task")
def send_verify_email_task(
        email_to: str,
        username: str,
        url: str
):
    from app.emails.service import EmailService
    from app.emails.schemas import VerifyEmailSchema

    data = VerifyEmailSchema(
        email_to=email_to,
        username=username,
        frontend_url=url
    )

    email_service = EmailService()
    asyncio.run(email_service.verify_email(data))

@celery_app.task(name="send_reset_password_email_task")
def send_reset_password_email_task(
        email_to: str,
        username: str,
        url,
        token
):
    from app.emails.service import EmailService
    from app.emails.schemas import ResetPasswordEmailSchema

    data = ResetPasswordEmailSchema(
        email_to=email_to,
        username=username,
        frontend_url=url,
        token=token
    )

    email_service = EmailService()
    asyncio.run(email_service.reset_password(data))

@celery_app.task(name="send_password_change_email_task")
def send_password_change_email_task(
        email_to: str,
        username: str,
        url: str
):
    from app.emails.service import EmailService
    from app.emails.schemas import PasswordChangedEmailSchema

    data = PasswordChangedEmailSchema(
        email_to=email_to,
        username=username,
        frontend_url=url
    )

    email_service = EmailService()
    asyncio.run(email_service.password_changed(data))

@celery_app.task(name="send_confirm_email_change")
def send_confirm_email_change(data: ConfirmEmailChangeSchema):
    from app.emails.service import EmailService

    email_service = EmailService()
    asyncio.run(email_service.confirm_email_change(data))
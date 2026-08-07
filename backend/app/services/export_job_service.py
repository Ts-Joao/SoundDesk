import zipfile
from pathlib import Path
from uuid import UUID

from app.exceptions.exceptions import BadRequestException
from app.enums.export_status import ExportStatus
from app.enums.track_status import TrackStatus
from app.models import Playlist
from app.models.export_job import ExportJob
from app.repositories.export_job_repository import ExportJobRepository
from app.repositories.playlist_repository import PlaylistRepository
from app.services.file_service import FileService
from app.workers.tasks import process_export


class ExportJobService:
    def __init__(
            self,
            repository: ExportJobRepository,
            playlist_repository: PlaylistRepository,
            file_service: FileService,
    ):
        self.repository = repository
        self.playlist_repository = playlist_repository
        self.file_service = file_service


    def create(
            self,
            playlist_id: UUID,
    ):
        job = self.repository.create(playlist_id)

        process_export.delay(
            str(job.id),
            str(playlist_id),
        )

        return job

    def find_all(self):
        return self.repository.find_all()

    def find_by_id(self, job_id: UUID) -> ExportJob:
        return self.repository.find_by_id(job_id)

    def download_playlist_zip(self, job_id: UUID) -> ExportJob:
        return self.repository.find_by_id(job_id)

    def start_export(
            self,
            job_id: UUID,
    ):
        return self.repository.update_status(job_id, ExportStatus.PROCESSING)

    def update_path(
            self,
            job_id: UUID,
            path: str
    ):
        return self.repository.update_path(job_id, path)

    def complete_export(
            self,
            job_id: UUID,
    ):
        return self.repository.update_status(job_id, ExportStatus.COMPLETED)

    def fail(
            self,
            job_id: UUID,
            error_message: str
    ):
        self.repository.update_status(job_id, ExportStatus.FAILED, error_message)

    @staticmethod
    def create_zip(
            playlist: Playlist,
    ) -> str:
        exports_dir = Path("storage/exports")
        exports_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        zip_path = exports_dir / f"{playlist.name}.zip"

        with zipfile.ZipFile(zip_path, "w") as zip_file:
            tracks_exported = 0

            for track in playlist.tracks:
                if track.status != TrackStatus.READY:
                    continue

                if not track.file_path:
                    continue

                tracks_exported =+ 1

                file_path = Path("storage") / track.file_path

                zip_file.write(
                    file_path,
                    arcname=file_path.name,
                )

        return str(zip_path)

    def process_export_playlist(
            self,
            job_id: UUID,
            playlist_id: UUID,
    ):

        try:
            self.start_export(job_id)

            playlist = self.playlist_repository.find_by_id(playlist_id)

            zip_path = self.create_zip(playlist)

            self.update_path(job_id, zip_path)

            self.complete_export(job_id)

            return str(zip_path)

        except Exception as exc:
            self.fail(job_id, str(exc))

    def get_zip(
            self,
            job_id: UUID,
    ):
        export_job = self.find_by_id(job_id)

        if export_job.status != ExportStatus.COMPLETED:
            raise BadRequestException("Zip not available")

        print(str(export_job.file_path))

        return str(export_job.file_path)

    def delete(
            self,
            job_id: UUID,
    ):
        export_job = self.find_by_id(job_id)

        self.file_service.delete_zip(export_job.file_path)
        self.repository.delete(job_id)

    def retry(
            self,
            job_id: UUID,
    ):
        job = self.find_by_id(job_id)

        if job.status != ExportStatus.FAILED:
            raise BadRequestException("Only failed jobs can be retried")

        self.repository.update_status(job_id, ExportStatus.RETRYING)

        new_job = self.repository.create(playlist_id=job.playlist_id)

        from app.workers.tasks import process_export
        task = process_export.delay(
            str(new_job.id),
            str(new_job.playlist_id),
        )

        self.repository.update_celery_task_id(new_job.id, task.id)

        return new_job

    def cancel(
            self,
            job_id: UUID,
    ):
        job = self.find_by_id(job_id)

        if job.status not in [ExportStatus.PENDING, ExportStatus.PROCESSING]:
            raise BadRequestException("Only pending or processing jobs can be canceled")

        if job.celery_task_id:
            from app.workers.tasks import celery_app
            celery_app.control.revoke(job.celery_task_id, terminate=True)

        self.repository.update_status(job_id, ExportStatus.CANCELED)
        return self.find_by_id(job_id)
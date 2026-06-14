from pathlib import Path
from uuid import UUID

from app.core.exceptions import NotFoundException
from app.enums.track_status import TrackStatus
from app.repositories.download_job_repository import DownloadJobRepository
from app.repositories.track_repository import TrackRepository
from app.schemas.track import CreateTrackSchema, UpdateTrackSchema
from app.services.file_service import FileService


class TrackService:
    def __init__(
            self,
            repository: TrackRepository,
            file_service: FileService,
    ):
        self.repository = repository
        self.file_service = file_service

    def create(self, data: CreateTrackSchema):
        return self.repository.create(data)

    def find_all(self):
        return  self.repository.find_all()

    def find_by_id(self, track_id: UUID):
        track = self.repository.find_by_id(track_id)

        if not track:
            raise NotFoundException("Track not found")

        return track

    def update(
            self,
            track_id: UUID,
            data: UpdateTrackSchema
    ):
        track = self.find_by_id(track_id)

        return self.repository.update(track, data)

    def delete(self, track_id: UUID):
        track = self.find_by_id(track_id)

        self.file_service.delete_audio(track.file_path)
        self.file_service.delete_cover(track.cover_path)
        self.repository.delete(track)

    def set_processing(self, track_id: UUID):
        track = self.find_by_id(track_id)

        self.repository.update_status(track, status=TrackStatus.PROCESSING)

    def set_finished(self, track_id: UUID):
        track = self.find_by_id(track_id)

        self.repository.update_status(track, status=TrackStatus.READY)

    def failed(self, track_id: UUID):
        track = self.find_by_id(track_id)

        self.repository.update_status(track, status=TrackStatus.FAILED)
from typing import List
from uuid import UUID

from app.exceptions.exceptions import NotFoundException
from app.enums.track_status import TrackStatus
from app.tracks.repository import TrackRepository
from app.tracks.models import Track
from app.tracks.schemas import CreateTrackSchema, UpdateTrackSchema
from app.common.file_service import FileService


class TrackService:
    def __init__(
            self,
            repository: TrackRepository,
            file_service: FileService,
    ):
        self.repository = repository
        self.file_service = file_service

    def get_or_create(self, data: CreateTrackSchema) -> tuple[Track, bool]:
        existing = self.repository.find_by_source_url(data.source_url)
        if existing:
            return existing, False
        track = self.repository.create(data)
        return track, True

    def create(self, data: CreateTrackSchema) -> Track:
        track, _ = self.get_or_create(data)
        return track

    def find_all(self, user_id: UUID) -> List[Track]:
        return self.repository.find_all(user_id)

    def find_by_id(self, track_id: UUID) -> Track:
        track = self.repository.find_by_id(track_id)

        if not track:
            raise NotFoundException("Track not found")

        return track

    def update(
            self,
            track_id: UUID,
            data: UpdateTrackSchema,
    ) -> Track:
        track = self.find_by_id(track_id)
        return self.repository.update(track, data)

    def delete_if_orphan(self, track_id: UUID) -> bool:
        track = self.repository.find_by_id(track_id)
        if not track:
            return False

        refs = self.repository.count_playlist_references(track_id)

        if refs == 0 and self.repository.count_download_references(track_id) == 0:
            if track.file_path:
                self.file_service.delete_audio(track.file_path)
            if track.cover_path:
                self.file_service.delete_cover(track.cover_path)

            self.repository.delete(track)
            return True
        return False

    def set_processing(self, track_id: UUID) -> None:
        track = self.find_by_id(track_id)
        self.repository.update_status(track, status=TrackStatus.PROCESSING)

    def set_finished(self, track_id: UUID) -> None:
        track = self.find_by_id(track_id)
        self.repository.update_status(track, status=TrackStatus.READY)

    def failed(self, track_id: UUID) -> None:
        track = self.find_by_id(track_id)
        self.repository.update_status(track, status=TrackStatus.FAILED)

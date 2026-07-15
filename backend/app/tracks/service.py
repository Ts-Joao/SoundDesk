from typing import List
from uuid import UUID

from app.exceptions.exceptions import NotFoundException, ForbiddenException
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

    def create(
            self,
            data: CreateTrackSchema,
            user_id: UUID
    ) -> Track:
        return self.repository.create(data, user_id)

    def find_all(
            self,
            user_id: UUID
    ) -> List[Track]:
        return self.repository.find_all(user_id)

    def find_by_id(
            self,
            track_id: UUID,
            user_id: UUID
    ) -> Track:
        track = self.repository.find_by_id(track_id)

        if not track:
            raise NotFoundException("Track not found")

        self._verify_ownership(track, user_id)

        return track

    def update(
            self,
            track_id: UUID,
            data: UpdateTrackSchema,
            user_id: UUID
    ) -> Track:
        track = self.find_by_id(track_id, user_id)

        return self.repository.update(track, data)

    def delete(
            self,
            track_id: UUID,
            user_id: UUID
    ) -> None:
        track = self.find_by_id(track_id, user_id)

        if track.file_path:
            self.file_service.delete_audio(track.file_path)
        if track.cover_path:
            self.file_service.delete_cover(track.cover_path)

        self.repository.delete(track)

    def set_processing(
            self,
            track_id: UUID,
            user_id: UUID
    ) -> None:
        track = self.find_by_id(track_id, user_id)

        self.repository.update_status(track, status=TrackStatus.PROCESSING)

    def set_finished(
            self,
            track_id: UUID,
            user_id: UUID
    ) -> None:
        track = self.find_by_id(track_id, user_id)

        self.repository.update_status(track, status=TrackStatus.READY)

    def failed(
            self,
            track_id: UUID,
            user_id: UUID
    ) -> None:
        track = self.find_by_id(track_id, user_id)

        self.repository.update_status(track, status=TrackStatus.FAILED)

    @staticmethod
    def _verify_ownership(
            track: Track,
            user_id: UUID
    ) -> None:
        if track.user_id != user_id:
            raise ForbiddenException("You don't have permission to perform this action")
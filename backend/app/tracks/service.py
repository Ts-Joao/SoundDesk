from typing import List
from uuid import UUID

from app.exceptions.exceptions import ForbiddenException, NotFoundException
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
            self._sync_metadata(existing, data)
            return existing, False
        track = self.repository.create(data)
        return track, True

    def _sync_metadata(self, track: Track, data: CreateTrackSchema) -> None:
        """Update an existing track's metadata from imported data.

        Rules:
        - title, artist, duration are always overwritten with the incoming data.
        - file_path and cover_path are only written if the track does not
          already have them (never overwrite a good existing path).
        - Status is intentionally never touched here.
        """
        changed = False

        if data.title and data.title != track.title:
            track.title = data.title
            changed = True

        if data.artist and data.artist != track.artist:
            track.artist = data.artist
            changed = True

        if data.duration and data.duration != track.duration:
            track.duration = data.duration
            changed = True

        if data.file_path and not track.file_path:
            track.file_path = data.file_path
            changed = True

        if data.cover_path and not track.cover_path:
            track.cover_path = data.cover_path
            changed = True

        if changed:
            self.repository.db.commit()
            self.repository.db.refresh(track)

    def create(self, data: CreateTrackSchema) -> Track:
        track, _ = self.get_or_create(data)
        return track

    def find_all(self, user_id: UUID) -> List[Track]:
        return self.repository.find_all(user_id)

    def find_by_id(self, track_id: UUID, user_id: UUID | None = None) -> Track:
        track = self.repository.find_by_id(track_id)

        if not track:
            raise NotFoundException("Track not found")

        if user_id is not None and not self.repository.is_accessible_by_user(track_id, user_id):
            raise ForbiddenException("You don't have permission to access this track")

        return track

    def find_by_source_url(self, source_url: str) -> Track:
        return self.repository.find_by_source_url(source_url)

    def update(
            self,
            track_id: UUID,
            data: UpdateTrackSchema,
            user_id: UUID,
    ) -> Track:
        track = self.find_by_id(track_id, user_id)
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

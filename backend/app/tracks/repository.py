from uuid import UUID

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.enums.track_status import TrackStatus
from app.tracks.models import Track
from app.tracks.schemas import CreateTrackSchema, UpdateTrackSchema
from app.playlists.models import PlaylistTrack, Playlist


class TrackRepository():
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: CreateTrackSchema) -> Track:
        track = Track(**data.model_dump())

        self.db.add(track)
        self.db.commit()
        self.db.refresh(track)

        return track

    def find_all(self, user_id: UUID):
        from app.playlists.models import Playlist
        return (
            self.db.query(Track)
            .join(PlaylistTrack, PlaylistTrack.track_id == Track.id)
            .join(Playlist, Playlist.id == PlaylistTrack.playlist_id)
            .filter(Playlist.user_id == user_id)
            .distinct()
            .all()
        )

    def find_by_id(self, track_id: UUID):
        return self.db.query(Track).filter(Track.id == track_id).first()

    def find_by_source_url(self, source_url: str) -> Track | None:
        return self.db.query(Track).filter(Track.source_url == source_url).first()

    def update(
            self,
            track: Track,
            data: UpdateTrackSchema
    ) -> Track:
        update_data = data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(track, field, value)

        self.db.commit()
        self.db.refresh(track)

        return track

    def update_status(
            self,
            track: Track,
            status: TrackStatus
    ):
        track.status = status
        self.db.commit()
        self.db.refresh(track)

        return track

    def delete(self, track: Track):
        self.db.delete(track)
        self.db.commit()

    def count_playlist_references(self, track_id: UUID) -> int:
        return (
            self.db.query(PlaylistTrack)
            .filter(PlaylistTrack.track_id == track_id)
            .count()
        )

    def count_download_references(self, track_id: UUID) -> int:
        from app.downloads.models import DownloadJob
        return (
            self.db.query(DownloadJob)
            .filter(DownloadJob.track_id == track_id)
            .count()
        )

    def count_by_user(self, user_id: UUID) -> int:
        return (
            self.db.query(func.count(func.distinct(PlaylistTrack.track_id)))
            .join(Playlist, Playlist.id == PlaylistTrack.playlist_id)
            .filter(Playlist.user_id == user_id)
            .scalar()
        )

    def find_recent(
            self,
            user_id: UUID,
            limit: int = 5
    ):
        return (
            self.db.query(Track)
            .join(PlaylistTrack)
            .join(Playlist)
            .filter(Playlist.user_id == user_id)
            .order_by(Track.created_at.desc())
            .limit(limit)
            .all()
        )
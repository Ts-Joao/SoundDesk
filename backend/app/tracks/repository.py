from uuid import UUID

from sqlalchemy.orm import Session

from app.enums.track_status import TrackStatus
from app.tracks.models import Track
from app.tracks.schemas import CreateTrackSchema, UpdateTrackSchema


class TrackRepository():
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: CreateTrackSchema) -> Track:
        track = Track(**data.model_dump())

        self.db.add(track)
        self.db.commit()
        self.db.refresh(track)

        return track

    def find_all(self):
        return self.db.query(Track).all()

    def find_by_id(self, track_id: UUID):
        return self.db.get(Track, track_id)

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
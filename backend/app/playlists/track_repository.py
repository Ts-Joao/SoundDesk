from uuid import UUID

from sqlalchemy.orm import Session

from app.playlists.model import PlaylistTrack


class PlaylistTrackRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
            self,
            playlist_id: UUID,
            track_id: UUID,
    ):
        relation = PlaylistTrack(
            playlist_id=playlist_id,
            track_id=track_id,
        )

        self.db.add(relation)
        self.db.commit()

        return relation

    def find_relation(
            self,
            playlist_id: UUID,
            track_id: UUID,
    ):
        return (
            self.db.query(PlaylistTrack)
            .filter(
                PlaylistTrack.playlist_id == playlist_id,
                PlaylistTrack.track_id == track_id,
            )
            .first()
        )

    def delete(
            self,
            relation: PlaylistTrack,
    ):
        self.db.delete(relation)
        self.db.commit()

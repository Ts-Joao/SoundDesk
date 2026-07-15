"""make_track_global_and_fix_cascades

Revision ID: f1a2b3c4d5e6
Revises: b0686f0c25f0
Create Date: 2026-07-15 03:37:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f1a2b3c4d5e6'
down_revision: Union[str, Sequence[str], None] = 'b0686f0c25f0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    1. Remove user_id (and FK to users) from the tracks table.
    2. Add ON DELETE CASCADE to playlist_tracks.playlist_id FK.
    3. Add ON DELETE CASCADE to playlist_tracks.track_id FK.
    4. Add ON DELETE CASCADE to playlists.user_id FK.
    5. Add ON DELETE CASCADE to download_job.user_id FK.
    6. Add ON DELETE CASCADE to export_jobs.user_id FK.
    """
    # ------------------------------------------------------------------
    # playlist_tracks: recreate FKs with CASCADE
    # ------------------------------------------------------------------
    op.drop_constraint(
        'playlist_tracks_playlist_id_fkey',
        'playlist_tracks',
        type_='foreignkey'
    )
    op.drop_constraint(
        'playlist_tracks_track_id_fkey',
        'playlist_tracks',
        type_='foreignkey'
    )
    op.create_foreign_key(
        'playlist_tracks_playlist_id_fkey',
        'playlist_tracks', 'playlists',
        ['playlist_id'], ['id'],
        ondelete='CASCADE'
    )
    op.create_foreign_key(
        'playlist_tracks_track_id_fkey',
        'playlist_tracks', 'tracks',
        ['track_id'], ['id'],
        ondelete='CASCADE'
    )

    # ------------------------------------------------------------------
    # tracks: remove user_id column and its FK
    # ------------------------------------------------------------------
    op.drop_constraint(
        'tracks_user_id_fkey',
        'tracks',
        type_='foreignkey'
    )
    op.drop_column('tracks', 'user_id')

    # ------------------------------------------------------------------
    # playlists: recreate user_id FK with CASCADE
    # ------------------------------------------------------------------
    op.drop_constraint(
        'playlists_user_id_fkey',
        'playlists',
        type_='foreignkey'
    )
    op.create_foreign_key(
        'playlists_user_id_fkey',
        'playlists', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )

    # ------------------------------------------------------------------
    # download_job: ensure user_id FK has CASCADE
    # ------------------------------------------------------------------
    op.drop_constraint(
        'download_job_user_id_fkey',
        'download_job',
        type_='foreignkey'
    )
    op.create_foreign_key(
        'download_job_user_id_fkey',
        'download_job', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )

    # ------------------------------------------------------------------
    # export_jobs: ensure user_id FK has CASCADE
    # ------------------------------------------------------------------
    op.drop_constraint(
        'export_jobs_user_id_fkey',
        'export_jobs',
        type_='foreignkey'
    )
    op.create_foreign_key(
        'export_jobs_user_id_fkey',
        'export_jobs', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )


def downgrade() -> None:
    """Reverse all changes."""
    # export_jobs: remove CASCADE
    op.drop_constraint('export_jobs_user_id_fkey', 'export_jobs', type_='foreignkey')
    op.create_foreign_key(
        'export_jobs_user_id_fkey',
        'export_jobs', 'users',
        ['user_id'], ['id'],
    )

    # download_job: remove CASCADE
    op.drop_constraint('download_job_user_id_fkey', 'download_job', type_='foreignkey')
    op.create_foreign_key(
        'download_job_user_id_fkey',
        'download_job', 'users',
        ['user_id'], ['id'],
    )

    # playlists: remove CASCADE
    op.drop_constraint('playlists_user_id_fkey', 'playlists', type_='foreignkey')
    op.create_foreign_key(
        'playlists_user_id_fkey',
        'playlists', 'users',
        ['user_id'], ['id'],
    )

    # tracks: re-add user_id column and FK
    op.add_column('tracks', sa.Column('user_id', sa.UUID(), nullable=True))
    op.create_foreign_key(
        'tracks_user_id_fkey',
        'tracks', 'users',
        ['user_id'], ['id'],
    )
    op.alter_column('tracks', 'user_id', nullable=False)

    # playlist_tracks: restore FKs without CASCADE
    op.drop_constraint('playlist_tracks_playlist_id_fkey', 'playlist_tracks', type_='foreignkey')
    op.drop_constraint('playlist_tracks_track_id_fkey', 'playlist_tracks', type_='foreignkey')
    op.create_foreign_key(
        'playlist_tracks_playlist_id_fkey',
        'playlist_tracks', 'playlists',
        ['playlist_id'], ['id'],
    )
    op.create_foreign_key(
        'playlist_tracks_track_id_fkey',
        'playlist_tracks', 'tracks',
        ['track_id'], ['id'],
    )

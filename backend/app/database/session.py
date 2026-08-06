from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database.config import DATABASE_URL
from app.database.base import Base

# SQLAlchemy resolves string relationships lazily.  Workers may import a single
# repository first, therefore every mapped class must be registered here before
# a Session is used.
from app.auth.models import RefreshToken  # noqa: F401, E402
from app.downloads.models import DownloadJob  # noqa: F401, E402
from app.exports.models import ExportJob  # noqa: F401, E402
from app.playlists.models import Playlist, PlaylistTrack  # noqa: F401, E402
from app.tracks.models import Track  # noqa: F401, E402
from app.tokens.models import AuthToken  # noqa: F401, E402
from app.users.models import User  # noqa: F401, E402


engine = create_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    autoflush=False,
    autocommit=False,
    bind=engine,
    expire_on_commit=False,
)

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session
import redis

from app.config.settings import settings
from app.database.dependencies import get_db
from app.core.redis import get_redis_client
from app.health.service import HealthService

router = APIRouter(tags=["Health"])

@router.get("/health")
def health():
    return {
        "status": "ok",
        "service": "SoundDesk",
        "version": settings.version,
    }

@router.post("/readiness")
def readiness(
        response: Response,
        db: Session = Depends(get_db),
        redis_client: redis.Redis = Depends(get_redis_client),
):
    result = HealthService.readiness(db, redis_client)

    if not result["is_healthy"]:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return {
        "status": "ok" if result["is_healthy"] else "unhealthy",
        "checks": result["checks"],
    }

@router.get("/version")
def version():
    return {
        "name": "SoundDesk",
        "version": settings.version,
        "environment": settings.environment,
    }
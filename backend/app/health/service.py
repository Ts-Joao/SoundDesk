from pathlib import Path

import redis
from sqlalchemy import text
from sqlalchemy.orm import Session


class HealthService:
    def __init__(self):
        pass

    @staticmethod
    def check_database(db: Session) -> str:
        try:
            db.execute(text("SELECT 1"))
            return "ok"
        except Exception:
            return "error"

    @staticmethod
    def check_storage() -> str:
        try:
            downloads_exists = Path("storage/downloads").exists()
            covers_exists = Path("storage/covers").exists()

            if downloads_exists and covers_exists:
                return "ok"
        except Exception:
            return "failed"

    @staticmethod
    def check_redis(redis_client: redis.Redis) -> str:
        try:
            if redis_client.ping():
                return "ok"
            return "failed"
        except Exception:
            return "failed"

    @staticmethod
    def readiness(db: Session, redis_client: redis.Redis) -> str:
        checks = {
            "database": HealthService.check_database(db),
            "storage": HealthService.check_storage(),
            "redis": HealthService.check_redis(redis_client),
        }

        is_healthy = all(status == "ok" for status in checks.values())

        return {
            "is_healthy": is_healthy,
            "checks": checks,
        }

import redis
from app.config.settings import settings

redis_client = redis.Redis(
    host=settings.redis_host,
    port=settings.redis_port,
    db=settings.redis_db,
    decode_responses=True,
    socket_timeout=2.0
)

def get_redis_client() -> redis.Redis:
    return redis_client
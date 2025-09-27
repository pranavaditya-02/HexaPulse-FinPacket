from __future__ import annotations
from typing import Optional
import orjson
from loguru import logger
from redis.asyncio import Redis

from services.pathway_services.schema import NewsItem

class RedisWebSocketSink:
    def __init__(self, redis_url: str, channel: str) -> None:
        self.redis_url = redis_url
        self.channel = channel
        self._redis: Optional[Redis] = None

    async def _client(self) -> Redis:
        if not self._redis:
            self._redis = Redis.from_url(self.redis_url, encoding="utf-8", decode_responses=True)
        return self._redis

    async def emit(self, item: NewsItem) -> None:
        redis = await self._client()
        payload = orjson.dumps(item.__dict__).decode("utf-8")
        await redis.publish(self.channel, payload)
        logger.debug("📣 Published news {} to channel {}", item.id, self.channel)

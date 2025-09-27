from __future__ import annotations
from typing import Optional
from redis.asyncio import Redis

_client: Optional[Redis] = None

async def get_redis(url: str) -> Redis:
    global _client
    if _client is None:
        _client = Redis.from_url(url, encoding="utf-8", decode_responses=True)
    return _client

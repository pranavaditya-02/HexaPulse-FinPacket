from __future__ import annotations
from fastapi import Header, HTTPException, status, Depends
from services.pathway_services.utils.config import settings
import asyncpg
from services.pathway_services.database.postgres import get_pool
from services.pathway_services.database.redis import get_redis
from redis.asyncio import Redis

async def api_key_auth(x_api_key: str | None = Header(default=None)) -> None:
    if settings.API_KEY and x_api_key != settings.API_KEY:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")

async def db_pool() -> asyncpg.Pool:
    return await get_pool(settings.POSTGRES_URL)

async def redis_client() -> Redis:
    return await get_redis(settings.REDIS_URL)

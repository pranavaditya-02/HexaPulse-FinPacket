from __future__ import annotations
import asyncpg
from typing import Optional

_pool: Optional[asyncpg.Pool] = None

async def get_pool(dsn: str) -> asyncpg.Pool:
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(dsn, min_size=1, max_size=10)
    return _pool

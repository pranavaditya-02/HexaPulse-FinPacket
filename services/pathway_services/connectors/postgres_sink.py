from __future__ import annotations
import asyncpg
from loguru import logger
from typing import Optional
from tenacity import retry, stop_after_attempt, wait_exponential

from services.pathway_services.schema import NewsItem

UPSERT_SQL = """
INSERT INTO news (
  id, source, title, url, published_at, summary, content,
  categories, sentiment, sentiment_confidence, relevance,
  market_impact, entities, numbers
)
VALUES (
  $1, $2, $3, $4, $5, $6, $7,
  $8, $9, $10, $11, $12, $13, $14
)
ON CONFLICT (id) DO UPDATE SET
  source=EXCLUDED.source,
  title=EXCLUDED.title,
  url=EXCLUDED.url,
  published_at=EXCLUDED.published_at,
  summary=EXCLUDED.summary,
  content=EXCLUDED.content,
  categories=EXCLUDED.categories,
  sentiment=EXCLUDED.sentiment,
  sentiment_confidence=EXCLUDED.sentiment_confidence,
  relevance=EXCLUDED.relevance,
  market_impact=EXCLUDED.market_impact,
  entities=EXCLUDED.entities,
  numbers=EXCLUDED.numbers
"""

class PostgresSink:
    def __init__(self, dsn: str) -> None:
        self.dsn = dsn
        self._pool: Optional[asyncpg.Pool] = None

    async def _pool_ready(self) -> asyncpg.Pool:
        if not self._pool:
            self._pool = await asyncpg.create_pool(self.dsn, min_size=1, max_size=5)
        return self._pool

    @retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=1, min=1, max=10))
    async def emit(self, item: NewsItem) -> None:
        pool = await self._pool_ready()
        async with pool.acquire() as conn:
            await conn.execute(
                UPSERT_SQL,
                item.id,
                item.source,
                item.title,
                item.url,
                item.published_at,
                item.summary,
                item.content,
                item.categories,
                item.sentiment,
                item.sentiment_confidence,
                item.relevance,
                item.market_impact,
                item.entities,
                item.numbers,
            )
        logger.debug("💾 Stored news {}", item.id)

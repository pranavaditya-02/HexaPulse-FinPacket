from __future__ import annotations
from typing import Optional, List
from fastapi import APIRouter, Depends, Query
import asyncpg

from services.api.deps import api_key_auth, db_pool
from services.api.models import NewsOut

router = APIRouter(dependencies=[Depends(api_key_auth)])

BASE_SQL = """
SELECT id, source, title, url, published_at, summary, content,
       categories, sentiment, sentiment_confidence, relevance,
       market_impact, entities, numbers
FROM news
WHERE 1=1
"""

def _append_filters(sql: str, params: list, category: Optional[str], source: Optional[str], min_relevance: Optional[int]) -> tuple[str, list]:
    if category:
        sql += " AND $%d = ANY(categories)" % (len(params)+1)
        params.append(category)
    if source:
        sql += " AND source = $%d" % (len(params)+1)
        params.append(source)
    if min_relevance is not None:
        sql += " AND relevance >= $%d" % (len(params)+1)
        params.append(min_relevance)
    sql += " ORDER BY published_at DESC LIMIT 200"
    return sql, params

@router.get("/news", response_model=List[NewsOut])
async def list_news(
    category: Optional[str] = Query(default=None),
    source: Optional[str] = Query(default=None),
    min_relevance: Optional[int] = Query(default=None, ge=0, le=100),
    pool: asyncpg.Pool = Depends(db_pool),
) -> list[NewsOut]:
    sql, params = _append_filters(BASE_SQL, [], category, source, min_relevance)
    rows = []
    async with pool.acquire() as conn:
        rows = await conn.fetch(sql, *params)
    return [
        NewsOut(
            id=r["id"], source=r["source"], title=r["title"], url=r["url"], published_at=r["published_at"],
            summary=r["summary"], content=r["content"], categories=r["categories"], sentiment=r["sentiment"],
            sentiment_confidence=r["sentiment_confidence"], relevance=r["relevance"], market_impact=r["market_impact"],
            entities=r["entities"], numbers=r["numbers"],
        )
        for r in rows
    ]

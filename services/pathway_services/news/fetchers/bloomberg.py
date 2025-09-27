from __future__ import annotations
from typing import List
import datetime as dt
from services.pathway_services.schema import NewsItem

async def fetch_latest_bloomberg() -> List[NewsItem]:
    """
    Placeholder: In production, integrate official API or licensed feed.
    """
    now = dt.datetime.utcnow().isoformat() + "Z"
    return [
        NewsItem(
            id="bbg-" + now,
            source="Bloomberg",
            title="Markets steady as RBI reviews rates",
            url="https://www.bloomberg.com/",
            published_at=now,
            summary="RBI maintains status quo; markets watch inflation trajectory.",
            content=None,
            categories=[],
            sentiment="neutral",
            sentiment_confidence=0.5,
            relevance=0,
            market_impact="low",
            entities={"companies": [], "indices": [], "regulators": []},
            numbers={"percentages": [], "amounts": [], "points": []},
        )
    ]

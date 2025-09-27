from __future__ import annotations
from typing import List
import datetime as dt
from services.pathway_services.schema import NewsItem

async def fetch_latest_cnbc() -> List[NewsItem]:
    """
    Placeholder: In production, integrate official API or licensed feed.
    """
    now = dt.datetime.utcnow().isoformat() + "Z"
    return [
        NewsItem(
            id="cnbc-" + now,
            source="CNBC",
            title="Sensex, Nifty dip on profit booking",
            url="https://www.cnbc.com/",
            published_at=now,
            summary="Indian equities see mild correction amid global cues.",
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

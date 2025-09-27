from __future__ import annotations
from dataclasses import dataclass
from typing import List, Optional, Dict

@dataclass
class NewsItem:
    id: str
    source: str
    title: str
    url: str
    published_at: str  # ISO8601
    summary: Optional[str]
    content: Optional[str]
    categories: List[str]
    sentiment: str
    sentiment_confidence: float
    relevance: int
    market_impact: str
    entities: Dict[str, list]  # {"companies": [], "indices": [], "regulators": []}
    numbers: Dict[str, list]   # {"percentages": [], "amounts": [], "points": []}

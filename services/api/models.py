from __future__ import annotations
from pydantic import BaseModel
from typing import List, Optional, Dict

class NewsOut(BaseModel):
    id: str
    source: str
    title: str
    url: str
    published_at: str
    summary: Optional[str]
    content: Optional[str]
    categories: List[str]
    sentiment: str
    sentiment_confidence: float
    relevance: int
    market_impact: str
    entities: Dict[str, list]
    numbers: Dict[str, list]

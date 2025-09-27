from __future__ import annotations
from services.pathway_services.schema import NewsItem

class MarketImpactAssessor:
    def __call__(self, item: NewsItem) -> NewsItem:
        s = item.sentiment
        r = item.relevance
        has_index = len(item.entities.get("indices", [])) > 0
        if r >= 70 or (has_index and r >= 50):
            impact = "high"
        elif r >= 40:
            impact = "medium"
        else:
            impact = "low"
        item.market_impact = impact
        return item

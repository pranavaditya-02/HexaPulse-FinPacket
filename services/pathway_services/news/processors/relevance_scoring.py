from __future__ import annotations
from services.pathway_services.schema import NewsItem
from services.pathway_services.utils.keywords import FIN_KEYWORDS_WEIGHTED

class RelevanceScorer:
    def __call__(self, item: NewsItem) -> NewsItem:
        text = " ".join(filter(None, [item.title, item.summary or "", item.content or ""])).lower()
        score = 0
        for kw, weight in FIN_KEYWORDS_WEIGHTED.items():
            if kw in text:
                score += weight
        score = max(0, min(100, score))
        item.relevance = score
        return item

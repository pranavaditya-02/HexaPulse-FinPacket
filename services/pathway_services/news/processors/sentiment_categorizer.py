from __future__ import annotations
from typing import List
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from services.pathway_services.schema import NewsItem
from services.pathway_services.utils.keywords import CATEGORY_KEYWORDS

_analyzer = SentimentIntensityAnalyzer()

class SentimentCategorizer:
    def __call__(self, item: NewsItem) -> NewsItem:
        text = " ".join(filter(None, [item.title, item.summary or "", item.content or ""]))[:5000]
        scores = _analyzer.polarity_scores(text or "")
        comp = scores.get("compound", 0.0)
        if comp > 0.15:
            sentiment = "positive"
        elif comp < -0.15:
            sentiment = "negative"
        else:
            sentiment = "neutral"
        item.sentiment = sentiment
        item.sentiment_confidence = min(1.0, abs(comp))

        # Categorization via keyword sets (global + Indian context)
        cats: List[str] = []
        lower = text.lower()
        for cat, kws in CATEGORY_KEYWORDS.items():
            if any(k in lower for k in kws):
                cats.append(cat)
        item.categories = sorted(set(cats)) or item.categories
        return item

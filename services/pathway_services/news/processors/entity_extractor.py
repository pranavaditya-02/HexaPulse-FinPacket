from __future__ import annotations
import re
from typing import List
from services.pathway_services.schema import NewsItem
from services.pathway_services.utils.keywords import COMPANIES_IN, INDICES_IN, REGULATORS_IN

PERCENT_RE = re.compile(r"\b-?\d+(?:\.\d+)?\s?%")
AMOUNT_RE = re.compile(r"\b₹?\$?\s?\d{1,3}(?:,\d{3})*(?:\.\d+)?\b")
POINTS_RE = re.compile(r"\b\d+(?:\.\d+)?\s?(?:pts?|points?)\b", re.IGNORECASE)

class EntityExtractor:
    def __call__(self, item: NewsItem) -> NewsItem:
        text = " ".join(filter(None, [item.title, item.summary or "", item.content or ""])).lower()
        companies = [c for c in COMPANIES_IN if c.lower() in text]
        indices = [i for i in INDICES_IN if i.lower() in text]
        regulators = [r for r in REGULATORS_IN if r.lower() in text]
        percentages = PERCENT_RE.findall(text)
        amounts = AMOUNT_RE.findall(text)
        points = POINTS_RE.findall(text)

        item.entities = {
            "companies": sorted(set(companies)),
            "indices": sorted(set(indices)),
            "regulators": sorted(set(regulators)),
        }
        item.numbers = {
            "percentages": percentages,
            "amounts": amounts,
            "points": points,
        }
        return item

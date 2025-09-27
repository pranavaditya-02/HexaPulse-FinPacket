from __future__ import annotations
from typing import List, Protocol
from loguru import logger
import asyncio
import datetime as dt

from services.pathway_services.schema import NewsItem
from services.pathway_services.news.fetchers.bloomberg import fetch_latest_bloomberg
from services.pathway_services.news.fetchers.cnbc import fetch_latest_cnbc

class Transform(Protocol):
    def __call__(self, item: NewsItem) -> NewsItem: ...

class Sink(Protocol):
    async def emit(self, item: NewsItem) -> None: ...

class APIPullInput:
    def __init__(self, sources: List[str], interval_seconds: int = 15) -> None:
        self.sources = sources
        self.interval_seconds = interval_seconds

    def run_pipeline(self, transforms: List[Transform], sinks: List[Sink]) -> None:
        asyncio.run(self._loop(transforms, sinks))

    async def _loop(self, transforms: List[Transform], sinks: List[Sink]) -> None:
        logger.info("🕸️ Starting API pull loop for sources={}", self.sources)
        while True:
            items: List[NewsItem] = []
            if "bloomberg" in self.sources:
                items += await fetch_latest_bloomberg()
            if "cnbc" in self.sources:
                items += await fetch_latest_cnbc()

            for item in items:
                for t in transforms:
                    item = t(item)
                await asyncio.gather(*(s.emit(item) for s in sinks))

            await asyncio.sleep(self.interval_seconds)

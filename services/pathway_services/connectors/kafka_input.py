from __future__ import annotations
from typing import List, Protocol, Iterable, Any
from loguru import logger
from aiokafka import AIOKafkaConsumer
import asyncio
import json
import os

from services.pathway_services.schema import NewsItem

class Transform(Protocol):
    def __call__(self, item: NewsItem) -> NewsItem: ...

class Sink(Protocol):
    async def emit(self, item: NewsItem) -> None: ...

class KafkaInput:
    def __init__(self, brokers: str, topic: str) -> None:
        self.brokers = brokers
        self.topic = topic

    def run_pipeline(self, transforms: List[Transform], sinks: List[Sink]) -> None:
        """
        Consumes messages from Kafka, applies transforms, and forwards to sinks.
        """
        asyncio.run(self._loop(transforms, sinks))

    async def _loop(self, transforms: List[Transform], sinks: List[Sink]) -> None:
        consumer = AIOKafkaConsumer(
            self.topic,
            bootstrap_servers=self.brokers.split(","),
            value_deserializer=lambda v: json.loads(v.decode("utf-8")),
            enable_auto_commit=True,
            auto_offset_reset="latest",
        )
        await consumer.start()
        logger.info("📥 Kafka consumer started on {}", self.topic)
        try:
            async for msg in consumer:
                raw = msg.value
                item = self._to_news_item(raw)
                for t in transforms:
                    item = t(item)
                # emit concurrently
                await asyncio.gather(*(s.emit(item) for s in sinks))
        finally:
            await consumer.stop()
            logger.info("🛑 Kafka consumer stopped")

    def _to_news_item(self, raw: dict) -> NewsItem:
        # Minimal mapping; ensure required keys exist
        return NewsItem(
            id=raw.get("id") or raw.get("guid") or os.urandom(8).hex(),
            source=raw.get("source", "unknown"),
            title=raw.get("title", ""),
            url=raw.get("url", ""),
            published_at=raw.get("published_at", ""),
            summary=raw.get("summary"),
            content=raw.get("content"),
            categories=raw.get("categories", []),
            sentiment="neutral",
            sentiment_confidence=0.5,
            relevance=0,
            market_impact="low",
            entities={"companies": [], "indices": [], "regulators": []},
            numbers={"percentages": [], "amounts": [], "points": []},
        )

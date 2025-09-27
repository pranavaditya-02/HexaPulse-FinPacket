from __future__ import annotations
from pydantic import BaseModel
import os

class Settings(BaseModel):
    APP_NAME: str = os.getenv("APP_NAME", "HexaPulse FinPocket")
    ENV: str = os.getenv("ENV", "development")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8080"))

    POSTGRES_URL: str = os.getenv("POSTGRES_URL", "postgresql://finpocket:finpocket@localhost:5432/finpocket")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    KAFKA_BROKERS: str = os.getenv("KAFKA_BROKERS", "")
    KAFKA_TOPIC_NEWS: str = os.getenv("KAFKA_TOPIC_NEWS", "hexapulse.news.raw")

    WS_REDIS_CHANNEL: str = os.getenv("WS_REDIS_CHANNEL", "hexapulse.news.stream")

    API_KEY: str = os.getenv("API_KEY", "")

settings = Settings()

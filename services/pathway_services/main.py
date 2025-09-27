from services.pathway_services.utils.config import settings
from services.pathway_services.utils.logger import logger
from services.pathway_services.connectors.kafka_input import KafkaInput
from services.pathway_services.connectors.api_input import APIPullInput
from services.pathway_services.news.processors.sentiment_categorizer import SentimentCategorizer
from services.pathway_services.news.processors.entity_extractor import EntityExtractor
from services.pathway_services.news.processors.relevance_scoring import RelevanceScorer
from services.pathway_services.news.processors.market_impact import MarketImpactAssessor
from services.pathway_services.connectors.postgres_sink import PostgresSink
from services.pathway_services.connectors.websocket_sink import RedisWebSocketSink

def main() -> None:
    """
    Start the streaming pipeline using Pathway, wiring input connectors,
    transformations, and output sinks (DB + WebSocket).
    """
    logger.info("🚀 Starting HexaPulse FinPocket worker (env={})", settings.ENV)

    # Select input source based on config
    if settings.KAFKA_BROKERS:
        input_source = KafkaInput(brokers=settings.KAFKA_BROKERS, topic=settings.KAFKA_TOPIC_NEWS)
        logger.info("🔌 Using Kafka input on topic: {}", settings.KAFKA_TOPIC_NEWS)
    else:
        input_source = APIPullInput(sources=["bloomberg", "cnbc"], interval_seconds=10)
        logger.info("🔌 Using API pull input from Bloomberg/CNBC placeholders")

    sentiment = SentimentCategorizer()
    entities = EntityExtractor()
    relevance = RelevanceScorer()
    impact = MarketImpactAssessor()

    db_sink = PostgresSink(dsn=settings.POSTGRES_URL)
    ws_sink = RedisWebSocketSink(redis_url=settings.REDIS_URL, channel=settings.WS_REDIS_CHANNEL)

    # Build and run pipeline
    input_source.run_pipeline(
        transforms=[sentiment, entities, relevance, impact],
        sinks=[db_sink, ws_sink],
    )

if __name__ == "__main__":
    main()

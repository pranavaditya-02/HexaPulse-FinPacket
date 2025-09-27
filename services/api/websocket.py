from __future__ import annotations
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from redis.asyncio import Redis

from services.api.deps import redis_client, api_key_auth
from services.pathway_services.utils.config import settings

router = APIRouter()

@router.websocket("/ws/news")
async def ws_news(websocket: WebSocket, redis: Redis = Depends(redis_client)):
    await websocket.accept()
    pubsub = redis.pubsub()
    await pubsub.subscribe(settings.WS_REDIS_CHANNEL)
    try:
        async for msg in pubsub.listen():
            if msg is None or msg.get("type") != "message":
                continue
            data = msg.get("data")
            await websocket.send_text(data)
    except WebSocketDisconnect:
        pass
    finally:
        await pubsub.unsubscribe(settings.WS_REDIS_CHANNEL)
        await pubsub.close()
        await websocket.close()

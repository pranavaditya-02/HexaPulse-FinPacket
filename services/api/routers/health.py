from __future__ import annotations
from fastapi import APIRouter
from prometheus_client import CollectorRegistry, Counter, generate_latest, CONTENT_TYPE_LATEST

router = APIRouter()
_registry = CollectorRegistry()
_requests = Counter("api_requests_total", "Total API requests", registry=_registry)

@router.get("/health")
async def health() -> dict:
    _requests.inc()
    return {"status": "ok"}

@router.get("/metrics")
async def metrics():
    _requests.inc()
    data = generate_latest(_registry)
    return Response(content=data, media_type=CONTENT_TYPE_LATEST)

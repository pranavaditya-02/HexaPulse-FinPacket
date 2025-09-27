from __future__ import annotations
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services.pathway_services.utils.config import settings
from services.api.routers.health import router as health_router
from services.api.routers.news import router as news_router
from services.api.websocket import router as ws_router

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, tags=["health"])
app.include_router(news_router, tags=["news"])
app.include_router(ws_router, tags=["ws"])

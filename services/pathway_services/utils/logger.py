from __future__ import annotations
from loguru import logger
import sys
from services.pathway_services.utils.config import settings

logger.remove()
logger.add(sys.stdout, colorize=True, backtrace=False, diagnose=False,
           format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
                  "<level>{level: <8}</level> | "
                  "✨ <cyan>{extra[app]}</cyan> | "
                  "<level>{message}</level>")
logger = logger.bind(app=settings.APP_NAME)
logger.level(settings.LOG_LEVEL.upper(), color="<yellow>")

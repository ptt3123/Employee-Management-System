# app run here
import logging
from fastapi import FastAPI

from apis.routes import router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.include_router(router)
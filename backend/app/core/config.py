
from pydantic import BaseModel
from functools import lru_cache
import os

class _Settings(BaseModel):
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    MONGO_DB: str = os.getenv("MONGO_DB", "content_db")
    CORS_ORIGINS: list[str] = list(filter(None, os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")))

@lru_cache(maxsize=1)
def get_settings() -> _Settings:
    return _Settings()

settings = get_settings()

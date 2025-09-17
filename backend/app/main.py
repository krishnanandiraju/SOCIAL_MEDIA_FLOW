
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import posts, connectors, health

app = FastAPI(title="Unified Content Publisher API", version="0.1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(posts.router, prefix="/posts", tags=["posts"])
app.include_router(connectors.router, prefix="/connectors", tags=["connectors"])

from app.api.v1.endpoints import health
from fastapi import APIRouter

api_router = APIRouter()

# Core system endpoints
api_router.include_router(health.router)

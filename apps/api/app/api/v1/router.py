from app.api.v1.endpoints import auth, bridges, construction, health, public
from fastapi import APIRouter

api_router = APIRouter()

# Health & Readiness
api_router.include_router(health.router)

# Authentication & Session
api_router.include_router(auth.router)

# Bridge Registry (L1)
api_router.include_router(bridges.router)

# Construction & Quality Audits (L2)
api_router.include_router(construction.router)

# Public Transparency Portal (L7)
api_router.include_router(public.router)

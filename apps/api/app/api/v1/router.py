from app.api.v1.endpoints import audits, auth, bridges, construction, health, public, telemetry
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

# Field Audits & Evidence (L4/L5)
api_router.include_router(audits.router)

# Telemetry & Real-Time Monitoring (L3)
api_router.include_router(telemetry.router)

# Public Transparency Portal (L7)
api_router.include_router(public.router)

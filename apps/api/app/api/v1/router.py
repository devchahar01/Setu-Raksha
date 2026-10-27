from app.api.v1.endpoints import (
    audits,
    auth,
    bridges,
    construction,
    defect_localization,
    health,
    notifications,
    public,
    risk,
    telemetry,
)
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

# Defect Localization & AR Twin (CS543 SfM / SIFT Photogrammetry)
api_router.include_router(defect_localization.router)

# AI Predictive Risk & Remediation Engine (L6)
api_router.include_router(risk.router)

# Notification Engine & Scheduler (L4)
api_router.include_router(notifications.router)

# Public Transparency Portal (L7)
api_router.include_router(public.router)

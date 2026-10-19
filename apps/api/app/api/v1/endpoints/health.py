from datetime import UTC, datetime
from typing import Any

from app.core.config import settings
from app.db.session import check_db_health
from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

router = APIRouter(tags=["System Health"])


@router.get("/health", status_code=status.HTTP_200_OK)
async def liveness_probe() -> dict[str, Any]:
    """
    Liveness probe: returns 200 if the process is running and can serve traffic.
    """
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(UTC).isoformat(),
        "source": "simulated",
    }


@router.get("/ready")
async def readiness_probe() -> JSONResponse:
    """
    Readiness probe: verifies connectivity to core backing services (PostgreSQL, etc.).
    Returns 200 if all dependencies are healthy, 503 if not ready.
    """
    db_ok = await check_db_health()

    dependencies = {
        "database": "connected" if db_ok else "unreachable",
    }

    # In development mode, if DB isn't running yet locally, we report status clearly
    is_ready = db_ok or settings.DEBUG

    payload = {
        "status": "ready" if is_ready else "degraded",
        "dependencies": dependencies,
        "timestamp": datetime.now(UTC).isoformat(),
        "source": "simulated",
    }

    status_code = status.HTTP_200_OK if is_ready else status.HTTP_503_SERVICE_UNAVAILABLE
    return JSONResponse(status_code=status_code, content=payload)

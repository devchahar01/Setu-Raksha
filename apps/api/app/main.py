from app.api.v1.endpoints import health
from app.api.v1.router import api_router
from app.core.config import settings
from app.core.errors import (
    AppException,
    app_exception_handler,
    http_exception_handler,
    unhandled_exception_handler,
    validation_exception_handler,
)
from app.core.log_config import setup_logging
from app.core.middleware import RequestContextMiddleware
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException

# Initialize structured logging
setup_logging(level="DEBUG" if settings.DEBUG else "INFO")

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for the National Bridge Infrastructure Safety & Intelligence Grid",
    version="0.1.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# Request context & tracing middleware
app.add_middleware(RequestContextMiddleware)

# Cross-Origin Resource Sharing
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handlers returning {code, params, request_id}
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

# Root-level health endpoints for load balancers / container health checks
app.include_router(health.router)

# Versioned API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

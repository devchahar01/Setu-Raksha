import logging
from typing import Any

from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("setu.errors")


class AppException(Exception):
    """Base application exception returning structured error payload."""

    def __init__(
        self,
        code: str,
        message: str = "An error occurred",
        status_code: int = status.HTTP_400_BAD_REQUEST,
        params: dict[str, Any] | None = None,
    ):
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code
        self.params = params or {}


class NotFoundException(AppException):
    def __init__(self, code: str = "RESOURCE_NOT_FOUND", params: dict[str, Any] | None = None):
        super().__init__(
            code=code,
            message="Resource not found",
            status_code=status.HTTP_404_NOT_FOUND,
            params=params,
        )


class UnauthorizedException(AppException):
    def __init__(self, code: str = "UNAUTHORIZED", params: dict[str, Any] | None = None):
        super().__init__(
            code=code,
            message="Unauthorized access",
            status_code=status.HTTP_401_UNAUTHORIZED,
            params=params,
        )


class ForbiddenException(AppException):
    def __init__(self, code: str = "FORBIDDEN", params: dict[str, Any] | None = None):
        super().__init__(
            code=code,
            message="Access forbidden",
            status_code=status.HTTP_403_FORBIDDEN,
            params=params,
        )


class BadRequestException(AppException):
    def __init__(self, code: str = "BAD_REQUEST", params: dict[str, Any] | None = None):
        super().__init__(code=code, message="Bad request", status_code=status.HTTP_400_BAD_REQUEST, params=params)


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "unknown")
    logger.warning(
        f"Application error [{exc.code}] on {request.method} {request.url.path}: {exc.message}",
        extra={"request_id": request_id},
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "code": exc.code,
            "params": exc.params,
            "request_id": request_id,
        },
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "unknown")
    # Simplify validation errors into field -> issue mapping without exposing raw internals
    errors_summary = []
    for err in exc.errors():
        field = ".".join(str(loc) for loc in err.get("loc", []))
        errors_summary.append({"field": field, "type": err.get("type", "invalid")})

    logger.warning(f"Validation error on {request.method} {request.url.path}", extra={"request_id": request_id})
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "code": "VALIDATION_FAILED",
            "params": {"errors": errors_summary},
            "request_id": request_id,
        },
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "unknown")
    code = "HTTP_ERROR"
    if exc.status_code == status.HTTP_404_NOT_FOUND:
        code = "NOT_FOUND"
    elif exc.status_code == status.HTTP_401_UNAUTHORIZED:
        code = "UNAUTHORIZED"
    elif exc.status_code == status.HTTP_403_FORBIDDEN:
        code = "FORBIDDEN"
    elif exc.status_code == status.HTTP_405_METHOD_NOT_ALLOWED:
        code = "METHOD_NOT_ALLOWED"

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "code": code,
            "params": {},
            "request_id": request_id,
        },
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "unknown")
    logger.error(
        f"Unhandled server error on {request.method} {request.url.path}: {str(exc)}",
        exc_info=True,
        extra={"request_id": request_id},
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "code": "INTERNAL_SERVER_ERROR",
            "params": {},
            "request_id": request_id,
        },
    )

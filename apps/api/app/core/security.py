from datetime import UTC, datetime, timedelta
from typing import Any

from app.core.config import settings
from app.core.errors import UnauthorizedException
from jose import JWTError, jwt
from passlib.context import CryptContext

# Password hashing with Argon2id
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against Argon2id hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash password using Argon2id."""
    return pwd_context.hash(password)


def create_access_token(
    subject: str,
    role: str,
    jurisdiction_id: str | None = None,
    expires_delta: timedelta | None = None,
) -> str:
    """Generate signed JWT access token."""
    expire = datetime.now(UTC) + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode: dict[str, Any] = {
        "sub": subject,
        "role": role,
        "jurisdiction_id": jurisdiction_id,
        "exp": expire,
        "type": "access",
    }
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(subject: str, expires_delta: timedelta | None = None) -> str:
    """Generate signed JWT refresh token."""
    expire = datetime.now(UTC) + (expires_delta or timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))
    to_encode: dict[str, Any] = {
        "sub": subject,
        "exp": expire,
        "type": "refresh",
    }
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict[str, Any]:
    """Decode and validate JWT token signature and expiration."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError as exc:
        raise UnauthorizedException(code="TOKEN_INVALID", params={"reason": str(exc)}) from exc

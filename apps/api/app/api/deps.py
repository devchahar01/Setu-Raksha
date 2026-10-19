from collections.abc import AsyncGenerator, Callable

from app.core.errors import ForbiddenException, UnauthorizedException
from app.core.security import decode_token
from app.db.models.user import User, UserRole
from app.db.session import AsyncSessionLocal
from fastapi import Cookie, Depends, Header, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def get_current_user(
    request: Request,
    authorization: str | None = Header(None),
    access_token: str | None = Cookie(None),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Extract token from Authorization header or httpOnly cookie.
    Authenticate user and verify active status.
    """
    token: str | None = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
    elif access_token:
        token = access_token

    if not token:
        raise UnauthorizedException(
            code="AUTH_REQUIRED", params={"message": "Authentication required"}
        )

    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException(code="TOKEN_MALFORMED")

    result = await db.execute(select(User).where(User.id == user_id, User.is_deleted == False))
    user = result.scalar_one_or_none()

    if not user or not user.is_active:
        raise UnauthorizedException(code="USER_INACTIVE_OR_NOT_FOUND")

    # Attach actor ID to request state for audit logs
    request.state.actor_id = user.id
    return user


def require_roles(*allowed_roles: str) -> Callable[..., User]:
    """Dependency factory enforcing Role-Based Access Control."""

    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if (
            current_user.role not in allowed_roles
            and current_user.role != UserRole.SYSTEM_ADMIN.value
        ):
            raise ForbiddenException(
                code="ROLE_UNAUTHORIZED",
                params={"user_role": current_user.role, "required_roles": list(allowed_roles)},
            )
        return current_user

    return role_checker


async def verify_bridge_jurisdiction(
    bridge_jurisdiction_id: str | None,
    current_user: User,
) -> bool:
    """
    Verify that current user's jurisdiction covers the target bridge.
    Admins and State Analysts have statewide scope.
    """
    if current_user.role in [UserRole.SYSTEM_ADMIN.value, UserRole.STATE_ANALYST.value]:
        return True

    if not current_user.jurisdiction_id or not bridge_jurisdiction_id:
        return False

    return bool(current_user.jurisdiction_id == bridge_jurisdiction_id)

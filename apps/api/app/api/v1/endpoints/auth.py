from app.api.deps import get_current_user, get_db
from app.core.config import settings
from app.core.errors import UnauthorizedException
from app.core.security import (
    create_access_token,
    create_refresh_token,
    verify_password,
)
from app.db.audit import log_audit_event
from app.db.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserOut
from fastapi import APIRouter, Depends, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/auth", tags=["Authentication & Session"])


@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    """
    Authenticate user via email and argon2id password hash.
    Sets secure httpOnly cookie and returns access token.
    """
    result = await db.execute(
        select(User).where(User.email == login_data.email, User.is_deleted == False)
    )
    user = result.scalar_one_or_none()

    if not user or not verify_password(login_data.password, user.password_hash):
        raise UnauthorizedException(
            code="INVALID_CREDENTIALS",
            params={"email": login_data.email},
        )

    if not user.is_active:
        raise UnauthorizedException(code="USER_INACTIVE")

    access_token = create_access_token(
        subject=user.id,
        role=user.role,
        jurisdiction_id=user.jurisdiction_id,
    )
    refresh_token = create_refresh_token(subject=user.id)

    # Set short-lived JWT in httpOnly cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=not settings.DEBUG,
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=not settings.DEBUG,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
    )

    await log_audit_event(
        db=db,
        action="LOGIN",
        entity="User",
        entity_id=user.id,
        actor_id=user.id,
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/logout")
async def logout(response: Response) -> dict[str, str]:
    """Clear httpOnly session cookie."""
    response.delete_cookie(key="access_token")
    return {"status": "logged_out"}


@router.get("/me", response_model=UserOut)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
) -> UserOut:
    """Return authenticated user profile."""
    return UserOut.model_validate(current_user)

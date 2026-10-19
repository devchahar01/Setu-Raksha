from app.api.deps import get_current_user, get_db, require_roles, verify_bridge_jurisdiction
from app.core.errors import ForbiddenException, NotFoundException
from app.db.audit import log_audit_event
from app.db.models.bridge import Bridge, BridgeAssignment
from app.db.models.user import User, UserRole
from app.schemas.bridge import (
    AssignmentCreate,
    AssignmentOut,
    BridgeCreate,
    BridgeOut,
    BridgeUpdate,
)
from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/bridges", tags=["Bridge Registry (L1)"])


@router.get("", response_model=list[BridgeOut])
async def list_bridges(
    district: str | None = Query(None, description="Filter by district"),
    river: str | None = Query(None, description="Filter by river basin"),
    tier: str | None = Query(None, description="Filter by risk tier (GOOD, WATCH, WARNING, CRITICAL)"),
    search: str | None = Query(None, description="Full-text name or code search"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[BridgeOut]:
    """
    List bridges with jurisdiction scoping.
    Officers and engineers only see bridges within their jurisdiction.
    Admins and State Analysts have statewide visibility.
    """
    query = select(Bridge).where(Bridge.is_deleted == False)

    # Enforce jurisdiction scoping
    if (
        current_user.role not in [UserRole.SYSTEM_ADMIN.value, UserRole.STATE_ANALYST.value]
        and current_user.jurisdiction_id
    ):
        query = query.where(Bridge.jurisdiction_id == current_user.jurisdiction_id)

    if district:
        query = query.where(Bridge.district.ilike(f"%{district}%"))
    if river:
        query = query.where(Bridge.river.ilike(f"%{river}%"))
    if tier:
        query = query.where(Bridge.current_tier == tier)
    if search:
        query = query.where(
            or_(
                Bridge.name.ilike(f"%{search}%"),
                Bridge.code.ilike(f"%{search}%"),
            )
        )

    query = query.order_by(Bridge.code).offset(offset).limit(limit)
    result = await db.execute(query)
    bridges = result.scalars().all()
    return [BridgeOut.model_validate(b) for b in bridges]


@router.post("", response_model=BridgeOut, status_code=status.HTTP_201_CREATED)
async def create_bridge(
    bridge_in: BridgeCreate,
    request: Request,
    current_user: User = Depends(require_roles(UserRole.DIVISION_ENGINEER.value, UserRole.SYSTEM_ADMIN.value)),
    db: AsyncSession = Depends(get_db),
) -> BridgeOut:
    """Create a new bridge record with L1 design metadata."""
    bridge = Bridge(
        **bridge_in.model_dump(),
        is_synthetic=True,
    )
    db.add(bridge)
    await db.flush()

    await log_audit_event(
        db=db,
        action="CREATE",
        entity="Bridge",
        entity_id=bridge.id,
        actor_id=current_user.id,
        request_id=getattr(request.state, "request_id", None),
        after=bridge_in.model_dump(),
    )
    await db.commit()
    await db.refresh(bridge)
    return BridgeOut.model_validate(bridge)


@router.get("/{bridge_id}", response_model=BridgeOut)
async def get_bridge(
    bridge_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> BridgeOut:
    """Retrieve bridge details with jurisdiction access check."""
    result = await db.execute(select(Bridge).where(Bridge.id == bridge_id, Bridge.is_deleted == False))
    bridge = result.scalar_one_or_none()
    if not bridge:
        raise NotFoundException(code="BRIDGE_NOT_FOUND", params={"bridge_id": bridge_id})

    # Jurisdiction negative check
    has_access = await verify_bridge_jurisdiction(bridge.jurisdiction_id, current_user)
    if not has_access:
        raise ForbiddenException(
            code="JURISDICTION_ACCESS_DENIED",
            params={"bridge_id": bridge_id, "user_jurisdiction": current_user.jurisdiction_id},
        )

    return BridgeOut.model_validate(bridge)


@router.patch("/{bridge_id}", response_model=BridgeOut)
async def update_bridge(
    bridge_id: str,
    bridge_update: BridgeUpdate,
    request: Request,
    current_user: User = Depends(require_roles(UserRole.DIVISION_ENGINEER.value, UserRole.SYSTEM_ADMIN.value)),
    db: AsyncSession = Depends(get_db),
) -> BridgeOut:
    """Update bridge metadata with audit logging."""
    result = await db.execute(select(Bridge).where(Bridge.id == bridge_id, Bridge.is_deleted == False))
    bridge = result.scalar_one_or_none()
    if not bridge:
        raise NotFoundException(code="BRIDGE_NOT_FOUND", params={"bridge_id": bridge_id})

    has_access = await verify_bridge_jurisdiction(bridge.jurisdiction_id, current_user)
    if not has_access:
        raise ForbiddenException(code="JURISDICTION_ACCESS_DENIED")

    before_snapshot = {c.name: getattr(bridge, c.name) for c in bridge.__table__.columns}
    update_data = bridge_update.model_dump(exclude_unset=True)

    for field, val in update_data.items():
        setattr(bridge, field, val)

    await log_audit_event(
        db=db,
        action="UPDATE",
        entity="Bridge",
        entity_id=bridge.id,
        actor_id=current_user.id,
        request_id=getattr(request.state, "request_id", None),
        before=before_snapshot,
        after=update_data,
    )

    await db.commit()
    await db.refresh(bridge)
    return BridgeOut.model_validate(bridge)


@router.post("/{bridge_id}/assignments", response_model=AssignmentOut)
async def assign_officer(
    bridge_id: str,
    assignment_in: AssignmentCreate,
    request: Request,
    current_user: User = Depends(require_roles(UserRole.DIVISION_ENGINEER.value, UserRole.SYSTEM_ADMIN.value)),
    db: AsyncSession = Depends(get_db),
) -> AssignmentOut:
    """Assign an officer to a bridge."""
    result = await db.execute(select(Bridge).where(Bridge.id == bridge_id, Bridge.is_deleted == False))
    bridge = result.scalar_one_or_none()
    if not bridge:
        raise NotFoundException(code="BRIDGE_NOT_FOUND")

    assignment = BridgeAssignment(
        bridge_id=bridge_id,
        officer_id=assignment_in.officer_id,
        from_date=assignment_in.from_date,
        to_date=assignment_in.to_date,
    )
    db.add(assignment)

    await log_audit_event(
        db=db,
        action="ASSIGN_OFFICER",
        entity="BridgeAssignment",
        entity_id=assignment.id,
        actor_id=current_user.id,
        request_id=getattr(request.state, "request_id", None),
        after=assignment_in.model_dump(),
    )
    await db.commit()
    await db.refresh(assignment)
    return AssignmentOut.model_validate(assignment)

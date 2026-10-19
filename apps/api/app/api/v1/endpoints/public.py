from datetime import UTC, datetime

from app.api.deps import get_db
from app.core.errors import NotFoundException
from app.db.models.bridge import Bridge
from app.schemas.bridge import PublicBridgeOut
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/public/bridges", tags=["Public Transparency Portal (L7)"])


def transform_public_bridge(bridge: Bridge) -> PublicBridgeOut:
    """Safely redact and compute public fields."""
    current_year = datetime.now(UTC).year
    age = max(0, current_year - bridge.year_built)
    design_life = bridge.design_life_y or 100
    consumed_pct = round(min(100.0, (age / design_life) * 100.0), 1)

    return PublicBridgeOut(
        id=bridge.id,
        code=bridge.code,
        name=bridge.name,
        latitude=bridge.latitude,
        longitude=bridge.longitude,
        river=bridge.river,
        district=bridge.district,
        type=bridge.type,
        length_m=bridge.length_m,
        year_built=bridge.year_built,
        design_life_y=bridge.design_life_y,
        age_years=age,
        design_life_consumed_percent=consumed_pct,
        current_tier=bridge.current_tier,
        last_audit_date=bridge.last_audit_date,
        source="simulated",
    )


@router.get("", response_model=list[PublicBridgeOut])
async def list_public_bridges(
    district: str | None = Query(None),
    river: str | None = Query(None),
    tier: str | None = Query(None),
    limit: int = Query(100, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
) -> list[PublicBridgeOut]:
    """
    Publicly accessible list of bridges for map exploration.
    Excludes private structural measurements, audit logs, and officer details.
    """
    query = select(Bridge).where(
        Bridge.is_deleted == False,
        Bridge.public_visibility == True,
    )
    if district:
        query = query.where(Bridge.district.ilike(f"%{district}%"))
    if river:
        query = query.where(Bridge.river.ilike(f"%{river}%"))
    if tier:
        query = query.where(Bridge.current_tier == tier)

    query = query.order_by(Bridge.code).limit(limit)
    result = await db.execute(query)
    bridges = result.scalars().all()
    return [transform_public_bridge(b) for b in bridges]


@router.get("/{bridge_id}", response_model=PublicBridgeOut)
async def get_public_bridge_profile(
    bridge_id: str,
    db: AsyncSession = Depends(get_db),
) -> PublicBridgeOut:
    """Public safe profile of a single bridge."""
    result = await db.execute(
        select(Bridge).where(
            Bridge.id == bridge_id,
            Bridge.is_deleted == False,
            Bridge.public_visibility == True,
        )
    )
    bridge = result.scalar_one_or_none()
    if not bridge:
        raise NotFoundException(code="BRIDGE_NOT_FOUND", params={"bridge_id": bridge_id})

    return transform_public_bridge(bridge)

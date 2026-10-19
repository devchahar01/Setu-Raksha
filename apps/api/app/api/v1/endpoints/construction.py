from app.api.deps import get_current_user, get_db, require_roles
from app.core.errors import NotFoundException
from app.db.audit import log_audit_event
from app.db.models.bridge import Bridge
from app.db.models.construction import (
    ConstructionRecord,
    LoadTest,
    MaterialLog,
)
from app.db.models.user import User, UserRole
from app.schemas.construction import (
    BridgeConstructionHistoryOut,
    ConstructionRecordOut,
    LoadTestCreate,
    LoadTestOut,
    MaterialLogCreate,
    MaterialLogOut,
)
from fastapi import APIRouter, Depends, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(
    prefix="/bridges/{bridge_id}/construction", tags=["Construction & Quality Audits (L2)"]
)


@router.get("", response_model=BridgeConstructionHistoryOut)
async def get_construction_history(
    bridge_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> BridgeConstructionHistoryOut:
    """Retrieve full L2 quality evidence and construction history."""
    b_res = await db.execute(
        select(Bridge).where(Bridge.id == bridge_id, Bridge.is_deleted == False)
    )
    if not b_res.scalar_one_or_none():
        raise NotFoundException(code="BRIDGE_NOT_FOUND")

    rec_res = await db.execute(
        select(ConstructionRecord).where(ConstructionRecord.bridge_id == bridge_id)
    )
    mat_res = await db.execute(select(MaterialLog).where(MaterialLog.bridge_id == bridge_id))
    load_res = await db.execute(select(LoadTest).where(LoadTest.bridge_id == bridge_id))

    return BridgeConstructionHistoryOut(
        bridge_id=bridge_id,
        construction_records=[
            ConstructionRecordOut.model_validate(r) for r in rec_res.scalars().all()
        ],
        material_logs=[MaterialLogOut.model_validate(m) for m in mat_res.scalars().all()],
        load_tests=[LoadTestOut.model_validate(lt) for lt in load_res.scalars().all()],
    )


@router.post("/materials", response_model=MaterialLogOut, status_code=status.HTTP_201_CREATED)
async def add_material_log(
    bridge_id: str,
    material_in: MaterialLogCreate,
    request: Request,
    current_user: User = Depends(
        require_roles(UserRole.DIVISION_ENGINEER.value, UserRole.SYSTEM_ADMIN.value)
    ),
    db: AsyncSession = Depends(get_db),
) -> MaterialLogOut:
    """Add concrete/steel material test log with pass/fail validation against minimums."""
    is_passed = material_in.test_value >= material_in.min_required

    entry = MaterialLog(
        bridge_id=bridge_id,
        material=material_in.material,
        grade=material_in.grade,
        test_value=material_in.test_value,
        min_required=material_in.min_required,
        is_passed=is_passed,
        test_date=material_in.test_date,
    )
    db.add(entry)
    await db.flush()

    await log_audit_event(
        db=db,
        action="ADD_MATERIAL_LOG",
        entity="MaterialLog",
        entity_id=entry.id,
        actor_id=current_user.id,
        request_id=getattr(request.state, "request_id", None),
        after=material_in.model_dump(),
    )
    await db.commit()
    await db.refresh(entry)
    return MaterialLogOut.model_validate(entry)


@router.post("/load-tests", response_model=LoadTestOut, status_code=status.HTTP_201_CREATED)
async def add_load_test(
    bridge_id: str,
    test_in: LoadTestCreate,
    request: Request,
    current_user: User = Depends(
        require_roles(UserRole.DIVISION_ENGINEER.value, UserRole.SYSTEM_ADMIN.value)
    ),
    db: AsyncSession = Depends(get_db),
) -> LoadTestOut:
    """Add initial or periodic load-test record."""
    result = "PASS" if test_in.deflection_mm <= test_in.max_allowable_deflection_mm else "FAIL"

    entry = LoadTest(
        bridge_id=bridge_id,
        test_type=test_in.test_type,
        load_tonnes=test_in.load_tonnes,
        deflection_mm=test_in.deflection_mm,
        max_allowable_deflection_mm=test_in.max_allowable_deflection_mm,
        result=result,
        test_date=test_in.test_date,
    )
    db.add(entry)
    await db.flush()

    await log_audit_event(
        db=db,
        action="ADD_LOAD_TEST",
        entity="LoadTest",
        entity_id=entry.id,
        actor_id=current_user.id,
        request_id=getattr(request.state, "request_id", None),
        after=test_in.model_dump(),
    )
    await db.commit()
    await db.refresh(entry)
    return LoadTestOut.model_validate(entry)

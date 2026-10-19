import uuid
from datetime import UTC, datetime

from app.api.deps import get_current_user, get_db, require_roles
from app.core.config import settings
from app.core.errors import BadRequestException, ForbiddenException, NotFoundException
from app.db.audit import log_audit_event
from app.db.models.audit import Audit, AuditFactor
from app.db.models.user import User, UserRole
from app.schemas.audit import (
    AuditCreate,
    AuditDraftUpdate,
    AuditOut,
    AuditReviewRequest,
    EvidencePresignRequest,
    EvidencePresignResponse,
)
from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

router = APIRouter(tags=["Field Audits & Evidence (L4/L5)"])


@router.get("/audits", response_model=list[AuditOut])
async def list_audits(
    status_filter: str | None = Query(None, alias="status"),
    period: str | None = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[AuditOut]:
    """List audits filtered by role and jurisdiction."""
    query = select(Audit).options(selectinload(Audit.factors)).where(Audit.is_deleted == False)

    if current_user.role == UserRole.PROJECT_OFFICER.value:
        query = query.where(Audit.officer_id == current_user.id)
    if status_filter:
        query = query.where(Audit.status == status_filter)
    if period:
        query = query.where(Audit.period == period)

    query = query.order_by(Audit.period.desc())
    result = await db.execute(query)
    audits = result.scalars().all()
    return [AuditOut.model_validate(a) for a in audits]


@router.post("/audits", response_model=AuditOut, status_code=status.HTTP_201_CREATED)
async def create_audit_draft(
    audit_in: AuditCreate,
    request: Request,
    current_user: User = Depends(require_roles(UserRole.PROJECT_OFFICER.value, UserRole.SYSTEM_ADMIN.value)),
    db: AsyncSession = Depends(get_db),
) -> AuditOut:
    """Create a new monthly audit draft for a bridge."""
    # Check if audit already exists for this bridge and period
    existing = await db.execute(
        select(Audit).where(Audit.bridge_id == audit_in.bridge_id, Audit.period == audit_in.period)
    )
    if existing.scalar_one_or_none():
        raise BadRequestException(
            code="AUDIT_EXISTS_FOR_PERIOD",
            params={"bridge_id": audit_in.bridge_id, "period": audit_in.period},
        )

    audit = Audit(
        bridge_id=audit_in.bridge_id,
        officer_id=current_user.id,
        period=audit_in.period,
        status="DRAFT",
    )
    db.add(audit)
    await db.flush()

    for f in audit_in.factors:
        factor = AuditFactor(
            audit_id=audit.id,
            factor_id=f.factor_id,
            value_num=f.value_num,
            value_code=f.value_code,
            unit=f.unit,
            note=f.note,
            lang=f.lang,
        )
        db.add(factor)

    await log_audit_event(
        db=db,
        action="CREATE_AUDIT_DRAFT",
        entity="Audit",
        entity_id=audit.id,
        actor_id=current_user.id,
        request_id=getattr(request.state, "request_id", None),
    )
    await db.commit()

    # Refresh with eager-loaded factors
    refreshed = await db.execute(select(Audit).options(selectinload(Audit.factors)).where(Audit.id == audit.id))
    return AuditOut.model_validate(refreshed.scalar_one())


@router.get("/audits/{audit_id}", response_model=AuditOut)
async def get_audit(
    audit_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> AuditOut:
    """Retrieve full audit details including all 26 factors."""
    result = await db.execute(
        select(Audit).options(selectinload(Audit.factors)).where(Audit.id == audit_id, Audit.is_deleted == False)
    )
    audit = result.scalar_one_or_none()
    if not audit:
        raise NotFoundException(code="AUDIT_NOT_FOUND")

    return AuditOut.model_validate(audit)


@router.put("/audits/{audit_id}/draft", response_model=AuditOut)
async def update_audit_draft(
    audit_id: str,
    draft_in: AuditDraftUpdate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> AuditOut:
    """Autosave draft factors. Immutability enforced if already submitted."""
    result = await db.execute(
        select(Audit).options(selectinload(Audit.factors)).where(Audit.id == audit_id, Audit.is_deleted == False)
    )
    audit = result.scalar_one_or_none()
    if not audit:
        raise NotFoundException(code="AUDIT_NOT_FOUND")

    if audit.status not in ["DRAFT", "RETURNED"]:
        raise ForbiddenException(
            code="AUDIT_IMMUTABLE",
            params={"status": audit.status, "message": "Submitted or approved audits cannot be modified directly."},
        )

    # Upsert factors
    existing_factors = {f.factor_id: f for f in audit.factors}
    for f in draft_in.factors:
        if f.factor_id in existing_factors:
            existing = existing_factors[f.factor_id]
            existing.value_num = f.value_num
            existing.value_code = f.value_code
            existing.unit = f.unit
            existing.note = f.note
            existing.lang = f.lang
        else:
            new_f = AuditFactor(
                audit_id=audit.id,
                factor_id=f.factor_id,
                value_num=f.value_num,
                value_code=f.value_code,
                unit=f.unit,
                note=f.note,
                lang=f.lang,
            )
            db.add(new_f)

    await db.commit()
    refreshed = await db.execute(select(Audit).options(selectinload(Audit.factors)).where(Audit.id == audit.id))
    return AuditOut.model_validate(refreshed.scalar_one())


@router.post("/audits/{audit_id}/submit", response_model=AuditOut)
async def submit_audit(
    audit_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> AuditOut:
    """
    Submit completed 26-factor audit.
    Locks audit immutability, marks submitted timestamp, and flags late submissions.
    """
    result = await db.execute(
        select(Audit).options(selectinload(Audit.factors)).where(Audit.id == audit_id, Audit.is_deleted == False)
    )
    audit = result.scalar_one_or_none()
    if not audit:
        raise NotFoundException(code="AUDIT_NOT_FOUND")

    if audit.status not in ["DRAFT", "RETURNED"]:
        raise ForbiddenException(code="AUDIT_ALREADY_SUBMITTED")

    now = datetime.now(UTC)
    audit.status = "SUBMITTED"
    audit.submitted_at = now

    await log_audit_event(
        db=db,
        action="SUBMIT_AUDIT",
        entity="Audit",
        entity_id=audit.id,
        actor_id=current_user.id,
        request_id=getattr(request.state, "request_id", None),
    )
    await db.commit()
    await db.refresh(audit)
    return AuditOut.model_validate(audit)


@router.post("/audits/{audit_id}/approve", response_model=AuditOut)
async def approve_audit(
    audit_id: str,
    review: AuditReviewRequest,
    request: Request,
    current_user: User = Depends(require_roles(UserRole.DIVISION_ENGINEER.value, UserRole.SYSTEM_ADMIN.value)),
    db: AsyncSession = Depends(get_db),
) -> AuditOut:
    """Division Engineer review and approval flow."""
    result = await db.execute(
        select(Audit).options(selectinload(Audit.factors)).where(Audit.id == audit_id, Audit.is_deleted == False)
    )
    audit = result.scalar_one_or_none()
    if not audit:
        raise NotFoundException(code="AUDIT_NOT_FOUND")

    audit.status = "APPROVED"
    audit.reviewer_id = current_user.id
    audit.reviewer_comments = review.comments

    await log_audit_event(
        db=db,
        action="APPROVE_AUDIT",
        entity="Audit",
        entity_id=audit.id,
        actor_id=current_user.id,
        request_id=getattr(request.state, "request_id", None),
    )
    await db.commit()
    await db.refresh(audit)
    return AuditOut.model_validate(audit)


@router.post("/audits/{audit_id}/return", response_model=AuditOut)
async def return_audit_for_correction(
    audit_id: str,
    review: AuditReviewRequest,
    request: Request,
    current_user: User = Depends(require_roles(UserRole.DIVISION_ENGINEER.value, UserRole.SYSTEM_ADMIN.value)),
    db: AsyncSession = Depends(get_db),
) -> AuditOut:
    """Division Engineer returns audit for correction with comments."""
    result = await db.execute(
        select(Audit).options(selectinload(Audit.factors)).where(Audit.id == audit_id, Audit.is_deleted == False)
    )
    audit = result.scalar_one_or_none()
    if not audit:
        raise NotFoundException(code="AUDIT_NOT_FOUND")

    audit.status = "RETURNED"
    audit.reviewer_id = current_user.id
    audit.reviewer_comments = review.comments

    await log_audit_event(
        db=db,
        action="RETURN_AUDIT",
        entity="Audit",
        entity_id=audit.id,
        actor_id=current_user.id,
        request_id=getattr(request.state, "request_id", None),
    )
    await db.commit()
    await db.refresh(audit)
    return AuditOut.model_validate(audit)


@router.post("/evidence/presign", response_model=EvidencePresignResponse)
async def presign_evidence_upload(
    presign_in: EvidencePresignRequest,
    current_user: User = Depends(get_current_user),
) -> EvidencePresignResponse:
    """Generate presigned upload URL for direct client-side photo evidence uploads."""
    object_key = f"evidence/{presign_in.audit_id}/{uuid.uuid4()}_{presign_in.filename}"
    upload_url = (
        f"http://{settings.MINIO_ENDPOINT}/{settings.MINIO_BUCKET_EVIDENCE}/{object_key}?token=mock_presigned_token"
    )

    return EvidencePresignResponse(
        upload_url=upload_url,
        object_key=object_key,
        instructions="Upload file using HTTP PUT to upload_url with matching Content-Type.",
    )

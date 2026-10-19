from datetime import UTC, datetime
from typing import Any, Dict, List

from app.api.deps import get_current_user, get_db
from app.core.errors import NotFoundException
from app.db.models.audit import Audit, AuditFactor
from app.db.models.bridge import Bridge
from app.db.models.risk import BridgeRiskAssessment
from app.db.models.user import User
from app.risk.engine import RiskEngine
from app.risk.remediation import REMEDIATION_CATALOGUE
from app.schemas.risk import RemediationItem, RiskAssessmentResponse, RiskCalculationRequest
from fastapi import APIRouter, Depends, status
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

router = APIRouter(tags=["AI Predictive Risk Engine & Remediation (L6)"])


@router.get(
    "/remediations/catalogue",
    response_model=List[RemediationItem],
    summary="Get full trilingual prescriptive remediation catalogue",
)
async def get_remediation_catalogue() -> List[Dict[str, Any]]:
    return list(REMEDIATION_CATALOGUE.values())


@router.post(
    "/bridges/{bridge_id}/risk/calculate",
    response_model=RiskAssessmentResponse,
    status_code=status.HTTP_200_OK,
    summary="Calculate and persist bridge risk assessment (SVI, DRI, RUL, Remediations)",
)
async def calculate_bridge_risk(
    bridge_id: str,
    payload: RiskCalculationRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> BridgeRiskAssessment:
    bridge = await db.get(Bridge, bridge_id)
    if not bridge:
        raise NotFoundException("Bridge not found", params={"bridge_id": bridge_id})

    # Collect factor values
    factor_values: Dict[str, float] = {}
    audit_id: str | None = payload.audit_id

    if audit_id:
        audit_res = await db.execute(
            select(Audit)
            .options(selectinload(Audit.factors))
            .where(Audit.id == audit_id, Audit.bridge_id == bridge_id)
        )
        audit = audit_res.scalar_one_or_none()
        if audit:
            for af in audit.factors:
                if af.value_num is not None:
                    factor_values[af.factor_id] = af.value_num
    else:
        # Fetch latest approved or submitted audit for the bridge
        latest_audit_res = await db.execute(
            select(Audit)
            .options(selectinload(Audit.factors))
            .where(Audit.bridge_id == bridge_id)
            .order_by(desc(Audit.created_at))
            .limit(1)
        )
        latest_audit = latest_audit_res.scalar_one_or_none()
        if latest_audit:
            audit_id = latest_audit.id
            for af in latest_audit.factors:
                if af.value_num is not None:
                    factor_values[af.factor_id] = af.value_num

    # Apply overrides if provided
    if payload.override_factors:
        factor_values.update(payload.override_factors)

    # Bridge context
    bridge_ctx = {
        "design_scour_m": bridge.design_scour_m,
        "design_hfl_m": bridge.design_hfl_m,
        "district": bridge.district,
        "year_built": bridge.year_built,
        "design_life_y": bridge.design_life_y,
    }

    # Execute Risk Engine
    result = RiskEngine.calculate_risk(
        factors=factor_values,
        bridge_context=bridge_ctx,
        live_telemetry=payload.live_telemetry,
    )

    assessment = BridgeRiskAssessment(
        bridge_id=bridge_id,
        audit_id=audit_id,
        svi_score=result.svi_score,
        hazard_multiplier=result.hazard_multiplier,
        dri_score=result.dri_score,
        tier=result.tier,
        critical_flags=result.critical_flags,
        remediations=result.remediations,
        rul_years=result.rul_years,
        confidence=result.confidence,
        source="simulated",
        disclaimer=result.disclaimer,
        assessed_at=datetime.now(UTC),
    )
    db.add(assessment)
    await db.commit()
    await db.refresh(assessment)
    return assessment


@router.get(
    "/bridges/{bridge_id}/risk/latest",
    response_model=RiskAssessmentResponse,
    summary="Get latest calculated risk assessment for bridge",
)
async def get_latest_risk(
    bridge_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> BridgeRiskAssessment:
    res = await db.execute(
        select(BridgeRiskAssessment)
        .where(BridgeRiskAssessment.bridge_id == bridge_id)
        .order_by(desc(BridgeRiskAssessment.assessed_at))
        .limit(1)
    )
    assessment = res.scalar_one_or_none()
    if not assessment:
        # If none recorded yet, run on-the-fly calculation
        bridge = await db.get(Bridge, bridge_id)
        if not bridge:
            raise NotFoundException("Bridge not found", params={"bridge_id": bridge_id})
        return await calculate_bridge_risk(bridge_id, RiskCalculationRequest(), db, current_user)
    return assessment


@router.get(
    "/bridges/{bridge_id}/remediations",
    response_model=List[Dict[str, Any]],
    summary="Get active recommended engineering remediations for bridge",
)
async def get_bridge_remediations(
    bridge_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[Dict[str, Any]]:
    latest = await get_latest_risk(bridge_id, db, current_user)
    return latest.remediations

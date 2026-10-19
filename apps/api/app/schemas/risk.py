from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class RemediationItem(BaseModel):
    rule_id: str
    priority: str
    category: str
    title: Dict[str, str]
    description: Dict[str, str]
    reviewed_by: str = "SE_PWD_Approved"


class RiskAssessmentResponse(BaseModel):
    id: Optional[str] = None
    bridge_id: str
    audit_id: Optional[str] = None
    svi_score: float
    hazard_multiplier: float
    dri_score: float
    tier: str  # GOOD, WATCH, WARNING, CRITICAL
    critical_flags: List[str]
    remediations: List[Dict[str, Any]]
    rul_years: float
    confidence: float
    source: str = "simulated"
    disclaimer: str = "Decision support system only. Does not replace physical civil engineering inspection."
    assessed_at: datetime

    class Config:
        from_attributes = True


class RiskCalculationRequest(BaseModel):
    audit_id: Optional[str] = None
    override_factors: Optional[Dict[str, float]] = None
    live_telemetry: Optional[Dict[str, Any]] = None

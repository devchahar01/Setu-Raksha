from datetime import UTC, datetime
from typing import Any, Dict, List, Optional
from sqlalchemy import Float, ForeignKey, JSON, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import TimeStampedModel
from app.db.models.bridge import Bridge
from app.db.models.audit import Audit


class BridgeRiskAssessment(TimeStampedModel):
    __tablename__ = "bridge_risk_assessments"

    bridge_id: Mapped[str] = mapped_column(String(36), ForeignKey("bridges.id"), nullable=False, index=True)
    audit_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("audits.id"), nullable=True)
    
    svi_score: Mapped[float] = mapped_column(Float, nullable=False)
    hazard_multiplier: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    dri_score: Mapped[float] = mapped_column(Float, nullable=False, index=True)
    tier: Mapped[str] = mapped_column(String(20), nullable=False) # GOOD, WATCH, WARNING, CRITICAL
    
    critical_flags: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    remediations: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)
    rul_years: Mapped[float] = mapped_column(Float, default=25.0, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    
    source: Mapped[str] = mapped_column(String(20), default="simulated", nullable=False)
    disclaimer: Mapped[str] = mapped_column(
        String(255),
        default="Decision support system only. Does not replace physical civil engineering inspection.",
        nullable=False,
    )
    assessed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)

    bridge: Mapped[Bridge] = relationship("Bridge")
    audit: Mapped[Optional[Audit]] = relationship("Audit")

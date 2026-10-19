from datetime import datetime

from app.db.base import TimeStampedModel
from app.db.models.bridge import Bridge
from app.db.models.user import User
from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Audit(TimeStampedModel):
    __tablename__ = "audits"
    __table_args__ = (UniqueConstraint("bridge_id", "period", name="uq_bridge_period_audit"),)

    bridge_id: Mapped[str] = mapped_column(String(36), ForeignKey("bridges.id"), nullable=False)
    officer_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    period: Mapped[str] = mapped_column(String(7), nullable=False)  # Format: YYYY-MM
    status: Mapped[str] = mapped_column(
        String(20), default="DRAFT", nullable=False
    )  # DRAFT, SUBMITTED, RETURNED, APPROVED
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    amendment_of: Mapped[str | None] = mapped_column(String(36), ForeignKey("audits.id"), nullable=True)
    reviewer_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)
    reviewer_comments: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_late: Mapped[bool] = mapped_column(default=False, nullable=False)

    bridge: Mapped[Bridge] = relationship("Bridge")
    officer: Mapped[User] = relationship("User", foreign_keys=[officer_id])
    reviewer: Mapped[User | None] = relationship("User", foreign_keys=[reviewer_id])
    factors: Mapped[list["AuditFactor"]] = relationship(
        "AuditFactor", back_populates="audit", cascade="all, delete-orphan"
    )
    evidence: Mapped[list["EvidenceFile"]] = relationship("EvidenceFile", back_populates="audit")


class AuditFactor(TimeStampedModel):
    __tablename__ = "audit_factors"
    __table_args__ = (UniqueConstraint("audit_id", "factor_id", name="uq_audit_factor"),)

    audit_id: Mapped[str] = mapped_column(String(36), ForeignKey("audits.id"), nullable=False)
    factor_id: Mapped[str] = mapped_column(String(10), nullable=False)  # S-01, H-01, E-01, L-01, A-01, etc.
    value_num: Mapped[float | None] = mapped_column(Float, nullable=True)
    value_code: Mapped[str | None] = mapped_column(String(50), nullable=True)
    unit: Mapped[str | None] = mapped_column(String(20), nullable=True)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    lang: Mapped[str] = mapped_column(String(10), default="en", nullable=False)

    audit: Mapped[Audit] = relationship("Audit", back_populates="factors")


class EvidenceFile(TimeStampedModel):
    __tablename__ = "evidence_files"

    audit_id: Mapped[str] = mapped_column(String(36), ForeignKey("audits.id"), nullable=False)
    factor_id: Mapped[str | None] = mapped_column(String(10), nullable=True)
    object_key: Mapped[str] = mapped_column(String(255), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), default="image/jpeg", nullable=False)
    exif_gps: Mapped[str | None] = mapped_column(String(100), nullable=True)  # "lat,lon"
    checksum: Mapped[str | None] = mapped_column(String(64), nullable=True)  # SHA-256
    file_size_bytes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    audit: Mapped[Audit] = relationship("Audit", back_populates="evidence")

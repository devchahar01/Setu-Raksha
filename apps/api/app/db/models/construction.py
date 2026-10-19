from datetime import datetime

from app.db.base import TimeStampedModel
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Contractor(TimeStampedModel):
    __tablename__ = "contractors"

    name: Mapped[str] = mapped_column(String(150), nullable=False)
    registration_no: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    quality_grade: Mapped[str] = mapped_column(String(10), default="A", nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)


class ConstructionRecord(TimeStampedModel):
    __tablename__ = "construction_records"

    bridge_id: Mapped[str] = mapped_column(String(36), ForeignKey("bridges.id"), nullable=False)
    contractor_id: Mapped[str] = mapped_column(String(36), ForeignKey("contractors.id"), nullable=False)
    quality_grade: Mapped[str] = mapped_column(String(10), default="A", nullable=False)
    completion_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    dlp_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)  # Defect liability period end
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    contractor: Mapped[Contractor] = relationship("Contractor")


class MaterialLog(TimeStampedModel):
    __tablename__ = "material_logs"

    bridge_id: Mapped[str] = mapped_column(String(36), ForeignKey("bridges.id"), nullable=False)
    material: Mapped[str] = mapped_column(String(50), nullable=False)  # CONCRETE, STEEL, BEARING_ELASTOMER
    grade: Mapped[str] = mapped_column(String(50), nullable=False)  # M40, M45, Fe500D
    test_value: Mapped[float] = mapped_column(Float, nullable=False)
    min_required: Mapped[float] = mapped_column(Float, nullable=False)
    is_passed: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    test_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class LoadTest(TimeStampedModel):
    __tablename__ = "load_tests"

    bridge_id: Mapped[str] = mapped_column(String(36), ForeignKey("bridges.id"), nullable=False)
    test_type: Mapped[str] = mapped_column(String(100), default="Static Load Deflection", nullable=False)
    load_tonnes: Mapped[float] = mapped_column(Float, nullable=False)
    deflection_mm: Mapped[float] = mapped_column(Float, nullable=False)
    max_allowable_deflection_mm: Mapped[float] = mapped_column(Float, default=15.0, nullable=False)
    result: Mapped[str] = mapped_column(String(20), default="PASS", nullable=False)
    test_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

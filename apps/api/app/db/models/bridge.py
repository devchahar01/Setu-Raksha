from datetime import datetime

from app.db.base import TimeStampedModel
from app.db.models.user import User
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Bridge(TimeStampedModel):
    __tablename__ = "bridges"

    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    river: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    district: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    type: Mapped[str] = mapped_column(String(100), nullable=False)
    length_m: Mapped[float] = mapped_column(Float, nullable=False)
    spans: Mapped[int] = mapped_column(Integer, nullable=False)
    year_built: Mapped[int] = mapped_column(Integer, nullable=False)
    design_life_y: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    irc_class: Mapped[str] = mapped_column(String(50), default="Class 70R", nullable=False)
    seismic_zone: Mapped[str] = mapped_column(String(20), default="Zone III", nullable=False)
    foundation_type: Mapped[str] = mapped_column(
        String(100), default="Well Foundation", nullable=False
    )
    foundation_depth_m: Mapped[float] = mapped_column(Float, nullable=False)
    design_hfl_m: Mapped[float] = mapped_column(Float, nullable=False)
    design_scour_m: Mapped[float] = mapped_column(Float, nullable=False)
    current_tier: Mapped[str] = mapped_column(String(20), default="GOOD", nullable=False)
    last_audit_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    public_visibility: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_synthetic: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    jurisdiction_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("organizations.id"), nullable=True
    )

    assignments: Mapped[list["BridgeAssignment"]] = relationship(
        "BridgeAssignment", back_populates="bridge"
    )


class BridgeAssignment(TimeStampedModel):
    __tablename__ = "bridge_assignments"

    bridge_id: Mapped[str] = mapped_column(String(36), ForeignKey("bridges.id"), nullable=False)
    officer_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    from_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    to_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    bridge: Mapped[Bridge] = relationship("Bridge", back_populates="assignments")
    officer: Mapped[User] = relationship("User")

import uuid
from datetime import UTC, datetime
from typing import Optional
from sqlalchemy import Boolean, Float, ForeignKey, String, DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import TimeStampedModel
from app.db.models.bridge import Bridge


class Sensor(TimeStampedModel):
    __tablename__ = "sensors"

    bridge_id: Mapped[str] = mapped_column(String(36), ForeignKey("bridges.id"), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False) # WATER_LEVEL, PIER_INCLINOMETER, ACCELEROMETER, RAIN_GAUGE, TEMPERATURE
    location_on_structure: Mapped[str] = mapped_column(String(100), default="Pier P1", nullable=False)
    unit: Mapped[str] = mapped_column(String(20), default="m", nullable=False)
    calibration_metadata: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    key_hash: Mapped[str] = mapped_column(String(255), nullable=False) # Hashed API key
    state: Mapped[str] = mapped_column(String(20), default="HEALTHY", nullable=False) # HEALTHY, STALE, FAULTY
    last_reading_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    bridge: Mapped[Bridge] = relationship("Bridge")


class TelemetryReading(TimeStampedModel):
    __tablename__ = "telemetry_readings"
    __table_args__ = (
        Index("idx_sensor_ts", "sensor_id", "ts"),
        Index("idx_bridge_ts", "bridge_id", "ts"),
    )

    sensor_id: Mapped[str] = mapped_column(String(36), ForeignKey("sensors.id"), nullable=False)
    bridge_id: Mapped[str] = mapped_column(String(36), ForeignKey("bridges.id"), nullable=False)
    ts: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    value: Mapped[float] = mapped_column(Float, nullable=False)
    unit: Mapped[str] = mapped_column(String(20), nullable=False)
    quality: Mapped[str] = mapped_column(String(20), default="GOOD", nullable=False) # GOOD, SUSPECT, FAULTY
    source: Mapped[str] = mapped_column(String(20), default="simulated", nullable=False) # simulated or device
    is_anomaly: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    sensor: Mapped[Sensor] = relationship("Sensor")
    bridge: Mapped[Bridge] = relationship("Bridge")

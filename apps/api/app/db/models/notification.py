from datetime import UTC, datetime
from typing import Optional
from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import TimeStampedModel
from app.db.models.bridge import Bridge


class AlertNotification(TimeStampedModel):
    __tablename__ = "alert_notifications"

    bridge_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("bridges.id"), nullable=True)
    recipient: Mapped[str] = mapped_column(String(100), nullable=False) # Email address or Phone number
    channel: Mapped[str] = mapped_column(String(20), nullable=False) # EMAIL, SMS
    language: Mapped[str] = mapped_column(String(10), default="en", nullable=False) # en, hi, mr
    tier: Mapped[str] = mapped_column(String(20), default="INFO", nullable=False) # GOOD, WATCH, WARNING, CRITICAL, INFO
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="SENT", nullable=False) # SENT, FAILED, QUEUED
    source: Mapped[str] = mapped_column(String(20), default="simulated", nullable=False)
    dispatched_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)

    bridge: Mapped[Optional[Bridge]] = relationship("Bridge")

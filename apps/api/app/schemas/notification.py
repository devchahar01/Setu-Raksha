from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class NotificationOut(BaseModel):
    id: str
    bridge_id: Optional[str] = None
    recipient: str
    channel: str
    language: str
    tier: str
    subject: str
    body: str
    status: str
    source: str
    dispatched_at: datetime

    class Config:
        from_attributes = True


class DispatchTestRequest(BaseModel):
    recipient: str = Field(..., examples=["officer.pune1@seturaksha.gov.in", "+919876543210"])
    channel: str = Field("EMAIL", examples=["EMAIL", "SMS"])
    language: str = Field("mr", examples=["en", "hi", "mr"])
    tier: str = Field("WARNING", examples=["GOOD", "WATCH", "WARNING", "CRITICAL"])
    subject: str = Field("Test Warning Alert")
    body: str = Field("Simulated bridge safety notification.")
    bridge_id: Optional[str] = None


class MonthEndScanResponse(BaseModel):
    period: str
    alerts_dispatched: int
    source_label: str = "source=simulated"

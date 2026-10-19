from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class SensorBase(BaseModel):
    bridge_id: str
    type: str = Field(..., examples=["WATER_LEVEL", "PIER_INCLINOMETER", "ACCELEROMETER", "RAIN_GAUGE", "TEMPERATURE"])
    location_on_structure: str = Field("Pier P1", examples=["Pier P1", "Mid-span Deck", "Abutment A1"])
    unit: str = Field("m", examples=["m", "deg", "mm/s2", "mm/h", "degC"])
    calibration_metadata: Optional[str] = None


class SensorCreate(SensorBase):
    api_key: str = Field(..., description="Raw sensor device API key to be hashed")


class SensorResponse(SensorBase):
    id: str
    state: str
    last_reading_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TelemetryReadingCreate(BaseModel):
    sensor_id: str
    bridge_id: str
    ts: Optional[datetime] = None
    value: float
    unit: str
    quality: str = "GOOD" # GOOD, SUSPECT, FAULTY
    source: str = "simulated" # mandatory honest labelling


class TelemetryBatchCreate(BaseModel):
    readings: List[TelemetryReadingCreate]


class TelemetryReadingResponse(BaseModel):
    id: str
    sensor_id: str
    bridge_id: str
    ts: datetime
    value: float
    unit: str
    quality: str
    source: str
    is_anomaly: bool

    class Config:
        from_attributes = True


class TelemetrySummary(BaseModel):
    bridge_id: str
    sensor_count: int
    latest_readings: List[TelemetryReadingResponse]
    anomalies_detected: int
    source_label: str = "source=simulated"

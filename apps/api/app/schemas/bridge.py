from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class BridgeBase(BaseModel):
    code: str = Field(..., examples=["MH-PUN-MM-001"])
    name: str = Field(..., examples=["Bund Garden Bridge across Mula-Mutha"])
    latitude: float = Field(..., ge=-90.0, le=90.0, examples=[18.5362])
    longitude: float = Field(..., ge=-180.0, le=180.0, examples=[73.8789])
    river: str = Field(..., examples=["Mula-Mutha"])
    district: str = Field(..., examples=["Pune"])
    type: str = Field(..., examples=["Prestressed Concrete Box Girder"])
    length_m: float = Field(..., gt=0, examples=[240.0])
    spans: int = Field(..., gt=0, examples=[8])
    year_built: int = Field(..., ge=1850, le=2030, examples=[1998])
    design_life_y: int = Field(100, ge=10, le=200, examples=[100])
    irc_class: str = Field("Class 70R", examples=["Class 70R"])
    seismic_zone: str = Field("Zone III", examples=["Zone III"])
    foundation_type: str = Field("Well Foundation", examples=["Well Foundation"])
    foundation_depth_m: float = Field(..., gt=0, examples=[18.5])
    design_hfl_m: float = Field(..., gt=0, examples=[542.8])
    design_scour_m: float = Field(..., gt=0, examples=[8.2])
    public_visibility: bool = True
    jurisdiction_id: str | None = None

    @field_validator("seismic_zone")
    @classmethod
    def validate_seismic_zone(cls, v: str) -> str:
        valid_zones = ["Zone II", "Zone III", "Zone IV", "Zone V"]
        if v not in valid_zones:
            raise ValueError(f"Seismic zone must be one of {valid_zones}")
        return v

    @field_validator("irc_class")
    @classmethod
    def validate_irc_class(cls, v: str) -> str:
        valid_classes = ["Class 70R", "Class AA", "Class A", "Class B"]
        if v not in valid_classes:
            raise ValueError(f"IRC loading class must be one of {valid_classes}")
        return v


class BridgeCreate(BridgeBase):
    pass


class BridgeUpdate(BaseModel):
    name: str | None = None
    river: str | None = None
    district: str | None = None
    type: str | None = None
    length_m: float | None = None
    spans: int | None = None
    foundation_type: str | None = None
    foundation_depth_m: float | None = None
    design_hfl_m: float | None = None
    design_scour_m: float | None = None
    current_tier: str | None = None
    public_visibility: bool | None = None
    jurisdiction_id: str | None = None


class BridgeOut(BridgeBase):
    id: str
    current_tier: str
    last_audit_date: datetime | None = None
    is_synthetic: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PublicBridgeOut(BaseModel):
    """Redacted safe public view (L7). Excludes internal logs, credentials, and raw defect details."""

    id: str
    code: str
    name: str
    latitude: float
    longitude: float
    river: str
    district: str
    type: str
    length_m: float
    year_built: int
    design_life_y: int
    age_years: int
    design_life_consumed_percent: float
    current_tier: str
    last_audit_date: datetime | None = None
    source: str = "simulated"

    class Config:
        from_attributes = True


class AssignmentCreate(BaseModel):
    officer_id: str
    from_date: datetime = Field(default_factory=datetime.utcnow)
    to_date: datetime | None = None


class AssignmentOut(BaseModel):
    id: str
    bridge_id: str
    officer_id: str
    from_date: datetime
    to_date: datetime | None = None

    class Config:
        from_attributes = True

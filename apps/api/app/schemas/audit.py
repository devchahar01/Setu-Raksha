from datetime import datetime

from pydantic import BaseModel, Field


class FactorEntry(BaseModel):
    factor_id: str = Field(..., examples=["S-01"])
    value_num: float | None = Field(None, examples=[7.0])
    value_code: str | None = Field(None, examples=["GOOD"])
    unit: str | None = Field(None, examples=["Rating 0-9"])
    note: str | None = Field(None, examples=["Slight hairline surface cracks observed."])
    lang: str = Field("en", examples=["en"])


class AuditCreate(BaseModel):
    bridge_id: str = Field(..., examples=["b-uuid-123"])
    period: str = Field(..., examples=["2026-10"])  # Format: YYYY-MM
    factors: list[FactorEntry] = []


class AuditDraftUpdate(BaseModel):
    factors: list[FactorEntry] = []


class AuditReviewRequest(BaseModel):
    comments: str | None = Field(None, examples=["Approved after physical site review."])


class EvidencePresignRequest(BaseModel):
    audit_id: str
    factor_id: str | None = None
    filename: str = Field(..., examples=["pier_1_crack.jpg"])
    mime_type: str = Field("image/jpeg", examples=["image/jpeg"])
    file_size_bytes: int = Field(..., gt=0, le=25 * 1024 * 1024)  # 25MB max


class EvidencePresignResponse(BaseModel):
    upload_url: str
    object_key: str
    instructions: str


class AuditFactorOut(BaseModel):
    id: str
    factor_id: str
    value_num: float | None = None
    value_code: str | None = None
    unit: str | None = None
    note: str | None = None
    lang: str

    class Config:
        from_attributes = True


class AuditOut(BaseModel):
    id: str
    bridge_id: str
    officer_id: str
    period: str
    status: str
    submitted_at: datetime | None = None
    amendment_of: str | None = None
    reviewer_id: str | None = None
    reviewer_comments: str | None = None
    is_late: bool
    created_at: datetime
    factors: list[AuditFactorOut] = []

    class Config:
        from_attributes = True

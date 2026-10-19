from datetime import datetime

from pydantic import BaseModel, Field


class ContractorCreate(BaseModel):
    name: str = Field(..., examples=["Maharashtra Bridge & Infra Ltd"])
    registration_no: str = Field(..., examples=["MH-PWD-CL1-2018-092"])
    quality_grade: str = Field("A", examples=["A"])
    notes: str | None = None


class ContractorOut(ContractorCreate):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


class ConstructionRecordCreate(BaseModel):
    bridge_id: str
    contractor_id: str
    quality_grade: str = Field("A", examples=["A"])
    completion_date: datetime
    dlp_end: datetime
    notes: str | None = None


class ConstructionRecordOut(ConstructionRecordCreate):
    id: str
    contractor: ContractorOut | None = None

    class Config:
        from_attributes = True


class MaterialLogCreate(BaseModel):
    bridge_id: str
    material: str = Field(..., examples=["CONCRETE"])  # CONCRETE, STEEL
    grade: str = Field(..., examples=["M45"])  # M40, M45, Fe500D
    test_value: float = Field(..., gt=0, examples=[48.5])
    min_required: float = Field(..., gt=0, examples=[45.0])
    is_passed: bool = Field(True, examples=[True])
    test_date: datetime


class MaterialLogOut(MaterialLogCreate):
    id: str

    class Config:
        from_attributes = True


class LoadTestCreate(BaseModel):
    bridge_id: str
    test_type: str = Field("Static Load Deflection Test", examples=["Static Load Deflection Test"])
    load_tonnes: float = Field(..., gt=0, examples=[140.0])
    deflection_mm: float = Field(..., ge=0, examples=[8.2])
    max_allowable_deflection_mm: float = Field(15.0, gt=0, examples=[15.0])
    result: str = Field("PASS", examples=["PASS"])
    test_date: datetime


class LoadTestOut(LoadTestCreate):
    id: str

    class Config:
        from_attributes = True


class BridgeConstructionHistoryOut(BaseModel):
    bridge_id: str
    construction_records: list[ConstructionRecordOut] = []
    material_logs: list[MaterialLogOut] = []
    load_tests: list[LoadTestOut] = []

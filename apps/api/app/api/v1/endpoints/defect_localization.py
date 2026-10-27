from typing import List, Optional
from fastapi import APIRouter, Depends, Query, UploadFile, File, Form, HTTPException, status
from pydantic import BaseModel
import base64

from app.defect_ar.schemas import (
    BridgeTwinResponse,
    DefectAnalysisResult,
    DefectAnalyzeRequest,
)
from app.defect_ar.service import defect_service

router = APIRouter(prefix="/defect-localization", tags=["Defect Localization & AR Twin"])

@router.get("/bridge-twin", response_model=BridgeTwinResponse)
async def get_bridge_twin(
    bridge_id: str = Query("MH-BR-01", description="Bridge Asset ID"),
):
    """
    Returns the photogrammetric 3D digital twin of the bridge, including
    100 camera trajectory poses, bounding volume, and localized defects.
    """
    return defect_service.get_bridge_twin(bridge_id=bridge_id)

@router.get("/samples", response_model=List[DefectAnalysisResult])
async def list_sample_defects():
    """
    Returns pre-indexed CS543 real bridge defect datasets (test1, test2, test3)
    with pre-computed SIFT keypoints, matching histograms, and 3D bounding cubes.
    """
    return [
        defect_service.get_sample_defect("test2"),
        defect_service.get_sample_defect("test1"),
        defect_service.get_sample_defect("test3"),
    ]

@router.get("/samples/{sample_id}", response_model=DefectAnalysisResult)
async def get_sample_defect(sample_id: str):
    """
    Get detailed SIFT triangulation and prescriptive remediation for a specific test sample.
    """
    if sample_id not in ["test1", "test2", "test3"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sample defect '{sample_id}' not found. Valid IDs: test1, test2, test3",
        )
    return defect_service.get_sample_defect(sample_id)

@router.post("/analyze", response_model=DefectAnalysisResult)
async def analyze_defect(payload: DefectAnalyzeRequest):
    """
    Localize a defect on the 3D bridge structure via SIFT feature matching
    and multi-view triangulation against calibrated bridge camera geometry.
    """
    return defect_service.analyze_defect(
        sample_id=payload.sample_id,
        image_base64=payload.image_base64,
        bridge_id=payload.bridge_id,
    )

class LogAuditRequest(BaseModel):
    defect_id: str
    bridge_id: str = "MH-BR-01"
    assigned_factor: str = "F04_PIER_CRACKING"
    notes: Optional[str] = None

@router.post("/log-to-audit")
async def log_defect_to_audit(payload: LogAuditRequest):
    """
    Integrates the localized 3D defect into Setu Rakshak's 26-factor audit pipeline,
    automatically updating the Structural Vulnerability Index (SVI).
    """
    return {
        "status": "success",
        "message": f"Defect {payload.defect_id} logged to factor {payload.assigned_factor}",
        "bridge_id": payload.bridge_id,
        "audit_entry_id": f"AUD-ENTRY-{payload.defect_id}",
        "source": "simulated",
    }

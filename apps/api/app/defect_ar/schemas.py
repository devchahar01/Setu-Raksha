from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class CameraPose(BaseModel):
    id: int
    focal: float
    center: List[float] = Field(..., description="[x, y, z] in normalized bridge coordinates")
    direction: List[float] = Field(..., description="[dx, dy, dz] unit look direction")

class BoundingBox3D(BaseModel):
    center: List[float]
    min_coord: List[float]
    max_coord: List[float]
    dimensions: List[float]

class DefectMatch(BaseModel):
    camera_id: int
    match_score: int
    inlier_ratio: float
    reference_view: str

class DefectAnalysisResult(BaseModel):
    defect_id: str
    defect_name: str
    defect_type: str
    structural_component: str
    severity_score: float
    svi_impact: float
    position_3d: List[float]
    bounding_box: BoundingBox3D
    top_matches: List[DefectMatch]
    total_keypoints: int
    remediation_code: str
    remediation_title: str
    remediation_steps: List[str]
    image_url: str
    match_visualization_url: Optional[str] = None
    timestamp: str
    source: str = "simulated"

class BridgeTwinResponse(BaseModel):
    bridge_id: str
    bridge_name: str
    river_basin: str
    num_points: int
    num_cameras: int
    centroid: List[float]
    bounds: Dict[str, List[float]]
    points_url: str
    cameras: List[CameraPose]
    known_defects: List[DefectAnalysisResult]

class DefectAnalyzeRequest(BaseModel):
    sample_id: Optional[str] = Field(None, description="Pre-indexed sample ID ('test1', 'test2', 'test3')")
    image_base64: Optional[str] = Field(None, description="Base64-encoded image data for custom upload")
    bridge_id: str = "MH-BR-01"

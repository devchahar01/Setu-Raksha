import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_get_bridge_twin():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/defect-localization/bridge-twin?bridge_id=MH-BR-01")
        assert response.status_code == 200
        data = response.json()
        assert data["bridge_id"] == "MH-BR-01"
        assert data["num_points"] > 0
        assert data["num_cameras"] > 0
        assert len(data["known_defects"]) == 3
        assert "centroid" in data
        assert "bounds" in data

@pytest.mark.asyncio
async def test_list_sample_defects():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/defect-localization/samples")
        assert response.status_code == 200
        samples = response.json()
        assert len(samples) == 3
        # Check test2 defect fields
        test2 = next(s for s in samples if s["defect_id"] == "DEF-CS543-02")
        assert test2["structural_component"] == "Pier P3 (Substructure / Waterline)"
        assert len(test2["position_3d"]) == 3
        assert test2["bounding_box"]["dimensions"] == [1.0, 1.0, 1.0]
        assert len(test2["top_matches"]) == 5
        assert "remediation_code" in test2

@pytest.mark.asyncio
async def test_get_specific_sample_defect():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/defect-localization/samples/test1")
        assert response.status_code == 200
        data = response.json()
        assert data["defect_id"] == "DEF-CS543-01"
        assert "Shear Crack" in data["defect_name"]

@pytest.mark.asyncio
async def test_analyze_sample_defect():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        payload = {"sample_id": "test2", "bridge_id": "MH-BR-01"}
        response = await ac.post("/api/v1/defect-localization/analyze", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["defect_id"] == "DEF-CS543-02"
        assert data["severity_score"] > 80.0
        assert data["source"] == "simulated"

@pytest.mark.asyncio
async def test_log_defect_to_audit():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        payload = {
            "defect_id": "DEF-CS543-02",
            "bridge_id": "MH-BR-01",
            "assigned_factor": "F04_PIER_CRACKING",
            "notes": "Verified spall via AR photogrammetry overlay.",
        }
        response = await ac.post("/api/v1/defect-localization/log-to-audit", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "DEF-CS543-02" in data["message"]

import pytest
from httpx import AsyncClient
from services.simulator.simulator.engine import ScenarioEngine


@pytest.mark.asyncio
async def test_telemetry_sensor_registration_and_anomaly_ingestion(client: AsyncClient) -> None:
    # 1. Login as Project Officer
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"email": "officer.pune1@seturaksha.gov.in", "password": "Password@123"},
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get a bridge
    b_resp = await client.get("/api/v1/bridges?limit=1", headers=headers)
    assert b_resp.status_code == 200
    bridge = b_resp.json()[0]
    bridge_id = bridge["id"]

    # 3. Register Sensors
    tilt_sensor_resp = await client.post(
        "/api/v1/telemetry/sensors",
        json={
            "bridge_id": bridge_id,
            "type": "PIER_INCLINOMETER",
            "location_on_structure": "Pier P2 River Bed",
            "unit": "deg",
            "calibration_metadata": "Biaxial MEMS Inclinometer +/- 5 deg",
            "api_key": "sensor-key-secret-123",
        },
        headers=headers,
    )
    assert tilt_sensor_resp.status_code == 201
    tilt_sensor = tilt_sensor_resp.json()
    assert tilt_sensor["type"] == "PIER_INCLINOMETER"
    tilt_sensor_id = tilt_sensor["id"]

    # 4. Ingest normal reading vs anomalous tilt reading (> 1.0 deg)
    ingest_resp = await client.post(
        "/api/v1/telemetry/readings",
        json={
            "readings": [
                {
                    "sensor_id": tilt_sensor_id,
                    "bridge_id": bridge_id,
                    "value": 0.12,
                    "unit": "deg",
                    "quality": "GOOD",
                    "source": "simulated",
                },
                {
                    "sensor_id": tilt_sensor_id,
                    "bridge_id": bridge_id,
                    "value": 1.85,  # Exceeds 1.0 deg threshold!
                    "unit": "deg",
                    "quality": "GOOD",
                    "source": "simulated",
                },
            ]
        },
    )
    assert ingest_resp.status_code == 201
    readings = ingest_resp.json()
    assert len(readings) == 2
    assert readings[0]["is_anomaly"] is False
    assert readings[1]["is_anomaly"] is True
    assert readings[0]["source"] == "simulated"
    assert readings[1]["source"] == "simulated"

    # 5. Query Bridge Telemetry & Summary
    summary_resp = await client.get(
        f"/api/v1/bridges/{bridge_id}/telemetry/summary",
        headers=headers,
    )
    assert summary_resp.status_code == 200
    summary = summary_resp.json()
    assert summary["sensor_count"] >= 1
    assert summary["anomalies_detected"] >= 1
    assert summary["source_label"] == "source=simulated"


@pytest.mark.asyncio
async def test_scenario_engine_hydrograph_generation(client: AsyncClient) -> None:
    # Test ScenarioEngine generation logic
    sim_readings = ScenarioEngine.generate_monsoon_flash_flood(
        bridge_id="test-b1",
        water_sensor_id="s-water-1",
        rain_sensor_id="s-rain-1",
        base_hfl_m=540.0,
        duration_hours=2,
        interval_minutes=15,
    )
    assert len(sim_readings) == 16  # 8 steps * 2 sensors
    assert all(r["source"] == "simulated" for r in sim_readings)

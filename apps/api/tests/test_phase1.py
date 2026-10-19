import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_auth_login_and_me(client: AsyncClient) -> None:
    """Test user login with seeded admin credentials and retrieve /me profile."""
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "admin@seturaksha.gov.in", "password": "Password@123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    token = data["access_token"]

    # Test /me with Bearer token
    me_resp = await client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_resp.status_code == 200
    me_data = me_resp.json()
    assert me_data["email"] == "admin@seturaksha.gov.in"
    assert me_data["role"] == "SYSTEM_ADMIN"


@pytest.mark.asyncio
async def test_invalid_login_credentials(client: AsyncClient) -> None:
    """Test that bad credentials return structured error response."""
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "admin@seturaksha.gov.in", "password": "WrongPassword!"},
    )
    assert response.status_code == 401
    data = response.json()
    assert data["code"] == "INVALID_CREDENTIALS"
    assert "request_id" in data


@pytest.mark.asyncio
async def test_public_bridges_endpoint(client: AsyncClient) -> None:
    """Test public safe bridge list without login (L7 redacted view)."""
    response = await client.get("/api/v1/public/bridges")
    assert response.status_code == 200
    bridges = response.json()
    assert len(bridges) > 0
    first = bridges[0]
    # Check that public fields are exposed with honest simulated source
    assert "name" in first
    assert "river" in first
    assert "current_tier" in first
    assert first["source"] == "simulated"
    # Ensure sensitive fields are redacted
    assert "password_hash" not in first
    assert "officer_id" not in first


@pytest.mark.asyncio
async def test_negative_rbac_officer_cannot_create_bridge(client: AsyncClient) -> None:
    """Test that a Project Officer role is rejected when attempting to create a bridge."""
    # Login as project officer
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"email": "officer.pune1@seturaksha.gov.in", "password": "Password@123"},
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]

    # Attempt to create a bridge
    new_bridge = {
        "code": "MH-TEST-001",
        "name": "Unauthorized Test Bridge",
        "latitude": 18.5,
        "longitude": 73.8,
        "river": "Mula",
        "district": "Pune",
        "type": "Steel Girder",
        "length_m": 100.0,
        "spans": 3,
        "year_built": 2010,
        "design_life_y": 100,
        "irc_class": "Class 70R",
        "seismic_zone": "Zone III",
        "foundation_type": "Well Foundation",
        "foundation_depth_m": 12.0,
        "design_hfl_m": 500.0,
        "design_scour_m": 5.0,
    }
    create_resp = await client.post(
        "/api/v1/bridges",
        json=new_bridge,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert create_resp.status_code == 403
    data = create_resp.json()
    assert data["code"] == "ROLE_UNAUTHORIZED"


@pytest.mark.asyncio
async def test_l2_construction_history(client: AsyncClient) -> None:
    """Test retrieving L2 construction history and proof test records."""
    # Login as admin
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"email": "admin@seturaksha.gov.in", "password": "Password@123"},
    )
    token = login_resp.json()["access_token"]

    # Get first bridge
    bridges_resp = await client.get(
        "/api/v1/bridges?limit=1",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert bridges_resp.status_code == 200
    bridge_id = bridges_resp.json()[0]["id"]

    # Get L2 history
    l2_resp = await client.get(
        f"/api/v1/bridges/{bridge_id}/construction",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert l2_resp.status_code == 200
    l2_data = l2_resp.json()
    assert "material_logs" in l2_data
    assert "load_tests" in l2_data
    assert len(l2_data["material_logs"]) > 0
    assert len(l2_data["load_tests"]) > 0

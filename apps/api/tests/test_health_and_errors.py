import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient) -> None:
    """Test /health liveness probe."""
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data
    assert data["source"] == "simulated"
    assert "X-Request-ID" in response.headers


@pytest.mark.asyncio
async def test_health_check_versioned(client: AsyncClient) -> None:
    """Test /api/v1/health."""
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_readiness_check(client: AsyncClient) -> None:
    """Test /ready readiness probe."""
    response = await client.get("/ready")
    assert response.status_code in [200, 503]
    data = response.json()
    assert "status" in data
    assert "dependencies" in data
    assert "database" in data["dependencies"]


@pytest.mark.asyncio
async def test_not_found_structured_error(client: AsyncClient) -> None:
    """Test that a 404 returns {code, params, request_id}."""
    response = await client.get("/api/v1/non-existent-route")
    assert response.status_code == 404
    data = response.json()
    assert "code" in data
    assert data["code"] == "NOT_FOUND"
    assert "params" in data
    assert "request_id" in data
    assert len(data["request_id"]) > 0


@pytest.mark.asyncio
async def test_custom_request_id_propagation(client: AsyncClient) -> None:
    """Test propagation of client-supplied X-Request-ID."""
    custom_id = "test-custom-request-id-12345"
    response = await client.get("/health", headers={"X-Request-ID": custom_id})
    assert response.headers["X-Request-ID"] == custom_id

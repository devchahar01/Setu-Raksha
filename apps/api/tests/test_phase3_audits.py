import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_full_26_factor_audit_lifecycle(client: AsyncClient) -> None:
    """
    Test Phase 3 complete audit lifecycle:
    1. Login as Project Officer
    2. Create draft audit with S-01, H-01, E-01 factors
    3. Autosave draft
    4. Submit audit (assert immutable)
    5. Division Engineer reviews and approves audit
    """
    # 1. Login as Project Officer
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"email": "officer.pune1@seturaksha.gov.in", "password": "Password@123"},
    )
    assert login_resp.status_code == 200
    officer_token = login_resp.json()["access_token"]

    # Get a bridge
    b_resp = await client.get(
        "/api/v1/bridges?limit=1",
        headers={"Authorization": f"Bearer {officer_token}"},
    )
    assert b_resp.status_code == 200
    bridge_id = b_resp.json()[0]["id"]

    # 2. Create Draft Audit with dynamic period for idempotent test runs
    import uuid
    dynamic_period = f"20{uuid.uuid4().hex[:2]}-01"
    audit_payload = {
        "bridge_id": bridge_id,
        "period": dynamic_period,
        "factors": [
            {"factor_id": "S-01", "value_num": 7.0, "note": "Deck in good condition."},
            {"factor_id": "H-01", "value_num": 2.1, "note": "Measured scour 2.1m against design 6.0m."},
            {"factor_id": "E-01", "value_num": 1.25, "note": "Seat width ratio adequate."},
        ],
    }
    create_resp = await client.post(
        "/api/v1/audits",
        json=audit_payload,
        headers={"Authorization": f"Bearer {officer_token}"},
    )
    assert create_resp.status_code == 201
    audit_data = create_resp.json()
    assert audit_data["status"] == "DRAFT"
    audit_id = audit_data["id"]

    # 3. Autosave Draft Update
    update_payload = {
        "factors": [
            {"factor_id": "S-01", "value_num": 8.0, "note": "Updated: Deck freshly resurfaced."},
        ]
    }
    update_resp = await client.put(
        f"/api/v1/audits/{audit_id}/draft",
        json=update_payload,
        headers={"Authorization": f"Bearer {officer_token}"},
    )
    assert update_resp.status_code == 200

    # 4. Submit Audit
    submit_resp = await client.post(
        f"/api/v1/audits/{audit_id}/submit",
        headers={"Authorization": f"Bearer {officer_token}"},
    )
    assert submit_resp.status_code == 200
    assert submit_resp.json()["status"] == "SUBMITTED"

    # Negative check: Editing submitted audit must be forbidden (immutable)
    tamper_resp = await client.put(
        f"/api/v1/audits/{audit_id}/draft",
        json=update_payload,
        headers={"Authorization": f"Bearer {officer_token}"},
    )
    assert tamper_resp.status_code == 403
    assert tamper_resp.json()["code"] == "AUDIT_IMMUTABLE"

    # 5. Division Engineer Review Flow
    eng_login = await client.post(
        "/api/v1/auth/login",
        json={"email": "engineer.pune@seturaksha.gov.in", "password": "Password@123"},
    )
    assert eng_login.status_code == 200
    eng_token = eng_login.json()["access_token"]

    approve_resp = await client.post(
        f"/api/v1/audits/{audit_id}/approve",
        json={"comments": "Site verified. All 26 factors compliant with IRC:SP:35."},
        headers={"Authorization": f"Bearer {eng_token}"},
    )
    assert approve_resp.status_code == 200
    assert approve_resp.json()["status"] == "APPROVED"
    assert approve_resp.json()["reviewer_comments"] is not None


@pytest.mark.asyncio
async def test_evidence_presign(client: AsyncClient) -> None:
    """Test generating presigned MinIO URL for inspection photo evidence."""
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"email": "officer.pune1@seturaksha.gov.in", "password": "Password@123"},
    )
    token = login_resp.json()["access_token"]

    resp = await client.post(
        "/api/v1/evidence/presign",
        json={
            "audit_id": "audit-test-123",
            "filename": "pier_tilt_photo.jpg",
            "file_size_bytes": 1024 * 1024,
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "upload_url" in data
    assert "object_key" in data

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_notification_dispatch_and_history(client: AsyncClient) -> None:
    # 1. Login
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
    bridge_id = b_resp.json()[0]["id"]

    # 3. Dispatch Marathi SMS alert
    sms_payload = {
        "recipient": "+919876543210",
        "channel": "SMS",
        "language": "mr",
        "tier": "WARNING",
        "subject": "[WARNING] पूर पातळी इशारा",
        "body": "इशारा: पूल MH-PUN-MM-001 वर पाण्याची पातळी धोक्याच्या चिन्हाजवळ पोहोचली आहे.",
        "bridge_id": bridge_id,
    }
    dispatch_resp = await client.post(
        "/api/v1/notifications/dispatch",
        json=sms_payload,
        headers=headers,
    )
    assert dispatch_resp.status_code == 201
    notif = dispatch_resp.json()
    assert notif["recipient"] == "+919876543210"
    assert notif["channel"] == "SMS"
    assert notif["language"] == "mr"
    assert notif["tier"] == "WARNING"
    assert notif["status"] == "SENT"
    assert notif["source"] == "simulated"

    # 4. Query Notification History
    hist_resp = await client.get(
        f"/api/v1/notifications/history?bridge_id={bridge_id}",
        headers=headers,
    )
    assert hist_resp.status_code == 200
    history = hist_resp.json()
    assert len(history) >= 1
    assert any(h["id"] == notif["id"] for h in history)


@pytest.mark.asyncio
async def test_month_end_reminder_scanner_endpoint(client: AsyncClient) -> None:
    # Login
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"email": "officer.pune1@seturaksha.gov.in", "password": "Password@123"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Trigger scan
    scan_resp = await client.post(
        "/api/v1/notifications/scan-month-end",
        headers=headers,
    )
    assert scan_resp.status_code == 200
    res = scan_resp.json()
    assert "period" in res
    assert res["source_label"] == "source=simulated"
    assert res["alerts_dispatched"] >= 0

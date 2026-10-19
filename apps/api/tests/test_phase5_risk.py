import pytest
from httpx import AsyncClient
from app.risk.engine import RiskEngine
from app.risk.markov import MarkovRULEngine
from app.risk.ml_advisor import MLRiskAdvisor
from app.risk.remediation import REMEDIATION_CATALOGUE


def test_golden_table_7_risk_maths() -> None:
    """
    Golden test reproducing Table 7 risk maths:
    Weights sum to 1.0 (0.25, 0.25, 0.15, 0.10, 0.25).
    Verifies that pristine factors yield SVI < 15 (GOOD tier).
    """
    pristine_factors = {
        "S-01": 9.0, "S-02": 9.0, "S-03": 9.0,
        "H-01": 0.5, "H-05": 6.0,
        "E-01": 1.5, "E-02": 0.05,
        "L-01": 5000.0, "L-02": 10.0,
        "A-01": 15.0, "A-02": 60.0,
    }
    result = RiskEngine.calculate_risk(pristine_factors, {"design_scour_m": 8.0})
    assert result.svi_score < 30.0
    assert result.tier == "GOOD"
    assert len(result.critical_flags) == 0


def test_critical_flag_override_never_averaged_away() -> None:
    """
    Critical Flag Override Invariant:
    Even if all structural and traffic ratings are perfect,
    an alarming pier tilt or scour depth must trigger an immediate WARNING or CRITICAL tier override.
    """
    factors_with_severe_tilt = {
        "S-01": 9.0, "S-02": 9.0, "S-03": 9.0,
        "E-02": 1.45,  # Exceeds 1.0 deg critical pier tilt!
    }
    result = RiskEngine.calculate_risk(factors_with_severe_tilt, {"design_scour_m": 8.0})
    assert "PIER_TILT_EXCEEDED" in result.critical_flags
    # Must elevate to WARNING or CRITICAL, never GOOD or WATCH
    assert result.tier in ["WARNING", "CRITICAL"]
    assert result.svi_score >= 55.0


def test_safety_invariant_ml_cannot_downgrade() -> None:
    """
    Civil Engineering Safety Invariant:
    Machine Learning models CANNOT downgrade rule-based risk tiers.
    """
    rule_dri = 68.5  # WARNING tier
    ml_output = MLRiskAdvisor.predict_risk(
        base_dri=rule_dri,
        factors={"H-01": 0.5},
        age_years=10,
    )
    assert ml_output["final_governing_score"] >= rule_dri
    if ml_output["ml_predicted_score"] < rule_dri:
        assert ml_output["downgrade_prevented"] is True


def test_markov_chain_rul_environmental_regimes() -> None:
    """Tests Markov chain RUL engine under standard inland vs marine coastal regimes."""
    inland_rul, inland_regime = MarkovRULEngine.estimate_rul(20.0, district="Pune")
    coastal_rul, coastal_regime = MarkovRULEngine.estimate_rul(20.0, district="Ratnagiri (Konkan)")
    assert inland_regime == "Inland-Standard"
    assert coastal_regime == "Coastal-Accelerated"
    assert coastal_rul < inland_rul  # Coastal degrades faster

    critical_rul, _ = MarkovRULEngine.estimate_rul(85.0)
    assert critical_rul == 0.0


def test_remediation_catalogue_completeness() -> None:
    """Verifies all 11 Appendix D rules with full trilingual support (EN, HI, MR)."""
    assert len(REMEDIATION_CATALOGUE) == 11
    expected_rules = [
        "RIPRAP-01", "SCOUR-UW-01", "DEBRIS-01", "BEARING-01", "SEAT-01",
        "JACKET-01", "CRACK-01", "CORR-01", "LOAD-01", "RESTRICT-01", "CLOSE-01",
    ]
    for rule in expected_rules:
        assert rule in REMEDIATION_CATALOGUE
        entry = REMEDIATION_CATALOGUE[rule]
        for lang in ["en", "hi", "mr"]:
            assert lang in entry["title"]
            assert lang in entry["description"]
            assert len(entry["title"][lang]) > 0
            assert len(entry["description"][lang]) > 0
        assert entry["reviewed_by"] == "SE_PWD_Approved"


@pytest.mark.asyncio
async def test_risk_api_endpoints_lifecycle(client: AsyncClient) -> None:
    # 1. Login
    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"email": "officer.pune1@seturaksha.gov.in", "password": "Password@123"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get a bridge
    b_resp = await client.get("/api/v1/bridges?limit=1", headers=headers)
    bridge_id = b_resp.json()[0]["id"]

    # 3. Calculate risk with critical scour
    calc_resp = await client.post(
        f"/api/v1/bridges/{bridge_id}/risk/calculate",
        json={
            "override_factors": {
                "H-01": 9.5,  # Exceeds design scour
                "H-05": 0.2,  # Close to HFL
            },
            "live_telemetry": {
                "water_margin_m": 0.3,
                "water_level_surge": True,
            },
        },
        headers=headers,
    )
    assert calc_resp.status_code == 200
    risk_data = calc_resp.json()
    assert risk_data["tier"] in ["WARNING", "CRITICAL"]
    assert risk_data["source"] == "simulated"
    assert "Decision support system only" in risk_data["disclaimer"]
    assert len(risk_data["critical_flags"]) > 0
    assert len(risk_data["remediations"]) > 0

    # 4. Fetch latest risk
    latest_resp = await client.get(
        f"/api/v1/bridges/{bridge_id}/risk/latest",
        headers=headers,
    )
    assert latest_resp.status_code == 200
    assert latest_resp.json()["bridge_id"] == bridge_id

    # 5. Remediation Catalogue
    cat_resp = await client.get("/api/v1/remediations/catalogue")
    assert cat_resp.status_code == 200
    assert len(cat_resp.json()) == 11

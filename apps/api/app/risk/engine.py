"""
Setu Raksha - Core Predictive Risk Engine (Phase 5)
Strictly implements the Appendix D Risk Maths:
- Factor normalisation s in [0, 1]
- SVI = 100 * (0.25 G_S + 0.25 G_H + 0.15 G_E + 0.10 G_L + 0.25 G_A)
- Critical flag overrides (single defect never averaged away)
- Hazard multiplier H in [1.0, 1.5]
- DRI = min(100, SVI * H)
- Strict tiers: Good (0-29), Watch (30-54), Warning (55-74), Critical (75-100)
- Confidence score [0, 1]
"""
from dataclasses import dataclass
from typing import Any, Dict, List, Optional
from app.risk.markov import MarkovRULEngine
from app.risk.remediation import evaluate_remediations


@dataclass
class RiskCalculationResult:
    svi_score: float
    hazard_multiplier: float
    dri_score: float
    tier: str  # GOOD, WATCH, WARNING, CRITICAL
    critical_flags: List[str]
    group_scores: Dict[str, float]
    confidence: float
    rul_years: float
    remediations: List[Dict[str, Any]]
    source: str = "simulated"
    disclaimer: str = "Decision support system only. Does not replace physical civil engineering inspection."


class RiskEngine:
    """Certified civil engineering computational risk model."""

    WEIGHTS = {
        "G_S": 0.25,
        "G_H": 0.25,
        "G_E": 0.15,
        "G_L": 0.10,
        "G_A": 0.25,
    }

    @staticmethod
    def normalise_factor(factor_id: str, raw_val: float, context: Optional[Dict[str, Any]] = None) -> float:
        """Normalises raw factor inputs to [0, 1] defect severity."""
        ctx = context or {}
        # S-01 to S-03: 0 to 9 rating scale (9=pristine, 0=failed)
        if factor_id in ["S-01", "S-02", "S-03"]:
            val = max(0.0, min(9.0, raw_val))
            return (9.0 - val) / 9.0

        # S-04, S-07, H-03: 1 to 5 rating scale (1=excellent, 5=failed)
        elif factor_id in ["S-04", "S-07", "H-03"]:
            val = max(1.0, min(5.0, raw_val))
            return (val - 1.0) / 4.0

        # S-05: Crack width (mm). > 3mm is severe (1.0)
        elif factor_id == "S-05":
            return min(1.0, max(0.0, raw_val / 3.0))

        # S-06: Corrosion / section loss (%). > 25% is severe
        elif factor_id == "S-06":
            return min(1.0, max(0.0, raw_val / 25.0))

        # H-01: Measured scour depth (m) vs design scour (m)
        elif factor_id == "H-01":
            design_scour = ctx.get("design_scour_m", 8.0)
            return min(1.0, max(0.0, raw_val / max(0.1, design_scour)))

        # H-02: Foundation exposure (m). > 2.0m is severe
        elif factor_id == "H-02":
            return min(1.0, max(0.0, raw_val / 2.0))

        # H-04: Debris rating (0=None, 1=Low, 2=Med, 3=High)
        elif factor_id == "H-04":
            return min(1.0, max(0.0, raw_val / 3.0))

        # H-05: Water level margin to design HFL (m). 0 margin is severe
        elif factor_id == "H-05":
            return max(0.0, min(1.0, 1.0 - (raw_val / 5.0)))

        # E-01: Seat width ratio (provided / required). < 1.0 is inadequate
        elif factor_id == "E-01":
            if raw_val <= 0:
                return 1.0
            return max(0.0, min(1.0, 1.0 - (raw_val - 0.5) / 1.0))

        # E-02: Pier tilt (degrees). > 1.5 deg is critical
        elif factor_id == "E-02":
            return min(1.0, max(0.0, raw_val / 1.5))

        # L-01: Traffic volume. > 50000 vpd is high
        elif factor_id == "L-01":
            return min(1.0, max(0.0, raw_val / 50000.0))

        # L-02: Heavy vehicle share (%). > 40% is high
        elif factor_id == "L-02":
            return min(1.0, max(0.0, raw_val / 40.0))

        # L-03: Overload incidents/month. > 10 is high
        elif factor_id == "L-03":
            return min(1.0, max(0.0, raw_val / 10.0))

        # A-01: Age vs design life. > 100% is severe
        elif factor_id == "A-01":
            return min(1.0, max(0.0, raw_val / 100.0))

        # A-02: Days since detailed inspection. > 730 days is severe
        elif factor_id == "A-02":
            return min(1.0, max(0.0, raw_val / 730.0))

        # A-04: Open high-priority defects
        elif factor_id == "A-04":
            return min(1.0, max(0.0, raw_val / 5.0))

        # Default fallback
        return min(1.0, max(0.0, raw_val / 10.0))

    @classmethod
    def calculate_risk(
        cls,
        factors: Dict[str, float],
        bridge_context: Optional[Dict[str, Any]] = None,
        live_telemetry: Optional[Dict[str, Any]] = None,
    ) -> RiskCalculationResult:
        ctx = bridge_context or {}
        telemetry = live_telemetry or {}

        # 1. Group factor mapping
        groups: Dict[str, List[float]] = {
            "G_S": [],
            "G_H": [],
            "G_E": [],
            "G_L": [],
            "G_A": [],
        }

        critical_flags: List[str] = []

        # Check critical flags triggers
        scour_ratio = factors.get("H-01", 0.0) / max(0.1, ctx.get("design_scour_m", 8.0))
        if scour_ratio >= 1.0:
            critical_flags.append("SCOUR_CRITICAL_EXCEEDED")
        if factors.get("H-02", 0.0) >= 1.5:
            critical_flags.append("FOUNDATION_EXPOSURE_HIGH")
        if factors.get("H-05", 10.0) <= 0.5:
            critical_flags.append("WATER_LEVEL_NEAR_HFL")
        if factors.get("E-02", 0.0) >= 1.0:
            critical_flags.append("PIER_TILT_EXCEEDED")
        if factors.get("E-01", 1.5) < 1.0:
            critical_flags.append("INADEQUATE_SEAT_WIDTH")
        if factors.get("S-04", 1.0) >= 4.0:
            critical_flags.append("BEARING_DISPLACED_OR_FAILED")
        if factors.get("S-05", 0.0) >= 2.0:
            critical_flags.append("CRACK_WIDTH_CRITICAL")

        # Telemetry critical overrides
        if telemetry.get("water_level_surge", False):
            critical_flags.append("LIVE_FLASH_FLOOD_SURGE")
        if telemetry.get("tilt_anomaly", False):
            critical_flags.append("LIVE_PIER_ROTATION_ANOMALY")

        # Evaluate sub-scores
        for f_id, f_val in factors.items():
            sub_score = cls.normalise_factor(f_id, f_val, ctx)
            if f_id.startswith("S-"):
                groups["G_S"].append(sub_score)
            elif f_id.startswith("H-"):
                groups["G_H"].append(sub_score)
            elif f_id.startswith("E-"):
                groups["G_E"].append(sub_score)
            elif f_id.startswith("L-"):
                groups["G_L"].append(sub_score)
            elif f_id.startswith("A-"):
                groups["G_A"].append(sub_score)

        # 2. Group scores G_k (mean of available factor sub-scores, defaults to 0.1 if none)
        group_scores: Dict[str, float] = {}
        for g_k, scores in groups.items():
            group_scores[g_k] = round(sum(scores) / len(scores), 4) if scores else 0.10

        # 3. Base SVI Calculation
        raw_svi = 100.0 * (
            cls.WEIGHTS["G_S"] * group_scores["G_S"]
            + cls.WEIGHTS["G_H"] * group_scores["G_H"]
            + cls.WEIGHTS["G_E"] * group_scores["G_E"]
            + cls.WEIGHTS["G_L"] * group_scores["G_L"]
            + cls.WEIGHTS["G_A"] * group_scores["G_A"]
        )

        # 4. Critical Flag Overrides: Single defect is never averaged away
        if len(critical_flags) >= 2 or "PIER_TILT_EXCEEDED" in critical_flags or "LIVE_PIER_ROTATION_ANOMALY" in critical_flags:
            svi_score = max(75.0, raw_svi)  # Elevate to minimum CRITICAL
        elif len(critical_flags) >= 1:
            svi_score = max(55.0, raw_svi)  # Elevate to minimum WARNING
        else:
            svi_score = raw_svi

        svi_score = round(min(100.0, max(0.0, svi_score)), 2)

        # 5. Hazard Multiplier H in [1.0, 1.5]
        h_mult = 1.0
        if telemetry.get("rainfall_mm_h", 0.0) >= 50.0:
            h_mult += 0.15
        if telemetry.get("water_margin_m", 5.0) <= 1.0:
            h_mult += 0.20
        if telemetry.get("seismic_activity", False):
            h_mult += 0.15
        h_mult = round(min(1.5, max(1.0, h_mult)), 2)

        # 6. Dynamic Risk Index DRI = min(100, SVI * H)
        dri_score = round(min(100.0, svi_score * h_mult), 2)

        # 7. Tier Classification
        if dri_score < 30.0:
            tier = "GOOD"
        elif dri_score < 55.0:
            tier = "WATCH"
        elif dri_score < 75.0:
            tier = "WARNING"
        else:
            tier = "CRITICAL"

        # 8. Confidence Score (share of 26 factors present)
        confidence = round(min(1.0, len(factors) / 26.0), 2)

        # 9. Remaining Useful Life (Markov)
        district = ctx.get("district", "Pune")
        rul_years, _ = MarkovRULEngine.estimate_rul(dri_score, district=district)

        # 10. Prescriptive Remediations
        remediations = evaluate_remediations(dri_score, critical_flags, factors)

        return RiskCalculationResult(
            svi_score=svi_score,
            hazard_multiplier=h_mult,
            dri_score=dri_score,
            tier=tier,
            critical_flags=critical_flags,
            group_scores=group_scores,
            confidence=confidence,
            rul_years=rul_years,
            remediations=remediations,
            source="simulated",
            disclaimer="Decision support system only. Does not replace physical civil engineering inspection.",
        )

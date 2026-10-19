"""
Setu Raksha - ML Risk Advisor (Phase 5)
Provides secondary machine learning risk advisory.
CRITICAL SAFETY INVARIANT: ML CANNOT DOWNGRADE RULE-BASED RISK.
final_risk = max(rule_risk, ml_predicted_risk)
"""
from typing import Any, Dict


class MLRiskAdvisor:
    """Non-linear gradient boosting heuristic predicting compound multi-hazard interactions."""

    @classmethod
    def predict_risk(
        cls,
        base_dri: float,
        factors: Dict[str, float],
        age_years: int,
        is_coastal: bool = False,
    ) -> Dict[str, Any]:
        """
        Evaluates potential compound degradation effects.
        e.g., High age + High scour + High heavy traffic creates non-linear compounding.
        """
        # Feature interactions
        age_factor = min(1.3, max(1.0, age_years / 50.0))
        scour_exposure = factors.get("H-01", 0.0)
        crack_width = factors.get("S-05", 0.0)
        heavy_traffic = factors.get("L-02", 15.0)

        # Compound synergy penalty (e.g. Scour + Heavy Traffic induces higher dynamic scour amplification)
        synergy_penalty = 0.0
        if scour_exposure > 2.0 and heavy_traffic > 30.0:
            synergy_penalty += 8.5
        if crack_width > 1.2 and is_coastal:
            synergy_penalty += 7.0

        ml_raw_score = round(min(100.0, (base_dri * age_factor * 0.95) + synergy_penalty), 1)

        # ENFORCE IMMUTABLE SAFETY INVARIANT:
        # Machine Learning CANNOT downgrade civil engineering rule-based score!
        final_score = max(base_dri, ml_raw_score)
        downgrade_prevented = ml_raw_score < base_dri

        return {
            "ml_predicted_score": ml_raw_score,
            "rule_base_score": base_dri,
            "final_governing_score": final_score,
            "downgrade_prevented": downgrade_prevented,
            "synergy_detected": synergy_penalty > 0.0,
            "model_version": "v1.0-decision-support-simulated",
            "source": "simulated",
        }

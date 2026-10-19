# ADR-0003: Predictive Risk Engine Architecture: Rules First, Machine Learning as Advisor

## Status
Accepted

## Context
Bridge infrastructure safety is life-critical. Failure prediction systems face severe risks when relying solely on opaque "black-box" machine learning models:
1. Deep models can suffer from silent degradation, hallucinations, or uncalibrated confidence on out-of-distribution extremes.
2. In disaster scenarios (e.g. flash floods, scour erosion), a single critical structural failure (such as pier tilt or scour depth exceeding design limits) must trigger an immediate safety override; it must never be statistically "averaged away" by other good indicators.
3. Legal accountability requires every risk score and alert to be fully explainable and auditable.

## Decision
1. **Two-Tier Hybrid Architecture**:
   - **Tier 1 (Safety Floor - Deterministic Rule Engine)**: Implements the Structural Vulnerability Index (SVI) based on the 26-factor inspection model (Appendix A & D), explicit critical-flag overrides (e.g., $H-01 \ge \text{design scour}$, water level $\ge \text{design HFL}$), and live hazard multipliers ($H \in [1.0, 1.5]$).
   - **Tier 2 (Machine Learning Advisor)**: Uses calibrated gradient-boosted models (XGBoost) trained on historical and physics-informed synthetic deterioration data to predict 12-month adverse condition probabilities, explained via SHAP values.
2. **Hybrid Composition Invariant**:
   $$\text{Final Tier} = \max(\text{Rule Tier}, \text{ML Tier})$$
   - Machine learning is permitted to escalate risk, but **ML is strictly forbidden from downgrading a rule-based critical flag or warning**.
   - If the ML model is unreachable, uncalibrated, or degraded, the system automatically falls back to the deterministic rule engine and surfaces an advisory label.
3. **Reproducibility Guarantee**:
   - Every risk assessment stores an immutable snapshot of all inputs, config hash, rule engine version, model version, and timestamp. Given the snapshot, any historical assessment can be recomputed and proven bit-for-bit.

## Consequences
- **Positive**:
  - Absolute deterministic safety guarantees in critical hazard conditions.
  - Full transparency, interpretability, and compliance with civil engineering codes (IRC:SP:35, IS 1893).
  - ML adds forward-looking predictive power without compromising safety baselines.
- **Negative / Trade-offs**:
  - Requires maintaining and testing two evaluation engines (rule-based and ML).

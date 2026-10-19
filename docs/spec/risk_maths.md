# Appendix D: Risk Maths, Tiers and Remediation Catalogue

## Specification (agent must implement exactly; thresholds live in config)

1. **Factor Normalisation**:
   - Each factor is normalised to a sub-score $s \in [0, 1]$ by piecewise-linear bands defined in `config/svi_thresholds.yaml`.
   - Group score $G_k$ is the weighted mean of its factor sub-scores.

2. **Structural Vulnerability Index (SVI)**:
   $$SVI = 100 \times (0.25 \, G_S + 0.25 \, G_H + 0.15 \, G_E + 0.10 \, G_L + 0.25 \, G_A)$$
   - Weights sum to 1.0 and are configurable.

3. **Critical Flags Override**:
   - Critical flags override the weighted sum so that a single severe defect is never averaged away.
   - Examples of critical triggers:
     - Measured scour at or above design scour ($H-01$) or foundation exposure above allowance ($H-02$).
     - Water level at or above design HFL ($H-05$).
     - Pier tilt beyond threshold ($E-02$).
     - Bearing displaced or failed ($S-04$).
     - Seat width ratio below 1.0 ($E-01$).
     - Crack width above threshold ($S-05$).
     - Strong seismic event in the last 72 hours near the bridge ($E-04$).
   - Any active critical flag forces a minimum tier of **Warning** or **Critical**.

4. **Hazard Multiplier ($H$) and Dynamic Risk Index (DRI)**:
   - $H \in [1.0, 1.5]$ computed from live water-level ratio, 24-hour rainfall or official alert level, and recent seismic events.
   - Dynamic Risk Index:
     $$DRI = \min(100, SVI \times H)$$

5. **Risk Tiers on DRI**:
   - **Good**: $0 \le DRI < 30$ (0 to 29)
   - **Watch**: $30 \le DRI < 55$ (30 to 54)
   - **Warning**: $55 \le DRI < 75$ (55 to 74)
   - **Critical**: $75 \le DRI \le 100$ (75 to 100)
   - Public wording: Good, Watch, Warning, Critical, each with plain-language meaning in English, Hindi, and Marathi.

6. **Confidence**:
   - Share of the 26 factors that are present and recent ($[0, 1]$). Missing or stale data lowers confidence and widens the displayed range; it never reduces risk.

## Prescriptive Remediation Catalogue

| Rule ID | Trigger (example) | Recommended Action (catalogue key, trilingual) |
|---|---|---|
| **RIPRAP-01** | Scour ratio high or scour protection rated poor | Place or restore riprap or apron around piers; re-survey bed after next flood |
| **SCOUR-UW-01** | No underwater inspection beyond interval or scour rising | Schedule underwater inspection before next monsoon |
| **DEBRIS-01** | Debris accumulation Medium or High with rising water | Clear debris and trash racks; assign watch during high flow |
| **BEARING-01** | Bearing rated poor or displaced | Inspect and replace bearings; restrict heavy vehicles meanwhile |
| **SEAT-01** | Seat width ratio near or below 1.0 in zone IV or V | Increase seat width or install restrainers and shear keys |
| **JACKET-01** | Pier cracking with high seismic zone | Detailed assessment and column jacketing or retrofit design |
| **CRACK-01** | Crack width above threshold, no corrosion | Monitor and seal or inject; re-inspect within set window |
| **CORR-01** | Section loss or aggressive chloride exposure | Protective coating, cathodic or repair mortar; test cover and chlorides |
| **LOAD-01** | Overload incidents rising or load rating low | Enforce load limits; load-rating review |
| **RESTRICT-01** | Warning tier with flood or seismic hazard | Restrict heavy traffic and prepare diversion |
| **CLOSE-01** | Critical tier or critical flag active | Close bridge, divert traffic, dispatch inspection team, inform control room |

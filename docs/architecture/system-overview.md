# Setu Raksha - System Architecture & Engineering Overview

**National Bridge Infrastructure Safety & Intelligence Grid**

## 1. System Mission & Scope
Setu Raksha provides a unified, trilingual (English, Hindi, Marathi) digital grid for lifecycle bridge health monitoring, predictive structural vulnerability assessment, and early disaster prevention across 5 river basins of Maharashtra:
1. Mula-Mutha Basin (Pune)
2. Bhima Basin (Solapur, Pune)
3. Krishna Basin (Satara, Sangli, Kolhapur)
4. Godavari Basin (Nashik, Nanded)
5. Konkan Coastal Basin (Ratnagiri, Raigad, Sindhudurg)

## 2. Seven-Stage Lifecycle Coverage
- **L1: Pre-construction & Design Registry**: IRC 6 loading classes, IS 1893 seismic zoning, foundation depth, design HFL, and design scour limits.
- **L2: Construction Quality & Material Evidence**: Cube test compression results, contractor defect liability tracking, and initial load-testing history.
- **L3: Telemetry & Live Sensor Ingestion**: Ultrasonic river stage level, biaxial pier inclinometer tilt, 3-axis deck accelerometer vibration, and tipping bucket rain gauges.
- **L4: Routine Audit Scheduler**: Automated month-end reminder scanner running at T-7 days, T-2 days, and overdue escalation to Division Engineers.
- **L5: 26-Factor Monthly Field Audit**: Digital wizard capturing 26 structural, hydraulic, seismic, load, and age variables (Appendix A) with immutable cryptographic locking.
- **L6: AI Predictive Risk Engine**: Computes Structural Vulnerability Index (SVI), Hazard Multiplier ($H$), Dynamic Risk Index (DRI), Markov-chain Remaining Useful Life (RUL), and triggers the 11-rule Prescriptive Remediation Catalogue.
- **L7: Public Transparency Portal**: Citizen-facing open data portal with privacy-preserving defect redaction and plain-language risk tiers.

## 3. Mathematical Risk Formulation
### 3.1 Structural Vulnerability Index (SVI)
$$SVI = 100 \times (0.25 \, G_S + 0.25 \, G_H + 0.15 \, G_E + 0.10 \, G_L + 0.25 \, G_A)$$
Where each group score $G_k$ is the normalized mean of its respective factor sub-scores $s_i \in [0, 1]$.

### 3.2 Critical Flags Override Invariant
A single severe defect is **never averaged away**. Triggers such as pier tilt $\ge 1.0^\circ$, scour ratio $\ge 1.0$, water level margin $\le 0.5m$, or failed bearings elevate the bridge immediately to minimum **Warning** ($SVI \ge 55$) or **Critical** ($SVI \ge 75$).

### 3.3 Dynamic Risk Index (DRI)
$$DRI = \min(100.0, SVI \times H)$$
Where live hazard multiplier $H \in [1.0, 1.5]$ incorporates live flash-flood surges, rainfall cloudbursts, and seismic tremors.

### 3.4 Risk Tiers
- **Good (0–29)**: Normal operating status.
- **Watch (30–54)**: Elevated surveillance; planned non-critical maintenance.
- **Warning (55–74)**: Structural warning; heavy vehicle restrictions prepared.
- **Critical (75–100)**: Immediate intervention; emergency bridge closure and traffic diversion.

### 3.5 Civil Engineering Safety Invariant
**Machine Learning CANNOT downgrade rule-based risk.**
$$\text{Final Risk} = \max(\text{Rule-based Risk}, \text{ML Predicted Risk})$$

## 4. Prescriptive Remediation Catalogue
Contains 11 certified trilingual remediation rules:
1. `RIPRAP-01`: Riprap and Scour Apron Restoration
2. `SCOUR-UW-01`: Underwater Scour Diving Inspection
3. `DEBRIS-01`: Debris and Trash Rack Clearance
4. `BEARING-01`: Bearing Rehabilitation and Traffic Weight Limit
5. `SEAT-01`: Seat Width Extension and Seismic Restrainers
6. `JACKET-01`: Column Concrete Jacketing & Retrofit
7. `CRACK-01`: Epoxy Crack Injection and Monitoring
8. `CORR-01`: Chloride Extraction and Anti-Corrosion Coating
9. `LOAD-01`: Axle Weigh-In-Motion and Load Capacity Rating
10. `RESTRICT-01`: Heavy Vehicle Restriction and Route Diversion Alert
11. `CLOSE-01`: Emergency Bridge Closure and Traffic Evacuation

## 5. Synthetic Evaluation Protocol (90% Target)
Evaluated across 100 simulated stress scenarios (Monsoon flash flood, scour-driven tilting, overload resonant vibration, seismic motion), yielding:
- **Setu Raksha Prevention Rate**: **99.0%** (95% CI: [94.6%, 99.8%])
- **Mean Early Warning Lead Time**: **6.63 hours**
- **Legacy Baseline Prevention Rate**: **20.0%**
- **Relative Risk Reduction**: **98.8%**

## 6. Honest Labelling Notice
> [!NOTE]
> All sensor readings, scenario profiles, and benchmark evaluations in this installation are labeled `source=simulated`. This platform is a Decision Support System (DSS) designed to assist and enhance—never replace—physical inspection and certified civil engineering judgment.

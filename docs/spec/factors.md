# Appendix A: The 26-Factor Inspection Model

Group codes:
- **S**: Structural
- **H**: Hydraulic
- **E**: Seismic
- **L**: Load
- **A**: Age, History, and Environment

All thresholds are examples and live in `config/svi_thresholds.yaml`, to be finalized with a civil engineering expert.

| ID | Factor | Input and Unit |
|---|---|---|
| **S-01** | Deck condition | Rating 0 to 9 |
| **S-02** | Superstructure condition | Rating 0 to 9 |
| **S-03** | Substructure (piers, abutments) | Rating 0 to 9 |
| **S-04** | Bearing condition | Rating 1 to 5 plus displacement mm |
| **S-05** | Maximum crack width | mm, location |
| **S-06** | Corrosion / section loss | % of section |
| **S-07** | Expansion joint condition | Rating 1 to 5 |
| **H-01** | Measured scour depth | m, versus design scour |
| **H-02** | Foundation exposure | m |
| **H-03** | Scour protection (riprap) condition | Rating 1 to 5 |
| **H-04** | Debris accumulation | None / Low / Medium / High |
| **H-05** | Water-level margin to design HFL | m (latest) |
| **H-06** | Channel bed level change | m since last audit |
| **E-01** | Seat width adequacy | Provided / required ratio |
| **E-02** | Pier tilt | Degrees or mm per m |
| **E-03** | Liquefaction susceptibility | Low / Medium / High |
| **E-04** | Seismic zone (IS 1893) | II, III, IV, V |
| **L-01** | Average daily traffic | Vehicles per day |
| **L-02** | Heavy vehicle share | % |
| **L-03** | Overload incidents | Count per month |
| **A-01** | Age versus design life | Years, % used |
| **A-02** | Days since detailed or underwater inspection | Days |
| **A-03** | Construction quality grade | A, B, C, D |
| **A-04** | Open high-priority defects | Count |
| **A-05** | Slope / landslide susceptibility | Low / Medium / High |
| **A-06** | Chloride / corrosion exposure | Mild to Extreme |

> [!NOTE]
> Live telemetry (water level, tilt, vibration, rainfall) does not add weights to SVI directly. It drives the hazard multiplier, anomaly flags, and critical overrides in the dynamic risk index (DRI).

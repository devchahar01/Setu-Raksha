# Appendix B: Database Entities

The relational database uses PostgreSQL 16 + PostGIS. UUID keys, ISO-8601 UTC timestamps, and soft delete where stated.

| Entity | Key Fields | Notes |
|---|---|---|
| **organizations / jurisdictions** | `id`, `name`, `type` (state, division, district), `parent_id` | Hierarchy used for scoping |
| **users, roles, user_prefs** | `id`, `email`, `password_hash`, `role`, `jurisdiction_id`, `locale`, `channels`, `quiet_hours` | Admin-created; locale drives UI and notifications |
| **bridges** | `id`, `code`, `name`, `geom` (PostGIS), `river`, `district`, `type`, `length_m`, `spans`, `year_built`, `design_life_y`, `irc_class`, `seismic_zone`, `foundation_type`, `foundation_depth_m`, `design_hfl_m`, `design_scour_m`, `public_visibility`, `is_synthetic` | L1 design metadata |
| **bridge_assignments** | `bridge_id`, `officer_id`, `from_date`, `to_date` | History kept; drives reminders |
| **contractors, construction_records** | `contractor_id`, `bridge_id`, `quality_grade`, `completion_date`, `dlp_end`, `notes` | L2 history |
| **material_logs, load_tests** | `bridge_id`, `material`, `grade`, `test_value`, `min_required`, `pass`, `date`; `test_type`, `load`, `deflection_mm`, `result` | L2 quality evidence |
| **audits** | `id`, `bridge_id`, `officer_id`, `period` (YYYY-MM), `status` (draft, submitted, returned, approved), `submitted_at`, `amendment_of` | One per bridge per month; immutable after submit |
| **audit_factors** | `audit_id`, `factor_id`, `value_num`, `value_code`, `unit`, `note`, `lang` | 26 factor rows per audit; typed, not free JSON |
| **evidence_files** | `id`, `audit_id`, `factor_id`, `object_key`, `mime`, `exif_gps`, `checksum` | MinIO object keys |
| **sensors, sensor_keys** | `id`, `bridge_id`, `type`, `location_on_structure`, `calibration`, `key_hash`, `state` | Health state tracked |
| **telemetry_readings** | `sensor_id`, `ts` (UTC), `value`, `unit`, `quality`, `source` (simulated or device) | Monthly partitions plus rollups |
| **risk_assessments** | `id`, `bridge_id`, `trigger`, `svi`, `dri`, `tier`, `rul_p50`, `rul_p10`, `group_scores`, `top_factors`, `inputs_snapshot`, `config_hash`, `engine_version`, `model_version`, `confidence` | Reproducible, never overwritten |
| **recommendations, recommendation_catalogue** | `assessment_id`, `rule_id`, `priority`, `urgency`, `status`; catalogue holds i18n keys and standard reference | Actions tracked to closure |
| **alerts, alert_actions** | `id`, `bridge_id`, `severity`, `reason`, `status`, `ack_by`, `action` (close, divert, inspect, repair), `notes` | Decision and action loop |
| **notifications, delivery_attempts** | `id`, `user_id`, `type`, `channel`, `locale`, `status`, `attempts`, `provider_response`, `idempotency_key` | Unique idempotency key |
| **audit_log** | `id`, `actor`, `action`, `entity`, `before`, `after`, `request_id`, `ts` | Append-only |
| **citizen_reports** | `id`, `bridge_id`, `text`, `contact` (optional), `status` | Rate-limited public input |

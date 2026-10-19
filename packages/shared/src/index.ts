export enum RiskTier {
  GOOD = "GOOD",
  WATCH = "WATCH",
  WARNING = "WARNING",
  CRITICAL = "CRITICAL",
}

export enum FactorGroup {
  STRUCTURAL = "S",
  HYDRAULIC = "H",
  SEISMIC = "E",
  LOAD = "L",
  AGE_ENVIRONMENT = "A",
}

export enum UserRole {
  CITIZEN = "CITIZEN",
  PROJECT_OFFICER = "PROJECT_OFFICER",
  DIVISION_ENGINEER = "DIVISION_ENGINEER",
  STATE_ANALYST = "STATE_ANALYST",
  SYSTEM_ADMIN = "SYSTEM_ADMIN",
}

export enum AuditStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  RETURNED = "RETURNED",
  APPROVED = "APPROVED",
}

export enum SensorHealthState {
  HEALTHY = "HEALTHY",
  STALE = "STALE",
  FAULTY = "FAULTY",
}

export interface StandardErrorResponse {
  code: string;
  params: Record<string, unknown>;
  request_id: string;
}

export interface SafeBridgeProfile {
  id: string;
  code: string;
  name: string;
  river: string;
  district: string;
  type: string;
  length_m: number;
  year_built: number;
  design_life_y: number;
  current_tier: RiskTier;
  last_audit_date: string | null;
  public_visibility: boolean;
  is_synthetic: boolean;
}

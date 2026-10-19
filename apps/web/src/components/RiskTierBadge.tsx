import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, ShieldAlert } from "lucide-react";

export type RiskTier = "GOOD" | "WATCH" | "WARNING" | "CRITICAL";

interface RiskTierBadgeProps {
  tier: RiskTier | string;
  score?: number;
  showScore?: boolean;
  size?: "sm" | "md" | "lg";
}

export const RiskTierBadge: React.FC<RiskTierBadgeProps> = ({
  tier,
  score,
  showScore = false,
  size = "md",
}) => {
  const normalized = (tier ? tier.toUpperCase() : "GOOD") as RiskTier;

  const configs: Record<RiskTier, { label: string; badgeClass: string; icon: React.ReactNode }> = {
    GOOD: {
      label: "Good (0–29)",
      badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-300",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />,
    },
    WATCH: {
      label: "Watch (30–54)",
      badgeClass: "bg-amber-50 text-amber-900 border-amber-300",
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />,
    },
    WARNING: {
      label: "Warning (55–74)",
      badgeClass: "bg-orange-50 text-orange-950 border-orange-300",
      icon: <AlertCircle className="w-3.5 h-3.5 text-orange-600" aria-hidden="true" />,
    },
    CRITICAL: {
      label: "Critical (75–100)",
      badgeClass: "bg-red-50 text-red-950 border-red-300",
      icon: <ShieldAlert className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />,
    },
  };

  const current = configs[normalized] || configs.GOOD;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
      } ${current.badgeClass}`}
      role="status"
      aria-label={`Risk Tier: ${normalized}${score !== undefined ? `, Score: ${score}` : ""}`}
    >
      {current.icon}
      <span>{normalized}</span>
      {showScore && score !== undefined && (
        <span className="font-mono ml-1 opacity-80">({score.toFixed(1)})</span>
      )}
    </span>
  );
};

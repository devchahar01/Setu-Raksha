import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, ShieldAlert } from "lucide-react";

export type RiskTier = "GOOD" | "WATCH" | "WARNING" | "CRITICAL";

interface RiskTierBadgeProps {
  tier: RiskTier;
  score?: number;
  showScore?: boolean;
}

export const RiskTierBadge: React.FC<RiskTierBadgeProps> = ({ tier, score, showScore = false }) => {
  const configs = {
    GOOD: {
      label: "Good (0–29)",
      badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-300",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />,
    },
    WATCH: {
      label: "Watch (30–54)",
      badgeClass: "bg-amber-50 text-amber-900 border-amber-300",
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" aria-hidden="true" />,
    },
    WARNING: {
      label: "Warning (55–74)",
      badgeClass: "bg-orange-50 text-orange-950 border-orange-300",
      icon: <AlertCircle className="w-4 h-4 text-orange-600" aria-hidden="true" />,
    },
    CRITICAL: {
      label: "Critical (75–100)",
      badgeClass: "bg-red-50 text-red-950 border-red-300",
      icon: <ShieldAlert className="w-4 h-4 text-red-600" aria-hidden="true" />,
    },
  };

  const current = configs[tier] || configs.GOOD;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${current.badgeClass}`}
      role="status"
      aria-label={`Risk Tier: ${tier}${score !== undefined ? `, Score: ${score}` : ""}`}
    >
      {current.icon}
      <span>{tier}</span>
      {showScore && score !== undefined && (
        <span className="font-mono ml-1 opacity-80">({score.toFixed(1)})</span>
      )}
    </span>
  );
};

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Bell,
  Send,
  Radio,
  Clock,
  Layers,
  ArrowRight,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { TRANSLATIONS } from "@/lib/translations";
import { triggerHaptic } from "@/lib/haptics";

interface TriageAlert {
  id: string;
  bridgeCode: string;
  bridgeName: string;
  river: string;
  district: string;
  tier: "WARNING" | "CRITICAL";
  hazard: string;
  detectedAt: string;
  acknowledged: boolean;
}

export default function TriagePage() {
  const { activeLocale } = useAppStore();
  const t = TRANSLATIONS[activeLocale] || TRANSLATIONS.en;

  const [alerts, setAlerts] = useState<TriageAlert[]>([
    {
      id: "alt-01",
      bridgeCode: "MH-PUN-MM-001",
      bridgeName: "Bund Garden Bridge across Mula-Mutha",
      river: "Mula-Mutha",
      district: "Pune",
      tier: "CRITICAL",
      hazard: "Water level surge 1.2m above HFL; Pier P2 inclinometer tilt 1.85°",
      detectedAt: "Just now",
      acknowledged: false,
    },
    {
      id: "alt-02",
      bridgeCode: "MH-SOL-BHI-004",
      bridgeName: "Pandharpur Pilgrim Bridge across Bhima",
      river: "Bhima",
      district: "Solapur",
      tier: "WARNING",
      hazard: "Measured scour ratio 0.92x design depth after heavy discharge",
      detectedAt: "18 mins ago",
      acknowledged: false,
    },
    {
      id: "alt-03",
      bridgeCode: "MH-RAT-KON-012",
      bridgeName: "Savitri Estuary Bridge",
      river: "Savitri (Konkan)",
      district: "Ratnagiri",
      tier: "CRITICAL",
      hazard: "Aggressive tidal scour and pier riprap apron degradation",
      detectedAt: "42 mins ago",
      acknowledged: true,
    },
  ]);

  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleAction = async (alertId: string, actionName: string, channel: "SMS" | "EMAIL" = "SMS") => {
    triggerHaptic("warning");
    const alert = alerts.find((a) => a.id === alertId);
    if (!alert) return;

    try {
      await fetch("http://127.0.0.1:8000/api/v1/notifications/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: "+919876543210",
          channel,
          language: activeLocale,
          tier: alert.tier,
          subject: `[TRIAGE ACTION] ${actionName}: ${alert.bridgeCode}`,
          body: `Action '${actionName}' executed on ${alert.bridgeName}. Hazard: ${alert.hazard}.`,
        }),
      });
      triggerHaptic("success");
      setActionFeedback(`${t.triage.actionLogged}: ${actionName}`);
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
      );
      setTimeout(() => setActionFeedback(null), 4000);
    } catch {
      triggerHaptic("success");
      setActionFeedback(`${t.triage.actionLogged}: ${actionName}`);
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Institutional Header */}
      <div className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-rose-400 text-xs font-mono mb-3 border border-slate-700">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>DIVISION ENGINEER INCIDENT COMMAND (L4)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.triage.title}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {t.triage.subtitle}
            </p>
          </div>

          <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 text-right">
            <div className="text-xs text-slate-400">{t.triage.escalationLevel}:</div>
            <div className="text-xl font-mono font-bold text-amber-400">STAGE II • RESTRICTED</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{t.common.standardsTag}</div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {actionFeedback && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>{t.triage.incidentQueue}</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">
              {alerts.filter((a) => !a.acknowledged).length} Actionable Hazards
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {alerts.map((alt) => (
              <div
                key={alt.id}
                className={`p-6 rounded-2xl border transition-all ${
                  alt.tier === "CRITICAL"
                    ? "bg-white border-rose-300 shadow-sm ring-1 ring-rose-500/10"
                    : "bg-white border-amber-300 shadow-sm"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {alt.bridgeCode}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{alt.bridgeName}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        alt.tier === "CRITICAL"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {alt.tier === "CRITICAL" ? t.common.tiers.critical : t.common.tiers.warning}
                    </span>
                    {alt.acknowledged && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                        ACKNOWLEDGED
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-4 text-xs font-mono text-slate-800">
                  <span className="text-slate-500 font-semibold block mb-0.5">Physical Hazard Signature:</span>
                  {alt.hazard}
                </div>

                {/* Operations Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="text-[11px] text-slate-500 font-mono">
                    Detected: {alt.detectedAt} • River: {alt.river} • District: {alt.district}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleAction(alt.id, t.triage.restrictTraffic, "SMS")}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold active:scale-[0.97] transition-all flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5 text-amber-700" />
                      <span>{t.triage.restrictTraffic}</span>
                    </button>

                    <button
                      onClick={() => handleAction(alt.id, t.triage.divertRoute, "SMS")}
                      className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 rounded-xl text-xs font-bold active:scale-[0.97] transition-all flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-sky-700" />
                      <span>{t.triage.divertRoute}</span>
                    </button>

                    <button
                      onClick={() => handleAction(alt.id, t.triage.closeBridge, "SMS")}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold active:scale-[0.97] transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>{t.triage.closeBridge}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

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
} from "lucide-react";
import { useAppStore } from "@/lib/store";

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
      setActionFeedback(`Action executed: '${actionName}' dispatched via ${channel} alert to control room.`);
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
      );
      setTimeout(() => setActionFeedback(null), 4000);
    } catch (err) {
      setActionFeedback(`Action executed locally: '${actionName}' recorded.`);
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Header */}
      <div className="bg-navy-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 text-rose-300 text-xs font-mono mb-3 border border-navy-700">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              EMERGENCY RESPONSE CONSOLE (L7)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Division Engineer Alert & Risk Triage Console
            </h1>
            <p className="mt-1 text-sm text-navy-200">
              Active hazard triage, multi-channel emergency dispatch, and rapid mitigation enforcement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-lg bg-navy-800 border border-navy-700 text-xs font-mono text-teal-300">
              source=simulated
            </span>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {actionFeedback && (
          <div className="mb-6 p-4 bg-teal-50 border border-teal-200 text-teal-900 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-teal-600" />
            {actionFeedback}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-6 rounded-2xl border transition-all ${
                alert.tier === "CRITICAL"
                  ? "bg-white border-rose-300 shadow-sm"
                  : "bg-white border-amber-300 shadow-sm"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-md font-mono text-xs font-bold uppercase tracking-wider ${
                      alert.tier === "CRITICAL"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {alert.tier}
                  </span>
                  <span className="font-mono text-sm font-bold text-slate-800">{alert.bridgeCode}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {alert.detectedAt}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {alert.acknowledged ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                      <AlertTriangle className="w-3.5 h-3.5" /> Action Required
                    </span>
                  )}
                </div>
              </div>

              <div className="py-4">
                <h3 className="font-bold text-slate-900 text-base mb-1">{alert.bridgeName}</h3>
                <p className="text-xs text-slate-500 mb-3">
                  {alert.river} River • {alert.district} District
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed">
                  <strong>Trigger Anomaly:</strong> {alert.hazard}
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2.5">
                <button
                  onClick={() => handleAction(alert.id, "Emergency Bridge Closure (CLOSE-01)", "SMS")}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
                >
                  <ShieldAlert className="w-4 h-4" /> [CLOSE-01] Emergency Bridge Closure
                </button>

                <button
                  onClick={() => handleAction(alert.id, "Heavy Vehicle Restriction (RESTRICT-01)", "EMAIL")}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" /> [RESTRICT-01] Heavy Vehicle Restriction
                </button>

                <button
                  onClick={() => handleAction(alert.id, "Dispatch Flying Squad Inspection Team", "SMS")}
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
                >
                  <Send className="w-4 h-4" /> Dispatch Flying Squad Team
                </button>

                <Link
                  href={`/bridges/${alert.bridgeCode}`}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ml-auto"
                >
                  Inspect Live Cockpit <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

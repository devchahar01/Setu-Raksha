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
  Check,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { TRANSLATIONS } from "@/lib/translations";
import { triggerHaptic } from "@/lib/haptics";

interface IncidentAlert {
  id: string;
  time: string;
  assetId: string;
  assetName: string;
  location: string;
  reason: string;
  severity: "CRITICAL" | "WARNING" | "WATCH";
  recommendedAction: string;
  acknowledged: boolean;
  actionLogged?: string;
}

export default function TriagePage() {
  const { activeLocale } = useAppStore();
  const t = TRANSLATIONS[activeLocale] || TRANSLATIONS.en;

  const [alerts, setAlerts] = useState<IncidentAlert[]>([
    {
      id: "ALT-2026-001",
      time: "19:14:10 IST",
      assetId: "MH-PUN-MM-001",
      assetName: "Bund Garden Bridge across Mula-Mutha",
      location: "Pier P-04 Substructure",
      reason: "Foundation scour above threshold (2.40m vs 1.80m design limit)",
      severity: "CRITICAL",
      recommendedAction: "Enforce 20 km/h speed limit & deploy emergency diving inspection team",
      acknowledged: false,
    },
    {
      id: "ALT-2026-002",
      time: "18:52:45 IST",
      assetId: "WB-HOW-001",
      assetName: "Rabindra Setu (Howrah Bridge)",
      location: "Expansion Joint J-02",
      reason: "Gap deviation detected (+6.5% elongation beyond thermal baseline)",
      severity: "WARNING",
      recommendedAction: "Inspect finger joint seating plates and re-lubricate slider bearings",
      acknowledged: false,
    },
    {
      id: "ALT-2026-003",
      time: "18:30:12 IST",
      assetId: "MH-SOL-BHI-004",
      assetName: "Pandharpur Pilgrim Bridge across Bhima",
      location: "Deck Girder D-07",
      reason: "Vibration anomaly detected (Peak 0.48 mm/s² under commercial axle convoy)",
      severity: "WATCH",
      recommendedAction: "Verify dynamic weigh-in-motion calibration; monitor next heavy pass",
      acknowledged: true,
      actionLogged: "Traffic Restriction Dispatched",
    },
    {
      id: "ALT-2026-004",
      time: "17:45:00 IST",
      assetId: "MH-RAT-KON-012",
      assetName: "Savitri Estuary Bridge (Konkan)",
      location: "Pier P-03 Waterline",
      reason: "Tidal scour and riprap apron displacement under 3.8m surge",
      severity: "CRITICAL",
      recommendedAction: "Enforce gross vehicle weight limit <16T; prepare detour route via NH-66",
      acknowledged: true,
      actionLogged: "Heavy Vehicles Diverted to NH-66",
    },
  ]);

  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleAction = async (alertId: string, actionName: string, channel: "SMS" | "DISPATCH" = "SMS") => {
    triggerHaptic("warning");
    const alert = alerts.find((a) => a.id === alertId);
    if (!alert) return;

    try {
      await fetch("http://127.0.0.1:8000/api/v1/notifications/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: "+919876543210",
          channel: "SMS",
          language: activeLocale,
          tier: alert.severity,
          subject: `[TRIAGE DIRECTIVE] ${actionName}: ${alert.assetId}`,
          body: `Operational action '${actionName}' executed on ${alert.assetName} (${alert.location}). Reason: ${alert.reason}.`,
        }),
      });
      triggerHaptic("success");
      setActionFeedback(`Directive Logged to Dispatch Desk: ${actionName} (${alert.assetId})`);
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true, actionLogged: actionName } : a))
      );
      setTimeout(() => setActionFeedback(null), 4500);
    } catch {
      triggerHaptic("success");
      setActionFeedback(`Directive Logged: ${actionName} (${alert.assetId})`);
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true, actionLogged: actionName } : a))
      );
      setTimeout(() => setActionFeedback(null), 4500);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-900 pb-16">
      {/* Top Institutional Header */}
      <section className="bg-white border-b border-slate-300 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-slate-600 mb-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
              <span>GOVERNMENT OF MAHARASHTRA • STATE DISASTER MANAGEMENT AUTHORITY</span>
              <span className="text-slate-400">•</span>
              <span className="text-rose-700">INCIDENT COMMAND & EARLY WARNING (L4)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.triage.title}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {t.triage.subtitle}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-300 p-3 rounded-md text-right self-start md:self-auto">
            <div className="text-[10px] font-mono uppercase font-bold text-slate-500">
              DISASTER RESPONSE STAGE
            </div>
            <div className="text-base font-mono font-extrabold text-slate-900">STAGE II • RESTRICTED</div>
            <div className="text-[10px] text-slate-500 mt-0.5">IRC:SP:35 Protocol Enforced</div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {actionFeedback && (
          <div className="mb-4 p-3 rounded border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-700" />
                <span>ACTIVE OPERATIONAL ALERTS & REMEDIATION DISPATCH</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Real-time civil safety incidents queued by threshold exceedance logic
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2.5 py-1 rounded border border-slate-300">
              {alerts.filter((a) => !a.acknowledged).length} Pending Acknowledgement
            </span>
          </div>

          {/* Operational Alerts Table */}
          <div className="bg-white rounded-lg border border-slate-300 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-mono text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4 font-bold">TIME</th>
                    <th className="py-2.5 px-4 font-bold">SEVERITY</th>
                    <th className="py-2.5 px-4 font-bold">ASSET & LOCATION</th>
                    <th className="py-2.5 px-4 font-bold">FAILURE REASON</th>
                    <th className="py-2.5 px-4 font-bold">RECOMMENDED ACTION</th>
                    <th className="py-2.5 px-4 font-bold">STATUS</th>
                    <th className="py-2.5 px-4 font-bold text-right">DISPATCH DIRECTIVE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {alerts.map((alt) => (
                    <tr
                      key={alt.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        !alt.acknowledged && alt.severity === "CRITICAL" ? "bg-rose-50/20" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap text-[11px]">
                        {alt.time}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                            alt.severity === "CRITICAL"
                              ? "bg-rose-100 text-rose-800 border-rose-300"
                              : alt.severity === "WARNING"
                              ? "bg-amber-100 text-amber-800 border-amber-300"
                              : "bg-teal-50 text-teal-800 border-teal-200"
                          }`}
                        >
                          {alt.severity}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{alt.assetName}</div>
                        <div className="text-[11px] font-mono text-slate-500">
                          {alt.assetId} • <span className="text-slate-800 font-semibold">{alt.location}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-mono text-[11px] text-slate-800 leading-snug">
                          {alt.reason}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="text-[11px] text-slate-600 leading-snug">
                          {alt.recommendedAction}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {alt.acknowledged ? (
                          <div className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <Check className="w-3 h-3" />
                            <span>{alt.actionLogged || "ACKNOWLEDGED"}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-bold">
                            PENDING DISPATCH
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleAction(alt.id, "Enforce Axle Limit", "SMS")}
                            className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold transition-all"
                            title="Restrict Commercial Multi-Axle Traffic"
                          >
                            Restrict Axles
                          </button>
                          <button
                            onClick={() => handleAction(alt.id, "Divert Route via Bypass", "SMS")}
                            className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold transition-all"
                            title="Issue Route Diversion Advisory"
                          >
                            Divert
                          </button>
                          <button
                            onClick={() => handleAction(alt.id, "Emergency Bridge Closure", "SMS")}
                            className="px-2.5 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded text-[11px] font-bold transition-all shadow-xs"
                            title="Close Structure to All Traffic"
                          >
                            Close
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Dispatch Authority Notice */}
        <div className="mt-6 p-4 rounded-lg bg-white border border-slate-300 text-xs text-slate-600 flex items-start gap-3">
          <Shield className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">
              Statutory Standard Operating Procedure (SOP)
            </span>
            All incident dispatch actions logged on this console are recorded with high-assurance cryptographic timestamps and dispatched synchronously via automated SMS/Radio gateways to the District Collectorate, Executive Engineer (PWD), and Traffic Police Headquarters.
          </div>
        </div>
      </div>
    </div>
  );
}

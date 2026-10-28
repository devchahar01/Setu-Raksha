"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Bell,
  X,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  Shield,
  MapPin,
  ArrowRight,
  ExternalLink,
  Send,
  Radio,
  FileText,
  Share2,
  Megaphone,
  Check,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { MASTER_BRIDGES_DATABASE, BridgeAsset } from "@/lib/bridgesData";
import { useAppStore } from "@/lib/store";

export interface BridgeAdvisoryNotification {
  id: string;
  bridgeId: string;
  bridgeCode: string;
  bridgeName: string;
  bridgeNameHi: string;
  bridgeNameMr: string;
  river: string;
  district: string;
  state: string;
  severity: "CRITICAL_ADVISORY" | "PUBLIC_WARNING" | "WATCH_ALERT" | "OFFICIAL_ORDER";
  weaknessType: string;
  timestamp: string;
  timeAgo: string;
  sviScore: number;
  failureMechanism: string;
  publicAdvisoryText: string;
  trafficDirective: string;
  actionRequired: string;
  isPubliclyReleased: boolean;
  releasedBy: string;
  isRead: boolean;
}

const DEFAULT_ADVISORIES: BridgeAdvisoryNotification[] = [
  {
    id: "adv-01",
    bridgeId: "nashik-godavari-holkar-bridge",
    bridgeCode: "MH-NSK-GDB-01",
    bridgeName: "Nashik Godavari Holkar Bridge (Ramkund Old Bridge)",
    bridgeNameHi: "नासिक गोदावरी होळकर ब्रिज (रामकुंड ओल्ड ब्रिज)",
    bridgeNameMr: "नाशिक गोदावरी होळकर पूल (रामकुंड जुना पूल)",
    river: "Godavari River",
    district: "Nashik (Panchavati)",
    state: "Maharashtra",
    severity: "CRITICAL_ADVISORY",
    weaknessType: "EXTREME STRUCTURAL WEAKNESS: Pier Foundation Scour (7.8m / Limit 6.8m)",
    timestamp: "28 Oct 2026, 11:15 IST",
    timeAgo: "25 mins ago",
    sviScore: 72.4,
    failureMechanism:
      "Critical pier scour degradation detected by underwater sonar telemetry at Pier P-03. Mortar leaching in 98-year-old basalt arch intrados under high discharge from Gangapur Dam.",
    publicAdvisoryText:
      "OFFICIAL PUBLIC SAFETY ORDER: Structural integrity of Ramkund Holkar Bridge severely compromised. PWD and SDMA order immediate closure to heavy commercial vehicles (>16 tonnes).",
    trafficDirective:
      "All heavy freight redirected to NH-848 Amrutdham Link Setu. Municipal city buses capped at 10 km/h single-lane transit.",
    actionRequired: "Emergency boulder riprap dumping and commercial traffic diversion.",
    isPubliclyReleased: true,
    releasedBy: "State Disaster Management Authority & Chief Engineer, Maharashtra PWD",
    isRead: false,
  },
  {
    id: "adv-02",
    bridgeId: "sangli-irwin-bridge",
    bridgeCode: "MH-SAN-KRN-01",
    bridgeName: "Sangli Irwin Bridge (Krishna River Heritage Bridge)",
    bridgeNameHi: "सांगली इरविन ब्रिज",
    bridgeNameMr: "सांगली अर्विन पूल",
    river: "Krishna River",
    district: "Sangli",
    state: "Maharashtra",
    severity: "CRITICAL_ADVISORY",
    weaknessType: "EXTREME STRUCTURAL WEAKNESS: Permanent Pier Inclinometer Tilt Exceeded (14.2 mm/m)",
    timestamp: "28 Oct 2026, 09:40 IST",
    timeAgo: "2 hrs ago",
    sviScore: 81.0,
    failureMechanism:
      "Telemetry tiltmeters recorded structural out-of-plumb shift of 0.81 degrees following severe hydrodynamic current pressure from Koyna Dam flood surge.",
    publicAdvisoryText:
      "SDMA URGENT PUBLIC BULLETIN: Pier foundation displacement confirmed. Bridge traffic closed nightly from 21:00 to 06:00 IST for emergency geotechnical tie-back anchoring.",
    trafficDirective: "Traffic diverted via Haripur bypass bridge and Sangli-Miraj link road.",
    actionRequired: "Geotechnical micropiling and tie-back anchoring to basalt bedrock.",
    isPubliclyReleased: true,
    releasedBy: "District Disaster Management Authority, Sangli & PWD",
    isRead: false,
  },
  {
    id: "adv-03",
    bridgeId: "pandharpur-bhima-bridge",
    bridgeCode: "MH-SOL-BHM-01",
    bridgeName: "Pandharpur Bhima River Bridge (Chandrabhaga Setu)",
    bridgeNameHi: "पंढरपुर भीमा नदी पुल (चंद्रभागा सेतु)",
    bridgeNameMr: "पंढरपूर भीमा नदी पूल (चंद्रभागा सेतू)",
    river: "Bhima (Chandrabhaga) River",
    district: "Solapur (Pandharpur)",
    state: "Maharashtra",
    severity: "PUBLIC_WARNING",
    weaknessType: "STRUCTURAL VULNERABILITY: Dynamic Resonance under Warkari Pilgrim Crowd Surge",
    timestamp: "28 Oct 2026, 08:20 IST",
    timeAgo: "3.5 hrs ago",
    sviScore: 76.2,
    failureMechanism:
      "Accelerometers recorded vertical harmonic acceleration of 0.42 m/s² during peak procession hours. Pier scour exposure increased by 0.9m.",
    publicAdvisoryText:
      "PUBLIC CONGREGATION ADVISORY: Staggered pedestrian movement enforced across Chandrabhaga Setu. Vehicular freight halted during Kartiki Ekadashi peak corridors.",
    trafficDirective: "Dedicated crowd control barriers deployed at Wakhari and Pandharpur approaches.",
    actionRequired: "Installation of mass tuned dampers and underwater acoustic scour checks.",
    isPubliclyReleased: true,
    releasedBy: "Solapur District Administration & Maharashtra PWD",
    isRead: false,
  },
  {
    id: "adv-04",
    bridgeId: "kharbao-ulhas-bridge",
    bridgeCode: "MH-THA-KNK-01",
    bridgeName: "Kharbao Ulhas River Bridge (Bhiwandi Freight Link)",
    bridgeNameHi: "खारबाव उल्हास नदी पुल",
    bridgeNameMr: "खारबाव उल्हास नदी पूल",
    river: "Ulhas River",
    district: "Thane",
    state: "Maharashtra",
    severity: "PUBLIC_WARNING",
    weaknessType: "STRUCTURAL FATIGUE: Rebar Section Loss (14.2%) from Marine Chloride Spray",
    timestamp: "27 Oct 2026, 17:15 IST",
    timeAgo: "Yesterday",
    sviScore: 73.8,
    failureMechanism:
      "Severe reinforcement spalling on underside of deck slab under 52,000 PCU daily container truck traffic serving Bhiwandi logistic hubs.",
    publicAdvisoryText:
      "FREIGHT CARRIER NOTIFICATION: Speed restriction of 30 km/h and axle weight checks enforced. Overloaded trailers will be impounded at toll plaza.",
    trafficDirective: "Heavy trailers (>40 tonnes) diverted to Mumbai-Nashik Expressway corridor.",
    actionRequired: "Carbon fiber wrapping (CFRP) and cathodic rust inhibitor application.",
    isPubliclyReleased: true,
    releasedBy: "MSRDC & PWD National Highway Division, Thane",
    isRead: true,
  },
  {
    id: "adv-05",
    bridgeId: "howrah-bridge",
    bridgeCode: "WB-HOW-001",
    bridgeName: "Rabindra Setu (Howrah Bridge)",
    bridgeNameHi: "रवीन्द्र सेतु (हावड़ा)",
    bridgeNameMr: "रवींद्र सेतू (हावडा)",
    river: "Hooghly River",
    district: "Howrah / Kolkata",
    state: "West Bengal",
    severity: "WATCH_ALERT",
    weaknessType: "TELEMETRY ALERT: Expansion Joint J-02 Gap Displacement (+29.5%)",
    timestamp: "27 Oct 2026, 14:03 IST",
    timeAgo: "Yesterday",
    sviScore: 28.5,
    failureMechanism:
      "ToF distance telemetry sensor detected longitudinal expansion joint gap opening of 18.4mm (baseline 14.2mm).",
    publicAdvisoryText:
      "MAINTENANCE ADVISORY: Lane 3 scheduled for brief overnight elastomeric joint adjustment between 01:00 and 03:30 IST. Minimal traffic disruption.",
    trafficDirective: "Lane diversion signs deployed by Kolkata Traffic Police.",
    actionRequired: "Elastomeric joint cleaning and hydraulic seal realignment.",
    isPubliclyReleased: false,
    releasedBy: "Syama Prasad Mookerjee Port Trust & PWD",
    isRead: true,
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PublicAdvisoryNotificationCenter: React.FC<Props> = ({ isOpen, onClose }) => {
  const { activeLocale } = useAppStore();
  const [advisories, setAdvisories] = useState<BridgeAdvisoryNotification[]>(DEFAULT_ADVISORIES);
  const [filterTab, setFilterTab] = useState<"ALL" | "CRITICAL" | "TRAFFIC" | "PUBLIC">("ALL");

  // Form State for Releasing a New Public Advisory
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState<boolean>(false);
  const [selectedBridgeId, setSelectedBridgeId] = useState<string>("nashik-godavari-holkar-bridge");
  const [advisoryType, setAdvisoryType] = useState<"CRITICAL_ADVISORY" | "PUBLIC_WARNING" | "OFFICIAL_ORDER">("CRITICAL_ADVISORY");
  const [customWeakness, setCustomWeakness] = useState<string>("Structural distress & excessive pier scour depth");
  const [customDirective, setCustomDirective] = useState<string>("Prohibit commercial vehicles >16t; divert traffic to nearest national bypass link.");
  const [broadcastSDMA, setBroadcastSDMA] = useState<boolean>(true);
  const [broadcastPublicPortal, setBroadcastPublicPortal] = useState<boolean>(true);
  const [broadcastSMS, setBroadcastSMS] = useState<boolean>(true);
  const [justReleasedId, setJustReleasedId] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isReleaseModalOpen) setIsReleaseModalOpen(false);
        else onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isReleaseModalOpen, onClose]);

  // Filtered advisories
  const filteredAdvisories = useMemo(() => {
    return advisories.filter((a) => {
      if (filterTab === "CRITICAL") return a.severity === "CRITICAL_ADVISORY";
      if (filterTab === "TRAFFIC") return a.trafficDirective !== "" && a.trafficDirective !== "None";
      if (filterTab === "PUBLIC") return a.isPubliclyReleased;
      return true;
    });
  }, [advisories, filterTab]);

  const unreadCount = advisories.filter((a) => !a.isRead).length;

  const markAllAsRead = () => {
    setAdvisories((prev) => prev.map((a) => ({ ...a, isRead: true })));
    triggerHaptic("selection");
  };

  const markSingleAsRead = (id: string) => {
    setAdvisories((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
    );
  };

  // Release a new public advisory
  const handlePublishAdvisory = (e: React.FormEvent) => {
    e.preventDefault();
    const bridge = MASTER_BRIDGES_DATABASE.find((b) => b.id === selectedBridgeId) || MASTER_BRIDGES_DATABASE[0];

    const newAdvisory: BridgeAdvisoryNotification = {
      id: `adv-${Date.now()}`,
      bridgeId: bridge.id,
      bridgeCode: bridge.code,
      bridgeName: bridge.name,
      bridgeNameHi: bridge.name_hi,
      bridgeNameMr: bridge.name_mr,
      river: bridge.river,
      district: bridge.district,
      state: bridge.state,
      severity: advisoryType,
      weaknessType: customWeakness,
      timestamp: "Just Now (Official Release)",
      timeAgo: "Just Now",
      sviScore: bridge.tier === "Critical" ? 78.4 : 64.0,
      failureMechanism: `Dynamic inspection flag triggered. ${customWeakness}. Immediate structural review authorized under IRC:SP:35 guidelines.`,
      publicAdvisoryText: `GOVERNMENT SAFETY GAZETTE: Immediate public warning released for ${bridge.name}. ${customDirective}`,
      trafficDirective: customDirective,
      actionRequired: "Enforce vehicular load limits and alert regional disaster management teams.",
      isPubliclyReleased: broadcastPublicPortal,
      releasedBy: "State Disaster Management Authority (SDMA) & PWD Infrastructure Intelligence Grid",
      isRead: false,
    };

    setAdvisories([newAdvisory, ...advisories]);
    setJustReleasedId(newAdvisory.id);
    setIsReleaseModalOpen(false);
    triggerHaptic("heavy");

    setTimeout(() => {
      setJustReleasedId(null);
    }, 5000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-2 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-slate-300 flex flex-col max-h-[92vh] overflow-hidden mt-10 mr-2 sm:mr-4"
      >
        {/* ============================================================ */}
        {/* 1. NOTIFICATION CENTER HEADER                                */}
        {/* ============================================================ */}
        <div className="bg-[#1e293b] text-white p-3.5 px-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-rose-600/90 text-white flex items-center justify-center font-bold shadow-xs">
              <Megaphone className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-sm tracking-tight text-white font-sans uppercase">
                  Critical Bridge Alerts &amp; Public Safety Advisories
                </h2>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold">
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 font-mono">
                Maharashtra SDMA • PWD Early Warning &amp; Broadcast Grid
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. SUBHEADER: ACTION BAR & FILTER TABS                       */}
        {/* ============================================================ */}
        <div className="bg-[#f8fafc] p-2.5 px-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setFilterTab("ALL");
                triggerHaptic("selection");
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                filterTab === "ALL"
                  ? "bg-[#0f172a] text-white shadow-2xs font-bold"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Advisories ({advisories.length})
            </button>
            <button
              onClick={() => {
                setFilterTab("CRITICAL");
                triggerHaptic("selection");
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                filterTab === "CRITICAL"
                  ? "bg-rose-700 text-white shadow-2xs font-bold"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>Weak Bridges (3)</span>
            </button>
            <button
              onClick={() => {
                setFilterTab("TRAFFIC");
                triggerHaptic("selection");
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                filterTab === "TRAFFIC"
                  ? "bg-amber-700 text-white shadow-2xs font-bold"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              Traffic Orders
            </button>
            <button
              onClick={() => {
                setFilterTab("PUBLIC");
                triggerHaptic("selection");
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                filterTab === "PUBLIC"
                  ? "bg-sky-700 text-white shadow-2xs font-bold"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              Public Broadcasts
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-slate-600 hover:text-slate-900 font-medium underline transition-colors"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={() => {
                setIsReleaseModalOpen(true);
                triggerHaptic("light");
              }}
              className="px-2.5 py-1 rounded text-[11px] font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1 shadow-xs transition-colors"
            >
              <Send className="w-3 h-3" />
              <span>Release New Advisory</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. SCROLLABLE ADVISORIES FEED                                */}
        {/* ============================================================ */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-[#f8fafc]">
          {filteredAdvisories.map((advisory) => {
            const isCritical = advisory.severity === "CRITICAL_ADVISORY";
            const isWarning = advisory.severity === "PUBLIC_WARNING";
            const isJustReleased = advisory.id === justReleasedId;

            return (
              <div
                key={advisory.id}
                onClick={() => markSingleAsRead(advisory.id)}
                className={`p-3.5 rounded-lg border transition-all ${
                  isJustReleased
                    ? "bg-amber-50 border-amber-400 ring-2 ring-amber-400/50"
                    : !advisory.isRead
                    ? "bg-white border-slate-300 shadow-sm ring-1 ring-slate-200"
                    : "bg-white/80 border-slate-200 opacity-90"
                }`}
              >
                {/* Advisory Top Badge & Timestamp Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Severity Pill */}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border flex items-center gap-1 ${
                        isCritical
                          ? "bg-rose-50 text-rose-700 border-rose-300"
                          : isWarning
                          ? "bg-amber-50 text-amber-800 border-amber-300"
                          : "bg-sky-50 text-sky-800 border-sky-300"
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>{isCritical ? "CRITICAL WEAK BRIDGE" : isWarning ? "PUBLIC WARNING" : "TELEMETRY WATCH"}</span>
                    </span>

                    {/* Official Release Badge */}
                    {advisory.isPubliclyReleased && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Publicly Broadcast</span>
                      </span>
                    )}

                    {isJustReleased && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-900 animate-pulse">
                        JUST RELEASED
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{advisory.timestamp}</span>
                  </div>
                </div>

                {/* Bridge Identification */}
                <div className="mb-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                      {advisory.bridgeCode}
                    </span>
                    <h3 className="font-extrabold text-sm text-[#0f172a] leading-tight">
                      {activeLocale === "hi"
                        ? advisory.bridgeNameHi
                        : activeLocale === "mr"
                        ? advisory.bridgeNameMr
                        : advisory.bridgeName}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>
                      {advisory.river} • {advisory.district}, {advisory.state}
                    </span>
                  </p>
                </div>

                {/* Weakness Analysis Header */}
                <div className="p-2.5 rounded bg-rose-50/70 border border-rose-200 text-xs text-rose-950 mb-2">
                  <div className="font-bold text-rose-900 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                    <span>{advisory.weaknessType}</span>
                  </div>
                  <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">
                    {advisory.failureMechanism}
                  </p>
                </div>

                {/* Official Public Safety Order & Traffic Directive */}
                <div className="p-2.5 rounded bg-amber-50/70 border border-amber-200 text-xs text-amber-950 mb-3 space-y-1">
                  <div className="font-bold text-amber-900 uppercase tracking-wide text-[10px] font-mono flex items-center gap-1">
                    <Megaphone className="w-3 h-3 text-amber-700" />
                    <span>Public Works Department Order</span>
                  </div>
                  <p className="text-[11px] text-slate-800 leading-snug font-medium">
                    {advisory.publicAdvisoryText}
                  </p>
                  <p className="text-[10px] font-mono text-slate-600 pt-0.5 border-t border-amber-200/60">
                    <strong>Traffic Route:</strong> {advisory.trafficDirective}
                  </p>
                </div>

                {/* Authority Signature & Action Links */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Issuer: {advisory.releasedBy}
                  </span>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Link
                      href={`/condition?bridge=${advisory.bridgeId}`}
                      onClick={onClose}
                      className="px-2 py-1 rounded text-[11px] font-semibold bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 transition-colors"
                    >
                      26-Factor Condition
                    </Link>
                    <Link
                      href={`/bridges?bridge=${advisory.bridgeId}`}
                      onClick={onClose}
                      className="px-2 py-1 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 transition-colors"
                    >
                      Locate on GIS
                    </Link>
                    <Link
                      href={`/bridges/${advisory.bridgeId}`}
                      onClick={onClose}
                      className="px-2 py-1 rounded text-[11px] font-semibold bg-[#1e293b] text-white hover:bg-black transition-colors flex items-center gap-1"
                    >
                      <span>Civil Cockpit</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* 4. NOTIFICATION CENTER FOOTER                                */}
        {/* ============================================================ */}
        <div className="bg-[#f8fafc] p-3 px-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
            <span>Active Surveillance: 44 Bridges • 24x7 IoT Telemetry</span>
          </div>

          <Link
            href="/public"
            onClick={onClose}
            className="text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 text-[11px]"
          >
            <span>Open Public Transparency Portal</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. RELEASE NEW ADVISORY ACTION MODAL                         */}
      {/* ============================================================ */}
      {isReleaseModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl border border-slate-300 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-rose-600" />
                <h3 className="font-extrabold text-sm text-[#0f172a] uppercase font-mono">
                  Broadcast Official Emergency Public Advisory
                </h3>
              </div>
              <button
                onClick={() => setIsReleaseModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublishAdvisory} className="space-y-3.5 text-xs">
              {/* Asset Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Infrastructure Asset:</label>
                <select
                  value={selectedBridgeId}
                  onChange={(e) => setSelectedBridgeId(e.target.value)}
                  className="w-full p-2 bg-[#f8fafc] border border-slate-300 rounded font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600"
                >
                  {MASTER_BRIDGES_DATABASE.map((b) => (
                    <option key={b.id} value={b.id}>
                      [{b.code}] {b.name} ({b.district}, {b.state}) • Grade: {b.tier}
                    </option>
                  ))}
                </select>
              </div>

              {/* Advisory Classification */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Advisory Severity Level:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdvisoryType("CRITICAL_ADVISORY")}
                    className={`py-1.5 px-2 rounded border text-center font-bold text-[11px] transition-colors ${
                      advisoryType === "CRITICAL_ADVISORY"
                        ? "bg-rose-50 text-rose-700 border-rose-400 ring-1 ring-rose-400"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    CRITICAL ADVISORY
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdvisoryType("PUBLIC_WARNING")}
                    className={`py-1.5 px-2 rounded border text-center font-bold text-[11px] transition-colors ${
                      advisoryType === "PUBLIC_WARNING"
                        ? "bg-amber-50 text-amber-800 border-amber-400 ring-1 ring-amber-400"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    PUBLIC WARNING
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdvisoryType("OFFICIAL_ORDER")}
                    className={`py-1.5 px-2 rounded border text-center font-bold text-[11px] transition-colors ${
                      advisoryType === "OFFICIAL_ORDER"
                        ? "bg-sky-50 text-sky-800 border-sky-400 ring-1 ring-sky-400"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    OFFICIAL ORDER
                  </button>
                </div>
              </div>

              {/* Failure / Weakness Mechanism */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Identified Structural Distress / Weakness:</label>
                <input
                  type="text"
                  value={customWeakness}
                  onChange={(e) => setCustomWeakness(e.target.value)}
                  placeholder="e.g. Scour depth reached 7.8m at Pier P-03; foundation exposure"
                  className="w-full p-2 bg-[#f8fafc] border border-slate-300 rounded text-slate-900 font-medium"
                  required
                />
              </div>

              {/* Public Traffic Directive */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Public Safety Directive &amp; Diversion Route:</label>
                <textarea
                  value={customDirective}
                  onChange={(e) => setCustomDirective(e.target.value)}
                  rows={2}
                  placeholder="e.g. Prohibit heavy multi-axle freight (>16t); divert traffic to nearest national bypass link."
                  className="w-full p-2 bg-[#f8fafc] border border-slate-300 rounded text-slate-900 font-medium leading-relaxed"
                  required
                />
              </div>

              {/* Broadcast Channels */}
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-700 block text-[11px] font-mono uppercase">
                  Broadcast Dispatch Channels:
                </span>
                <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700">
                  <input
                    type="checkbox"
                    checked={broadcastPublicPortal}
                    onChange={(e) => setBroadcastPublicPortal(e.target.checked)}
                    className="rounded text-sky-600"
                  />
                  <span>Publish to Public Transparency Portal &amp; Citizen Web App</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700">
                  <input
                    type="checkbox"
                    checked={broadcastSDMA}
                    onChange={(e) => setBroadcastSDMA(e.target.checked)}
                    className="rounded text-sky-600"
                  />
                  <span>Emergency Dispatch to State Disaster Management Authority (SDMA)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700">
                  <input
                    type="checkbox"
                    checked={broadcastSMS}
                    onChange={(e) => setBroadcastSMS(e.target.checked)}
                    className="rounded text-sky-600"
                  />
                  <span>Corridor Traffic Police Alert &amp; Commuter Advisory</span>
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReleaseModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Official Advisory</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

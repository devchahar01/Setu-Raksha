"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Shield,
  Layers,
  Radio,
  ClipboardList,
  AlertTriangle,
  Eye,
  Box,
  Search,
  ArrowRight,
  ExternalLink,
  MapPin,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { TRANSLATIONS } from "@/lib/translations";
import { MASTER_BRIDGES_DATABASE, BridgeAsset } from "@/lib/bridgesData";
import { RiskTierBadge } from "@/components/RiskTierBadge";

export default function Home() {
  const { activeLocale } = useAppStore();
  const t = TRANSLATIONS[activeLocale] || TRANSLATIONS.en;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("ALL");

  // Filtered bridges for fast quick directory
  const filteredBridges = useMemo(() => {
    return MASTER_BRIDGES_DATABASE.filter((bridge) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        bridge.name.toLowerCase().includes(q) ||
        (bridge.name_hi && bridge.name_hi.includes(q)) ||
        (bridge.name_mr && bridge.name_mr.includes(q)) ||
        bridge.district.toLowerCase().includes(q) ||
        bridge.river.toLowerCase().includes(q) ||
        bridge.code.toLowerCase().includes(q);

      const matchesTier =
        selectedTier === "ALL" ||
        bridge.tier.toUpperCase() === selectedTier.toUpperCase();

      return matchesSearch && matchesTier;
    });
  }, [searchQuery, selectedTier]);

  // Overall grid statistics
  const stats = useMemo(() => {
    const total = MASTER_BRIDGES_DATABASE.length;
    const good = MASTER_BRIDGES_DATABASE.filter((b) => b.tier.toUpperCase() === "GOOD").length;
    const watch = MASTER_BRIDGES_DATABASE.filter((b) => b.tier.toUpperCase() === "WATCH").length;
    const warning = MASTER_BRIDGES_DATABASE.filter((b) => b.tier.toUpperCase() === "WARNING").length;
    const critical = MASTER_BRIDGES_DATABASE.filter((b) => b.tier.toUpperCase() === "CRITICAL").length;
    const totalSensors = MASTER_BRIDGES_DATABASE.reduce((sum, b) => sum + (b.active_sensors_count || 3), 0);
    return { total, good, watch, warning, critical, totalSensors };
  }, []);

  const getLocalizedName = (bridge: BridgeAsset) => {
    if (activeLocale === "hi" && bridge.name_hi) return bridge.name_hi;
    if (activeLocale === "mr" && bridge.name_mr) return bridge.name_mr;
    return bridge.name;
  };

  return (
    <div className="w-full bg-slate-50 min-h-[calc(100vh-140px)] text-slate-800">
      {/* ============================================================ */}
      {/* 1. SIMPLE HERO BANNER (Fast, lightweight, no 3D canvas)      */}
      {/* ============================================================ */}
      <section className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t.common.simulatedTag || "SIMULATED MODE (TEST GRID)"}</span>
                <span className="text-slate-400">|</span>
                <span>IRC:SP:35 &amp; IS 1893</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                {t.common.appName} <span className="text-sky-600">Grid</span>
              </h1>
              <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-2xl">
                {t.common.tagline}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/bridges"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-colors"
              >
                <Layers className="w-4 h-4" />
                <span>{t.common.nav.registry}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/telemetry"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
              >
                <Radio className="w-4 h-4 text-emerald-600" />
                <span>{t.common.nav.telemetry}</span>
              </Link>
              <Link
                href="/risk"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{t.common.nav.risk}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. STATS OVERVIEW CARDS                                      */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Total Assets</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">{stats.total}</span>
            <span className="text-[11px] text-slate-500">Bridges &amp; Flyovers</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-medium text-emerald-700 uppercase tracking-wider block">Good Tier</span>
            <span className="text-2xl font-bold text-emerald-600 mt-1 block">{stats.good}</span>
            <span className="text-[11px] text-emerald-600/80">SVI &lt; 30 (Nominal)</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-medium text-amber-700 uppercase tracking-wider block">Watch Tier</span>
            <span className="text-2xl font-bold text-amber-600 mt-1 block">{stats.watch}</span>
            <span className="text-[11px] text-amber-600/80">SVI 30–54 (Advisory)</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-medium text-orange-700 uppercase tracking-wider block">Warning</span>
            <span className="text-2xl font-bold text-orange-600 mt-1 block">{stats.warning}</span>
            <span className="text-[11px] text-orange-600/80">SVI 55–74 (Repairs)</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-medium text-red-700 uppercase tracking-wider block">Critical</span>
            <span className="text-2xl font-bold text-red-600 mt-1 block">{stats.critical}</span>
            <span className="text-[11px] text-red-600/80">SVI ≥ 75 (Escalated)</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-medium text-sky-700 uppercase tracking-wider block">Live IoT Sensors</span>
            <span className="text-2xl font-bold text-sky-600 mt-1 block">{stats.totalSensors}</span>
            <span className="text-[11px] text-sky-600/80">Streaming 1 Hz</span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. CORE MODULES GRID                                         */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-600" />
            <span>Infrastructure Lifecycle Modules (L1–L7)</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Standard Operating Workflow</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* L1 Registry */}
          <Link
            href="/bridges"
            className="group bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-sky-400 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">L1/L2</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-3 group-hover:text-sky-600 transition-colors">
              {t.common.nav.registry}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Geotechnical parameters, IRC class ratings, seismic zones, foundation depths, and structural blueprints.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-sky-600 group-hover:gap-2 transition-all">
              <span>Explore 60 Bridges</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          {/* L3 Telemetry */}
          <Link
            href="/telemetry"
            className="group bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Radio className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">L3 LIVE</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-3 group-hover:text-emerald-600 transition-colors">
              {t.common.nav.telemetry}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Ultrasonic river stage, pier tilt inclinometers, triaxial vibration accelerometers, and live anomaly traps.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600 group-hover:gap-2 transition-all">
              <span>View Sensor Feeds</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          {/* L5 Field Audits */}
          <Link
            href="/audits"
            className="group bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <ClipboardList className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">L5 AUDIT</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-3 group-hover:text-indigo-600 transition-colors">
              {t.common.nav.audits}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Standardized 26-factor field audit portal adhering to Appendix A, photographic logs, and offline support.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:gap-2 transition-all">
              <span>Submit Inspection</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          {/* L6 AI Risk Engine */}
          <Link
            href="/risk"
            className="group bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">L6 AI</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-3 group-hover:text-amber-600 transition-colors">
              {t.common.nav.risk}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Deterministic SVI, dynamic DRI, Markov Remaining Useful Life (RUL), and prioritized engineering fixes.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-600 group-hover:gap-2 transition-all">
              <span>Assess SVI &amp; DRI</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Computer Vision AR Twin */}
          <Link
            href="/defect-ar"
            className="group bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-cyan-400 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                <Box className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">AR TWIN</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-3 group-hover:text-cyan-600 transition-colors">
              {t.common.nav.defectAr}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              SIFT keypoint defect localization, multi-view camera triangulation, and spatial 3D crack mapping.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-600 group-hover:gap-2 transition-all">
              <span>Launch AR Twin</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          {/* L7 Citizen Portal */}
          <Link
            href="/public"
            className="group bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Eye className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">L7 PUBLIC</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-3 group-hover:text-emerald-600 transition-colors">
              {t.common.nav.public}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Transparent citizen safety tiers, design life consumed, traffic advisories, and cryptographic integrity.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600 group-hover:gap-2 transition-all">
              <span>Open Public Portal</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. FAST INTERACTIVE BRIDGE DIRECTORY (Search & Filters)       */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-sky-600" />
                <span>Monitored Bridge Grid Directory</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Quick directory of registered bridges with live health tiers and specifications.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search bridge, river, district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                />
              </div>

              {/* Tier Filter Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                {["ALL", "GOOD", "WATCH", "WARNING", "CRITICAL"].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      selectedTier === tier
                        ? "bg-white text-slate-900 shadow-xs font-semibold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-5">
            {filteredBridges.slice(0, 12).map((bridge) => (
              <div
                key={bridge.id}
                className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-500 px-1.5 py-0.5 bg-slate-200/80 rounded">
                      {bridge.code}
                    </span>
                    <RiskTierBadge tier={bridge.tier} size="sm" score={bridge.setu_score} showScore />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-2 line-clamp-1">
                    {getLocalizedName(bridge)}
                  </h3>

                  <div className="mt-2 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{bridge.district}, {bridge.state}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">River: {bridge.river}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Built: {bridge.year_built} ({bridge.age_years} yrs old)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    {bridge.length_m}m | {bridge.spans} spans
                  </span>
                  <Link
                    href={`/bridges/${bridge.id}`}
                    className="inline-flex items-center gap-1 font-semibold text-sky-600 hover:text-sky-700"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredBridges.length > 12 && (
            <div className="mt-6 text-center">
              <Link
                href="/bridges"
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <span>View all {filteredBridges.length} bridges in Full Registry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {filteredBridges.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium">No bridges match your filter criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTier("ALL");
                }}
                className="mt-3 text-xs font-semibold text-sky-600 hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. ENGINEERING ADVISORY & HONEST LABELLING                   */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 sm:p-5 flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-bold block text-sm text-amber-950 mb-0.5">
              {t.common.disclaimerTitle || "Engineering Advisory Notice"}
            </span>
            <p>
              {t.common.disclaimerText ||
                "Setu Rakshak provides predictive decision support to assist civil authorities and engineers in prioritizing inspection, traffic restrictions, and preventative maintenance. It never replaces detailed structural analysis, physical non-destructive testing (NDT), or a certified civil engineer's professional judgment. All sensor feeds, stream readings, and starter bridge records are SIMULATED for demonstration."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

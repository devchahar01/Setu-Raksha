"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Layers,
  MapPin,
  Filter,
  ArrowRight,
  ExternalLink,
  Search,
  Navigation,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Calendar,
  Clock,
  Compass,
  Building2,
  Activity,
  History,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight,
  Crosshair,
  Gauge,
  Info,
  Waves,
  Car,
  Wind,
  CheckCircle2,
} from "lucide-react";
import { RiskTierBadge } from "@/components/RiskTierBadge";
import { useAppStore } from "@/lib/store";
import { formatNumber } from "@/lib/formatters";
import { TRANSLATIONS } from "@/lib/translations";
import { triggerHaptic } from "@/lib/haptics";
import {
  MASTER_BRIDGES_DATABASE,
  BridgeAsset,
} from "@/lib/bridgesData";

const STATES = [
  "All",
  "Maharashtra",
  "West Bengal",
  "Jammu and Kashmir",
  "Assam",
  "Tamil Nadu",
  "Gujarat",
  "Bihar",
  "Delhi",
  "Telangana",
  "Karnataka",
  "Uttar Pradesh",
  "Goa",
  "Uttarakhand",
  "Kerala",
  "Meghalaya",
];

const AGE_ERAS = [
  { id: "All", labelEn: "All Eras", labelHi: "सभी युग", labelMr: "सर्व युग" },
  { id: "<10", labelEn: "< 10 Yrs (Modern)", labelHi: "< १० वर्ष (आधुनिक)", labelMr: "< १० वर्षे (आधुनिक)" },
  { id: "10-30", labelEn: "10–30 Yrs (Established)", labelHi: "१०–३० वर्ष (स्थापित)", labelMr: "१०–३० वर्षे (प्रस्थापित)" },
  { id: "30-60", labelEn: "30–60 Yrs (Mid-Life)", labelHi: "३०–६० वर्ष (मध्यम)", labelMr: "३०–६० वर्षे (मध्यम)" },
  { id: ">60", labelEn: "> 60 Yrs (Aging)", labelHi: "> ६० वर्ष (वरिष्ठ)", labelMr: "> ६० वर्षे (ज्येष्ठ)" },
  { id: ">100", labelEn: "> 100 Yrs (Heritage)", labelHi: "> १०० वर्ष (धरोहर)", labelMr: "> १०० वर्षे (वारसा)" },
];

const TIERS = ["All", "Good", "Watch", "Warning", "Critical"];

function BridgesPageContent() {
  const searchParams = useSearchParams();
  const { activeLocale, useDevanagariDigits } = useAppStore();
  const t = TRANSLATIONS[activeLocale];

  // State Management
  const [bridges, setBridges] = useState<BridgeAsset[]>(MASTER_BRIDGES_DATABASE);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<"ALL" | "BRIDGES" | "FLYOVERS" | "HERITAGE">("ALL");
  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedAge, setSelectedAge] = useState<string>("All");
  const [selectedTier, setSelectedTier] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeBridge, setActiveBridge] = useState<BridgeAsset>(MASTER_BRIDGES_DATABASE[0]);
  const [activeDossierTab, setActiveDossierTab] = useState<"HISTORY" | "SPECS" | "HYDRAULIC" | "HEALTH">("HISTORY");
  const [locatePulse, setLocatePulse] = useState<boolean>(false);

  // Map Controls
  const [mapType, setMapType] = useState<"k" | "h" | "p" | "m">("h");
  const [zoomLevel, setZoomLevel] = useState<number>(15);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Check URL query parameters on initial load
  useEffect(() => {
    const bridgeParam = searchParams.get("bridge");
    const categoryParam = searchParams.get("category");
    const stateParam = searchParams.get("state");

    if (bridgeParam) {
      const match = MASTER_BRIDGES_DATABASE.find(
        (b) => b.id.toLowerCase() === bridgeParam.toLowerCase() || b.code.toLowerCase() === bridgeParam.toLowerCase()
      );
      if (match) {
        setActiveBridge(match);
        setZoomLevel(16);
      }
    }

    if (categoryParam === "flyovers") {
      setActiveCategory("FLYOVERS");
    } else if (categoryParam === "heritage") {
      setActiveCategory("HERITAGE");
    }

    if (stateParam && STATES.includes(stateParam)) {
      setSelectedState(stateParam);
    }
  }, [searchParams]);

  // Filter logic
  const filteredBridges = useMemo(() => {
    return bridges.filter((b) => {
      // Category filter
      if (activeCategory === "FLYOVERS" && !b.is_flyover) return false;
      if (activeCategory === "BRIDGES" && b.is_flyover) return false;
      if (activeCategory === "HERITAGE" && b.age_years < 50) return false;

      // State filter
      if (selectedState !== "All" && !b.state.toLowerCase().includes(selectedState.toLowerCase())) {
        return false;
      }

      // Age era filter
      if (selectedAge === "<10" && b.age_years >= 10) return false;
      if (selectedAge === "10-30" && (b.age_years < 10 || b.age_years > 30)) return false;
      if (selectedAge === "30-60" && (b.age_years < 30 || b.age_years > 60)) return false;
      if (selectedAge === ">60" && b.age_years <= 60) return false;
      if (selectedAge === ">100" && b.age_years <= 100) return false;

      // Health tier filter
      if (selectedTier !== "All" && b.tier.toLowerCase() !== selectedTier.toLowerCase()) {
        return false;
      }

      // Search query across fields
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = b.name.toLowerCase().includes(q);
        const matchesHi = b.name_hi.toLowerCase().includes(q);
        const matchesMr = b.name_mr.toLowerCase().includes(q);
        const matchesCode = b.code.toLowerCase().includes(q);
        const matchesDistrict = b.district.toLowerCase().includes(q);
        const matchesState = b.state.toLowerCase().includes(q);
        const matchesRiver = b.river.toLowerCase().includes(q);
        const matchesType = b.superstructure_type.toLowerCase().includes(q);
        const matchesBuilder = b.builder_contractor.toLowerCase().includes(q);
        return (
          matchesName ||
          matchesHi ||
          matchesMr ||
          matchesCode ||
          matchesDistrict ||
          matchesState ||
          matchesRiver ||
          matchesType ||
          matchesBuilder
        );
      }

      return true;
    });
  }, [bridges, activeCategory, selectedState, selectedAge, selectedTier, searchQuery]);

  const resetAllFilters = () => {
    setActiveCategory("ALL");
    setSelectedState("All");
    setSelectedAge("All");
    setSelectedTier("All");
    setSearchQuery("");
    triggerHaptic("selection");
  };

  const handleLocateBridge = (bridge: BridgeAsset) => {
    setActiveBridge(bridge);
    setZoomLevel(16);
    setLocatePulse(true);
    triggerHaptic("medium");

    setTimeout(() => {
      setLocatePulse(false);
    }, 2000);

    // Scroll map container into view
    if (mapContainerRef.current) {
      mapContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Google Maps embed URL
  const currentLat = activeBridge?.latitude ?? 18.9858;
  const currentLng = activeBridge?.longitude ?? 72.9362;
  const googleMapsUrl = `https://maps.google.com/maps?q=${currentLat},${currentLng}&t=${mapType}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;
  const externalGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${currentLat},${currentLng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${currentLat},${currentLng}`;

  // Localized bridge name
  const localizedBridgeName = (b: BridgeAsset) => {
    if (activeLocale === "hi") return b.name_hi;
    if (activeLocale === "mr") return b.name_mr;
    return b.name;
  };

  // Design life consumption percentage
  const lifeConsumedPercent = Math.min(
    100,
    Math.round((activeBridge.age_years / activeBridge.design_life_y) * 100)
  );

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-800 pb-16">
      {/* 1. Official Institutional Header */}
      <div className="bg-[#f4f2ec] text-slate-900 py-6 px-4 sm:px-6 lg:px-8 border-b border-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-600 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="font-bold">ASSET MANAGEMENT MODULE • LEVEL 01 REGISTRY</span>
              <span>•</span>
              <span>WIKIPEDIA & MoRTH VERIFIED REPOSITORY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
              {t.bridges.title}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {t.bridges.locateSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto font-mono text-xs">
            <div className="bg-white px-3.5 py-1.5 rounded border border-slate-300 text-slate-800 shadow-2xs">
              <span className="text-slate-400 block text-[10px]">TOTAL ASSETS REGISTERED</span>
              <span className="font-bold text-sm">
                {formatNumber(filteredBridges.length, activeLocale, useDevanagariDigits)} / {formatNumber(bridges.length, activeLocale, useDevanagariDigits)}
              </span>
            </div>
            <div className="bg-white px-3.5 py-1.5 rounded border border-slate-300 text-slate-800 shadow-2xs">
              <span className="text-slate-400 block text-[10px]">VERIFICATION STANDARD</span>
              <span className="font-bold text-sm text-emerald-700">IRC:SP:35 • RDSO</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* 2. LOCATE BRIDGE OR FLYOVER INTERACTIVE COMMAND BAR */}
        <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-xs space-y-3.5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Primary Category Switcher Tabs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => {
                  setActiveCategory("ALL");
                  triggerHaptic("selection");
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${
                  activeCategory === "ALL"
                    ? "bg-[#0f172a] text-white border-[#0f172a]"
                    : "bg-[#f8fafc] text-slate-700 border-slate-300 hover:bg-slate-200"
                }`}
              >
                {t.bridges.allCategories} ({bridges.length})
              </button>
              <button
                onClick={() => {
                  setActiveCategory("BRIDGES");
                  triggerHaptic("selection");
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${
                  activeCategory === "BRIDGES"
                    ? "bg-[#0f172a] text-white border-[#0f172a]"
                    : "bg-[#f8fafc] text-slate-700 border-slate-300 hover:bg-slate-200"
                }`}
              >
                {t.bridges.bridgesOnly} ({bridges.filter((b) => !b.is_flyover).length})
              </button>
              <button
                onClick={() => {
                  setActiveCategory("FLYOVERS");
                  triggerHaptic("selection");
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${
                  activeCategory === "FLYOVERS"
                    ? "bg-[#0f172a] text-white border-[#0f172a]"
                    : "bg-[#f8fafc] text-slate-700 border-slate-300 hover:bg-slate-200"
                }`}
              >
                {t.bridges.flyoversOnly} ({bridges.filter((b) => b.is_flyover).length})
              </button>
              <button
                onClick={() => {
                  setActiveCategory("HERITAGE");
                  triggerHaptic("selection");
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${
                  activeCategory === "HERITAGE"
                    ? "bg-[#0f172a] text-white border-[#0f172a]"
                    : "bg-[#f8fafc] text-slate-700 border-slate-300 hover:bg-slate-200"
                }`}
              >
                {t.bridges.historicOnly} ({bridges.filter((b) => b.age_years >= 50).length})
              </button>
            </div>

            {/* Quick Search Field */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder={t.bridges.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs bg-[#f8fafc] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-600 font-medium text-slate-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Secondary Filters Bar */}
          <div className="pt-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* State Filter */}
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-500">{t.bridges.filterState}:</span>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    triggerHaptic("selection");
                  }}
                  className="bg-[#f8fafc] border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 font-medium focus:outline-none"
                >
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Age / Era Filter */}
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-500">{t.bridges.filterAge}:</span>
                <select
                  value={selectedAge}
                  onChange={(e) => {
                    setSelectedAge(e.target.value);
                    triggerHaptic("selection");
                  }}
                  className="bg-[#f8fafc] border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 font-medium focus:outline-none"
                >
                  {AGE_ERAS.map((era) => (
                    <option key={era.id} value={era.id}>
                      {activeLocale === "hi" ? era.labelHi : activeLocale === "mr" ? era.labelMr : era.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition Tier Filter */}
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-500">{t.bridges.filterTier}:</span>
                <div className="flex items-center gap-1">
                  {TIERS.map((tier) => (
                    <button
                      key={tier}
                      onClick={() => {
                        setSelectedTier(tier);
                        triggerHaptic("selection");
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                        selectedTier === tier
                          ? "bg-slate-800 text-white border-slate-800 font-bold"
                          : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filter Clear */}
            {(selectedState !== "All" || selectedAge !== "All" || selectedTier !== "All" || searchQuery !== "" || activeCategory !== "ALL") && (
              <button
                onClick={resetAllFilters}
                className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded flex items-center gap-1 font-medium bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. GIS MAP & DEEP TECHNICAL DOSSIER GRID (HERO OPERATIONS AREA) */}
        <div ref={mapContainerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: GIS Satellite Surveillance Viewport (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-lg border border-slate-300 shadow-xs overflow-hidden flex flex-col h-[540px]">
            {/* GIS Top Toolbar */}
            <div className="bg-[#1e293b] text-white p-2.5 px-4 flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono border-b border-slate-700">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${locatePulse ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`}></span>
                <span className="font-bold text-white tracking-wide">
                  GIS SATELLITE LOCATOR
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-sky-300">
                  {currentLat.toFixed(4)}° N, {currentLng.toFixed(4)}° E
                </span>
              </div>

              {/* Map Layer Switcher */}
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded border border-slate-700 text-[11px]">
                <button
                  onClick={() => {
                    setMapType("h");
                    triggerHaptic("light");
                  }}
                  className={`px-2 py-0.5 rounded font-semibold ${
                    mapType === "h" ? "bg-sky-700 text-white" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {t.bridges.hybrid}
                </button>
                <button
                  onClick={() => {
                    setMapType("k");
                    triggerHaptic("light");
                  }}
                  className={`px-2 py-0.5 rounded font-semibold ${
                    mapType === "k" ? "bg-sky-700 text-white" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {t.bridges.satellite}
                </button>
                <button
                  onClick={() => {
                    setMapType("p");
                    triggerHaptic("light");
                  }}
                  className={`px-2 py-0.5 rounded font-semibold ${
                    mapType === "p" ? "bg-sky-700 text-white" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {t.bridges.terrain}
                </button>
                <button
                  onClick={() => {
                    setMapType("m");
                    triggerHaptic("light");
                  }}
                  className={`px-2 py-0.5 rounded font-semibold ${
                    mapType === "m" ? "bg-sky-700 text-white" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {t.bridges.roadmap}
                </button>
              </div>

              {/* Zoom & Route Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setZoomLevel((prev) => Math.min(prev + 1, 19));
                    triggerHaptic("light");
                  }}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setZoomLevel((prev) => Math.max(prev - 1, 9));
                    triggerHaptic("light");
                  }}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-700 hover:bg-emerald-600 text-white rounded flex items-center gap-1 transition-colors"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Route</span>
                </a>
                <a
                  href={externalGoogleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-0.5 text-[11px] font-semibold bg-slate-700 hover:bg-slate-600 text-white rounded flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Map Frame */}
            <div className="relative flex-1 w-full bg-slate-200">
              <iframe
                title="Google Maps Bridge GIS Locator"
                src={googleMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
              />

              {/* Pinpoint Radar HUD */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded border border-slate-300 shadow-sm flex items-center gap-2 font-mono text-[11px]">
                <Crosshair className="w-3.5 h-3.5 text-sky-700 animate-spin" style={{ animationDuration: "12s" }} />
                <span className="font-bold text-slate-900">{activeBridge.code}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600">{activeBridge.district}, {activeBridge.state}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: DEEP CIVIL ENGINEERING INTELLIGENCE DOSSIER (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-lg border border-slate-300 shadow-xs flex flex-col h-[540px] overflow-hidden">
            {/* Dossier Header */}
            <div className="p-3.5 bg-[#f8fafc] border-b border-slate-300">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300 shadow-2xs">
                    {activeBridge.code}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-200 text-slate-800 border border-slate-300">
                    {activeBridge.category}
                  </span>
                </div>
                <RiskTierBadge tier={activeBridge.tier} size="sm" />
              </div>

              <h2 className="text-base font-bold text-[#0f172a] leading-snug">
                {localizedBridgeName(activeBridge)}
              </h2>
              <div className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span>{activeBridge.river}</span>
                <span>•</span>
                <span>{activeBridge.district}, {activeBridge.state}</span>
                <span>•</span>
                <span className="font-mono font-bold text-slate-800">
                  Built {activeBridge.year_built} ({activeBridge.age_years} yrs active)
                </span>
              </div>
            </div>

            {/* Dossier Navigation Tabs */}
            <div className="flex border-b border-slate-300 bg-[#f1f5f9] text-[11px] font-semibold text-slate-600">
              <button
                onClick={() => {
                  setActiveDossierTab("HISTORY");
                  triggerHaptic("selection");
                }}
                className={`flex-1 py-2 text-center transition-colors border-r border-slate-300 flex items-center justify-center gap-1 ${
                  activeDossierTab === "HISTORY"
                    ? "bg-white text-slate-950 font-bold border-b-2 border-b-slate-900"
                    : "hover:bg-slate-200"
                }`}
              >
                <History className="w-3 h-3" />
                <span>History</span>
              </button>
              <button
                onClick={() => {
                  setActiveDossierTab("SPECS");
                  triggerHaptic("selection");
                }}
                className={`flex-1 py-2 text-center transition-colors border-r border-slate-300 flex items-center justify-center gap-1 ${
                  activeDossierTab === "SPECS"
                    ? "bg-white text-slate-950 font-bold border-b-2 border-b-slate-900"
                    : "hover:bg-slate-200"
                }`}
              >
                <Building2 className="w-3 h-3" />
                <span>Specs</span>
              </button>
              <button
                onClick={() => {
                  setActiveDossierTab("HYDRAULIC");
                  triggerHaptic("selection");
                }}
                className={`flex-1 py-2 text-center transition-colors border-r border-slate-300 flex items-center justify-center gap-1 ${
                  activeDossierTab === "HYDRAULIC"
                    ? "bg-white text-slate-950 font-bold border-b-2 border-b-slate-900"
                    : "hover:bg-slate-200"
                }`}
              >
                <Waves className="w-3 h-3" />
                <span>Hydraulic</span>
              </button>
              <button
                onClick={() => {
                  setActiveDossierTab("HEALTH");
                  triggerHaptic("selection");
                }}
                className={`flex-1 py-2 text-center transition-colors flex items-center justify-center gap-1 ${
                  activeDossierTab === "HEALTH"
                    ? "bg-white text-slate-950 font-bold border-b-2 border-b-slate-900"
                    : "hover:bg-slate-200"
                }`}
              >
                <Activity className="w-3 h-3" />
                <span>Health</span>
              </button>
            </div>

            {/* Dossier Content Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
              {/* TAB 1: HISTORY & AGE */}
              {activeDossierTab === "HISTORY" && (
                <div className="space-y-3">
                  {/* Service Life Consumption Gauge */}
                  <div className="p-3 bg-[#f8fafc] rounded border border-slate-300 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-bold text-slate-700">SERVICE LIFE CONSUMPTION</span>
                      <span className="font-bold text-slate-900">
                        {lifeConsumedPercent}% ({activeBridge.age_years} / {activeBridge.design_life_y} Yrs)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          lifeConsumedPercent > 80
                            ? "bg-amber-600"
                            : lifeConsumedPercent > 50
                            ? "bg-sky-600"
                            : "bg-emerald-600"
                        }`}
                        style={{ width: `${lifeConsumedPercent}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Built: {activeBridge.year_built}</span>
                      <span>Remaining: {activeBridge.remaining_life_y} Years</span>
                    </div>
                  </div>

                  {/* Historical Provenance Narrative */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-900 uppercase font-mono block">
                      Historical Background & Origin
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed bg-[#fbfbfa] p-2.5 rounded border border-slate-200">
                      {activeBridge.history_summary}
                    </p>
                  </div>

                  {/* Engineering Significance */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-900 uppercase font-mono block">
                      Civil Engineering Significance
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed bg-[#fbfbfa] p-2.5 rounded border border-slate-200">
                      {activeBridge.engineering_significance}
                    </p>
                  </div>

                  {/* Builder / Contractor */}
                  <div className="p-2.5 bg-slate-100/70 rounded border border-slate-200 text-[11px]">
                    <span className="text-slate-500 font-medium block">Builder / Executing Agency:</span>
                    <span className="font-bold text-slate-900">{activeBridge.builder_contractor}</span>
                  </div>
                </div>
              )}

              {/* TAB 2: CIVIL & STRUCTURAL SPECS */}
              {activeDossierTab === "SPECS" && (
                <div className="space-y-3">
                  {/* Key Dimensional Metrics */}
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div className="p-2.5 bg-[#f8fafc] rounded border border-slate-300">
                      <span className="text-slate-400 block text-[10px]">TOTAL LENGTH</span>
                      <span className="text-sm font-bold text-slate-900">{activeBridge.length_m} m</span>
                    </div>
                    <div className="p-2.5 bg-[#f8fafc] rounded border border-slate-300">
                      <span className="text-slate-400 block text-[10px]">MAX CLEAR SPAN</span>
                      <span className="text-sm font-bold text-slate-900">{activeBridge.main_span_m} m</span>
                    </div>
                    <div className="p-2.5 bg-[#f8fafc] rounded border border-slate-300">
                      <span className="text-slate-400 block text-[10px]">TOTAL SPANS</span>
                      <span className="text-sm font-bold text-slate-900">{activeBridge.spans} Units</span>
                    </div>
                    <div className="p-2.5 bg-[#f8fafc] rounded border border-slate-300">
                      <span className="text-slate-400 block text-[10px]">DECK WIDTH</span>
                      <span className="text-sm font-bold text-slate-900">{activeBridge.width_m} m</span>
                    </div>
                  </div>

                  {/* Superstructure Classification */}
                  <div className="p-2.5 bg-[#fbfbfa] rounded border border-slate-200 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Superstructure Type</span>
                    <span className="font-bold text-slate-900 block leading-tight">{activeBridge.superstructure_type}</span>
                  </div>

                  {/* Foundation & Substructure */}
                  <div className="p-2.5 bg-[#fbfbfa] rounded border border-slate-200 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Substructure & Foundation</span>
                    <span className="font-semibold text-slate-800 block text-xs">{activeBridge.substructure_type}</span>
                    <span className="text-[11px] text-slate-600 block">{activeBridge.foundation_type} (Depth: {activeBridge.foundation_depth_m}m)</span>
                  </div>

                  {/* Materials & Metallurgy */}
                  <div className="p-2.5 bg-[#fbfbfa] rounded border border-slate-200 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Material Specifications</span>
                    <span className="text-[11px] text-slate-700 block leading-relaxed">{activeBridge.material_specs}</span>
                  </div>

                  {/* Traffic Loading Class */}
                  <div className="p-2 bg-slate-100 rounded border border-slate-200 text-[11px] flex items-center justify-between font-mono">
                    <span className="text-slate-600">IRC Loading Class:</span>
                    <span className="font-bold text-slate-900">{activeBridge.irc_class}</span>
                  </div>
                </div>
              )}

              {/* TAB 3: HYDRAULIC & ENVIRONMENTAL */}
              {activeDossierTab === "HYDRAULIC" && (
                <div className="space-y-3">
                  <div className="p-2.5 bg-[#f8fafc] rounded border border-slate-300">
                    <span className="text-slate-400 block text-[10px] font-mono">WATERWAY / CORRIDOR</span>
                    <span className="text-xs font-bold text-slate-900">{activeBridge.river}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div className="p-2.5 bg-[#f8fafc] rounded border border-slate-300">
                      <span className="text-slate-400 block text-[10px]">HFL CLEARANCE</span>
                      <span className="text-sm font-bold text-slate-900">{activeBridge.design_hfl_m} m</span>
                    </div>
                    <div className="p-2.5 bg-[#f8fafc] rounded border border-slate-300">
                      <span className="text-slate-400 block text-[10px]">DESIGN SCOUR</span>
                      <span className="text-sm font-bold text-slate-900">{activeBridge.design_scour_m} m</span>
                    </div>
                    <div className="p-2.5 bg-[#f8fafc] rounded border border-slate-300">
                      <span className="text-slate-400 block text-[10px]">SEISMIC ZONE</span>
                      <span className="text-sm font-bold text-slate-900">{activeBridge.seismic_zone}</span>
                    </div>
                    <div className="p-2.5 bg-[#f8fafc] rounded border border-slate-300">
                      <span className="text-slate-400 block text-[10px]">WIND RATING</span>
                      <span className="text-sm font-bold text-slate-900">{activeBridge.design_wind_speed_kmh} km/h</span>
                    </div>
                  </div>

                  <div className="p-3 bg-sky-50/70 border border-sky-200 rounded text-[11px] space-y-1 text-slate-700">
                    <span className="font-bold text-sky-950 font-mono block">MONSOON SURGE BEHAVIOR</span>
                    <p className="leading-relaxed">
                      Hydrodynamic bridge pier cutwaters calibrated under IRC:5 and FHWA HEC-18 standards. Real-time sonar telemetry monitors live scour depression during monsoonal discharge surges.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: STRUCTURAL HEALTH & IOT */}
              {activeDossierTab === "HEALTH" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div className="p-2.5 bg-[#f8fafc] rounded border border-slate-300">
                      <span className="text-slate-400 block text-[10px]">SETU SAFETY SCORE</span>
                      <span className="text-base font-bold text-slate-900">{activeBridge.setu_score} / 100</span>
                      <span className="text-[10px] text-emerald-700 block font-semibold">Nominal Condition</span>
                    </div>
                    <div className="p-2.5 bg-[#f8fafc] rounded border border-slate-300">
                      <span className="text-slate-400 block text-[10px]">DEFECT RISK INDEX (DRI)</span>
                      <span className="text-base font-bold text-slate-900">{activeBridge.dri_score.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-500 block">IRC:SP:35 Matrix</span>
                    </div>
                    <div className="p-2.5 bg-[#f8fafc] rounded border border-slate-300">
                      <span className="text-slate-400 block text-[10px]">ACTIVE IOT NODES</span>
                      <span className="text-sm font-bold text-slate-900">{activeBridge.active_sensors_count} Channels</span>
                      <span className="text-[10px] text-emerald-700 block">100% Online</span>
                    </div>
                    <div className="p-2.5 bg-[#f8fafc] rounded border border-slate-300">
                      <span className="text-slate-400 block text-[10px]">TRAFFIC VOLUME</span>
                      <span className="text-sm font-bold text-slate-900">{activeBridge.traffic_pcu_per_day.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 block">PCU / Day</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-100 rounded border border-slate-200 text-[11px] font-mono space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Last Certified Audit:</span>
                      <span className="font-bold text-slate-900">{activeBridge.last_inspection_date}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Inspection Frequency:</span>
                      <span className="font-bold text-slate-900">Every {activeBridge.inspection_interval_months} Months</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dossier Bottom Command Buttons */}
            <div className="p-3 bg-[#f8fafc] border-t border-slate-300 flex items-center justify-between gap-2">
              <Link
                href={`/bridges/${activeBridge.id}`}
                className="px-3 py-1.5 bg-[#1e293b] hover:bg-black text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>{t.bridges.viewDetails}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <div className="flex items-center gap-1.5">
                <Link
                  href={`/defect-ar?bridge=${activeBridge.id}`}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold transition-colors"
                >
                  Twin
                </Link>
                <Link
                  href={`/telemetry?bridge=${activeBridge.id}`}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold transition-colors"
                >
                  IoT
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4. MASTER ASSET MANAGEMENT ROSTER TABLE */}
        <div className="bg-white rounded-lg border border-slate-300 shadow-xs overflow-hidden">
          <div className="px-4 py-3 bg-[#f8fafc] border-b border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-600" />
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                REGISTERED INFRASTRUCTURE ASSET MASTER ROSTER ({filteredBridges.length} ASSETS)
              </h2>
            </div>
            <span className="font-mono text-[11px] text-slate-500">
              Verified against Wikipedia and National Road Congress Standards
            </span>
          </div>

          {filteredBridges.length === 0 ? (
            <div className="p-10 text-center space-y-3 bg-[#fafaf9]">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center mx-auto text-slate-400">
                <Filter className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 font-mono">
                0 ASSETS MATCH CURRENT FILTERS
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No registered bridges or flyovers match your current filter parameters.
              </p>
              <div className="pt-2">
                <button
                  onClick={resetAllFilters}
                  className="px-4 py-2 bg-[#1e293b] text-white rounded text-xs font-semibold hover:bg-black transition-colors"
                >
                  Reset Filters & View All {bridges.length} Assets
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f1f5f9] text-slate-700 font-mono text-[11px] border-b border-slate-300">
                    <th className="py-2.5 px-3 font-bold">ASSET CODE</th>
                    <th className="py-2.5 px-3 font-bold">INFRASTRUCTURE STRUCTURE</th>
                    <th className="py-2.5 px-3 font-bold">CATEGORY</th>
                    <th className="py-2.5 px-3 font-bold">STATE & DISTRICT</th>
                    <th className="py-2.5 px-3 font-bold">RIVER / CORRIDOR</th>
                    <th className="py-2.5 px-3 font-bold text-center">BUILT (AGE)</th>
                    <th className="py-2.5 px-3 font-bold text-center">LENGTH</th>
                    <th className="py-2.5 px-3 font-bold text-center">CONDITION</th>
                    <th className="py-2.5 px-3 font-bold text-center">SETU SCORE</th>
                    <th className="py-2.5 px-3 font-bold text-right">OPERATIONAL ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredBridges.map((b) => {
                    const isSelected = activeBridge?.id === b.id;
                    return (
                      <tr
                        key={b.id}
                        onClick={() => handleLocateBridge(b)}
                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                          isSelected ? "bg-sky-50/80 font-medium" : ""
                        }`}
                      >
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          {b.code}
                        </td>
                        <td className="py-2.5 px-3 text-slate-900 font-semibold">
                          <div className="flex flex-col">
                            <span>{localizedBridgeName(b)}</span>
                            {activeLocale !== "en" && (
                              <span className="text-[10px] text-slate-500 font-normal">{b.name}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                              b.is_flyover
                                ? "bg-amber-50 text-amber-800 border-amber-300"
                                : "bg-slate-100 text-slate-700 border-slate-300"
                            }`}
                          >
                            {b.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {b.district}, {b.state}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                          {b.river}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                          {b.year_built} ({b.age_years}y)
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                          {b.length_m >= 1000 ? `${(b.length_m / 1000).toFixed(1)} km` : `${b.length_m} m`}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <RiskTierBadge tier={b.tier} size="sm" />
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                          {b.setu_score} / 100
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLocateBridge(b);
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-800 hover:text-white bg-sky-100 hover:bg-sky-800 px-2 py-1 rounded border border-sky-300 transition-colors"
                              title="Locate on GIS Map"
                            >
                              <MapPin className="w-3 h-3" />
                              <span>Locate</span>
                            </button>
                            <Link
                              href={`/bridges/${b.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded border border-slate-300"
                            >
                              <span>Cockpit</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BridgesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-8 text-slate-500 font-mono text-xs">
          Loading Bridge Registry &amp; GIS Infrastructure...
        </div>
      }
    >
      <BridgesPageContent />
    </React.Suspense>
  );
}

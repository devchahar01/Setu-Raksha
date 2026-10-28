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
  Building2,
  Activity,
  History as HistoryIcon,
  Crosshair,
  Waves,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { RiskTierBadge } from "@/components/RiskTierBadge";
import { useAppStore } from "@/lib/store";
import { formatNumber } from "@/lib/formatters";
import { TRANSLATIONS } from "@/lib/translations";
import { triggerHaptic } from "@/lib/haptics";
import {
  MASTER_BRIDGES_DATABASE,
  BridgeAsset,
  getBridgeBasin,
} from "@/lib/bridgesData";

const BASINS = [
  "All Basins",
  "Godavari",
  "Mula-Mutha",
  "Bhima",
  "Krishna",
  "Konkan",
  "Ganges/Hooghly",
  "Brahmaputra",
];

const TIERS = ["All Tiers", "Good", "Watch", "Warning", "Critical"];

const STATES = [
  "All",
  "Maharashtra",
  "West Bengal",
  "Andhra Pradesh",
  "Assam",
  "Gujarat",
  "Jammu and Kashmir",
  "Tamil Nadu",
  "Bihar",
  "Delhi",
  "Telangana",
  "Karnataka",
  "Uttar Pradesh",
  "Goa",
  "Uttarakhand",
  "Kerala",
];

const AGE_ERAS = [
  { id: "All", labelEn: "All Eras", labelHi: "सभी युग", labelMr: "सर्व कालखंड" },
  { id: "<10", labelEn: "Modern (<10 yrs)", labelHi: "आधुनिक (<10 वर्ष)", labelMr: "आधुनिक (<१० वर्षे)" },
  { id: "10-30", labelEn: "Established (10-30 yrs)", labelHi: "स्थापित (10-30 वर्ष)", labelMr: "स्थापित (१०-३० वर्षे)" },
  { id: "30-60", labelEn: "Mid-Life (30-60 yrs)", labelHi: "मध्यम आयु (30-60 वर्ष)", labelMr: "मध्यम वय (३०-६० वर्षे)" },
  { id: ">60", labelEn: "Senior (>60 yrs)", labelHi: "वरिष्ठ (>60 वर्ष)", labelMr: "ज्येष्ठ (>६० वर्षे)" },
  { id: ">100", labelEn: "Heritage (>100 yrs)", labelHi: "विरासत (>100 वर्ष)", labelMr: "वारसा (>१०० वर्षे)" },
];

function BridgesPageContent() {
  const searchParams = useSearchParams();
  const { activeLocale, useDevanagariDigits } = useAppStore();
  const t = TRANSLATIONS[activeLocale] || TRANSLATIONS.en;

  // Filter & View State
  const [bridges] = useState<BridgeAsset[]>(MASTER_BRIDGES_DATABASE);
  const [selectedBasin, setSelectedBasin] = useState<string>("All Basins");
  const [selectedTier, setSelectedTier] = useState<string>("All Tiers");
  const [activeCategory, setActiveCategory] = useState<"ALL" | "BRIDGES" | "FLYOVERS" | "HERITAGE">("ALL");
  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedAge, setSelectedAge] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Right Panel Tab: Bridge List vs. Dossier
  const [rightPanelTab, setRightPanelTab] = useState<"LIST" | "DOSSIER">("LIST");
  const [activeDossierSubTab, setActiveDossierSubTab] = useState<"HISTORY" | "SPECS" | "HYDRAULIC" | "HEALTH">("HISTORY");

  // Active Bridge for Map & Dossier (defaults to first asset or query param)
  const [activeBridge, setActiveBridge] = useState<BridgeAsset>(MASTER_BRIDGES_DATABASE[0]);
  const [locatePulse, setLocatePulse] = useState<boolean>(false);

  // Map Controls
  const [mapType, setMapType] = useState<"k" | "h" | "p" | "m">("h");
  const [zoomLevel, setZoomLevel] = useState<number>(15);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Parse URL query parameters
  useEffect(() => {
    const bridgeParam = searchParams.get("bridge");
    const basinParam = searchParams.get("basin");
    const tierParam = searchParams.get("tier");
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

    if (basinParam && BASINS.some((b) => b.toLowerCase() === basinParam.toLowerCase())) {
      const found = BASINS.find((b) => b.toLowerCase() === basinParam.toLowerCase());
      if (found) setSelectedBasin(found);
    }

    if (tierParam && TIERS.some((t) => t.toLowerCase() === tierParam.toLowerCase())) {
      const found = TIERS.find((t) => t.toLowerCase() === tierParam.toLowerCase());
      if (found) setSelectedTier(found);
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

  // Primary filtering logic
  const filteredBridges = useMemo(() => {
    return bridges.filter((b) => {
      // 1. River Basin filter
      if (selectedBasin !== "All Basins") {
        const basin = getBridgeBasin(b);
        if (basin.toLowerCase() !== selectedBasin.toLowerCase()) return false;
      }

      // 2. Health Tier filter
      if (selectedTier !== "All Tiers" && b.tier.toLowerCase() !== selectedTier.toLowerCase()) {
        return false;
      }

      // 3. Category filter
      if (activeCategory === "FLYOVERS" && !b.is_flyover) return false;
      if (activeCategory === "BRIDGES" && b.is_flyover) return false;
      if (activeCategory === "HERITAGE" && b.age_years < 50) return false;

      // 4. State filter
      if (selectedState !== "All" && !b.state.toLowerCase().includes(selectedState.toLowerCase())) {
        return false;
      }

      // 5. Age era filter
      if (selectedAge === "<10" && b.age_years >= 10) return false;
      if (selectedAge === "10-30" && (b.age_years < 10 || b.age_years > 30)) return false;
      if (selectedAge === "30-60" && (b.age_years < 30 || b.age_years > 60)) return false;
      if (selectedAge === ">60" && b.age_years <= 60) return false;
      if (selectedAge === ">100" && b.age_years <= 100) return false;

      // 6. Text Search query
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
  }, [bridges, selectedBasin, selectedTier, activeCategory, selectedState, selectedAge, searchQuery]);

  // Fallback bridges when combined filters yield 0
  const fallbackBasinBridges = useMemo(() => {
    if (filteredBridges.length > 0) return [];
    if (selectedBasin !== "All Basins") {
      return bridges.filter((b) => getBridgeBasin(b).toLowerCase() === selectedBasin.toLowerCase());
    }
    if (selectedTier !== "All Tiers") {
      return bridges.filter((b) => b.tier.toLowerCase() === selectedTier.toLowerCase());
    }
    return bridges.slice(0, 5);
  }, [bridges, filteredBridges.length, selectedBasin, selectedTier]);

  // Reset all filters
  const resetAllFilters = () => {
    setSelectedBasin("All Basins");
    setSelectedTier("All Tiers");
    setActiveCategory("ALL");
    setSelectedState("All");
    setSelectedAge("All");
    setSearchQuery("");
    triggerHaptic("selection");
  };

  // Center & locate on map
  const handleLocateBridge = (bridge: BridgeAsset) => {
    setActiveBridge(bridge);
    setZoomLevel(16);
    setLocatePulse(true);
    triggerHaptic("medium");

    setTimeout(() => {
      setLocatePulse(false);
    }, 2000);

    if (mapContainerRef.current) {
      mapContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Google Maps URLs
  const currentLat = activeBridge?.latitude ?? 20.0063;
  const currentLng = activeBridge?.longitude ?? 73.7915;
  const googleMapsUrl = `https://maps.google.com/maps?q=${currentLat},${currentLng}&t=${mapType}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;
  const externalGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${currentLat},${currentLng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${currentLat},${currentLng}`;

  // Localized bridge name
  const localizedBridgeName = (b: BridgeAsset) => {
    if (activeLocale === "hi") return b.name_hi;
    if (activeLocale === "mr") return b.name_mr;
    return b.name;
  };

  // Service life consumption %
  const lifeConsumedPercent = Math.min(
    100,
    Math.round((activeBridge.age_years / activeBridge.design_life_y) * 100)
  );

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#0f172a] pb-16">
      {/* 1. Official Institutional Strip */}
      <div className="bg-[#ffffff] text-slate-900 py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-200 shadow-2xs">
        <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="font-bold uppercase tracking-wider text-slate-700">LEVEL 01 ASSET REGISTRY &amp; GIS INTELLIGENCE</span>
              <span>•</span>
              <span>MoRTH &amp; PWD MAHARASHTRA</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight">
              {t.bridges?.title || "National Bridge Infrastructure Asset Registry"}
            </h1>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto font-mono text-xs">
            <div className="bg-[#f8fafc] px-3 py-1.5 rounded border border-slate-200 text-slate-800">
              <span className="text-slate-400 block text-[9px] uppercase">Registered Assets</span>
              <span className="font-bold text-sm">
                {filteredBridges.length} / {bridges.length} Units
              </span>
            </div>
            <div className="bg-[#f8fafc] px-3 py-1.5 rounded border border-slate-200 text-slate-800">
              <span className="text-slate-400 block text-[9px] uppercase">Compliance Grid</span>
              <span className="font-bold text-sm text-emerald-700">IRC:SP:35 • RDSO</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 mt-4 space-y-4">
        {/* 2. RIVER BASIN & HEALTH TIER INTERACTIVE FILTERS BAR (Matching User's Screenshot) */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-2xs space-y-3">
          {/* Row 1: River Basin + Health Tier Buttons */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
            {/* River Basin Selector */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-bold text-slate-600 flex items-center gap-1 font-mono text-[11px] shrink-0">
                <Waves className="w-3.5 h-3.5 text-sky-600" />
                <span>River Basin:</span>
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                {BASINS.map((basin) => (
                  <button
                    key={basin}
                    onClick={() => {
                      setSelectedBasin(basin);
                      triggerHaptic("selection");
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                      selectedBasin === basin
                        ? "bg-[#0284c7] text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {basin}
                  </button>
                ))}
              </div>
            </div>

            {/* Health Tier Selector */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-bold text-slate-600 font-mono text-[11px] shrink-0">
                Health Tier:
              </span>
              <div className="flex items-center gap-1">
                {TIERS.map((tier) => (
                  <button
                    key={tier}
                    onClick={() => {
                      setSelectedTier(tier);
                      triggerHaptic("selection");
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                      selectedTier === tier
                        ? "bg-[#0f172a] text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Search Box + Category Pills + State Select + Reset */}
          <div className="pt-2.5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by bridge code, structure name, river, district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#f8fafc] border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-600 font-medium text-slate-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Secondary Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Category Pills */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-[11px] font-medium">
                {(["ALL", "BRIDGES", "FLYOVERS", "HERITAGE"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      triggerHaptic("selection");
                    }}
                    className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                      activeCategory === cat ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* State Dropdown */}
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  triggerHaptic("selection");
                }}
                className="bg-[#f8fafc] border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 font-medium focus:outline-none"
              >
                {STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {/* Age Era Dropdown */}
              <select
                value={selectedAge}
                onChange={(e) => {
                  setSelectedAge(e.target.value);
                  triggerHaptic("selection");
                }}
                className="bg-[#f8fafc] border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 font-medium focus:outline-none"
              >
                {AGE_ERAS.map((era) => (
                  <option key={era.id} value={era.id}>
                    {activeLocale === "hi" ? era.labelHi : activeLocale === "mr" ? era.labelMr : era.labelEn}
                  </option>
                ))}
              </select>

              {/* Active Filter Clear */}
              {(selectedBasin !== "All Basins" || selectedTier !== "All Tiers" || selectedState !== "All" || selectedAge !== "All" || searchQuery !== "" || activeCategory !== "ALL") && (
                <button
                  onClick={resetAllFilters}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded flex items-center gap-1 font-semibold bg-white hover:bg-slate-50 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. SPLIT OPERATIONAL VIEW: MAP ON LEFT (7 COLS), BRIDGE LIST & DOSSIER ON RIGHT (5 COLS) */}
        <div ref={mapContainerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          {/* ======================================================== */}
          {/* LEFT: GIS Geospatial Surveillance Grid (7 Cols on LG)    */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col h-[560px]">
            {/* GIS Top Toolbar */}
            <div className="bg-[#1e293b] text-white p-2 px-3.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono border-b border-slate-700">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${locatePulse ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`}></span>
                <span className="font-bold text-white tracking-wide">
                  Geospatial Surveillance &amp; Aerial Grid
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-sky-300">
                  {currentLat.toFixed(4)}° N, {currentLng.toFixed(4)}° E
                </span>
              </div>

              {/* Layer Switcher & Nav Buttons */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5 bg-slate-800 p-0.5 rounded border border-slate-700 text-[10px]">
                  <button
                    onClick={() => {
                      setMapType("h");
                      triggerHaptic("light");
                    }}
                    className={`px-2 py-0.5 rounded font-semibold ${
                      mapType === "h" ? "bg-sky-700 text-white" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    Hybrid Aerial
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
                    Satellite
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
                    River Basin Terrain
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
                    Roadmap
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(z + 1, 19))}
                    className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-white rounded flex items-center justify-center font-bold text-xs"
                    title="Zoom In"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(z - 1, 9))}
                    className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-white rounded flex items-center justify-center font-bold text-xs"
                    title="Zoom Out"
                  >
                    -
                  </button>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-700 hover:bg-emerald-600 text-white rounded flex items-center gap-1 transition-colors"
                  >
                    <Navigation className="w-2.5 h-2.5" />
                    <span>Route</span>
                  </a>
                  <a
                    href={externalGoogleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-0.5 text-[10px] font-semibold bg-slate-700 hover:bg-slate-600 text-white rounded flex items-center gap-1 transition-colors"
                    title="Open in Google Maps"
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
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
                <span className="text-slate-700 font-semibold">{localizedBridgeName(activeBridge).split("(")[0]}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600">{activeBridge.district}, {activeBridge.state}</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT: BRIDGES LIST & DOSSIER (5 Cols on LG)             */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200/90 shadow-2xs flex flex-col h-[560px] overflow-hidden">
            {/* Top Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-[#f8fafc] text-xs font-semibold text-slate-700">
              <button
                onClick={() => {
                  setRightPanelTab("LIST");
                  triggerHaptic("selection");
                }}
                className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-r border-slate-200 transition-colors ${
                  rightPanelTab === "LIST"
                    ? "bg-white text-sky-800 font-bold border-b-2 border-b-sky-700 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-sky-600" />
                <span>Bridges Master List ({filteredBridges.length})</span>
              </button>
              <button
                onClick={() => {
                  setRightPanelTab("DOSSIER");
                  triggerHaptic("selection");
                }}
                className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors ${
                  rightPanelTab === "DOSSIER"
                    ? "bg-white text-sky-800 font-bold border-b-2 border-b-sky-700 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-slate-600" />
                <span>Civil Dossier ({activeBridge.code})</span>
              </button>
            </div>

            {/* TAB CONTENT A: SCROLLABLE LIST OF BRIDGES */}
            {rightPanelTab === "LIST" && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#fbfbfa]">
                {filteredBridges.length === 0 ? (
                  /* RECOVERY EMPTY STATE WHEN FILTER COMBINATION HAS NO EXACT MATCH */
                  <div className="p-6 text-center space-y-3 bg-white rounded-lg border border-slate-200">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center mx-auto text-slate-400">
                      <Filter className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 font-mono uppercase tracking-wide">
                      0 Assets Match: {selectedBasin} + {selectedTier}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                      No bridge in the registry currently matches both <strong className="text-slate-900">{selectedBasin}</strong> basin and <strong className="text-slate-900">{selectedTier}</strong> health tier simultaneously.
                    </p>
                    <div className="flex flex-col gap-1.5 pt-1">
                      {selectedTier !== "All Tiers" && (
                        <button
                          onClick={() => {
                            setSelectedTier("All Tiers");
                            triggerHaptic("selection");
                          }}
                          className="w-full py-1.5 bg-[#0284c7] hover:bg-sky-800 text-white rounded text-xs font-semibold transition-colors"
                        >
                          Show all bridges in {selectedBasin}
                        </button>
                      )}
                      {selectedBasin !== "All Basins" && (
                        <button
                          onClick={() => {
                            setSelectedBasin("All Basins");
                            triggerHaptic("selection");
                          }}
                          className="w-full py-1.5 bg-slate-800 hover:bg-black text-white rounded text-xs font-semibold transition-colors"
                        >
                          Show all {selectedTier} bridges statewide
                        </button>
                      )}
                      <button
                        onClick={resetAllFilters}
                        className="w-full py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded text-xs font-semibold transition-colors"
                      >
                        Reset All Filters ({bridges.length} Assets)
                      </button>
                    </div>

                    {/* Closest related bridges */}
                    {fallbackBasinBridges.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 text-left">
                        <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block mb-2">
                          Available bridges in {selectedBasin}:
                        </span>
                        <div className="space-y-2">
                          {fallbackBasinBridges.map((b) => (
                            <div
                              key={b.id}
                              onClick={() => handleLocateBridge(b)}
                              className="p-2.5 rounded border border-slate-200 bg-[#f8fafc] hover:bg-sky-50 cursor-pointer flex items-center justify-between gap-2"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-[10px] font-bold text-slate-900">{b.code}</span>
                                  <RiskTierBadge tier={b.tier} size="sm" />
                                </div>
                                <div className="text-xs font-bold text-slate-800 truncate">{localizedBridgeName(b)}</div>
                                <div className="text-[10px] text-slate-500">{b.river} • {b.district}</div>
                              </div>
                              <button className="px-2 py-1 text-[10px] font-semibold bg-sky-100 text-sky-800 rounded">
                                Locate
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ACTIVE MATCHES LIST */
                  filteredBridges.map((bridge) => {
                    const isSelected = activeBridge?.id === bridge.id;
                    return (
                      <div
                        key={bridge.id}
                        onClick={() => handleLocateBridge(bridge)}
                        className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-sky-50/90 border-sky-400 shadow-xs ring-1 ring-sky-300"
                            : "bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs"
                        }`}
                      >
                        {/* Top: Code, Tier, Score */}
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {bridge.code}
                            </span>
                            <RiskTierBadge tier={bridge.tier} size="sm" />
                          </div>
                          <span className="font-mono text-xs font-bold text-slate-800">
                            Setu {bridge.setu_score} <span className="text-slate-400 text-[10px] font-normal">/ 100</span>
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-sm text-[#0f172a] leading-snug">
                          {localizedBridgeName(bridge)}
                        </h3>

                        {/* Subtitle */}
                        <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-1 mb-2">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {bridge.river} • {bridge.district}, {bridge.state}
                          </span>
                        </p>

                        {/* 3 Metrics Box */}
                        <div className="grid grid-cols-3 gap-1.5 text-[10px] bg-slate-50 p-2 rounded border border-slate-200 text-slate-700 mb-2 font-mono">
                          <div>
                            <span className="text-slate-400 block text-[9px]">Length</span>
                            <strong className="text-slate-900">{bridge.length_m} m</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px]">Built (Age)</span>
                            <strong className="text-slate-900">{bridge.year_built} ({bridge.age_years}y)</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px]">Spans</span>
                            <strong className="text-slate-900">{bridge.spans}</strong>
                          </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                          <span className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">
                            {bridge.category}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLocateBridge(bridge);
                              }}
                              className="px-2 py-1 rounded text-[11px] font-semibold bg-sky-100 text-sky-800 hover:bg-sky-200 border border-sky-300 flex items-center gap-1 transition-colors"
                            >
                              <MapPin className="w-3 h-3" />
                              <span>Locate</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveBridge(bridge);
                                setRightPanelTab("DOSSIER");
                                triggerHaptic("light");
                              }}
                              className="px-2 py-1 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors"
                            >
                              Dossier
                            </button>
                            <Link
                              href={`/bridges/${bridge.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="px-2 py-1 rounded text-[11px] font-semibold bg-[#1e293b] text-white hover:bg-black flex items-center gap-1 transition-colors"
                            >
                              <span>Cockpit</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB CONTENT B: DETAILED DOSSIER & PROVENANCE */}
            {rightPanelTab === "DOSSIER" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Dossier Header */}
                <div className="p-3 bg-[#f8fafc] border-b border-slate-200">
                  <div className="flex items-center justify-between gap-2 mb-1">
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

                  <h2 className="text-sm font-bold text-[#0f172a] leading-snug">
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

                {/* Subtabs for Dossier */}
                <div className="flex border-b border-slate-200 bg-[#f1f5f9] text-[11px] font-semibold text-slate-600">
                  <button
                    onClick={() => setActiveDossierSubTab("HISTORY")}
                    className={`flex-1 py-1.5 text-center transition-colors border-r border-slate-200 ${
                      activeDossierSubTab === "HISTORY" ? "bg-white text-slate-950 font-bold border-b-2 border-b-sky-700" : "hover:bg-slate-200"
                    }`}
                  >
                    History &amp; Age
                  </button>
                  <button
                    onClick={() => setActiveDossierSubTab("SPECS")}
                    className={`flex-1 py-1.5 text-center transition-colors border-r border-slate-200 ${
                      activeDossierSubTab === "SPECS" ? "bg-white text-slate-950 font-bold border-b-2 border-b-sky-700" : "hover:bg-slate-200"
                    }`}
                  >
                    Civil Specs
                  </button>
                  <button
                    onClick={() => setActiveDossierSubTab("HYDRAULIC")}
                    className={`flex-1 py-1.5 text-center transition-colors border-r border-slate-200 ${
                      activeDossierSubTab === "HYDRAULIC" ? "bg-white text-slate-950 font-bold border-b-2 border-b-sky-700" : "hover:bg-slate-200"
                    }`}
                  >
                    Hydraulic
                  </button>
                  <button
                    onClick={() => setActiveDossierSubTab("HEALTH")}
                    className={`flex-1 py-1.5 text-center transition-colors ${
                      activeDossierSubTab === "HEALTH" ? "bg-white text-slate-950 font-bold border-b-2 border-b-sky-700" : "hover:bg-slate-200"
                    }`}
                  >
                    Health
                  </button>
                </div>

                {/* Dossier Body */}
                <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-[#fbfbfa]">
                  {activeDossierSubTab === "HISTORY" && (
                    <div className="space-y-3">
                      {/* Service Life Consumption Gauge */}
                      <div className="p-3 bg-white rounded border border-slate-200 space-y-2">
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
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span>Built: {activeBridge.year_built}</span>
                          <span>Remaining: {activeBridge.remaining_life_y} Years</span>
                        </div>
                      </div>

                      {/* Historical Background */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-900 uppercase font-mono block">
                          Historical Background &amp; Origin
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                          {activeBridge.history_summary}
                        </p>
                      </div>

                      {/* Civil Significance */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-900 uppercase font-mono block">
                          Civil Engineering Significance
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                          {activeBridge.engineering_significance}
                        </p>
                      </div>

                      {/* Builder */}
                      <div className="p-2.5 bg-slate-100 rounded border border-slate-200 text-[11px]">
                        <span className="text-slate-500 font-medium block">Builder / Agency:</span>
                        <span className="font-bold text-slate-900">{activeBridge.builder_contractor}</span>
                      </div>
                    </div>
                  )}

                  {activeDossierSubTab === "SPECS" && (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                        <div className="p-2.5 bg-white rounded border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">TOTAL LENGTH</span>
                          <span className="text-sm font-bold text-slate-900">{activeBridge.length_m} m</span>
                        </div>
                        <div className="p-2.5 bg-white rounded border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">MAX CLEAR SPAN</span>
                          <span className="text-sm font-bold text-slate-900">{activeBridge.main_span_m} m</span>
                        </div>
                        <div className="p-2.5 bg-white rounded border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">TOTAL SPANS</span>
                          <span className="text-sm font-bold text-slate-900">{activeBridge.spans} Units</span>
                        </div>
                        <div className="p-2.5 bg-white rounded border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">DECK WIDTH</span>
                          <span className="text-sm font-bold text-slate-900">{activeBridge.width_m} m</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-white rounded border border-slate-200 space-y-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase block">Superstructure Type</span>
                        <span className="font-bold text-slate-900 block leading-tight">{activeBridge.superstructure_type}</span>
                      </div>

                      <div className="p-2.5 bg-white rounded border border-slate-200 space-y-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase block">Substructure &amp; Foundation</span>
                        <span className="font-semibold text-slate-800 block text-xs">{activeBridge.substructure_type}</span>
                        <span className="text-[11px] text-slate-600 block">{activeBridge.foundation_type} (Depth: {activeBridge.foundation_depth_m}m)</span>
                      </div>

                      <div className="p-2 bg-slate-100 rounded border border-slate-200 text-[11px] flex items-center justify-between font-mono">
                        <span className="text-slate-600">IRC Loading Class:</span>
                        <span className="font-bold text-slate-900">{activeBridge.irc_class}</span>
                      </div>
                    </div>
                  )}

                  {activeDossierSubTab === "HYDRAULIC" && (
                    <div className="space-y-2.5">
                      <div className="p-2.5 bg-white rounded border border-slate-200">
                        <span className="text-slate-400 block text-[10px] font-mono">WATERWAY / CORRIDOR</span>
                        <span className="text-xs font-bold text-slate-900">{activeBridge.river}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                        <div className="p-2.5 bg-white rounded border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">DESIGN HFL</span>
                          <span className="text-sm font-bold text-slate-900">{activeBridge.design_hfl_m} m</span>
                        </div>
                        <div className="p-2.5 bg-white rounded border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">MAX SCOUR DEPTH</span>
                          <span className="text-sm font-bold text-slate-900">{activeBridge.design_scour_m} m</span>
                        </div>
                        <div className="p-2.5 bg-white rounded border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">SEISMIC ZONE</span>
                          <span className="text-sm font-bold text-slate-900">{activeBridge.seismic_zone}</span>
                        </div>
                        <div className="p-2.5 bg-white rounded border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">DESIGN WIND</span>
                          <span className="text-sm font-bold text-slate-900">{activeBridge.design_wind_speed_kmh} km/h</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDossierSubTab === "HEALTH" && (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                        <div className="p-2.5 bg-white rounded border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">SETU HEALTH SCORE</span>
                          <span className="text-lg font-extrabold text-emerald-700">{activeBridge.setu_score} / 100</span>
                        </div>
                        <div className="p-2.5 bg-white rounded border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">DEGRADATION INDEX</span>
                          <span className="text-lg font-extrabold text-slate-900">DRI {activeBridge.dri_score}</span>
                        </div>
                      </div>
                      <div className="p-2.5 bg-slate-100 rounded border border-slate-200 text-[11px] font-mono space-y-1">
                        <div className="flex justify-between text-slate-600">
                          <span>Last Certified Audit:</span>
                          <span className="font-bold text-slate-900">{activeBridge.last_inspection_date}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Audit Cadence:</span>
                          <span className="font-bold text-slate-900">Every {activeBridge.inspection_interval_months} Months</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dossier Bottom Action Link */}
                <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between gap-2">
                  <Link
                    href={`/bridges/${activeBridge.id}`}
                    className="px-3 py-1.5 bg-[#1e293b] hover:bg-black text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span>Open Complete Civil Cockpit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => setRightPanelTab("LIST")}
                    className="text-xs text-sky-700 hover:underline font-semibold"
                  >
                    ← Back to Bridge List
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. MASTER ASSET MANAGEMENT ROSTER TABLE */}
        <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="px-4 py-3 bg-[#f8fafc] border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f1f5f9] text-slate-700 font-mono text-[11px] border-b border-slate-200">
                  <th className="py-2.5 px-3 font-bold">ASSET CODE</th>
                  <th className="py-2.5 px-3 font-bold">INFRASTRUCTURE STRUCTURE</th>
                  <th className="py-2.5 px-3 font-bold">CATEGORY</th>
                  <th className="py-2.5 px-3 font-bold">STATE &amp; DISTRICT</th>
                  <th className="py-2.5 px-3 font-bold">RIVER &amp; BASIN</th>
                  <th className="py-2.5 px-3 font-bold text-center">BUILT (AGE)</th>
                  <th className="py-2.5 px-3 font-bold text-center">LENGTH</th>
                  <th className="py-2.5 px-3 font-bold text-center">CONDITION</th>
                  <th className="py-2.5 px-3 font-bold text-center">SETU SCORE</th>
                  <th className="py-2.5 px-3 font-bold text-right">ACTION</th>
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
                      <td className="py-2.5 px-3 text-slate-600">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 border border-slate-200">
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

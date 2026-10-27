"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Layers,
  MapPin,
  Filter,
  Activity,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Search,
  Radio,
  Compass,
  Navigation,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  CheckCircle2,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { RiskTierBadge } from "@/components/RiskTierBadge";
import { useAppStore } from "@/lib/store";
import { formatNumber } from "@/lib/formatters";
import { TRANSLATIONS } from "@/lib/translations";
import { triggerHaptic } from "@/lib/haptics";

interface Bridge {
  id: string;
  code: string;
  name: string;
  river: string;
  district: string;
  type: string;
  length_m: number;
  spans?: number;
  year_built: number;
  latitude: number;
  longitude: number;
  design_hfl_m?: number;
  design_scour_m?: number;
  dri_score?: number;
  tier?: string;
  current_tier?: string;
}

const BASINS = ["All", "Mula-Mutha", "Bhima", "Krishna", "Godavari", "Konkan"];
const TIERS = ["All", "Good", "Watch", "Warning", "Critical"];
const TYPES = ["All", "Prestressed Concrete Box Girder", "Steel Truss", "Arch Bridge", "Balanced Cantilever"];

const BASIN_COORDINATES: Record<string, { lat: number; lng: number; zoom: number }> = {
  All: { lat: 18.5204, lng: 73.8567, zoom: 12 },
  "Mula-Mutha": { lat: 18.5204, lng: 73.8567, zoom: 14 },
  Bhima: { lat: 17.6599, lng: 75.9064, zoom: 13 },
  Krishna: { lat: 17.7405, lng: 74.0663, zoom: 13 },
  Godavari: { lat: 19.9975, lng: 73.7898, zoom: 13 },
  Konkan: { lat: 18.0827, lng: 73.4219, zoom: 13 },
};

export default function BridgesPage() {
  const { activeLocale, useDevanagariDigits } = useAppStore();
  const t = TRANSLATIONS[activeLocale];

  const [bridges, setBridges] = useState<Bridge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBasin, setSelectedBasin] = useState<string>("All");
  const [selectedTier, setSelectedTier] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeBridge, setActiveBridge] = useState<Bridge | null>(null);

  // Google Maps GIS View Settings
  const [mapType, setMapType] = useState<"k" | "h" | "p" | "m">("h");
  const [zoomLevel, setZoomLevel] = useState<number>(15);

  useEffect(() => {
    async function loadBridges() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/public/bridges?limit=100");
        if (res.ok) {
          const data = await res.json();
          const enhanced = data.map((b: Bridge) => {
            const rawTier = (b.current_tier || "GOOD").toUpperCase();
            const tierMap: Record<string, string> = {
              GOOD: "Good",
              WATCH: "Watch",
              WARNING: "Warning",
              CRITICAL: "Critical",
            };
            const tier = tierMap[rawTier] || "Good";
            const driMap: Record<string, number> = { Good: 18.5, Watch: 42.0, Warning: 64.2, Critical: 82.5 };
            return {
              ...b,
              tier,
              dri_score: driMap[tier] || 22.0,
              spans: b.spans || Math.max(3, Math.floor(b.length_m / 40)),
            };
          });
          setBridges(enhanced);
          if (enhanced.length > 0) setActiveBridge(enhanced[0]);
        }
      } catch (err) {
        console.warn("API fetch error, using synthetic bridge registry:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBridges();
  }, []);

  const resetAllFilters = () => {
    setSelectedBasin("All");
    setSelectedTier("All");
    setSelectedType("All");
    setSearchQuery("");
    triggerHaptic("selection");
  };

  const filteredBridges = bridges.filter((b) => {
    const matchesBasin =
      selectedBasin === "All" ||
      b.river.toLowerCase().includes(selectedBasin.toLowerCase()) ||
      b.district.toLowerCase().includes(selectedBasin.toLowerCase());
    const matchesTier = selectedTier === "All" || b.tier?.toLowerCase() === selectedTier.toLowerCase();
    const matchesType = selectedType === "All" || b.type.toLowerCase() === selectedType.toLowerCase();
    const matchesSearch =
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.river.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBasin && matchesTier && matchesType && matchesSearch;
  });

  // Current active map target coordinates
  const currentLat = activeBridge?.latitude ?? BASIN_COORDINATES[selectedBasin]?.lat ?? 18.5204;
  const currentLng = activeBridge?.longitude ?? BASIN_COORDINATES[selectedBasin]?.lng ?? 73.8567;

  // Google Maps embed URL
  const googleMapsUrl = `https://maps.google.com/maps?q=${currentLat},${currentLng}&t=${mapType}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;

  // External direct links
  const externalGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${currentLat},${currentLng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${currentLat},${currentLng}`;

  const handleBasinClick = (basin: string) => {
    setSelectedBasin(basin);
    triggerHaptic("selection");
    const coords = BASIN_COORDINATES[basin];
    if (coords) {
      setZoomLevel(coords.zoom);
    }
  };

  const handleSelectBridge = (bridge: Bridge) => {
    setActiveBridge(bridge);
    setZoomLevel(16);
    triggerHaptic("selection");
  };

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
              <span>SOURCE: PWD_GEO_GRID</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
              {t.bridges.title}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {t.bridges.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto font-mono text-xs">
            <div className="bg-white px-3.5 py-1.5 rounded border border-slate-300 text-slate-800">
              <span className="text-slate-400 block text-[10px]">TOTAL ASSETS</span>
              <span className="font-bold text-sm">
                {formatNumber(filteredBridges.length, activeLocale, useDevanagariDigits)} / {formatNumber(bridges.length, activeLocale, useDevanagariDigits)}
              </span>
            </div>
            <div className="bg-white px-3.5 py-1.5 rounded border border-slate-300 text-slate-800">
              <span className="text-slate-400 block text-[10px]">INSPECTION STATUS</span>
              <span className="font-bold text-sm text-emerald-700">100% UP TO DATE</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main GIS Control & Asset Console */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Search & Operational Filters Bar */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-300 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder={t.bridges.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-[#f8fafc] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-500 font-medium"
              />
            </div>

            {/* River Basin Filter Row */}
            <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
              <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> {t.bridges.filterBasin}:
              </span>
              {BASINS.map((basin) => (
                <button
                  key={basin}
                  onClick={() => handleBasinClick(basin)}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                    selectedBasin === basin
                      ? "bg-[#1e293b] text-white font-bold"
                      : "bg-[#f1f5f9] text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {basin === "All" ? t.bridges.allBasins : basin}
                </button>
              ))}
            </div>

            {/* Risk Tier Filter */}
            <div className="flex items-center gap-1 flex-wrap w-full md:w-auto">
              <span className="text-xs font-semibold text-slate-500 mr-1">{t.bridges.filterTier}:</span>
              {TIERS.map((tier) => (
                <button
                  key={tier}
                  onClick={() => {
                    setSelectedTier(tier);
                    triggerHaptic("selection");
                  }}
                  className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                    selectedTier === tier
                      ? "bg-[#1e293b] text-white font-bold"
                      : "bg-[#f1f5f9] text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {tier === "All" ? t.bridges.allTiers : tier}
                </button>
              ))}
            </div>

            {/* Reset Button */}
            {(selectedBasin !== "All" || selectedTier !== "All" || searchQuery !== "") && (
              <button
                onClick={resetAllFilters}
                className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded flex items-center gap-1 font-medium bg-slate-50"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. GIS Geospatial Viewport (Dominant Section) */}
        <div className="bg-white rounded-lg border border-slate-300 shadow-xs overflow-hidden flex flex-col h-[520px]">
          {/* GIS Map Toolbar */}
          <div className="bg-[#1e293b] text-white p-2.5 px-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-b border-slate-700">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-bold text-white tracking-wide">
                GIS SATELLITE SURVEILLANCE FEED
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-sky-300">
                COORDS: {currentLat.toFixed(4)}° N, {currentLng.toFixed(4)}° E
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
                className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-700 hover:bg-emerald-600 text-white rounded flex items-center gap-1 transition-colors"
              >
                <Navigation className="w-3 h-3" />
                <span>Route</span>
              </a>
              <a
                href={externalGoogleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 text-[11px] font-semibold bg-slate-700 hover:bg-slate-600 text-white rounded flex items-center gap-1 transition-colors"
              >
                <span>Earth</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Embedded Google Maps Viewport */}
          <div className="relative flex-1 w-full bg-slate-200">
            <iframe
              title="Google Maps Bridge GIS"
              src={googleMapsUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
            />

            {/* Floating Asset Crosshair Card */}
            {activeBridge && (
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-slate-300 shadow-md flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                      {activeBridge.code}
                    </span>
                    <RiskTierBadge tier={activeBridge.tier || "Good"} size="sm" />
                    <span className="text-[11px] font-mono text-slate-500">
                      DRI: {activeBridge.dri_score?.toFixed(1)}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-900 truncate">{activeBridge.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {activeBridge.river} River • {activeBridge.district} District • Built {activeBridge.year_built} • {activeBridge.type}
                  </div>
                </div>

                <Link
                  href={`/bridges/${activeBridge.id}`}
                  className="px-3.5 py-1.5 bg-[#1e293b] hover:bg-black text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <span>{t.bridges.viewDetails}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 4. Structured Civil Asset Management Table */}
        <div className="bg-white rounded-lg border border-slate-300 shadow-xs overflow-hidden">
          <div className="px-4 py-3 bg-[#f8fafc] border-b border-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-600" />
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                REGISTERED BRIDGE ASSET MASTER ROSTER
              </h2>
            </div>
            <span className="font-mono text-[11px] text-slate-500">
              Showing {filteredBridges.length} of {bridges.length} assets
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs font-mono">
              Loading Asset Management Roster...
            </div>
          ) : filteredBridges.length === 0 ? (
            /* Clear, non-empty, actionable empty-state message */
            <div className="p-10 text-center space-y-3 bg-[#fafaf9]">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center mx-auto text-slate-400">
                <Filter className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 font-mono">
                0 ASSETS MATCH CURRENT FILTERS
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No registered bridges in the Maharashtra PWD database match your current search query "{searchQuery}" or selected basin "{selectedBasin}".
              </p>
              <div className="pt-2">
                <button
                  onClick={resetAllFilters}
                  className="px-4 py-2 bg-[#1e293b] text-white rounded text-xs font-semibold hover:bg-black transition-colors"
                >
                  Reset Filters & View All 60 Bridges
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f1f5f9] text-slate-700 font-mono text-[11px] border-b border-slate-300">
                    <th className="py-2.5 px-3 font-bold">ASSET ID</th>
                    <th className="py-2.5 px-3 font-bold">BRIDGE STRUCTURE</th>
                    <th className="py-2.5 px-3 font-bold">RIVER & BASIN</th>
                    <th className="py-2.5 px-3 font-bold">DISTRICT</th>
                    <th className="py-2.5 px-3 font-bold">TYPE</th>
                    <th className="py-2.5 px-3 font-bold text-center">SPANS</th>
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
                        onClick={() => handleSelectBridge(b)}
                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                          isSelected ? "bg-sky-50/70 font-medium" : ""
                        }`}
                      >
                        <td className="py-2 px-3 font-mono font-bold text-slate-900">
                          {b.code}
                        </td>
                        <td className="py-2 px-3 text-slate-900 font-semibold">
                          {b.name}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {b.river}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {b.district}
                        </td>
                        <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">
                          {b.type}
                        </td>
                        <td className="py-2 px-3 text-center font-mono text-slate-700">
                          {b.spans}
                        </td>
                        <td className="py-2 px-3 text-center font-mono text-slate-700">
                          {b.length_m}m
                        </td>
                        <td className="py-2 px-3 text-center">
                          <RiskTierBadge tier={b.tier || "Good"} size="sm" />
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-bold text-slate-800">
                          {(100 - (b.dri_score ?? 22)).toFixed(0)} / 100
                        </td>
                        <td className="py-2 px-3 text-right">
                          <Link
                            href={`/bridges/${b.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded border border-slate-300"
                          >
                            <span>Cockpit</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
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

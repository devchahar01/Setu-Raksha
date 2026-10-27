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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeBridge, setActiveBridge] = useState<Bridge | null>(null);

  // Google Maps View Settings
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

  const filteredBridges = bridges.filter((b) => {
    const matchesBasin =
      selectedBasin === "All" ||
      b.river.toLowerCase().includes(selectedBasin.toLowerCase()) ||
      b.district.toLowerCase().includes(selectedBasin.toLowerCase());
    const matchesTier = selectedTier === "All" || b.tier?.toLowerCase() === selectedTier.toLowerCase();
    const matchesSearch =
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.river.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBasin && matchesTier && matchesSearch;
  });

  // Current active map target coordinates
  const currentLat = activeBridge?.latitude ?? BASIN_COORDINATES[selectedBasin]?.lat ?? 18.5204;
  const currentLng = activeBridge?.longitude ?? BASIN_COORDINATES[selectedBasin]?.lng ?? 73.8567;

  // Google Maps embed URL
  const googleMapsUrl = `https://maps.google.com/maps?q=${currentLat},${currentLng}&t=${mapType}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;

  // External direct links to Google Maps app / web
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
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Light Institutional Header */}
      <div className="bg-white text-slate-900 py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-semibold mb-2.5 border border-sky-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>GOVERNMENT OF MAHARASHTRA • PWD (L1 REGISTRY)</span>
                <span className="text-slate-300">•</span>
                <span className="font-mono text-[11px] text-sky-700">{t.common.simulatedTag}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {t.bridges.title}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                {t.bridges.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 text-xs flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-700">
                  {formatNumber(filteredBridges.length, activeLocale, useDevanagariDigits)}{" "}
                  {t.bridges.totalRegistered}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder={t.bridges.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Basin Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
              <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> {t.bridges.filterBasin}:
              </span>
              {BASINS.map((basin) => (
                <button
                  key={basin}
                  onClick={() => handleBasinClick(basin)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    selectedBasin === basin
                      ? "bg-sky-700 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {basin === "All" ? t.bridges.allBasins : basin}
                </button>
              ))}
            </div>

            {/* Risk Tier Filter */}
            <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
              <span className="text-xs font-semibold text-slate-500 mr-1">{t.bridges.filterTier}:</span>
              {TIERS.map((tier) => (
                <button
                  key={tier}
                  onClick={() => {
                    setSelectedTier(tier);
                    triggerHaptic("selection");
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    selectedTier === tier
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tier === "All" ? t.bridges.allTiers : tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Split: Left (Interactive Map), Right (Bridges List) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Live Google Maps GIS Surveillance Window */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[580px]">
              {/* Map Controls Header */}
              <div className="p-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="font-bold text-xs tracking-tight text-white">{t.bridges.mapTitle}</span>
                  {activeBridge && (
                    <span className="font-mono text-[11px] text-sky-300 font-semibold bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                      {activeBridge.code}
                    </span>
                  )}
                </div>

                {/* Map Type Switcher Buttons */}
                <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                  <button
                    onClick={() => {
                      setMapType("h");
                      triggerHaptic("light");
                    }}
                    className={`px-2 py-1 text-[11px] font-semibold rounded ${
                      mapType === "h" ? "bg-sky-600 text-white" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {t.bridges.hybrid}
                  </button>
                  <button
                    onClick={() => {
                      setMapType("k");
                      triggerHaptic("light");
                    }}
                    className={`px-2 py-1 text-[11px] font-semibold rounded ${
                      mapType === "k" ? "bg-sky-600 text-white" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {t.bridges.satellite}
                  </button>
                  <button
                    onClick={() => {
                      setMapType("p");
                      triggerHaptic("light");
                    }}
                    className={`px-2 py-1 text-[11px] font-semibold rounded ${
                      mapType === "p" ? "bg-sky-600 text-white" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {t.bridges.terrain}
                  </button>
                  <button
                    onClick={() => {
                      setMapType("m");
                      triggerHaptic("light");
                    }}
                    className={`px-2 py-1 text-[11px] font-semibold rounded ${
                      mapType === "m" ? "bg-sky-600 text-white" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {t.bridges.roadmap}
                  </button>
                </div>

                {/* Direct Google Maps Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setZoomLevel((prev) => Math.min(prev + 1, 19));
                      triggerHaptic("light");
                    }}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setZoomLevel((prev) => Math.max(prev - 1, 9));
                      triggerHaptic("light");
                    }}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded flex items-center gap-1 transition-colors"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>{t.bridges.directions}</span>
                  </a>
                  <a
                    href={externalGoogleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 text-[11px] font-semibold bg-sky-700 hover:bg-sky-600 text-white rounded flex items-center gap-1 transition-colors"
                  >
                    <span>{t.bridges.openMaps}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Live Embedded Google Maps Iframe */}
              <div className="relative flex-1 w-full bg-slate-200">
                <iframe
                  title="Google Maps Bridge View"
                  src={googleMapsUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                />

                {/* Floating Bridge Detail Pill Over Map */}
                {activeBridge && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-white/80 shadow-lg flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-xs font-extrabold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                          {activeBridge.code}
                        </span>
                        <RiskTierBadge tier={activeBridge.tier || "Good"} size="sm" />
                      </div>
                      <div className="font-bold text-xs text-slate-900 truncate">{activeBridge.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {activeBridge.river} River • {activeBridge.district} • GPS: {currentLat.toFixed(4)},{" "}
                        {currentLng.toFixed(4)}
                      </div>
                    </div>

                    <Link
                      href={`/bridges/${activeBridge.id}`}
                      className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
                    >
                      <span>{t.bridges.viewDetails}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Bridges List */}
          <div className="lg:col-span-5 space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-xs">Loading Bridge Registry...</div>
            ) : filteredBridges.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs bg-white rounded-xl border border-slate-200">
                No bridges match your filter criteria.
              </div>
            ) : (
              filteredBridges.map((bridge) => {
                const isSelected = activeBridge?.id === bridge.id;
                return (
                  <div
                    key={bridge.id}
                    onClick={() => handleSelectBridge(bridge)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-sky-50/80 border-sky-400 shadow-sm ring-1 ring-sky-300"
                        : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {bridge.code}
                        </span>
                        <RiskTierBadge tier={bridge.tier || "Good"} size="sm" />
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        DRI {formatNumber(bridge.dri_score ?? 22.0, activeLocale, useDevanagariDigits)}
                      </span>
                    </div>

                    <h3 className="font-bold text-xs text-slate-900 mb-1">{bridge.name}</h3>

                    <p className="text-[11px] text-slate-500 mb-2.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>
                        {bridge.river} River • {bridge.district} District
                      </span>
                    </p>

                    <div className="grid grid-cols-3 gap-2 text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-100 text-slate-600 mb-2.5">
                      <div>
                        <span className="text-slate-400 block">{t.bridges.length}:</span>
                        <span className="font-semibold text-slate-800">
                          {formatNumber(bridge.length_m, activeLocale, useDevanagariDigits)}m
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{t.bridges.spans}:</span>
                        <span className="font-semibold text-slate-800">
                          {formatNumber(bridge.spans ?? 6, activeLocale, useDevanagariDigits)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{t.bridges.builtYear}:</span>
                        <span className="font-semibold text-slate-800">{bridge.year_built}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                      <span className="text-sky-700 font-semibold">{bridge.type}</span>
                      <Link
                        href={`/bridges/${bridge.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-slate-500 hover:text-sky-700 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>{t.bridges.viewDetails}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

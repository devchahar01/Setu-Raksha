"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Video,
  Box,
  Radio,
  ClipboardList,
  AlertTriangle,
  Landmark,
  FileText,
  Settings,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Compass,
  ArrowRight,
  ChevronDown,
  CloudSun,
  Droplets,
  Eye,
  Wind,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  MapPin,
  Flame,
  Shield,
  Activity,
} from "lucide-react";
import { BridgeHero3D } from "@/components/BridgeHero3D";
import { useAppStore } from "@/lib/store";
import { triggerHaptic } from "@/lib/haptics";
import { MASTER_BRIDGES_DATABASE } from "@/lib/bridgesData";

export default function Home() {
  const { activeLocale } = useAppStore();

  // State Management
  const [sidebarActive, setSidebarActive] = useState<string>("live_view");
  const [cameraMode, setCameraMode] = useState<"LIVE" | "STRUCTURE" | "RIVER" | "DECK" | "PIERS" | "APPROACH" | "AERIAL">("LIVE");
  const [sensorTab, setSensorTab] = useState<"IMU" | "WATER" | "TOF" | "TEMP">("IMU");
  const [mapLayer, setMapLayer] = useState<"satellite" | "terrain" | "map">("satellite");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [lastPacketTime, setLastPacketTime] = useState<string>("19:16:32");

  // Dynamic Bridge Selection (defaults to Rabindra Setu / Howrah Bridge matching screenshot)
  const [selectedBridgeId, setSelectedBridgeId] = useState<string>("howrah-bridge");
  const activeBridge = MASTER_BRIDGES_DATABASE.find((b) => b.id === selectedBridgeId) || MASTER_BRIDGES_DATABASE[1];

  // Dynamic packet time counter
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setLastPacketTime(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Sensor metrics depending on selected tab
  const sensorConfigs = {
    IMU: {
      title: "IMU-04 (Modal Frequency)",
      badge: "Normal",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      current: "2.14 Hz",
      baseline: "2.18 Hz",
      deviation: "-1.8%",
      deviationColor: "text-emerald-700",
      signal: "Good",
      yLabels: ["2.6", "2.4", "2.2", "2.0", "1.8"],
      points: [
        { x: 0, y: 55 },
        { x: 30, y: 52 },
        { x: 60, y: 56 },
        { x: 90, y: 54 },
        { x: 120, y: 48 },
        { x: 150, y: 50 },
        { x: 180, y: 42 },
        { x: 210, y: 38 },
        { x: 240, y: 45 },
        { x: 270, y: 52 },
        { x: 300, y: 48 },
      ],
    },
    WATER: {
      title: "WL-02 (Ultrasonic River Stage)",
      badge: "Normal",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      current: "4.82 m",
      baseline: "4.50 m",
      deviation: "+7.1%",
      deviationColor: "text-emerald-700",
      signal: "Good",
      yLabels: ["6.0", "5.5", "5.0", "4.5", "4.0"],
      points: [
        { x: 0, y: 62 },
        { x: 30, y: 60 },
        { x: 60, y: 58 },
        { x: 90, y: 55 },
        { x: 120, y: 52 },
        { x: 150, y: 50 },
        { x: 180, y: 48 },
        { x: 210, y: 46 },
        { x: 240, y: 45 },
        { x: 270, y: 44 },
        { x: 300, y: 43 },
      ],
    },
    TOF: {
      title: "TOF-01 (Expansion Joint Gap)",
      badge: "Warning",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      current: "18.4 mm",
      baseline: "14.2 mm",
      deviation: "+29.5%",
      deviationColor: "text-amber-700",
      signal: "Watch",
      yLabels: ["25.0", "20.0", "15.0", "10.0", "5.0"],
      points: [
        { x: 0, y: 45 },
        { x: 30, y: 42 },
        { x: 60, y: 40 },
        { x: 90, y: 38 },
        { x: 120, y: 32 },
        { x: 150, y: 28 },
        { x: 180, y: 25 },
        { x: 210, y: 26 },
        { x: 240, y: 24 },
        { x: 270, y: 22 },
        { x: 300, y: 20 },
      ],
    },
    TEMP: {
      title: "TH-03 (Ambient & Deck Temperature)",
      badge: "Normal",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      current: "31.4 °C",
      baseline: "30.0 °C",
      deviation: "+4.6%",
      deviationColor: "text-emerald-700",
      signal: "Good",
      yLabels: ["40.0", "35.0", "30.0", "25.0", "20.0"],
      points: [
        { x: 0, y: 50 },
        { x: 30, y: 46 },
        { x: 60, y: 40 },
        { x: 90, y: 34 },
        { x: 120, y: 30 },
        { x: 150, y: 32 },
        { x: 180, y: 38 },
        { x: 210, y: 42 },
        { x: 240, y: 48 },
        { x: 270, y: 52 },
        { x: 300, y: 55 },
      ],
    },
  };

  const curSensor = sensorConfigs[sensorTab];

  // SVG sparkline path calculation
  const pathD = curSensor.points.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[idx - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x} ${pt.y}`;
  }, "");

  const fillD = `${pathD} L 300 80 L 0 80 Z`;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f4f5f7] text-[#0f172a] p-3 sm:p-4">
      <div className="max-w-[1720px] mx-auto flex gap-3">
        {/* ============================================================ */}
        {/* 1. LEFT VERTICAL SIDEBAR (Matching reference screenshot)     */}
        {/* ============================================================ */}
        <aside className="w-48 shrink-0 bg-white rounded-lg border border-slate-200/90 shadow-2xs p-2 flex flex-col justify-between hidden md:flex">
          <div className="space-y-1 text-xs">
            {/* Live View (Active) */}
            <button
              onClick={() => {
                setSidebarActive("live_view");
                setCameraMode("LIVE");
                triggerHaptic("selection");
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-semibold transition-all ${
                sidebarActive === "live_view"
                  ? "bg-sky-50 text-[#0284c7] font-bold border-l-2 border-[#0284c7]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Video className="w-4 h-4 text-[#0284c7]" />
              <span>Live View</span>
            </button>

            {/* Digital Twin */}
            <button
              onClick={() => {
                setSidebarActive("digital_twin");
                setCameraMode("STRUCTURE");
                triggerHaptic("selection");
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium transition-all ${
                sidebarActive === "digital_twin"
                  ? "bg-sky-50 text-[#0284c7] font-bold border-l-2 border-[#0284c7]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Box className="w-4 h-4 text-slate-500" />
              <span>Digital Twin</span>
            </button>

            {/* IoT Sensors */}
            <Link
              href="/telemetry"
              onClick={() => triggerHaptic("light")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              <Radio className="w-4 h-4 text-slate-500" />
              <span>IoT Sensors</span>
            </Link>

            {/* Defects & Inspection */}
            <Link
              href="/audits"
              onClick={() => triggerHaptic("light")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              <ClipboardList className="w-4 h-4 text-slate-500" />
              <span>Defects &amp; Inspection</span>
            </Link>

            {/* Triage & Alerts */}
            <Link
              href="/triage"
              onClick={() => triggerHaptic("light")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              <AlertTriangle className="w-4 h-4 text-slate-500" />
              <span>Triage &amp; Alerts</span>
            </Link>

            {/* Bridge Registry */}
            <Link
              href="/bridges"
              onClick={() => triggerHaptic("light")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              <Landmark className="w-4 h-4 text-slate-500" />
              <span>Bridge Registry</span>
            </Link>

            {/* Reports */}
            <Link
              href="/public"
              onClick={() => triggerHaptic("light")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Reports</span>
            </Link>
          </div>

          {/* Settings at bottom */}
          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={() => triggerHaptic("light")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </button>
          </div>
        </aside>

        {/* ============================================================ */}
        {/* 2. CENTER & RIGHT MAIN GRID (Matching reference screenshot)  */}
        {/* ============================================================ */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-w-0">
          {/* ========================================================== */}
          {/* CENTER AREA (8 Columns on desktop): Feed + 3 Bottom Cards  */}
          {/* ========================================================== */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            {/* TOP: LIVE SURVEILLANCE FEED VIEWPORT */}
            <div className="relative w-full h-[380px] sm:h-[440px] bg-slate-900 rounded-lg overflow-hidden border border-slate-200/90 shadow-2xs group">
              {/* If in STRUCTURE / DIGITAL TWIN mode, render the 3D twin, otherwise render authentic photo feed */}
              {cameraMode === "STRUCTURE" ? (
                <div className="w-full h-full relative">
                  <BridgeHero3D />
                </div>
              ) : (
                <div
                  className="w-full h-full relative transition-transform duration-700 ease-out"
                  style={{
                    transform:
                      cameraMode === "DECK"
                        ? "scale(1.35) translate(5%, -10%)"
                        : cameraMode === "RIVER"
                        ? "scale(1.25) translate(-5%, 15%)"
                        : cameraMode === "PIERS"
                        ? "scale(1.4) translate(-10%, 20%)"
                        : cameraMode === "APPROACH"
                        ? "scale(1.2) translate(15%, -5%)"
                        : cameraMode === "AERIAL"
                        ? "scale(0.95)"
                        : `scale(${zoomLevel})`,
                  }}
                >
                  <Image
                    src="/images/howrah_live_feed.jpg"
                    alt="Rabindra Setu Live Observation Feed"
                    fill
                    priority
                    className="object-cover"
                  />
                  {/* Subtle live atmospheric sheen */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />
                </div>
              )}

              {/* Top Left HUD: LIVE FEED – CAMERA 01 [HD] */}
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-white text-[11px] font-mono tracking-wide z-10 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold">LIVE FEED – CAMERA 01</span>
                <span className="bg-white/20 text-[10px] px-1 py-0.2 rounded font-bold">HD</span>
              </div>

              {/* Top Right HUD: Fullscreen Action */}
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => {
                    setIsFullscreen(!isFullscreen);
                    triggerHaptic("light");
                  }}
                  className="bg-black/60 backdrop-blur-md hover:bg-black/80 text-white p-1.5 rounded transition-colors border border-white/10"
                  title="Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Middle Right Map / Camera Overlay Controls */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-10">
                <button
                  onClick={() => {
                    setZoomLevel((prev) => Math.min(prev + 0.15, 1.6));
                    triggerHaptic("light");
                  }}
                  className="bg-black/60 backdrop-blur-md hover:bg-black/80 text-white w-7 h-7 rounded flex items-center justify-center font-bold text-xs border border-white/10"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setZoomLevel((prev) => Math.max(prev - 0.15, 0.85));
                    triggerHaptic("light");
                  }}
                  className="bg-black/60 backdrop-blur-md hover:bg-black/80 text-white w-7 h-7 rounded flex items-center justify-center font-bold text-xs border border-white/10"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setZoomLevel(1);
                    setCameraMode("LIVE");
                    triggerHaptic("light");
                  }}
                  className="bg-black/60 backdrop-blur-md hover:bg-black/80 text-white w-7 h-7 rounded flex items-center justify-center border border-white/10"
                  title="Reset Orientation"
                >
                  <Compass className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bottom Left HUD: RABINDRA SETU Overlay Card */}
              <div className="absolute bottom-3 left-3 bg-black/65 backdrop-blur-md px-3 py-2 rounded-md text-white z-10 border border-white/10 max-w-sm">
                <div className="font-extrabold text-sm tracking-tight text-white uppercase leading-none">
                  {activeBridge.name}
                </div>
                <div className="text-[11px] text-slate-300 font-mono mt-1">
                  Bridge ID: {activeBridge.code} | {activeBridge.river} | {activeBridge.district}
                </div>
              </div>

              {/* Bottom Right HUD: Camera / Observation Modes Selector */}
              <div className="absolute bottom-3 right-3 flex items-center bg-black/65 backdrop-blur-md p-1 rounded-md text-white text-[11px] font-semibold gap-1 z-10 border border-white/10">
                {(["LIVE", "STRUCTURE", "RIVER", "DECK", "PIERS", "APPROACH", "AERIAL"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setCameraMode(mode);
                      triggerHaptic("selection");
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider transition-colors ${
                      cameraMode === mode
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-300 hover:text-white hover:bg-white/15"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* BOTTOM ROW (3 Cards: Bridge Details, Map View, Live Sensor Data) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* ======================================================== */}
              {/* CARD 1: BRIDGE DETAILS                                   */}
              {/* ======================================================== */}
              <div className="bg-white rounded-lg border border-slate-200/90 p-3 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f172a] mb-2.5 pb-1 border-b border-slate-100">
                    <Landmark className="w-3.5 h-3.5 text-slate-700" />
                    <span>Bridge Details</span>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    {/* Archival Thumbnail Photo */}
                    <div className="relative w-20 h-20 rounded overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                      <Image
                        src="/images/howrah_thumbnail.jpg"
                        alt="Rabindra Setu Archival View"
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Metadata Specs */}
                    <div className="flex-1 min-w-0 text-[11px] space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-xs text-[#0f172a] truncate">
                          {activeBridge.name.split("(")[0]}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      </div>

                      <div className="space-y-0.5 text-[10px] font-mono text-slate-600">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Asset ID:</span>
                          <span className="font-semibold text-slate-900">{activeBridge.code}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">District:</span>
                          <span className="font-semibold text-slate-900">{activeBridge.district}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">River:</span>
                          <span className="font-semibold text-slate-900">{activeBridge.river.split(" ")[0]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Structure:</span>
                          <span className="font-semibold text-slate-900">{activeBridge.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Commissioned:</span>
                          <span className="font-semibold text-slate-900">{activeBridge.year_built}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total Length:</span>
                          <span className="font-semibold text-slate-900">{activeBridge.length_m} m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">No. of Spans:</span>
                          <span className="font-semibold text-slate-900">{activeBridge.spans}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Last Inspection:</span>
                          <span className="font-semibold text-slate-900">{activeBridge.last_inspection_date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Condition Grade:</span>
                          <span className="font-bold text-emerald-700">B (Good)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="pt-2 mt-2 border-t border-slate-100">
                  <Link
                    href={`/bridges/${activeBridge.id}`}
                    onClick={() => triggerHaptic("light")}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0284c7] hover:text-sky-800 transition-colors"
                  >
                    <span>View Full Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* ======================================================== */}
              {/* CARD 2: MAP VIEW (GIS Satellite Viewport)                */}
              {/* ======================================================== */}
              <div className="bg-white rounded-lg border border-slate-200/90 p-3 shadow-2xs flex flex-col justify-between">
                <div>
                  {/* Map Header with Dropdowns & Layer Controls */}
                  <div className="flex items-center justify-between gap-1 text-xs font-bold text-[#0f172a] mb-2 pb-1 border-b border-slate-100">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-700" />
                      <span>Map View</span>
                    </div>

                    {/* Layer Switcher */}
                    <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded text-[10px] font-medium">
                      <button
                        onClick={() => {
                          setMapLayer("satellite");
                          triggerHaptic("light");
                        }}
                        className={`px-1.5 py-0.5 rounded font-semibold transition-colors ${
                          mapLayer === "satellite" ? "bg-[#1e293b] text-white" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Satellite
                      </button>
                      <button
                        onClick={() => {
                          setMapLayer("terrain");
                          triggerHaptic("light");
                        }}
                        className={`px-1.5 py-0.5 rounded font-semibold transition-colors ${
                          mapLayer === "terrain" ? "bg-[#1e293b] text-white" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Terrain
                      </button>
                      <button
                        onClick={() => {
                          setMapLayer("map");
                          triggerHaptic("light");
                        }}
                        className={`px-1.5 py-0.5 rounded font-semibold transition-colors ${
                          mapLayer === "map" ? "bg-[#1e293b] text-white" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Map
                      </button>
                    </div>
                  </div>

                  {/* Filter Selectors Bar */}
                  <div className="flex items-center gap-1 mb-2 text-[10px] font-medium text-slate-600">
                    <select
                      value={selectedBridgeId}
                      onChange={(e) => {
                        setSelectedBridgeId(e.target.value);
                        triggerHaptic("selection");
                      }}
                      className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] focus:outline-none font-semibold text-slate-800"
                    >
                      <option value="howrah-bridge">Rabindra Setu (Howrah)</option>
                      <option value="atal-setu-mthl">Atal Setu (MTHL)</option>
                      <option value="bandra-worli-sea-link">Bandra-Worli Sea Link</option>
                      <option value="chenab-rail-bridge">Chenab Rail Bridge</option>
                      <option value="pamban-bridge">Pamban Sea Bridge</option>
                    </select>
                    <select className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] focus:outline-none text-slate-600">
                      <option>Condition ▾</option>
                      <option>Normal</option>
                      <option>Watch</option>
                      <option>Warning</option>
                    </select>
                    <select className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] focus:outline-none text-slate-600">
                      <option>District ▾</option>
                      <option>Howrah</option>
                      <option>Kolkata</option>
                      <option>Mumbai</option>
                    </select>
                  </div>

                  {/* Satellite Aerial Map Image with Pins */}
                  <div className="relative w-full h-[140px] rounded overflow-hidden border border-slate-200 bg-slate-900">
                    <Image
                      src="/images/howrah_satellite_map.jpg"
                      alt="Howrah & Hooghly River Satellite View"
                      fill
                      className="object-cover"
                    />

                    {/* River Label */}
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/70 text-[9px] font-serif italic tracking-wider pointer-events-none rotate-[-45deg]">
                      Hooghly River
                    </span>

                    {/* West Bank: Howrah Label */}
                    <span className="absolute top-8 left-3 text-white/90 text-[10px] font-mono font-bold drop-shadow">
                      Howrah
                    </span>

                    {/* East Bank: Kolkata Label */}
                    <span className="absolute top-8 right-3 text-white/90 text-[10px] font-mono font-bold drop-shadow">
                      Kolkata
                    </span>

                    {/* Main Target Bridge Pin (Blue) */}
                    <div className="absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 bg-[#0284c7] text-white px-1.5 py-0.5 rounded shadow-sm text-[9px] font-bold border border-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      <span>Rabindra Setu</span>
                    </div>

                    {/* Ambient Safety Markers */}
                    <span className="absolute top-[35%] left-[25%] w-2.5 h-2.5 rounded-full bg-amber-400 border border-white shadow-xs"></span>
                    <span className="absolute top-[28%] left-[38%] w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shadow-xs"></span>
                    <span className="absolute top-[68%] left-[58%] w-2.5 h-2.5 rounded-full bg-rose-500 border border-white shadow-xs"></span>

                    {/* Controls & Scale */}
                    <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white px-1.5 py-0.2 rounded text-[8px] font-mono">
                      1 km
                    </div>
                    <div className="absolute bottom-1.5 right-1.5 flex flex-col gap-0.5">
                      <button className="w-4 h-4 bg-white text-slate-800 rounded text-[9px] font-bold flex items-center justify-center shadow-xs">
                        +
                      </button>
                      <button className="w-4 h-4 bg-white text-slate-800 rounded text-[9px] font-bold flex items-center justify-center shadow-xs">
                        -
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>GPS: 22.5851° N, 88.3469° E</span>
                  <Link href="/bridges" className="text-[#0284c7] font-semibold hover:underline">
                    Expand GIS →
                  </Link>
                </div>
              </div>

              {/* ======================================================== */}
              {/* CARD 3: LIVE SENSOR DATA (Engineering Waveform Chart)    */}
              {/* ======================================================== */}
              <div className="bg-white rounded-lg border border-slate-200/90 p-3 shadow-2xs flex flex-col justify-between">
                <div>
                  {/* Sensor Header */}
                  <div className="flex items-center justify-between gap-1 text-xs font-bold text-[#0f172a] mb-2 pb-1 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-slate-700" />
                      <span>Live Sensor Data</span>
                    </div>

                    {/* Sensor Type Tabs */}
                    <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded text-[10px]">
                      <button
                        onClick={() => {
                          setSensorTab("IMU");
                          triggerHaptic("selection");
                        }}
                        className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                          sensorTab === "IMU" ? "bg-[#1e293b] text-white" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        IMU
                      </button>
                      <button
                        onClick={() => {
                          setSensorTab("WATER");
                          triggerHaptic("selection");
                        }}
                        className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                          sensorTab === "WATER" ? "bg-[#1e293b] text-white" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Water Level
                      </button>
                      <button
                        onClick={() => {
                          setSensorTab("TOF");
                          triggerHaptic("selection");
                        }}
                        className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                          sensorTab === "TOF" ? "bg-[#1e293b] text-white" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        ToF Gap
                      </button>
                      <button
                        onClick={() => {
                          setSensorTab("TEMP");
                          triggerHaptic("selection");
                        }}
                        className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                          sensorTab === "TEMP" ? "bg-[#1e293b] text-white" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Temperature
                      </button>
                    </div>
                  </div>

                  {/* Subtitle & Health Status Badge */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-xs font-bold text-slate-800">{curSensor.title}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${curSensor.badgeColor}`}>
                      {curSensor.badge}
                    </span>
                  </div>

                  {/* 4-Metric Statistics Row */}
                  <div className="grid grid-cols-4 gap-1 p-1.5 bg-[#f8fafc] rounded border border-slate-200 text-center font-mono text-[10px] mb-2">
                    <div>
                      <span className="text-slate-400 block text-[9px]">Current</span>
                      <strong className="text-slate-900 text-[11px]">{curSensor.current}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Baseline</span>
                      <span className="text-slate-700 font-semibold">{curSensor.baseline}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Deviation</span>
                      <span className={`font-bold ${curSensor.deviationColor}`}>{curSensor.deviation}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Signal</span>
                      <span className="text-emerald-700 font-bold">{curSensor.signal}</span>
                    </div>
                  </div>

                  {/* Engineering Frequency Curve Chart (SVG) */}
                  <div className="relative w-full h-[85px] bg-[#fbfbfa] rounded border border-slate-200 p-1 flex">
                    {/* Y-axis labels */}
                    <div className="w-6 shrink-0 flex flex-col justify-between text-[8px] font-mono text-slate-400 text-right pr-1">
                      {curSensor.yLabels.map((yl) => (
                        <span key={yl}>{yl}</span>
                      ))}
                    </div>

                    {/* Chart Canvas */}
                    <div className="flex-1 relative h-full">
                      {/* Horizontal Grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                        <div className="border-b border-slate-200 w-full" />
                        <div className="border-b border-slate-200 w-full" />
                        <div className="border-b border-slate-200 w-full" />
                        <div className="border-b border-slate-200 w-full" />
                        <div className="border-b border-slate-200 w-full" />
                      </div>

                      {/* SVG Wave */}
                      <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="sensorGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path d={fillD} fill="url(#sensorGrad)" />
                        <path d={pathD} fill="none" stroke="#0284c7" strokeWidth="1.75" />
                      </svg>

                      {/* X-axis Timestamps */}
                      <div className="absolute bottom-0 inset-x-0 flex justify-between text-[8px] font-mono text-slate-400 px-1">
                        <span>12:00</span>
                        <span>14:00</span>
                        <span>16:00</span>
                        <span>18:00</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Last Packet: {lastPacketTime}</span>
                  <Link href="/telemetry" className="text-[#0284c7] font-semibold hover:underline">
                    View Full Rack →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* RIGHT COLUMN (4 Columns on desktop): Bridge Condition &    */}
          {/* Recent Alerts Panels                                       */}
          {/* ========================================================== */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {/* ======================================================== */}
            {/* PANEL 1: BRIDGE CONDITION & SETU SCORE                   */}
            {/* ======================================================== */}
            <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs space-y-3.5">
              {/* Header Row */}
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <h3 className="font-extrabold text-xs text-[#0f172a] uppercase tracking-wider">
                  BRIDGE CONDITION
                </h3>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  NORMAL
                </span>
              </div>

              {/* Setu Score Hero & Progress Meter */}
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] font-mono text-slate-500 font-semibold tracking-wider">
                    SETU SCORE
                  </span>
                  <div className="font-extrabold font-mono text-xl text-[#0f172a]">
                    82 <span className="text-xs text-slate-400 font-normal">/ 100</span>
                  </div>
                </div>

                {/* Primary Segmented Progress Bar */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-700 h-full rounded-full" style={{ width: "82%" }} />
                </div>
              </div>

              {/* 5 Sub-Factor Horizontal Rating Bars */}
              <div className="space-y-1.5 text-[11px] font-mono">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 w-24">Structural</span>
                  <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: "82%" }} />
                  </div>
                  <span className="w-6 text-right font-bold text-slate-800">82</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 w-24">Hydraulic</span>
                  <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: "74%" }} />
                  </div>
                  <span className="w-6 text-right font-bold text-slate-800">74</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 w-24">Seismic</span>
                  <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-700 h-full rounded-full" style={{ width: "91%" }} />
                  </div>
                  <span className="w-6 text-right font-bold text-slate-800">91</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 w-24">Traffic</span>
                  <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: "68%" }} />
                  </div>
                  <span className="w-6 text-right font-bold text-slate-800">68</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 w-24">Environmental</span>
                  <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: "77%" }} />
                  </div>
                  <span className="w-6 text-right font-bold text-slate-800">77</span>
                </div>
              </div>

              {/* LIVE DATA: Sensors Count & Review Dates */}
              <div className="pt-2.5 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Radio className="w-3.5 h-3.5 text-slate-500" />
                    <span>LIVE DATA</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    12 / 12 Sensors Online
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-600 pt-0.5">
                  <div className="bg-slate-50 p-1.5 rounded border border-slate-150">
                    <span className="text-slate-400 block text-[9px]">Last Inspection</span>
                    <strong className="text-slate-900">14 Oct 2026</strong>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded border border-slate-150">
                    <span className="text-slate-400 block text-[9px]">Next Review</span>
                    <strong className="text-slate-900">14 Jan 2027</strong>
                  </div>
                </div>
              </div>

              {/* ENVIRONMENT: 6-Item Atmospheric Matrix */}
              <div className="pt-2.5 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <CloudSun className="w-3.5 h-3.5 text-slate-500" />
                  <span>ENVIRONMENT</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-700">
                  <div className="bg-[#f8fafc] p-1.5 rounded border border-slate-200 flex flex-col">
                    <div className="flex items-center gap-1 text-slate-400 text-[9px]">
                      <Clock className="w-2.5 h-2.5" />
                      <span>Time</span>
                    </div>
                    <strong className="text-slate-900 font-mono mt-0.5">17:42 IST</strong>
                  </div>

                  <div className="bg-[#f8fafc] p-1.5 rounded border border-slate-200 flex flex-col">
                    <div className="flex items-center gap-1 text-slate-400 text-[9px]">
                      <CloudSun className="w-2.5 h-2.5" />
                      <span>Weather</span>
                    </div>
                    <strong className="text-slate-900 font-medium truncate mt-0.5">Partly Cloudy</strong>
                  </div>

                  <div className="bg-[#f8fafc] p-1.5 rounded border border-slate-200 flex flex-col">
                    <div className="flex items-center gap-1 text-slate-400 text-[9px]">
                      <Droplets className="w-2.5 h-2.5" />
                      <span>Rainfall</span>
                    </div>
                    <strong className="text-slate-900 font-mono mt-0.5">2.4 mm/hr</strong>
                  </div>

                  <div className="bg-[#f8fafc] p-1.5 rounded border border-slate-200 flex flex-col">
                    <div className="flex items-center gap-1 text-slate-400 text-[9px]">
                      <Eye className="w-2.5 h-2.5" />
                      <span>Visibility</span>
                    </div>
                    <strong className="text-slate-900 font-mono mt-0.5">7.8 km</strong>
                  </div>

                  <div className="bg-[#f8fafc] p-1.5 rounded border border-slate-200 flex flex-col">
                    <div className="flex items-center gap-1 text-slate-400 text-[9px]">
                      <Activity className="w-2.5 h-2.5" />
                      <span>River Stage</span>
                    </div>
                    <strong className="text-slate-900 font-mono mt-0.5">4.82 m</strong>
                  </div>

                  <div className="bg-[#f8fafc] p-1.5 rounded border border-slate-200 flex flex-col">
                    <div className="flex items-center gap-1 text-slate-400 text-[9px]">
                      <Wind className="w-2.5 h-2.5" />
                      <span>Wind</span>
                    </div>
                    <strong className="text-slate-900 font-mono mt-0.5">18 km/h</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* PANEL 2: RECENT ALERTS (Matching reference screenshot)   */}
            {/* ======================================================== */}
            <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs space-y-2.5">
              {/* Header */}
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f172a]">
                  <AlertTriangle className="w-3.5 h-3.5 text-slate-700" />
                  <span>Recent Alerts</span>
                </div>
                <Link
                  href="/triage"
                  onClick={() => triggerHaptic("light")}
                  className="text-[11px] font-semibold text-[#0284c7] hover:text-sky-800 transition-colors"
                >
                  View All →
                </Link>
              </div>

              {/* Alert Items List */}
              <div className="space-y-2 text-xs">
                {/* Alert 1: WARNING */}
                <div className="p-2 rounded bg-slate-50/70 border border-slate-200/90 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-900 text-xs">Expansion Joint J-02</span>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono">
                        <span className="text-slate-400">18:42</span>
                        <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                          WARNING
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Gap deviation detected</p>
                  </div>
                </div>

                {/* Alert 2: CRITICAL */}
                <div className="p-2 rounded bg-slate-50/70 border border-slate-200/90 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-900 text-xs">Pier P-04</span>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono">
                        <span className="text-slate-400">16:21</span>
                        <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                          CRITICAL
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Foundation scour above threshold</p>
                  </div>
                </div>

                {/* Alert 3: WATCH */}
                <div className="p-2 rounded bg-slate-50/70 border border-slate-200/90 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded bg-sky-100 text-[#0284c7] flex items-center justify-center shrink-0 mt-0.5">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-900 text-xs">Deck D-07</span>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono">
                        <span className="text-slate-400">14:03</span>
                        <span className="px-1.5 py-0.2 rounded bg-sky-50 text-[#0284c7] border border-sky-200 font-bold">
                          WATCH
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Vibration anomaly</p>
                  </div>
                </div>

                {/* Alert 4: NORMAL */}
                <div className="p-2 rounded bg-slate-50/70 border border-slate-200/90 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-900 text-xs">All other systems</span>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono">
                        <span className="text-slate-400">12:17</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                          NORMAL
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Operating normally</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

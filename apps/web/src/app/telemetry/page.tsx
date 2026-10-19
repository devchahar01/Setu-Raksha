"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Radio,
  Activity,
  Droplets,
  Compass,
  Zap,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Shield,
  Layers,
  Flame,
  ArrowRight,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatNumber } from "@/lib/formatters";

interface SensorFeed {
  id: string;
  name: string;
  type: string;
  location: string;
  value: number;
  unit: string;
  status: "NORMAL" | "ANOMALY" | "CRITICAL";
  trend: "RISING" | "STEADY" | "FALLING";
}

export default function TelemetryPage() {
  const { activeLocale, useDevanagariDigits } = useAppStore();

  const [selectedBridge, setSelectedBridge] = useState<string>("MH-PUN-MM-001");
  const [simScenario, setSimScenario] = useState<string>("NORMAL");
  const [liveTicks, setLiveTicks] = useState<number>(0);

  // Dynamic live simulated readings
  const [waterLevel, setWaterLevel] = useState<number>(538.4);
  const [pierTilt, setPierTilt] = useState<number>(0.12);
  const [vibration, setVibration] = useState<number>(0.38);
  const [rainfall, setRainfall] = useState<number>(8.5);

  // Live stream pulse effect
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTicks((prev) => prev + 1);

      if (simScenario === "FLOOD") {
        setWaterLevel((prev) => +(prev + 0.08).toFixed(2));
        setRainfall((prev) => +(prev + 1.2).toFixed(1));
      } else if (simScenario === "TILT") {
        setPierTilt((prev) => +(prev + 0.04).toFixed(2));
      } else {
        // Normal minor sensor noise
        setWaterLevel((prev) => +(538.4 + (Math.sin(Date.now() / 3000) * 0.08)).toFixed(2));
        setPierTilt((prev) => +(0.12 + (Math.cos(Date.now() / 4000) * 0.02)).toFixed(2));
        setVibration((prev) => +(0.35 + (Math.random() * 0.08)).toFixed(2));
        setRainfall((prev) => +(8.5 + (Math.random() * 0.5)).toFixed(1));
      }
    }, 1200);

    return () => clearInterval(timer);
  }, [simScenario]);

  const sensors: SensorFeed[] = [
    {
      id: "SNS-WL-01",
      name: "Ultrasonic River Stage Level",
      type: "WATER_LEVEL",
      location: "Pier P2 Central Waterway",
      value: waterLevel,
      unit: "m MSL",
      status: waterLevel >= 541.5 ? "CRITICAL" : waterLevel >= 540.0 ? "ANOMALY" : "NORMAL",
      trend: simScenario === "FLOOD" ? "RISING" : "STEADY",
    },
    {
      id: "SNS-INC-01",
      name: "Biaxial MEMS Pier Inclinometer",
      type: "PIER_INCLINOMETER",
      location: "Pier P2 Well Cap Substructure",
      value: pierTilt,
      unit: "°",
      status: pierTilt >= 1.0 ? "CRITICAL" : pierTilt >= 0.6 ? "ANOMALY" : "NORMAL",
      trend: simScenario === "TILT" ? "RISING" : "STEADY",
    },
    {
      id: "SNS-ACC-01",
      name: "3-Axis Deck Vibration Accelerometer",
      type: "ACCELEROMETER",
      location: "Mid-Span 4 Girder Underside",
      value: vibration,
      unit: "m/s²",
      status: vibration >= 2.5 ? "ANOMALY" : "NORMAL",
      trend: "STEADY",
    },
    {
      id: "SNS-RG-01",
      name: "Optical Tipping Bucket Rain Gauge",
      type: "RAIN_GAUGE",
      location: "Abutment A1 Meteorological Mast",
      value: rainfall,
      unit: "mm/h",
      status: rainfall >= 50.0 ? "ANOMALY" : "NORMAL",
      trend: simScenario === "FLOOD" ? "RISING" : "STEADY",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <div className="bg-navy-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 text-teal-300 text-xs font-mono mb-3 border border-navy-700">
              <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              LIVE TELEMETRY & IOT INGESTION GRID (L3)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Structural Health Sensor Monitoring Cockpit
            </h1>
            <p className="mt-1 text-sm text-navy-200">
              Continuous sub-second telemetry ingestion across ultrasonic, inclinometer, and accelerometer feeds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-lg bg-navy-800 border border-navy-700 text-xs font-mono text-teal-300">
              source=simulated
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-900/50 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              INGESTION ONLINE (Tick {liveTicks})
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Scenario Controls Toolbar */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Sliders className="w-5 h-5 text-teal-600" />
            <div>
              <div className="text-xs font-bold text-slate-800">Monitored Bridge:</div>
              <select
                value={selectedBridge}
                onChange={(e) => setSelectedBridge(e.target.value)}
                className="mt-0.5 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
              >
                <option value="MH-PUN-MM-001">MH-PUN-MM-001 (Bund Garden - Mula-Mutha)</option>
                <option value="MH-SOL-BHI-004">MH-SOL-BHI-004 (Pandharpur - Bhima)</option>
                <option value="MH-RAT-KON-012">MH-RAT-KON-012 (Savitri Estuary - Konkan)</option>
              </select>
            </div>
          </div>

          {/* Synthetic Scenario Injectors */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-500 mr-1">Inject Stress Scenario:</span>
            <button
              onClick={() => {
                setSimScenario("FLOOD");
                setWaterLevel(540.2);
                setRainfall(68.0);
              }}
              className={`px-3 py-1.5 text-xs rounded-xl font-bold flex items-center gap-1.5 transition-colors ${
                simScenario === "FLOOD"
                  ? "bg-rose-600 text-white shadow"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> Monsoon Flood Surge
            </button>

            <button
              onClick={() => {
                setSimScenario("TILT");
                setPierTilt(1.25);
              }}
              className={`px-3 py-1.5 text-xs rounded-xl font-bold flex items-center gap-1.5 transition-colors ${
                simScenario === "TILT"
                  ? "bg-orange-600 text-white shadow"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Compass className="w-3.5 h-3.5" /> Scour Pier Tilt (1.25°)
            </button>

            <button
              onClick={() => {
                setSimScenario("NORMAL");
                setWaterLevel(538.4);
                setPierTilt(0.12);
                setVibration(0.35);
                setRainfall(8.5);
              }}
              className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold transition-colors"
            >
              Reset Baseline
            </button>
          </div>
        </div>

        {/* Live Gauges Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {sensors.map((s) => (
            <div
              key={s.id}
              className={`p-6 rounded-2xl border transition-all ${
                s.status === "CRITICAL"
                  ? "bg-rose-50 border-rose-300 shadow-md ring-2 ring-rose-500/20"
                  : s.status === "ANOMALY"
                  ? "bg-amber-50 border-amber-300 shadow"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {s.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    s.status === "CRITICAL"
                      ? "bg-rose-600 text-white"
                      : s.status === "ANOMALY"
                      ? "bg-amber-600 text-white"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <div className="text-3xl font-mono font-extrabold text-slate-900 mb-1">
                {s.value} <span className="text-base font-normal text-slate-500">{s.unit}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-xs mb-1">{s.name}</h3>
              <p className="text-[11px] text-slate-500 mb-4">{s.location}</p>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                <span>Trend: <strong>{s.trend}</strong></span>
                <span className="font-mono text-[10px] text-teal-600">200ms SSE</span>
              </div>
            </div>
          ))}
        </div>

        {/* Real-Time Waveform & Live Log */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Animated Waveform Visualization */}
          <div className="lg:col-span-2 bg-navy-950 p-6 rounded-2xl border border-navy-800 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-sm text-white">Continuous Vibration Waveform (Accelerometer)</h3>
              </div>
              <span className="text-xs font-mono text-teal-300">Sampling Rate: 50 Hz</span>
            </div>

            {/* SVG Waveform Curve */}
            <div className="h-44 w-full bg-navy-900 rounded-xl p-2 flex items-center justify-center relative overflow-hidden border border-navy-800">
              <svg viewBox="0 0 700 160" className="w-full h-full">
                <defs>
                  <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 80 Q 35 30 70 80 T 140 80 T 210 80 T 280 80 T 350 80 T 420 80 T 490 80 T 560 80 T 630 80 T 700 80"
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="2.5"
                />
                <circle cx="630" cy="80" r="5" fill="#2dd4bf" className="animate-ping" />
              </svg>
              <div className="absolute top-3 left-3 text-[11px] font-mono text-navy-300">
                RMS Amplitude: {vibration} m/s² • Dominant Deck Frequency: 2.84 Hz
              </div>
            </div>
          </div>

          {/* Ingestion Stream Feed Console */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-teal-600" /> Ingestion Event Stream
                </h3>
                <span className="text-[10px] font-mono text-slate-400">HTTP/2 SSE</span>
              </div>

              <div className="space-y-2 font-mono text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 h-44 overflow-y-auto">
                <div>[00:0{liveTicks % 10}] POST /api/v1/telemetry/readings 201 Created</div>
                <div>[00:0{liveTicks % 10}] Reading SNS-WL-01: {waterLevel}m (GOOD)</div>
                <div>[00:0{liveTicks % 10}] Reading SNS-INC-01: {pierTilt}° ({pierTilt >= 1.0 ? "ANOMALY" : "GOOD"})</div>
                <div>[00:0{liveTicks % 10}] Reading SNS-ACC-01: {vibration} m/s² (GOOD)</div>
                <div>[00:0{liveTicks % 10}] Quality=GOOD, source=simulated</div>
              </div>
            </div>

            <Link
              href={`/bridges/${selectedBridge}`}
              className="mt-4 w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              Inspect Complete Cockpit <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Civil Engineering Notice */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
          <strong>Mandatory Statutory Notice:</strong> Decision support system only. Does not replace physical civil engineering inspection. All telemetry streams are marked <code>source=simulated</code> for testing and evaluation.
        </div>
      </div>
    </div>
  );
}

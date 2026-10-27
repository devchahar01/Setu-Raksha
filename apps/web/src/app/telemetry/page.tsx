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
  TrendingUp,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { TRANSLATIONS } from "@/lib/translations";
import { triggerHaptic } from "@/lib/haptics";

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
  const { activeLocale } = useAppStore();
  const t = TRANSLATIONS[activeLocale] || TRANSLATIONS.en;

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
        setWaterLevel((prev) => +(538.4 + Math.sin(Date.now() / 3000) * 0.08).toFixed(2));
        setPierTilt((prev) => +(0.12 + Math.cos(Date.now() / 4000) * 0.02).toFixed(2));
        setVibration((prev) => +(0.35 + Math.random() * 0.08).toFixed(2));
        setRainfall((prev) => +(8.5 + Math.random() * 0.5).toFixed(1));
      }
    }, 1200);

    return () => clearInterval(timer);
  }, [simScenario]);

  const handleScenarioChange = (scenario: string) => {
    triggerHaptic(scenario === "NORMAL" ? "tap" : "warning");
    setSimScenario(scenario);
    if (scenario === "FLOOD") {
      setWaterLevel(540.2);
      setRainfall(68.0);
    } else if (scenario === "TILT") {
      setPierTilt(1.25);
    } else {
      setWaterLevel(538.4);
      setPierTilt(0.12);
      setVibration(0.35);
      setRainfall(8.5);
    }
  };

  const sensors: SensorFeed[] = [
    {
      id: "SNS-WL-01",
      name: t.telemetry.waterLevel,
      type: "WATER_LEVEL",
      location: "Pier P2 Central Waterway",
      value: waterLevel,
      unit: "m MSL",
      status: waterLevel >= 541.5 ? "CRITICAL" : waterLevel >= 540.0 ? "ANOMALY" : "NORMAL",
      trend: simScenario === "FLOOD" ? "RISING" : "STEADY",
    },
    {
      id: "SNS-INC-01",
      name: t.telemetry.pierTilt,
      type: "PIER_INCLINOMETER",
      location: "Pier P2 Well Cap Substructure",
      value: pierTilt,
      unit: "°",
      status: pierTilt >= 1.0 ? "CRITICAL" : pierTilt >= 0.6 ? "ANOMALY" : "NORMAL",
      trend: simScenario === "TILT" ? "RISING" : "STEADY",
    },
    {
      id: "SNS-ACC-01",
      name: t.telemetry.vibration,
      type: "ACCELEROMETER",
      location: "Mid-Span 4 Girder Underside",
      value: vibration,
      unit: "mm/s²",
      status: vibration >= 2.5 ? "ANOMALY" : "NORMAL",
      trend: "STEADY",
    },
    {
      id: "SNS-RG-01",
      name: t.telemetry.rainfall,
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
      {/* Top Institutional Header */}
      <div className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-sky-400 text-xs font-mono mb-3 border border-slate-700">
              <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span>{t.telemetry.streamActive}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.telemetry.title}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {t.telemetry.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-sky-400">
              {t.common.simulatedTag}
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>TELEMETRY ONLINE • #{liveTicks}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Scenario Controls Toolbar */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Sliders className="w-5 h-5 text-sky-600" />
            <div>
              <div className="text-xs font-bold text-slate-800">{t.bridges.title}:</div>
              <select
                value={selectedBridge}
                onChange={(e) => {
                  triggerHaptic("select");
                  setSelectedBridge(e.target.value);
                }}
                className="mt-0.5 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              >
                <option value="MH-PUN-MM-001">MH-PUN-MM-001 (Bund Garden - Mula-Mutha)</option>
                <option value="MH-SOL-BHI-004">MH-SOL-BHI-004 (Pandharpur - Bhima)</option>
                <option value="MH-RAT-KON-012">MH-RAT-KON-012 (Savitri Estuary - Konkan)</option>
              </select>
            </div>
          </div>

          {/* Test Scenario Injectors */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-500 mr-1">Calibrated Stress Testing:</span>
            <button
              onClick={() => handleScenarioChange("FLOOD")}
              className={`px-3 py-1.5 text-xs rounded-xl font-bold flex items-center gap-1.5 active:scale-[0.97] transition-all ${
                simScenario === "FLOOD"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Droplets className="w-3.5 h-3.5" /> High Flood Surge (HFL)
            </button>

            <button
              onClick={() => handleScenarioChange("TILT")}
              className={`px-3 py-1.5 text-xs rounded-xl font-bold flex items-center gap-1.5 active:scale-[0.97] transition-all ${
                simScenario === "TILT"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Compass className="w-3.5 h-3.5" /> Pier Inclinometer Tilt
            </button>

            <button
              onClick={() => handleScenarioChange("NORMAL")}
              className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold active:scale-[0.97] transition-all"
            >
              Baseline Normal
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
                  ? "bg-amber-50 border-amber-300 shadow-xs"
                  : "bg-white border-slate-200 shadow-xs"
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
                  {s.status === "CRITICAL"
                    ? t.common.tiers.critical
                    : s.status === "ANOMALY"
                    ? t.common.tiers.warning
                    : t.common.tiers.good}
                </span>
              </div>

              <div className="text-3xl font-mono font-extrabold text-slate-900 mb-1">
                {s.value} <span className="text-base font-normal text-slate-500">{s.unit}</span>
              </div>
              <div className="text-xs font-bold text-slate-800 mb-1">{s.name}</div>
              <div className="text-[11px] text-slate-500">{s.location}</div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>{t.telemetry.lastPing}: 0.8s ago</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 100% Signal
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Calibration & Engineering Thresholds */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-600" />
            <span>Statutory Civil Engineering Transducer Standards</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
            In accordance with IRC:SP:35 and FHWA HEC-18 protocols, river water levels are measured with temperature-compensated 4-20mA ultrasonic transceivers referenced to high flood levels (HFL). Pier tilt is captured with dual-axis MEMS inclinometers calibrated to ±0.01° resolution. Deck dynamic vibration is logged via triaxial seismic accelerometers (0.5 to 100 Hz).
          </p>
        </div>
      </div>
    </div>
  );
}

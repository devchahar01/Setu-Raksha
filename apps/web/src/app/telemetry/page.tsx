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
  Thermometer,
  Gauge,
  ArrowUpRight,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { TRANSLATIONS } from "@/lib/translations";
import { triggerHaptic } from "@/lib/haptics";

interface SensorChannel {
  id: string;
  name: string;
  type: "IMU" | "WATER_LEVEL" | "TOF_GAP" | "TEMP" | "INCLINOMETER" | "ACCEL" | "RAIN";
  location: string;
  currentValue: number;
  unit: string;
  baseline: number;
  deviation: string;
  isNegativeDeviation?: boolean;
  signal: "EXCELLENT" | "GOOD" | "MARGINAL";
  lastPacketSec: number;
  status: "NORMAL" | "WATCH" | "CRITICAL";
  trendHistory: number[]; // 10 points for sparkline
}

export default function TelemetryPage() {
  const { activeLocale } = useAppStore();
  const t = TRANSLATIONS[activeLocale] || TRANSLATIONS.en;

  const [selectedBridge, setSelectedBridge] = useState<string>("MH-PUN-MM-001");
  const [simScenario, setSimScenario] = useState<string>("NORMAL");
  const [liveTicks, setLiveTicks] = useState<number>(142);

  // Dynamic live simulated telemetry channels
  const [channels, setChannels] = useState<SensorChannel[]>([
    {
      id: "IMU-04",
      name: "Modal Frequency",
      type: "IMU",
      location: "Pier P-02 Cantilever Arm",
      currentValue: 2.14,
      unit: "Hz",
      baseline: 2.18,
      deviation: "-1.8%",
      isNegativeDeviation: true,
      signal: "GOOD",
      lastPacketSec: 3,
      status: "NORMAL",
      trendHistory: [2.18, 2.17, 2.16, 2.15, 2.14, 2.15, 2.14, 2.13, 2.14, 2.14],
    },
    {
      id: "WL-02",
      name: "River Stage (Water Level)",
      type: "WATER_LEVEL",
      location: "Pier P-02 Central Waterway Mast",
      currentValue: 538.42,
      unit: "m MSL",
      baseline: 537.10,
      deviation: "+1.32 m",
      signal: "EXCELLENT",
      lastPacketSec: 2,
      status: "NORMAL",
      trendHistory: [537.9, 538.0, 538.1, 538.2, 538.3, 538.35, 538.4, 538.41, 538.42, 538.42],
    },
    {
      id: "TOF-01",
      name: "ToF Expansion Gap",
      type: "TOF_GAP",
      location: "Abutment A-01 Expansion Joint",
      currentValue: 42.6,
      unit: "mm",
      baseline: 40.0,
      deviation: "+6.5%",
      signal: "GOOD",
      lastPacketSec: 5,
      status: "WATCH",
      trendHistory: [40.2, 40.5, 41.0, 41.4, 41.8, 42.0, 42.3, 42.4, 42.5, 42.6],
    },
    {
      id: "TEMP-03",
      name: "Deck Surface Temperature",
      type: "TEMP",
      location: "Mid-Span 4 Asphalt Wearing Course",
      currentValue: 31.4,
      unit: "°C",
      baseline: 28.0,
      deviation: "+12.1%",
      signal: "GOOD",
      lastPacketSec: 8,
      status: "NORMAL",
      trendHistory: [28.5, 29.0, 29.6, 30.2, 30.8, 31.0, 31.2, 31.3, 31.4, 31.4],
    },
    {
      id: "INC-02",
      name: "Substructure Dual-Axis Tilt",
      type: "INCLINOMETER",
      location: "Pier P-02 Well Cap",
      currentValue: 0.12,
      unit: "°",
      baseline: 0.08,
      deviation: "+0.04°",
      signal: "EXCELLENT",
      lastPacketSec: 3,
      status: "NORMAL",
      trendHistory: [0.08, 0.09, 0.09, 0.10, 0.11, 0.11, 0.12, 0.12, 0.12, 0.12],
    },
    {
      id: "ACC-01",
      name: "Deck Peak Vibration",
      type: "ACCEL",
      location: "Mid-Span 4 Girder Underside",
      currentValue: 0.38,
      unit: "mm/s²",
      baseline: 0.35,
      deviation: "+8.5%",
      signal: "GOOD",
      lastPacketSec: 4,
      status: "NORMAL",
      trendHistory: [0.34, 0.36, 0.35, 0.37, 0.36, 0.39, 0.37, 0.38, 0.38, 0.38],
    },
    {
      id: "RG-01",
      name: "Precipitation Mast",
      type: "RAIN",
      location: "Abutment A-01 Meteorological Station",
      currentValue: 8.5,
      unit: "mm/h",
      baseline: 0.0,
      deviation: "+8.5 mm/h",
      signal: "GOOD",
      lastPacketSec: 12,
      status: "NORMAL",
      trendHistory: [2.0, 3.5, 5.0, 6.2, 7.0, 7.8, 8.1, 8.3, 8.4, 8.5],
    },
  ]);

  // Periodic simulated live ticks
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTicks((prev) => prev + 1);

      setChannels((prevChannels) =>
        prevChannels.map((ch) => {
          let delta = 0;
          if (simScenario === "FLOOD" && ch.id === "WL-02") {
            delta = 0.05;
          } else if (simScenario === "TILT" && ch.id === "INC-02") {
            delta = 0.03;
          } else {
            delta = (Math.random() - 0.48) * (ch.unit === "°C" ? 0.2 : ch.unit === "Hz" ? 0.005 : 0.02);
          }

          const newVal = +(ch.currentValue + delta).toFixed(2);
          const dev =
            ch.unit === "%" || ch.unit === "Hz"
              ? `${(((newVal - ch.baseline) / ch.baseline) * 100).toFixed(1)}%`
              : `${newVal >= ch.baseline ? "+" : ""}${(newVal - ch.baseline).toFixed(2)} ${ch.unit}`;

          const status =
            ch.id === "WL-02" && newVal >= 541.0
              ? "CRITICAL"
              : ch.id === "INC-02" && newVal >= 0.8
              ? "CRITICAL"
              : ch.id === "TOF-01" && newVal >= 45.0
              ? "WATCH"
              : "NORMAL";

          const history = [...ch.trendHistory.slice(1), newVal];

          return {
            ...ch,
            currentValue: newVal,
            deviation: dev,
            status,
            trendHistory: history,
            lastPacketSec: Math.floor(Math.random() * 3) + 1,
          };
        })
      );
    }, 1800);

    return () => clearInterval(timer);
  }, [simScenario]);

  const handleScenarioChange = (scenario: string) => {
    triggerHaptic(scenario === "NORMAL" ? "selection" : "warning");
    setSimScenario(scenario);
    if (scenario === "FLOOD") {
      setChannels((prev) =>
        prev.map((c) =>
          c.id === "WL-02"
            ? { ...c, currentValue: 541.2, status: "CRITICAL", deviation: "+4.10 m" }
            : c
        )
      );
    } else if (scenario === "TILT") {
      setChannels((prev) =>
        prev.map((c) =>
          c.id === "INC-02"
            ? { ...c, currentValue: 1.15, status: "CRITICAL", deviation: "+1.07°" }
            : c
        )
      );
    } else {
      setChannels((prev) =>
        prev.map((c) =>
          c.id === "WL-02"
            ? { ...c, currentValue: 538.42, status: "NORMAL", deviation: "+1.32 m" }
            : c.id === "INC-02"
            ? { ...c, currentValue: 0.12, status: "NORMAL", deviation: "+0.04°" }
            : c
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-900 pb-16">
      {/* Top Institutional Header */}
      <section className="bg-white border-b border-slate-300 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-slate-600 mb-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
              <span>GOVERNMENT OF MAHARASHTRA • PUBLIC WORKS DEPARTMENT</span>
              <span className="text-slate-400">•</span>
              <span className="text-teal-700">SHM TELEMETRY GRID (L3)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.telemetry.title}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {t.telemetry.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* NODE STATUS Counter as specified in master prompt */}
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-md">
              <div className="text-[10px] font-mono uppercase font-bold text-slate-500">NODE STATUS</div>
              <div className="text-sm font-extrabold font-mono text-teal-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                <span>12 / 12 ONLINE</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-md text-[11px] font-mono text-slate-600">
              <div>GATEWAY: GW-MM-02</div>
              <div className="text-slate-500 font-bold">PACKET #{liveTicks}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Operational Control Toolbar */}
        <div className="bg-white p-4 rounded-lg border border-slate-300 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Sliders className="w-4 h-4 text-teal-700" />
            <div>
              <div className="text-xs font-bold text-slate-800">MONITORED BRIDGE ASSET:</div>
              <select
                value={selectedBridge}
                onChange={(e) => {
                  triggerHaptic("selection");
                  setSelectedBridge(e.target.value);
                }}
                className="mt-0.5 p-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-semibold focus:outline-hidden"
              >
                <option value="MH-PUN-MM-001">MH-PUN-MM-001 • Bund Garden Bridge across Mula-Mutha</option>
                <option value="MH-SOL-BHI-004">MH-SOL-BHI-004 • Pandharpur Pilgrim Bridge across Bhima</option>
                <option value="MH-RAT-KON-012">MH-RAT-KON-012 • Savitri Estuary Bridge (Konkan)</option>
              </select>
            </div>
          </div>

          {/* Test Scenario Calibrator */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-500 mr-1">Calibrated Stress Testing:</span>
            <button
              onClick={() => handleScenarioChange("FLOOD")}
              className={`px-3 py-1.5 text-xs rounded font-bold flex items-center gap-1.5 transition-all border ${
                simScenario === "FLOOD"
                  ? "bg-rose-700 text-white border-rose-800"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Droplets className="w-3 h-3" /> High Flood Surge (HFL)
            </button>

            <button
              onClick={() => handleScenarioChange("TILT")}
              className={`px-3 py-1.5 text-xs rounded font-bold flex items-center gap-1.5 transition-all border ${
                simScenario === "TILT"
                  ? "bg-amber-700 text-white border-amber-800"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Compass className="w-3 h-3" /> Pier Tilt Anomaly
            </button>

            <button
              onClick={() => handleScenarioChange("NORMAL")}
              className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold transition-all border border-slate-200"
            >
              Reset to Baseline
            </button>
          </div>
        </div>

        {/* Live IoT Sensor Telemetry Table & Cards */}
        <div className="bg-white rounded-lg border border-slate-300 overflow-hidden mb-6">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-700" />
                <span>ACTIVE TELEMETRY CHANNELS & CALIBRATED BASELINES</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Synchronized 4-20mA & RS-485 Modbus telemetry streamed from pier caps, well foundations & superstructure girders
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {channels.length} Channels Calibrated
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-mono text-[11px]">
                <tr>
                  <th className="py-2.5 px-4 font-bold">SENSOR ID</th>
                  <th className="py-2.5 px-4 font-bold">METRIC / TRANSDUCER</th>
                  <th className="py-2.5 px-4 font-bold">LOCATION</th>
                  <th className="py-2.5 px-4 font-bold">CURRENT</th>
                  <th className="py-2.5 px-4 font-bold">BASELINE</th>
                  <th className="py-2.5 px-4 font-bold">DEVIATION</th>
                  <th className="py-2.5 px-4 font-bold">TREND (LAST 10 TICKS)</th>
                  <th className="py-2.5 px-4 font-bold">SIGNAL</th>
                  <th className="py-2.5 px-4 font-bold">LAST PACKET</th>
                  <th className="py-2.5 px-4 font-bold">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {channels.map((ch) => {
                  const min = Math.min(...ch.trendHistory);
                  const max = Math.max(...ch.trendHistory);
                  const range = max - min || 1;

                  // Compute small SVG path
                  const points = ch.trendHistory
                    .map((val, idx) => {
                      const x = (idx / 9) * 80;
                      const y = 22 - ((val - min) / range) * 16;
                      return `${x},${y}`;
                    })
                    .join(" ");

                  return (
                    <tr key={ch.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{ch.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{ch.name}</td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">{ch.location}</td>
                      <td className="py-3 px-4 font-mono font-extrabold text-sm text-slate-900">
                        {ch.currentValue} <span className="text-[11px] font-normal text-slate-500">{ch.unit}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                        {ch.baseline} {ch.unit}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[11px]">
                        <span
                          className={
                            ch.status === "CRITICAL"
                              ? "text-rose-700"
                              : ch.status === "WATCH"
                              ? "text-amber-700"
                              : "text-teal-700"
                          }
                        >
                          {ch.deviation}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {/* Engineering Sparkline */}
                        <div className="w-20 h-6 bg-slate-50 rounded border border-slate-200 flex items-center justify-center p-0.5">
                          <svg className="w-full h-full" viewBox="0 0 80 24">
                            <polyline
                              fill="none"
                              stroke={
                                ch.status === "CRITICAL"
                                  ? "#b91c1c"
                                  : ch.status === "WATCH"
                                  ? "#d97706"
                                  : "#0f766e"
                              }
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={points}
                            />
                          </svg>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {ch.signal}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{ch.lastPacketSec}s ago</td>
                      <td className="py-3 px-4 font-mono text-[10px]">
                        <span
                          className={`px-2 py-0.5 rounded font-bold border ${
                            ch.status === "CRITICAL"
                              ? "bg-rose-100 text-rose-800 border-rose-300"
                              : ch.status === "WATCH"
                              ? "bg-amber-100 text-amber-800 border-amber-300"
                              : "bg-teal-50 text-teal-800 border-teal-200"
                          }`}
                        >
                          {ch.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Technical Calibration & Civil Engineering Transducer Standards */}
        <div className="bg-white p-5 rounded-lg border border-slate-300">
          <h3 className="font-bold text-slate-900 text-xs mb-2 flex items-center gap-2 uppercase tracking-wide">
            <Shield className="w-4 h-4 text-teal-700" />
            <span>Statutory Civil Engineering Transducer Specifications</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 leading-relaxed">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Ultrasonic Stage Transceiver</span>
              <span>
                4-20mA temperature-compensated transducer mounted above the central waterway, calibrated to High Flood Level (HFL: 542.8m MSL). Resolution: ±2mm.
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Dual-Axis MEMS Inclinometers</span>
              <span>
                Submersible IP68 tilt transducers fixed directly onto well caps and pier shafts. Measures rotation to ±0.01° under live traffic braking.
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Triaxial Modal Accelerometers</span>
              <span>
                Piezoelectric dynamic response sensors logging superstructure natural frequencies (0.5 Hz – 100 Hz) to detect girder section loss and stiffness degradation.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

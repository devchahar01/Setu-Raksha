"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Shield,
  Activity,
  Layers,
  MapPin,
  Clock,
  Radio,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Flame,
  Droplets,
  Compass,
  Zap,
  ExternalLink,
} from "lucide-react";
import { RiskTierBadge } from "@/components/RiskTierBadge";
import { useAppStore } from "@/lib/store";
import { formatNumber } from "@/lib/formatters";

interface BridgeDetail {
  id: string;
  code: string;
  name: string;
  river: string;
  district: string;
  type: string;
  length_m: number;
  spans: number;
  year_built: number;
  design_life_y: number;
  irc_class: string;
  seismic_zone: string;
  foundation_type: string;
  foundation_depth_m: number;
  design_hfl_m: number;
  design_scour_m: number;
}

export default function BridgeCockpitPage() {
  const params = useParams();
  const bridgeId = params.id as string;
  const { activeLocale, useDevanagariDigits } = useAppStore();

  const [bridge, setBridge] = useState<BridgeDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [simulating, setSimulating] = useState<boolean>(false);

  // Live telemetry state
  const [waterLevel, setWaterLevel] = useState<number>(538.4);
  const [pierTilt, setPierTilt] = useState<number>(0.12);
  const [vibration, setVibration] = useState<number>(0.35);
  const [rainfall, setRainfall] = useState<number>(12.0);

  // Risk state
  const [driScore, setDriScore] = useState<number>(28.4);
  const [tier, setTier] = useState<string>("Good");
  const [criticalFlags, setCriticalFlags] = useState<string[]>([]);
  const [remediations, setRemediations] = useState<any[]>([]);

  useEffect(() => {
    async function fetchBridge() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/v1/bridges/${bridgeId}`);
        if (res.ok) {
          const data = await res.json();
          setBridge(data);
        }
      } catch (err) {
        console.warn("Could not fetch bridge from API, loading fallback demo bridge:", err);
        setBridge({
          id: bridgeId,
          code: "MH-PUN-MM-001",
          name: "Bund Garden Bridge across Mula-Mutha",
          river: "Mula-Mutha",
          district: "Pune",
          type: "Prestressed Concrete Box Girder",
          length_m: 240.0,
          spans: 8,
          year_built: 1998,
          design_life_y: 100,
          irc_class: "Class 70R",
          seismic_zone: "Zone III",
          foundation_type: "Well Foundation",
          foundation_depth_m: 18.5,
          design_hfl_m: 542.8,
          design_scour_m: 8.2,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchBridge();
  }, [bridgeId]);

  // Trigger simulated monsoon flash flood
  const triggerMonsoonSimulation = () => {
    setSimulating(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setWaterLevel((prev) => +(prev + 0.65).toFixed(2));
      setRainfall((prev) => +(prev + 14.0).toFixed(1));
      setPierTilt((prev) => +(prev + 0.15).toFixed(2));

      if (step >= 5) {
        clearInterval(interval);
        setDriScore(84.5);
        setTier("Critical");
        setCriticalFlags(["WATER_LEVEL_NEAR_HFL", "LIVE_FLASH_FLOOD_SURGE"]);
        setRemediations([
          {
            rule_id: "CLOSE-01",
            priority: "IMMEDIATE",
            title: {
              en: "Emergency Bridge Closure and Traffic Evacuation",
              hi: "आपातकालीन पुल बंदी और यातायात निकासी",
              mr: "तातडीने पूल बंद करणे आणि वाहतूक वळवणे",
            },
            description: {
              en: "Immediately close bridge to all traffic, sound sirens, inform district disaster control room.",
              hi: "पुल को सभी यातायात के लिए तुरंत बंद करें, सायरन बजाएं, जिला नियंत्रण कक्ष को सूचित करें।",
              mr: "पूल तात्काळ सर्व वाहतुकीसाठी बंद करा, सायरन वाजवा, आपत्ती व्यवस्थापन कक्षाला कळवा.",
            },
          },
          {
            rule_id: "RIPRAP-01",
            priority: "URGENT",
            title: {
              en: "Riprap and Scour Apron Restoration",
              hi: "रिपरैप और कटाव सुरक्षा एप्रन का पुनर्स्थापन",
              mr: "रिपरॅप आणि गाद संरक्षण अ‍ॅप्रनची पुनर्स्थापना",
            },
            description: {
              en: "Place or restore riprap or apron around piers; re-survey bed after next flood.",
              hi: "खंभों के चारों ओर बोल्डर पिचिंग/रिपरैप बिछाएं; अगली बाढ़ के बाद नदी तल का पुनः सर्वेक्षण करें।",
              mr: "खांबांभोवती बोल्डर पिचिंग/रिपरॅप लावा; पुढच्या पुरानंतर नदी पात्राचे पुनर्सर्वेक्षण करा.",
            },
          },
        ]);
        setSimulating(false);
      }
    }, 800);
  };

  const resetBaseline = () => {
    setWaterLevel(538.4);
    setPierTilt(0.12);
    setVibration(0.35);
    setRainfall(12.0);
    setDriScore(28.4);
    setTier("Good");
    setCriticalFlags([]);
    setRemediations([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading Bridge Cockpit...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Banner */}
      <div className="bg-navy-900 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/bridges"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Bridge Registry
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-xs font-extrabold bg-teal-500/20 text-teal-300 px-3 py-1 rounded-md border border-teal-500/30">
                  {bridge?.code}
                </span>
                <RiskTierBadge tier={tier} size="md" />
                <span className="text-xs text-navy-300 font-mono">source=simulated</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{bridge?.name}</h1>
              <p className="text-sm text-navy-200 mt-1">
                {bridge?.river} River Basin • {bridge?.district} District • Built {bridge?.year_built}
              </p>
            </div>

            {/* Simulation Trigger Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={triggerMonsoonSimulation}
                disabled={simulating}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow transition-colors"
              >
                <Flame className="w-4 h-4" />
                {simulating ? "Simulating Flood Surge..." : "Inject Monsoon Flood Surge"}
              </button>
              <button
                onClick={resetBaseline}
                className="px-3 py-2.5 bg-navy-800 hover:bg-navy-700 text-navy-200 rounded-xl text-xs font-semibold transition-colors"
              >
                Reset Baseline
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Structural Specs & DRI Risk Gauge */}
        <div className="space-y-6">
          {/* Dynamic Risk Index Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-teal-600" />
                <h2 className="font-bold text-slate-900 text-base">Predictive Risk Index</h2>
              </div>
              <span className="text-xs font-mono font-bold text-teal-600">Appendix D Math</span>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center mb-4">
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1">
                Dynamic Risk Index (DRI)
              </div>
              <div className="text-4xl font-extrabold font-mono text-slate-900">{driScore.toFixed(1)}</div>
              <div className="text-xs text-slate-500 mt-1">Scale 0 (Pristine) to 100 (Critical)</div>

              <div className="w-full bg-slate-200 h-3 rounded-full mt-4 overflow-hidden flex">
                <div style={{ width: `${Math.min(100, driScore)}%` }} className={`h-full transition-all duration-500 ${
                  driScore >= 75 ? "bg-rose-500" : driScore >= 55 ? "bg-orange-500" : driScore >= 30 ? "bg-amber-500" : "bg-emerald-500"
                }`} />
              </div>
            </div>

            {criticalFlags.length > 0 && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl mb-4 text-xs text-rose-900">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-rose-700">
                  <AlertTriangle className="w-4 h-4" /> Active Critical Overrides:
                </div>
                <ul className="list-disc list-inside space-y-0.5">
                  {criticalFlags.map((flag) => (
                    <li key={flag} className="font-mono font-semibold">{flag}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
              <strong>Advisory:</strong> Decision support system only. Does not replace physical civil engineering inspection.
            </div>
          </div>

          {/* Civil Engineering Structural Metadata */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-600" /> Structural Design Profile
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">IRC Loading Class:</span>
                <span className="font-semibold text-slate-900">{bridge?.irc_class}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Seismic Zone (IS 1893):</span>
                <span className="font-semibold text-slate-900">{bridge?.seismic_zone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Foundation Type:</span>
                <span className="font-semibold text-slate-900">{bridge?.foundation_type}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Foundation Depth:</span>
                <span className="font-semibold text-slate-900">{bridge?.foundation_depth_m}m</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Design High Flood Level (HFL):</span>
                <span className="font-semibold text-slate-900">{bridge?.design_hfl_m}m MSL</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Maximum Design Scour:</span>
                <span className="font-semibold text-slate-900">{bridge?.design_scour_m}m</span>
              </div>
            </div>
          </div>

          {/* Google Maps Real-Time Location Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sky-600" /> Google Maps Satellite
              </h2>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=18.5204,73.8567`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
              >
                Full Map <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 mb-3 bg-slate-100">
              <iframe
                title="Bridge Google Maps Satellite View"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://maps.google.com/maps?q=18.5204,73.8567&t=h&z=16&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-mono text-[11px]">GPS: 18.5204° N, 73.8567° E</span>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=18.5204,73.8567`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-sky-600 hover:underline flex items-center gap-1"
              >
                Directions →
              </a>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Live Telemetry Gauges & Prescriptive Remediations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Telemetry Sensor Gauges */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-teal-600" />
                <h2 className="font-bold text-slate-900 text-base">Live Structural Telemetry Cockpit (L3)</h2>
              </div>
              <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Ingestion
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Ultrasonic Water Level */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Droplets className="w-4 h-4 text-sky-600" /> Water Level
                </div>
                <div className="text-2xl font-mono font-extrabold text-slate-900">{waterLevel}m</div>
                <div className="text-[11px] text-slate-400 mt-1">HFL: {bridge?.design_hfl_m}m</div>
              </div>

              {/* Pier Inclinometer Tilt */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Compass className="w-4 h-4 text-teal-600" /> Pier Tilt
                </div>
                <div className={`text-2xl font-mono font-extrabold ${pierTilt >= 1.0 ? "text-rose-600" : "text-slate-900"}`}>
                  {pierTilt}°
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Threshold: 1.0°</div>
              </div>

              {/* Deck Accelerometer */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Zap className="w-4 h-4 text-amber-600" /> Vibration
                </div>
                <div className="text-2xl font-mono font-extrabold text-slate-900">{vibration} m/s²</div>
                <div className="text-[11px] text-slate-400 mt-1">Safe &lt; 2.5</div>
              </div>

              {/* Rainfall Gauge */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Droplets className="w-4 h-4 text-indigo-600" /> Rainfall
                </div>
                <div className="text-2xl font-mono font-extrabold text-slate-900">{rainfall} mm/h</div>
                <div className="text-[11px] text-slate-400 mt-1">Cloudburst &gt; 50</div>
              </div>
            </div>
          </div>

          {/* Prescriptive Remediation Catalogue Recommendations */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-600" /> Prescriptive Engineering Remediations
              </h2>
              <span className="text-xs text-slate-500">Trilingual Catalogue (EN / HI / MR)</span>
            </div>

            {remediations.length > 0 ? (
              <div className="space-y-4">
                {remediations.map((rem, idx) => {
                  const lang = activeLocale as "en" | "hi" | "mr";
                  const title = rem.title[lang] || rem.title.en;
                  const desc = rem.description[lang] || rem.description.en;

                  return (
                    <div
                      key={rem.rule_id || idx}
                      className={`p-4 rounded-xl border ${
                        rem.priority === "IMMEDIATE"
                          ? "bg-rose-50 border-rose-200"
                          : "bg-amber-50 border-amber-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs font-bold text-slate-800">
                          [{rem.rule_id}]
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            rem.priority === "IMMEDIATE"
                              ? "bg-rose-600 text-white"
                              : "bg-amber-600 text-white"
                          }`}
                        >
                          {rem.priority}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{title}</h4>
                      <p className="text-xs text-slate-700 leading-relaxed">{desc}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                Structural health is currently within normal operating tolerances.
                <br />
                No immediate emergency interventions triggered.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

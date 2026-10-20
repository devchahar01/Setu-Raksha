"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Activity,
  Layers,
  FileCheck,
  Cpu,
  Eye,
  AlertTriangle,
  ArrowRight,
  Database,
  Radio,
  CheckCircle2,
  Clock,
  Compass,
  Droplets,
  ExternalLink,
  Flame,
  Globe,
  Sliders,
  Sparkles,
  Zap,
} from "lucide-react";
import { BridgeHero3D } from "@/components/BridgeHero3D";
import { useAppStore } from "@/lib/store";
import { formatNumber } from "@/lib/formatters";

const I18N_HOME = {
  en: {
    heroSection: "Overview",
    statBridges: "Bridges Monitored",
    statBridgesSub: "5 Maharashtra Basins",
    statSensors: "Active IoT Sensors",
    statSensorsSub: "Ultrasonic, Tilt, Accel",
    statLeadTime: "Average Warning Lead Time",
    statLeadTimeSub: "Advance Disaster Warning",
    statTarget: "Disaster Risk Prevention",
    statTargetSub: "Synthetic Benchmark Study",

    pipelineTitle: "SEVEN-STAGE LIFECYCLE DATA PIPELINE",
    pipelineSub: "Institutional digital architecture from pre-construction design to public transparency",

    basinTitle: "STRATEGIC RIVER BASINS",
    basinSub: "Continuous hydrological and geotechnical surveillance across 5 critical river basins in Maharashtra",

    quickAccessTitle: "OPERATIONAL COMMAND HUBS",
    quickAccessSub: "Direct access to field audit wizards, live sensor telemetry, and engineer triage consoles",

    disclaimerTitle: "STATUTORY CIVIL ENGINEERING ADVISORY",
    disclaimerText:
      "Setu Raksha is a certified decision-support intelligence grid designed to augment—never replace—certified civil engineering inspection, physical non-destructive testing (NDT), and human professional judgment. All telemetry data is labeled source=simulated for testing.",
  },
  hi: {
    heroSection: "अवलोकन",
    statBridges: "निगरानी अधीन पुल",
    statBridgesSub: "५ महाराष्ट्र नदी बेसिन",
    statSensors: "सक्रिय टेलीमेट्री नोड्स",
    statSensorsSub: "अल्ट्रासोनिक, झुकाव, कंपन",
    statLeadTime: "औसत चेतावनी समय",
    statLeadTimeSub: "आपदा पूर्व सूचना अग्रिम",
    statTarget: "आपदा जोखिम निवारण",
    statTargetSub: "सिंथेटिक बेंचमार्क अध्ययन",

    pipelineTitle: "सात-चरणीय जीवन चक्र डेटा पाइपलाइन",
    pipelineSub: "पूर्व-निर्माण डिजाइन से नागरिक पारदर्शिता तक संपूर्ण संस्थागत डिजिटल ग्रिड",

    basinTitle: "महाराष्ट्र सामरिक नदी बेसिन",
    basinSub: "५ प्रमुख नदी घाटियों में निरंतर जलवैज्ञानिक और भू-तकनीकी सुरक्षा निगरानी",

    quickAccessTitle: "कमांड एवं संचालन केंद्र",
    quickAccessSub: "फील्ड ऑडिट विज़ार्ड, लाइव टेलीमेट्री और इंजीनियर ट्राइएज कंसोल का सीधा प्रवेश",

    disclaimerTitle: "वैधानिक सिविल इंजीनियरिंग सूचना",
    disclaimerText:
      "सेतु रक्षा एक निर्णय-सहायता इंटेलिजेंस ग्रिड है जो प्रमाणित सिविल इंजीनियरिंग निरीक्षण, भौतिक परीक्षण और मानवीय तकनीकी निर्णय की सहायता करता है, उनका स्थान नहीं लेता। सभी डेटा स्रोत=सिम्युलेटेड के रूप में चिह्नित हैं।",
  },
  mr: {
    heroSection: "अवलोकन",
    statBridges: "देखरेख खालील पूल",
    statBridgesSub: "५ महाराष्ट्र नदी खोरे",
    statSensors: "सक्रिय सेन्सर नोड्स",
    statSensorsSub: "अल्ट्रासोनिक, टिल्ट, व्हायब्रेशन",
    statLeadTime: "सरासरी पूर्वसूचना वेळ",
    statLeadTimeSub: "आपत्ती प्रतिबंधात्मक आगाऊ वेळ",
    statTarget: "आपत्ती निवारण लक्ष्य",
    statTargetSub: "सिम्युलेशन मूल्यांकन अभ्यास",

    pipelineTitle: "सात-टप्प्यांची जीवनचक्र डेटा पाइपलाइन",
    pipelineSub: "बांधकामपूर्व डिझाइनपासून सार्वजनिक पारदर्शकतेपर्यंत संपूर्ण डिजिटल इंटेलिजेंस ग्रीड",

    basinTitle: "महाराष्ट्र सामरिक नदी खोरे",
    basinSub: "५ प्रमुख नदी खोऱ्यांमध्ये सतत जलवैज्ञानिक आणि भू-तांत्रिक सुरक्षा देखरेख",

    quickAccessTitle: "कमांड व संचालन दालन",
    quickAccessSub: "फील्ड तपासणी विझार्ड, थेट सेन्सर देखरेख आणि अभियंता नियंत्रण कक्षात थेट प्रवेश",

    disclaimerTitle: "वैधानिक स्थापत्य अभियांत्रिकी सूचना",
    disclaimerText:
      "सेतू रक्षा ही निर्णय-साहाय्य यंत्रणा असून ती प्रत्यक्ष स्थापत्य अभियांत्रिकी तपासणी, प्रत्यक्ष चाचणी आणि मानवी अभियांत्रिकी निर्णयाची जागा घेत नाही. सर्व डेटा चाचणीसाठी source=simulated म्हणून नोंदवला गेला आहे.",
  },
};

const BASIN_METRICS = [
  {
    id: "mula-mutha",
    name: "Mula-Mutha Basin",
    nameLocal: "मुळा-मुठा खोरे (पुणे)",
    bridges: 14,
    status: "Good (0–29 DRI)",
    waterLevel: "538.4m MSL",
    flow: "Safe (1.2m below HFL)",
    color: "border-emerald-300 bg-emerald-50/60 text-emerald-900",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  {
    id: "bhima",
    name: "Bhima River Basin",
    nameLocal: "भीमा खोरे (सोलापूर / पुणे)",
    bridges: 12,
    status: "Watch (30–54 DRI)",
    waterLevel: "462.1m MSL",
    flow: "Elevated Scour Vigilance",
    color: "border-amber-300 bg-amber-50/60 text-amber-900",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    id: "krishna",
    name: "Krishna River Basin",
    nameLocal: "कृष्णा खोरे (सातारा / सांगली)",
    bridges: 15,
    status: "Good (0–29 DRI)",
    waterLevel: "554.8m MSL",
    flow: "Normal Controlled Flow",
    color: "border-emerald-300 bg-emerald-50/60 text-emerald-900",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  {
    id: "godavari",
    name: "Godavari River Basin",
    nameLocal: "गोदावरी खोरे (नाशिक / नांदेड)",
    bridges: 11,
    status: "Warning (55–74 DRI)",
    waterLevel: "565.3m MSL",
    flow: "Active Monitored Discharge",
    color: "border-orange-300 bg-orange-50/60 text-orange-900",
    badge: "bg-orange-100 text-orange-800 border-orange-200",
  },
  {
    id: "konkan",
    name: "Konkan Coastal Basin",
    nameLocal: "कोकण किनारी खोरे (रत्नागिरी / रायगड)",
    bridges: 8,
    status: "Critical (75–100 DRI)",
    waterLevel: "Tidal Surge High",
    flow: "Chloride Exposure Accelerated",
    color: "border-rose-300 bg-rose-50/60 text-rose-900",
    badge: "bg-rose-100 text-rose-800 border-rose-200",
  },
];

export default function Home() {
  const { activeLocale, useDevanagariDigits } = useAppStore();
  const t = I18N_HOME[activeLocale] || I18N_HOME.en;

  const [selectedBasin, setSelectedBasin] = useState<string>("mula-mutha");

  // Complete, sequential L1 through L7 Lifecycle
  const lifecycles = [
    {
      code: "L1",
      title: "Pre-construction & Design Registry",
      titleHi: "पूर्व-निर्माण एवं डिजाइन रजिस्ट्री",
      titleMr: "बांधकामपूर्व व डिझाइन नोंदवही",
      desc: "IRC loading standards (70R, Class AA), IS 1893 seismic zoning, foundation depth, and design scour thresholds.",
      tag: "IRC Standards",
      href: "/bridges",
      icon: <Layers className="w-5 h-5 text-sky-600" />,
    },
    {
      code: "L2",
      title: "Construction & Quality Testing",
      titleHi: "निर्माण एवं गुणवत्ता परीक्षण",
      titleMr: "बांधकाम व गुणवत्ता परीक्षण",
      desc: "Concrete cube compressive strength logs, contractor defect liability tracking, and initial proof-load verification.",
      tag: "Quality Logs",
      href: "/bridges?view=quality",
      icon: <Database className="w-5 h-5 text-sky-600" />,
    },
    {
      code: "L3",
      title: "Live Monitoring & Telemetry Cockpit",
      titleHi: "लाइव निगरानी एवं टेलीमेट्री",
      titleMr: "थेट देखरेख व सेन्सर कॉकपिट",
      desc: "Ultrasonic river stage, biaxial pier inclinometer tilt (1.0° threshold), and 3-axis deck vibration accelerometers.",
      tag: "50Hz Stream",
      href: "/telemetry",
      icon: <Radio className="w-5 h-5 text-sky-600" />,
    },
    {
      code: "L4",
      title: "Routine Audit Scheduler & Escalation",
      titleHi: "मासिक ऑडिट शेड्यूलर एवं एस्केलेशन",
      titleMr: "नियमित ऑडिट शेड्यूलर व एस्केलेशन",
      desc: "Automated scan at T-7 days, T-2 days, and overdue escalation to Division Engineers with emergency action dispatch.",
      tag: "Audit Matrix",
      href: "/triage",
      icon: <Clock className="w-5 h-5 text-sky-600" />,
    },
    {
      code: "L5",
      title: "26-Factor Monthly Field Audit",
      titleHi: "२६-घटक मासिक फील्ड ऑडिट",
      titleMr: "२६-घटक मासिक तपासणी",
      desc: "Digital inspection wizard capturing Structural, Hydraulic, Seismic, Load, and Age factors with immutable locking.",
      tag: "Field Wizard",
      href: "/audits",
      icon: <FileCheck className="w-5 h-5 text-sky-600" />,
    },
    {
      code: "L6",
      title: "AI Predictive Risk & Remediations",
      titleHi: "एआई भविष्यसूचक जोखिम एवं उपचार",
      titleMr: "एआई जोखीम व उपाययोजना",
      desc: "Piecewise-linear SVI scoring, Dynamic Risk Index (DRI), Markov-chain degradation, and 11-rule Prescriptive Catalogue.",
      tag: "Risk Engine",
      href: "/risk",
      icon: <Cpu className="w-5 h-5 text-sky-600" />,
    },
    {
      code: "L7",
      title: "Public Citizen Transparency Portal",
      titleHi: "सार्वजनिक नागरिक पारदर्शिता पोर्टल",
      titleMr: "नागरिक पारदर्शकता पोर्टल",
      desc: "Citizen view of bridge age, certified health tiers, and open audit history with privacy-preserving redaction.",
      tag: "Open Access",
      href: "/public",
      icon: <Eye className="w-5 h-5 text-sky-600" />,
    },
  ];

  return (
    <div className="relative w-full text-slate-800 overflow-x-hidden">
      {/* 1. CINEMATIC 3D DAYLIGHT BRIDGE WITH INDIAN VEHICLES */}
      <BridgeHero3D />

      {/* 2. MAIN OPERATIONS & INTELLIGENCE GRID FLOATING OVER PERSISTENT 3D CANVAS */}
      <div id="operations-grid" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Live National Metric Wall */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/85 backdrop-blur-md p-5 rounded-2xl border border-white/80 shadow-md hover:shadow-lg transition-all">
            <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-1">
              {t.statBridges}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 mb-1">
              {formatNumber(60, activeLocale, useDevanagariDigits)}
            </div>
            <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {t.statBridgesSub}
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur-md p-5 rounded-2xl border border-white/80 shadow-md hover:shadow-lg transition-all">
            <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-1">
              {t.statSensors}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 mb-1">
              {formatNumber(240, activeLocale, useDevanagariDigits)}
            </div>
            <div className="text-xs text-sky-700 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              {t.statSensorsSub}
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur-md p-5 rounded-2xl border border-white/80 shadow-md hover:shadow-lg transition-all">
            <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-1">
              {t.statLeadTime}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 mb-1">
              {formatNumber(6.63, activeLocale, useDevanagariDigits)} hrs
            </div>
            <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {t.statLeadTimeSub}
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur-md p-5 rounded-2xl border border-white/80 shadow-md hover:shadow-lg transition-all">
            <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-1">
              {t.statTarget}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 mb-1">
              99.0%
            </div>
            <div className="text-xs text-indigo-700 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              {t.statTargetSub}
            </div>
          </div>
        </div>

        {/* 3. L1–L7 STRUCTURED DATA PIPELINE */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
            <div>
              <div className="text-xs font-mono text-sky-700 uppercase tracking-widest mb-1 font-bold">
                CORE SYSTEM ARCHITECTURE
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {t.pipelineTitle}
              </h2>
              <p className="text-sm text-slate-600 mt-1">{t.pipelineSub}</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200 font-medium">MoRTH Standard</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200 font-medium">IRC:SP:35</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lifecycles.map((item) => {
              const localizedTitle =
                activeLocale === "hi" ? item.titleHi : activeLocale === "mr" ? item.titleMr : item.title;
              return (
                <Link
                  key={item.code}
                  href={item.href}
                  className="group bg-white/85 backdrop-blur-md hover:bg-white/95 p-6 rounded-2xl border border-white/80 hover:border-sky-300 transition-all shadow-md hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                          {item.icon}
                        </div>
                        <span className="font-mono text-xs font-extrabold text-sky-800 bg-sky-100 px-2.5 py-1 rounded-md border border-sky-200">
                          {item.code}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm mb-2 group-hover:text-sky-700 transition-colors">
                      {localizedTitle}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 group-hover:text-sky-700">
                    <span className="font-semibold text-xs">Open Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 4. STRATEGIC RIVER BASINS SPOTLIGHT */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
            <div>
              <div className="text-xs font-mono text-sky-700 uppercase tracking-widest mb-1 font-bold">
                REGIONAL SURVEILLANCE COVERAGE
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {t.basinTitle}
              </h2>
              <p className="text-sm text-slate-600 mt-1">{t.basinSub}</p>
            </div>
            <Link
              href="/bridges"
              className="text-xs text-sky-700 hover:text-sky-800 font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-sky-200 shadow-xs"
            >
              Open Interactive Basin GIS Map <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {BASIN_METRICS.map((basin) => (
              <div
                key={basin.id}
                onClick={() => setSelectedBasin(basin.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer backdrop-blur-md ${
                  selectedBasin === basin.id
                    ? `${basin.color} shadow-md ring-2 ring-sky-500/40`
                    : "bg-white/85 border-white/80 hover:border-slate-300 shadow-xs"
                }`}
              >
                <div className="text-xs font-semibold text-slate-500 mb-1">
                  {formatNumber(basin.bridges, activeLocale, useDevanagariDigits)} Bridges
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{basin.name}</h4>
                <div className="text-xs text-slate-500 mb-3">{basin.nameLocal}</div>

                <div className="space-y-1.5 text-xs border-t border-slate-200/80 pt-3">
                  <div className={`text-xs font-bold inline-block px-2 py-0.5 rounded border ${basin.badge}`}>
                    {basin.status}
                  </div>
                  <div className="text-xs font-medium text-slate-700">{basin.waterLevel}</div>
                  <div className="text-xs text-slate-500">{basin.flow}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. OPERATIONAL COMMAND HUBS */}
        <div>
          <div className="mb-6">
            <div className="text-xs font-mono text-sky-700 uppercase tracking-widest mb-1 font-bold">
              DIRECT ACCESS
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.quickAccessTitle}
            </h2>
            <p className="text-xs text-slate-600 mt-1">{t.quickAccessSub}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/bridges"
              className="p-5 bg-white/85 backdrop-blur-md hover:bg-white/95 border border-white/80 rounded-2xl flex items-center justify-between group transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 group-hover:text-sky-700">
                    Bridge Registry & GIS Map
                  </div>
                  <div className="text-xs text-slate-500">5 Basins • Color Coded Markers</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/telemetry"
              className="p-5 bg-white/85 backdrop-blur-md hover:bg-white/95 border border-white/80 rounded-2xl flex items-center justify-between group transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 group-hover:text-sky-700">
                    Live Telemetry Sensors Cockpit
                  </div>
                  <div className="text-xs text-slate-500">Water Stage • Pier Tilt • Vibration</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/audits"
              className="p-5 bg-white/85 backdrop-blur-md hover:bg-white/95 border border-white/80 rounded-2xl flex items-center justify-between group transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 group-hover:text-emerald-700">
                    26-Factor Field Audit Wizard
                  </div>
                  <div className="text-xs text-slate-500">Immutable Cryptographic Locking</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/risk"
              className="p-5 bg-white/85 backdrop-blur-md hover:bg-white/95 border border-white/80 rounded-2xl flex items-center justify-between group transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 group-hover:text-indigo-700">
                    AI SVI, DRI & Remediation
                  </div>
                  <div className="text-xs text-slate-500">11 Certified Trilingual Rules</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/triage"
              className="p-5 bg-white/85 backdrop-blur-md hover:bg-white/95 border border-white/80 rounded-2xl flex items-center justify-between group transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 group-hover:text-rose-700">
                    Alert & Triage Console
                  </div>
                  <div className="text-xs text-slate-500">Emergency Actions: CLOSE-01</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/public"
              className="p-5 bg-white/85 backdrop-blur-md hover:bg-white/95 border border-white/80 rounded-2xl flex items-center justify-between group transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 group-hover:text-purple-700">
                    Public Citizen Transparency
                  </div>
                  <div className="text-xs text-slate-500">Redacted Open Intelligence</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        {/* 6. MANDATORY STATUTORY CIVIL ENGINEERING NOTICE */}
        <div className="p-5 rounded-2xl bg-amber-50/90 backdrop-blur-md border border-amber-200/90 shadow-sm text-xs text-amber-900 leading-relaxed flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider text-amber-950 mr-2">
              {t.disclaimerTitle}:
            </span>
            {t.disclaimerText}
          </div>
        </div>
      </div>
    </div>
  );
}

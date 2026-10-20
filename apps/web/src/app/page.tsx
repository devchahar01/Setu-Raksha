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
import { RiskTierBadge } from "@/components/RiskTierBadge";
import { useAppStore } from "@/lib/store";
import { formatNumber } from "@/lib/formatters";

const I18N_HOME = {
  en: {
    heroSection: "Overview",
    statBridges: "Bridges Monitored",
    statBridgesSub: "5 Maharashtra Basins",
    statSensors: "IoT Sensor Feeds",
    statSensorsSub: "Ultrasonic, Tilt, Accel",
    statLeadTime: "Mean Lead Time",
    statLeadTimeSub: "Advance Disaster Warning",
    statTarget: "Disaster Reduction",
    statTargetSub: "Synthetic Evaluation Study",

    pipelineTitle: "SEVEN-STAGE LIFECYCLE DATA PIPELINE",
    pipelineSub: "Institutional data architecture from pre-construction design to public transparency",
    
    basinTitle: "MAHARASHTRA STRATEGIC RIVER BASINS",
    basinSub: "Continuous hydrological and geotechnical surveillance across 5 critical river basins",

    quickAccessTitle: "COMMAND & OPERATIONAL HUBS",
    quickAccessSub: "Direct access to field audit wizards, live sensor telemetry, and engineer triage",

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
    color: "border-teal-500/40 bg-teal-500/5",
  },
  {
    id: "bhima",
    name: "Bhima River Basin",
    nameLocal: "भीमा खोरे (सोलापूर / पुणे)",
    bridges: 12,
    status: "Watch (30–54 DRI)",
    waterLevel: "462.1m MSL",
    flow: "Elevated Scour Vigilance",
    color: "border-amber-500/40 bg-amber-500/5",
  },
  {
    id: "krishna",
    name: "Krishna River Basin",
    nameLocal: "कृष्णा खोरे (सातारा / सांगली)",
    bridges: 15,
    status: "Good (0–29 DRI)",
    waterLevel: "554.8m MSL",
    flow: "Normal Controlled Flow",
    color: "border-teal-500/40 bg-teal-500/5",
  },
  {
    id: "godavari",
    name: "Godavari River Basin",
    nameLocal: "गोदावरी खोरे (नाशिक / नांदेड)",
    bridges: 11,
    status: "Warning (55–74 DRI)",
    waterLevel: "565.3m MSL",
    flow: "Active Monitored Discharge",
    color: "border-orange-500/40 bg-orange-500/5",
  },
  {
    id: "konkan",
    name: "Konkan Coastal Basin",
    nameLocal: "कोकण किनारी खोरे (रत्नागिरी / रायगड)",
    bridges: 8,
    status: "Critical (75–100 DRI)",
    waterLevel: "Tidal Surge High",
    flow: "Chloride Exposure Accelerated",
    color: "border-rose-500/40 bg-rose-500/5",
  },
];

export default function Home() {
  const { activeLocale, useDevanagariDigits } = useAppStore();
  const t = I18N_HOME[activeLocale] || I18N_HOME.en;

  const [selectedBasin, setSelectedBasin] = useState<string>("mula-mutha");

  const lifecycles = [
    {
      code: "L1",
      title: "Pre-construction & Design Registry",
      titleHi: "पूर्व-निर्माण एवं डिजाइन रजिस्ट्री",
      titleMr: "बांधकामपूर्व व डिझाइन नोंदवही",
      desc: "IRC loading class (70R, Class AA), IS 1893 seismic zoning, foundation depth, and design scour limits.",
      tag: "IRC Standards",
      href: "/bridges",
      icon: <Layers className="w-5 h-5 text-teal-400" />,
    },
    {
      code: "L2",
      title: "Construction & Quality Audits",
      titleHi: "निर्माण एवं गुणवत्ता परीक्षण",
      titleMr: "बांधकाम व गुणवत्ता परीक्षण",
      desc: "Concrete cube compressive strength logs, contractor defect liability tracking, and initial proof-load tests.",
      tag: "Material Logs",
      href: "/bridges",
      icon: <Database className="w-5 h-5 text-teal-400" />,
    },
    {
      code: "L3",
      title: "Live Monitoring & Telemetry Cockpit",
      titleHi: "लाइव निगरानी एवं टेलीमेट्री",
      titleMr: "थेट देखरेख व सेन्सर कॉकपिट",
      desc: "Ultrasonic river stage, biaxial pier inclinometer tilt (1.0° threshold), 3-axis deck vibration accelerometers.",
      tag: "50Hz IoT Stream",
      href: "/telemetry",
      icon: <Radio className="w-5 h-5 text-teal-400" />,
    },
    {
      code: "L4",
      title: "Routine Audit Scheduler & Escalation",
      titleHi: "मासिक ऑडिट शेड्यूलर एवं एस्केलेशन",
      titleMr: "नियमित ऑडिट शेड्यूलर व एस्केलेशन",
      desc: "Automated scan at T-7 days, T-2 days, and overdue escalation to Division Engineers with multi-channel dispatch.",
      tag: "Celery Scheduler",
      href: "/triage",
      icon: <Clock className="w-5 h-5 text-teal-400" />,
    },
    {
      code: "L5",
      title: "26-Factor Monthly Field Audit",
      titleHi: "२६-घटक मासिक फील्ड ऑडिट",
      titleMr: "२६-घटक मासिक तपासणी",
      desc: "Digital inspection wizard capturing Structural, Hydraulic, Seismic, Load, and Age factors with immutable locking.",
      tag: "Appendix A Wizard",
      href: "/audits",
      icon: <FileCheck className="w-5 h-5 text-teal-400" />,
    },
    {
      code: "L6",
      title: "AI Predictive Risk & Remediations",
      titleHi: "एआई भविष्यसूचक जोखिम एवं उपचार",
      titleMr: "एआई जोखीम व उपाययोजना",
      desc: "Piecewise-linear SVI scoring, Dynamic Risk Index (DRI), Markov-chain RUL models, and 11-rule Prescriptive Catalogue.",
      tag: "Appendix D Engine",
      href: "/risk",
      icon: <Cpu className="w-5 h-5 text-teal-400" />,
    },
    {
      code: "L7",
      title: "Public Citizen Transparency Portal",
      titleHi: "सार्वजनिक नागरिक पारदर्शिता पोर्टल",
      titleMr: "नागरिक पारदर्शकता पोर्टल",
      desc: "Citizen view of bridge age, certified health tiers, and open audit history with privacy-preserving redaction.",
      tag: "Citizen Open Grid",
      href: "/public",
      icon: <Eye className="w-5 h-5 text-teal-400" />,
    },
  ];

  return (
    <div className="w-full bg-[#060A12] text-slate-100">
      {/* 1. CINEMATIC 3D INTRODUCTORY SEQUENCE */}
      <BridgeHero3D />

      {/* 2. MAIN OPERATIONS & INTELLIGENCE GRID */}
      <div id="operations-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Live National Metric Wall */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
            <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider mb-1">
              {t.statBridges}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white mb-1">
              {formatNumber(60, activeLocale, useDevanagariDigits)}
            </div>
            <div className="text-xs text-teal-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              {t.statBridgesSub}
            </div>
          </div>

          <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
            <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider mb-1">
              {t.statSensors}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white mb-1">
              {formatNumber(240, activeLocale, useDevanagariDigits)}
            </div>
            <div className="text-xs text-sky-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
              {t.statSensorsSub}
            </div>
          </div>

          <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
            <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider mb-1">
              {t.statLeadTime}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white mb-1">
              {formatNumber(6.63, activeLocale, useDevanagariDigits)} hrs
            </div>
            <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {t.statLeadTimeSub}
            </div>
          </div>

          <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
            <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider mb-1">
              {t.statTarget}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white mb-1">
              99.0%
            </div>
            <div className="text-xs text-indigo-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              {t.statTargetSub}
            </div>
          </div>
        </div>

        {/* 3. L1–L7 STRUCTURED DATA PIPELINE */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
            <div>
              <div className="text-xs font-mono text-teal-400 uppercase tracking-widest mb-1 font-bold">
                CORE SYSTEM ARCHITECTURE
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t.pipelineTitle}
              </h2>
              <p className="text-sm text-slate-400 mt-1">{t.pipelineSub}</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="px-2 py-1 bg-slate-900 rounded border border-slate-800">MoRTH Grid</span>
              <span className="px-2 py-1 bg-slate-900 rounded border border-slate-800">IRC:SP:35</span>
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
                  className="group bg-slate-950/70 hover:bg-slate-900/90 p-6 rounded-2xl border border-slate-800 hover:border-teal-500/50 transition-all shadow-sm hover:shadow-xl hover:shadow-teal-500/5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                          {item.icon}
                        </div>
                        <span className="font-mono text-xs font-extrabold text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/60">
                          {item.code}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-100 text-sm mb-2 group-hover:text-teal-300 transition-colors">
                      {localizedTitle}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">{item.desc}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-teal-400">
                    <span className="font-medium text-[11px]">Inspect Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 4. MAHARASHTRA STRATEGIC RIVER BASINS SPOTLIGHT */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
            <div>
              <div className="text-xs font-mono text-teal-400 uppercase tracking-widest mb-1 font-bold">
                REGIONAL JURISDICTION COVERAGE
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t.basinTitle}
              </h2>
              <p className="text-sm text-slate-400 mt-1">{t.basinSub}</p>
            </div>
            <Link
              href="/bridges"
              className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              Open Interactive Basin GIS Map <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {BASIN_METRICS.map((basin) => (
              <div
                key={basin.id}
                onClick={() => setSelectedBasin(basin.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedBasin === basin.id
                    ? `${basin.color} shadow-lg ring-1 ring-teal-500/40`
                    : "bg-slate-900/30 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <div className="text-xs font-mono text-slate-400 mb-1">
                  {formatNumber(basin.bridges, activeLocale, useDevanagariDigits)} Bridges
                </div>
                <h4 className="font-bold text-white text-sm mb-1">{basin.name}</h4>
                <div className="text-[11px] text-slate-400 mb-3">{basin.nameLocal}</div>

                <div className="space-y-1.5 text-xs border-t border-slate-800/60 pt-3">
                  <div className="text-[11px] font-mono text-teal-300">{basin.status}</div>
                  <div className="text-[10px] text-slate-400">{basin.waterLevel}</div>
                  <div className="text-[10px] text-slate-500">{basin.flow}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. DIRECT COMMAND ACTION DECK */}
        <div>
          <div className="mb-6">
            <div className="text-xs font-mono text-teal-400 uppercase tracking-widest mb-1 font-bold">
              OPERATIONAL WORKFLOWS
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {t.quickAccessTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-1">{t.quickAccessSub}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/bridges"
              className="p-5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-teal-300">
                    Bridge Registry & GIS Map
                  </div>
                  <div className="text-xs text-slate-400">5 Basins • Color Coded Markers</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/telemetry"
              className="p-5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-sky-300">
                    Live Telemetry Sensors Cockpit
                  </div>
                  <div className="text-xs text-slate-400">Water Stage • Pier Tilt • Vibration</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/audits"
              className="p-5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-emerald-300">
                    26-Factor Field Audit Wizard
                  </div>
                  <div className="text-xs text-slate-400">Immutable Cryptographic Locking</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/risk"
              className="p-5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-indigo-300">
                    AI SVI, DRI & Remediation
                  </div>
                  <div className="text-xs text-slate-400">11 Certified Trilingual Rules</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/triage"
              className="p-5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-rose-300">
                    Alert & Triage Console
                  </div>
                  <div className="text-xs text-slate-400">Emergency Actions: CLOSE-01</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/public"
              className="p-5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-purple-300">
                    Public Citizen Transparency
                  </div>
                  <div className="text-xs text-slate-400">Redacted Open Intelligence</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        {/* 6. MANDATORY STATUTORY CIVIL ENGINEERING NOTICE */}
        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider text-amber-300 mr-2">
              {t.disclaimerTitle}:
            </span>
            {t.disclaimerText}
          </div>
        </div>
      </div>
    </div>
  );
}

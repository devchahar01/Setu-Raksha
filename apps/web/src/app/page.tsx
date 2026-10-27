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
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { BridgeHero3D } from "@/components/BridgeHero3D";
import { useAppStore } from "@/lib/store";
import { formatNumber } from "@/lib/formatters";
import { triggerHaptic } from "@/lib/haptics";

const I18N_HOME = {
  en: {
    heroSection: "Overview",
    statBridges: "Bridges Monitored",
    statBridgesSub: "5 Maharashtra Basins",
    statSensors: "Active IoT Sensors",
    statSensorsSub: "Stage, Inclinometers, PPV",
    statLeadTime: "Warning Lead Time",
    statLeadTimeSub: "Hydrological Alert Headroom",
    statTarget: "Disaster Risk Mitigation",
    statTargetSub: "Synthetic Benchmark Study",

    pipelineTitle: "SEVEN-STAGE LIFECYCLE DATA PIPELINE",
    pipelineSub:
      "Institutional digital architecture from pre-construction design to public transparency conforming to IRC:SP:35 & IS 1893",

    basinTitle: "STRATEGIC RIVER BASINS",
    basinSub:
      "Continuous hydrological and geotechnical surveillance across 5 critical river basins in Maharashtra",

    quickAccessTitle: "OPERATIONAL COMMAND HUBS",
    quickAccessSub:
      "Direct access to field audit wizards, live sensor telemetry, and engineer triage consoles",

    disclaimerTitle: "STATUTORY CIVIL ENGINEERING ADVISORY",
    disclaimerText:
      "Setu Rakshak is an authorized decision-support intelligence grid designed to assist—never replace—certified civil engineering inspection, physical non-destructive testing (NDT), and professional human engineering judgment. All telemetry feeds are labeled source=simulated.",
  },
  hi: {
    heroSection: "अवलोकन",
    statBridges: "निगरानी अधीन पुल",
    statBridgesSub: "५ महाराष्ट्र नदी बेसिन",
    statSensors: "सक्रिय टेलीमेट्री नोड्स",
    statSensorsSub: "जल स्तर, झुकाव, कंपन",
    statLeadTime: "चेतावनी अग्रिम समय",
    statLeadTimeSub: "आपदा पूर्व सूचना अग्रिम",
    statTarget: "आपदा जोखिम निवारण",
    statTargetSub: "सिंथेटिक बेंचमार्क अध्ययन",

    pipelineTitle: "सात-चरणीय जीवन चक्र डेटा पाइपलाइन",
    pipelineSub:
      "पूर्व-निर्माण डिजाइन से नागरिक पारदर्शिता तक IRC:SP:35 और IS 1893 अनुरूप संपूर्ण संस्थागत डिजिटल ग्रिड",

    basinTitle: "महाराष्ट्र सामरिक नदी बेसिन",
    basinSub:
      "५ प्रमुख नदी घाटियों में निरंतर जलवैज्ञानिक और भू-तकनीकी सुरक्षा निगरानी",

    quickAccessTitle: "कमांड एवं संचालन केंद्र",
    quickAccessSub:
      "फील्ड ऑडिट विज़ार्ड, लाइव टेलीमेट्री और इंजीनियर ट्राइएज कंसोल का सीधा प्रवेश",

    disclaimerTitle: "वैधानिक सिविल इंजीनियरिंग सूचना",
    disclaimerText:
      "सेतु रक्षक एक निर्णय-सहायता इंटेलिजेंस ग्रिड है जो प्रमाणित सिविल इंजीनियरिंग निरीक्षण, भौतिक परीक्षण और मानवीय तकनीकी निर्णय की सहायता करता है, उनका स्थान नहीं लेता। सभी डेटा स्रोत=सिम्युलेटेड के रूप में चिह्नित हैं।",
  },
  mr: {
    heroSection: "अवलोकन",
    statBridges: "देखरेख खालील पूल",
    statBridgesSub: "५ महाराष्ट्र नदी खोरे",
    statSensors: "सक्रिय सेन्सर नोड्स",
    statSensorsSub: "जलपातळी, टिल्ट, कंपन",
    statLeadTime: "सरासरी पूर्वसूचना वेळ",
    statLeadTimeSub: "आपत्ती प्रतिबंधात्मक आगाऊ वेळ",
    statTarget: "आपत्ती निवारण लक्ष्य",
    statTargetSub: "सिम्युलेशन मूल्यांकन अभ्यास",

    pipelineTitle: "सात-टप्प्यांची जीवनचक्र डेटा पाइपलाइन",
    pipelineSub:
      "बांधकामपूर्व डिझाइनपासून सार्वजनिक पारदर्शकतेपर्यंत IRC:SP:35 आणि IS 1893 मानकांनुसार संस्थागत डिजिटल ग्रीड",

    basinTitle: "महाराष्ट्र सामरिक नदी खोरे",
    basinSub:
      "५ प्रमुख नदी खोऱ्यांमध्ये सतत जलवैज्ञानिक आणि भू-तांत्रिक सुरक्षा देखरेख",

    quickAccessTitle: "कमांड व संचालन दालन",
    quickAccessSub:
      "फील्ड तपासणी विझार्ड, थेट सेन्सर देखरेख आणि अभियंता नियंत्रण कक्षात थेट प्रवेश",

    disclaimerTitle: "वैधानिक स्थापत्य अभियांत्रिकी सूचना",
    disclaimerText:
      "सेतू रक्षक ही निर्णय-साहाय्य यंत्रणा असून ती प्रत्यक्ष स्थापत्य अभियांत्रिकी तपासणी, प्रत्यक्ष चाचणी आणि मानवी अभियांत्रिकी निर्णयाची जागा घेत नाही. सर्व डेटा चाचणीसाठी source=सिम्युलेटेड म्हणून नोंदवला गेला आहे.",
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

  // Complete, sequential L1 through L7 Lifecycle with authentic civil descriptions
  const lifecycles = [
    {
      code: "L1",
      title: {
        en: "Pre-construction & Design Registry",
        hi: "पूर्व-निर्माण एवं डिजाइन रजिस्ट्री",
        mr: "बांधकामपूर्व व डिझाइन नोंदवही",
      },
      desc: {
        en: "IRC loading standards (70R, Class AA), IS 1893 seismic zoning, foundation depth, and design scour thresholds.",
        hi: "आईआरसी भार मानक (70R, क्लास AA), IS 1893 भूकंपीय क्षेत्र, नींव गहराई और डिजाइन कटाव सीमाएं।",
        mr: "आयआरसी भार मानके (70R, क्लास AA), IS 1893 भूकंप प्रवण क्षेत्र, पाया खोली आणि डिझाइन गाद मर्यादा.",
      },
      tag: "IRC Standards",
      href: "/bridges",
      icon: <Layers className="w-5 h-5 text-sky-600" />,
    },
    {
      code: "L2",
      title: {
        en: "Construction & Quality Testing",
        hi: "निर्माण एवं गुणवत्ता परीक्षण",
        mr: "बांधकाम व गुणवत्ता परीक्षण",
      },
      desc: {
        en: "Concrete cube compressive strength logs, contractor defect liability tracking, and initial proof-load verification.",
        hi: "कंक्रीट क्यूब संपीड़न शक्ति लॉग, ठेकेदार दोष दायित्व ट्रैकिंग और प्रारंभिक प्रूफ-लोड सत्यापन।",
        mr: "काँक्रीट क्यूब संकुचन क्षमता नोंदी, कंत्राटदार दोष दायित्व कालावधी आणि भार चाचणी पडताळणी.",
      },
      tag: "Quality Logs",
      href: "/bridges",
      icon: <Database className="w-5 h-5 text-sky-600" />,
    },
    {
      code: "L3",
      title: {
        en: "Live Structural Telemetry Cockpit",
        hi: "लाइव संरचनात्मक टेलीमेट्री कॉकपिट",
        mr: "थेट संरचनात्मक सेन्सर कॉकपिट",
      },
      desc: {
        en: "Ultrasonic river stage, biaxial pier inclinometer tilt (1.0 mrad threshold), and 3-axis deck vibration accelerometers.",
        hi: "अल्ट्रासोनिक नदी जल स्तर, पियर द्विएक्शियल झुकाव (1.0 mrad सीमा) और 3-अक्षीय डेक कंपन त्वरण।",
        mr: "अल्ट्रासोनिक नदी पातळी, खांबाचा कल (1.0 mrad मर्यादा) आणि ३-अक्षीय डेक कंपन प्रवेग मापक.",
      },
      tag: "50Hz Stream",
      href: "/telemetry",
      icon: <Radio className="w-5 h-5 text-sky-600" />,
    },
    {
      code: "L4",
      title: {
        en: "Routine Audit Scheduler & Escalation",
        hi: "मासिक ऑडिट शेड्यूलर एवं एस्केलेशन",
        mr: "नियमित ऑडिट शेड्यूलर व एस्केलेशन",
      },
      desc: {
        en: "Automated scan at T-7 days, T-2 days, and overdue escalation to Division Engineers with emergency action dispatch.",
        hi: "टी-७ दिन, टी-२ दिन पर स्वचालित स्कैन और आपातकालीन कार्रवाई प्रेषण के साथ डिवीजन इंजीनियरों को एस्केलेशन।",
        mr: "T-७ दिवस, T-२ दिवस स्वयंचलित स्कॅन आणि आपत्कालीन कारवाईसह विभागीय अभियंत्याकडे वर्ग.",
      },
      tag: "Audit Matrix",
      href: "/triage",
      icon: <Clock className="w-5 h-5 text-sky-600" />,
    },
    {
      code: "L5",
      title: {
        en: "26-Factor Monthly Field Audit",
        hi: "२६-घटक मासिक फील्ड ऑडिट",
        mr: "२६-घटक मासिक तपासणी",
      },
      desc: {
        en: "Digital inspection wizard capturing Structural, Hydraulic, Seismic, Load, and Age factors with immutable locking.",
        hi: "संरचनात्मक, हाइड्रोलिक, भूकंपीय, भार और आयु कारकों को अपरिवर्तनीय लॉकिंग के साथ दर्ज करने वाला डिजिटल विज़ार्ड।",
        mr: "संरचनात्मक, जलवैज्ञानिक, भूकंपीय, भार आणि वय निकष अपरिवर्तनीय लॉकिंगसह नोंदवणारा डिजिटल विझार्ड.",
      },
      tag: "Field Wizard",
      href: "/audits",
      icon: <FileCheck className="w-5 h-5 text-sky-600" />,
    },
    {
      code: "L6",
      title: {
        en: "Structural Vulnerability & RUL Engine",
        hi: "संरचनात्मक संवेदनशीलता एवं शेष जीवन (RUL)",
        mr: "संरचनात्मक संवेदनशीलता व उर्वरित आयुष्य (RUL)",
      },
      desc: {
        en: "Piecewise-linear SVI scoring, Dynamic Risk Index (DRI), Markov-chain degradation, and 11-rule Prescriptive Catalogue.",
        hi: "पीसवाइज़-रेखीय SVI स्कोरिंग, डायनामिक जोखिम सूचकांक (DRI), मार्कोव क्षरण और 11-नियम निर्धारित उपचार सूची।",
        mr: "तुकडा-रेषीय SVI गुण, डायनामिक जोखीम निर्देशांक (DRI), मार्कोव्ह क्षय अंदाज आणि ११ अधिकृत दुरुस्ती उपाय.",
      },
      tag: "Risk Engine",
      href: "/risk",
      icon: <Cpu className="w-5 h-5 text-sky-600" />,
    },
    {
      code: "L7",
      title: {
        en: "Public Citizen Transparency Portal",
        hi: "सार्वजनिक नागरिक पारदर्शिता पोर्टल",
        mr: "नागरिक पारदर्शकता पोर्टल",
      },
      desc: {
        en: "Citizen view of bridge age, certified health tiers, and open audit history with privacy-preserving redaction.",
        hi: "गोपनीयता-संरक्षित प्रारूप के साथ पुल निर्माण आयु, प्रमाणित सुरक्षा स्तर और खुली ऑडिट रिपोर्ट।",
        mr: "पुलाचे वय, प्रमाणित सुरक्षा स्तर आणि खुली तपासणी माहिती नागरिकांसाठी उपलब्ध.",
      },
      tag: "Open Access",
      href: "/public",
      icon: <Eye className="w-5 h-5 text-sky-600" />,
    },
  ];

  return (
    <div className="relative w-full text-slate-800 overflow-x-hidden">
      {/* 1. CINEMATIC 3D DAYLIGHT BRIDGE */}
      <BridgeHero3D />

      {/* 2. MAIN OPERATIONS GRID */}
      <div id="operations-grid" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Live National Metric Wall */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-white/80 shadow-md hover:shadow-lg transition-all">
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

          <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-white/80 shadow-md hover:shadow-lg transition-all">
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

          <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-white/80 shadow-md hover:shadow-lg transition-all">
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

          <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-white/80 shadow-md hover:shadow-lg transition-all">
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
              <p className="text-xs sm:text-sm text-slate-600 mt-1">{t.pipelineSub}</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="px-2.5 py-1 bg-white/90 rounded-lg border border-slate-200 font-medium shadow-xs">
                MoRTH Standard
              </span>
              <span className="px-2.5 py-1 bg-white/90 rounded-lg border border-slate-200 font-medium shadow-xs">
                IRC:SP:35
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lifecycles.map((item) => {
              const localizedTitle = item.title[activeLocale] || item.title.en;
              const localizedDesc = item.desc[activeLocale] || item.desc.en;
              return (
                <Link
                  key={item.code}
                  href={item.href}
                  onClick={() => triggerHaptic("light")}
                  className="group bg-white/90 backdrop-blur-md hover:bg-white p-6 rounded-2xl border border-white/80 hover:border-sky-300 transition-all shadow-md hover:shadow-xl flex flex-col justify-between"
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
                    <p className="text-xs text-slate-600 leading-relaxed">{localizedDesc}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 group-hover:text-sky-700">
                    <span className="font-semibold text-xs">
                      {activeLocale === "hi" ? "मॉड्यूल खोलें" : activeLocale === "mr" ? "विभाग उघडा" : "Open Module"}
                    </span>
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
              <p className="text-xs sm:text-sm text-slate-600 mt-1">{t.basinSub}</p>
            </div>
            <Link
              href="/bridges"
              onClick={() => triggerHaptic("light")}
              className="text-xs text-sky-700 hover:text-sky-800 font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-sky-200 shadow-xs"
            >
              <span>
                {activeLocale === "hi"
                  ? "नदी बेसिन जीआईएस मानचित्र खोलें"
                  : activeLocale === "mr"
                  ? "नदी खोरे जीआयएस नकाशा उघडा"
                  : "Open Interactive Basin GIS Map"}
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {BASIN_METRICS.map((basin) => (
              <div
                key={basin.id}
                onClick={() => {
                  setSelectedBasin(basin.id);
                  triggerHaptic("selection");
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer backdrop-blur-md ${
                  selectedBasin === basin.id
                    ? `${basin.color} shadow-md ring-2 ring-sky-500/40`
                    : "bg-white/90 border-white/80 hover:border-slate-300 shadow-xs"
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
              onClick={() => triggerHaptic("light")}
              className="p-5 bg-white/90 backdrop-blur-md hover:bg-white border border-white/80 rounded-2xl flex items-center justify-between group transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 group-hover:text-sky-700">
                    {activeLocale === "hi"
                      ? "पुल रजिस्ट्री एवं जीआईएस"
                      : activeLocale === "mr"
                      ? "पूल नोंदवही व जीआयएस"
                      : "Bridge Registry & GIS Map"}
                  </div>
                  <div className="text-xs text-slate-500">5 Basins • Color Coded Markers</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/telemetry"
              onClick={() => triggerHaptic("light")}
              className="p-5 bg-white/90 backdrop-blur-md hover:bg-white border border-white/80 rounded-2xl flex items-center justify-between group transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 group-hover:text-sky-700">
                    {activeLocale === "hi"
                      ? "लाइव टेलीमेट्री सेंसर कॉकपिट"
                      : activeLocale === "mr"
                      ? "थेट सेन्सर टेलीमेट्री कॉकपिट"
                      : "Live Telemetry Sensors Cockpit"}
                  </div>
                  <div className="text-xs text-slate-500">Water Stage • Pier Tilt • Vibration</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/audits"
              onClick={() => triggerHaptic("light")}
              className="p-5 bg-white/90 backdrop-blur-md hover:bg-white border border-white/80 rounded-2xl flex items-center justify-between group transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 group-hover:text-emerald-700">
                    {activeLocale === "hi"
                      ? "२६-घटक फील्ड ऑडिट विज़ार्ड"
                      : activeLocale === "mr"
                      ? "२६-घटक फील्ड तपासणी विझार्ड"
                      : "26-Factor Field Audit Wizard"}
                  </div>
                  <div className="text-xs text-slate-500">IRC:SP:35 Table 4.1 Calibration</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/risk"
              onClick={() => triggerHaptic("light")}
              className="p-5 bg-white/90 backdrop-blur-md hover:bg-white border border-white/80 rounded-2xl flex items-center justify-between group transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 group-hover:text-indigo-700">
                    {activeLocale === "hi"
                      ? "SVI, DRI एवं उपचार सूची"
                      : activeLocale === "mr"
                      ? "SVI, DRI व उपाययोजना सूची"
                      : "SVI, DRI & Remediation Catalogue"}
                  </div>
                  <div className="text-xs text-slate-500">11 Certified Trilingual Rules</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/defect-ar"
              onClick={() => triggerHaptic("light")}
              className="p-5 bg-white/90 backdrop-blur-md hover:bg-white border border-white/80 rounded-2xl flex items-center justify-between group transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 group-hover:text-amber-700">
                    {activeLocale === "hi"
                      ? "AR 3D दोष स्थानीयकरण ट्विन"
                      : activeLocale === "mr"
                      ? "AR 3D दोष स्थाननिश्चिती ट्विन"
                      : "AR 3D Defect Localization Twin"}
                  </div>
                  <div className="text-xs text-slate-500">CS543 Photogrammetry & SIFT Multi-View</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/public"
              onClick={() => triggerHaptic("light")}
              className="p-5 bg-white/90 backdrop-blur-md hover:bg-white border border-white/80 rounded-2xl flex items-center justify-between group transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 group-hover:text-purple-700">
                    {activeLocale === "hi"
                      ? "सार्वजनिक नागरिक पारदर्शिता"
                      : activeLocale === "mr"
                      ? "नागरिक पारदर्शकता दालन"
                      : "Public Citizen Transparency"}
                  </div>
                  <div className="text-xs text-slate-500">Citizen Grievance & Health Tiers</div>
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

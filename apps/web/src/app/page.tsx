"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
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
  Box,
  Activity,
  Compass,
} from "lucide-react";
import { BridgeHero3D } from "@/components/BridgeHero3D";
import { useAppStore } from "@/lib/store";
import { formatNumber } from "@/lib/formatters";
import { triggerHaptic } from "@/lib/haptics";

const I18N_HOME = {
  en: {
    heroSection: "Overview",
    statBridges: "REGISTERED BRIDGES",
    statBridgesSub: "Across 5 Strategic Basins",
    statSensors: "TELEMETRY TRANSDUCERS",
    statSensorsSub: "IMU, Stage, Tilt, Accel",
    statLeadTime: "EARLY WARNING HEADROOM",
    statLeadTimeSub: "Advance Disaster Margin",
    statTarget: "RISK PREVENTION RATE",
    statTargetSub: "IRC:SP:35 Safety Benchmark",

    pipelineTitle: "SEVEN-STAGE STRUCTURAL LIFECYCLE SYSTEM",
    pipelineSub:
      "Standardized civil engineering data flow from design specifications to public transparency (IRC:SP:35 & IS 1893 compliant)",

    basinTitle: "MAHARASHTRA STRATEGIC RIVER BASINS",
    basinSub:
      "Continuous hydrological and scour surveillance across 5 critical river basins in Maharashtra",

    quickAccessTitle: "OPERATIONAL CONTROL ROOM MODULES",
    quickAccessSub:
      "Direct consoles for structural engineers, division executive officers, and field inspection crews",

    disclaimerTitle: "STATUTORY CIVIL ENGINEERING NOTICE",
    disclaimerText:
      "Setu Rakshak is an authorized decision-support engineering grid designed to assist—never replace—certified civil engineering inspection, physical non-destructive testing (NDT), and professional human engineering judgment. All telemetry feeds are labeled source=simulated.",
  },
  hi: {
    heroSection: "अवलोकन",
    statBridges: "पंजीकृत पुल परिसंपत्तियां",
    statBridgesSub: "५ प्रमुख नदी बेसिन में",
    statSensors: "सक्रिय टेलीमेट्री ट्रांसड्यूसर",
    statSensorsSub: "जल स्तर, झुकाव, कंपन",
    statLeadTime: "चेतावनी अग्रिम समय",
    statLeadTimeSub: "आपदा पूर्व सूचना अग्रिम",
    statTarget: "जोखिम निवारण दर",
    statTargetSub: "IRC:SP:35 सुरक्षा मानक",

    pipelineTitle: "सात-चरणीय संरचनात्मक जीवन चक्र प्रणाली",
    pipelineSub:
      "डिजाइन विनिर्देशों से नागरिक पारदर्शिता तक मानकीकृत सिविल इंजीनियरिंग डेटा प्रवाह (IRC:SP:35 व IS 1893 अनुरूप)",

    basinTitle: "महाराष्ट्र सामरिक नदी बेसिन निगरानी",
    basinSub:
      "महाराष्ट्र की ५ प्रमुख नदी घाटियों में निरंतर जलवैज्ञानिक और नींव कटाव सुरक्षा निगरानी",

    quickAccessTitle: "कंट्रोल रूम परिचालन मॉड्यूल",
    quickAccessSub:
      "संरचनात्मक इंजीनियरों, कार्यकारी अधिकारियों और फील्ड निरीक्षण टीमों के लिए सीधे कंसोल",

    disclaimerTitle: "वैधानिक सिविल इंजीनियरिंग सूचना",
    disclaimerText:
      "सेतु रक्षक एक निर्णय-सहायता इंजीनियरिंग ग्रिड है जो प्रमाणित सिविल इंजीनियरिंग निरीक्षण, भौतिक परीक्षण और मानवीय तकनीकी निर्णय की सहायता करता है, उनका स्थान नहीं लेता। सभी परीक्षण डेटा स्रोत=सिम्युलेटेड के रूप में चिह्नित हैं।",
  },
  mr: {
    heroSection: "अवलोकन",
    statBridges: "नोंदणीकृत पूल मालमत्ता",
    statBridgesSub: "५ सामरिक नदी खोऱ्यांमध्ये",
    statSensors: "सक्रिय टेलीमेट्री ट्रान्सड्यूसर",
    statSensorsSub: "पातळी, टिल्ट, कंपन",
    statLeadTime: "आगाऊ इशारा कालावधी",
    statLeadTimeSub: "आपत्ती प्रतिबंधात्मक वेळ",
    statTarget: "जोखीम निवारण दर",
    statTargetSub: "IRC:SP:35 सुरक्षा निकष",

    pipelineTitle: "सात-टप्प्यांची संरचनात्मक जीवनचक्र प्रणाली",
    pipelineSub:
      "डिझाइन निकषांपासून सार्वजनिक पारदर्शकतेपर्यंत मानकीकृत स्थापत्य अभियांत्रिकी डेटा प्रवाह (IRC:SP:35 व IS 1893 मानकांनुसार)",

    basinTitle: "महाराष्ट्र सामरिक नदी खोरे देखरेख",
    basinSub:
      "महाराष्ट्रातील ५ प्रमुख नदी खोऱ्यांमध्ये अखंड जलवैज्ञानिक व पायाची झीज सुरक्षा देखरेख",

    quickAccessTitle: "नियंत्रण कक्ष संचालन विभाग",
    quickAccessSub:
      "स्थापत्य अभियंता, कार्यकारी अधिकारी आणि प्रत्यक्ष तपासणी पथकांसाठी थेट नियंत्रण दालने",

    disclaimerTitle: "वैधानिक स्थापत्य अभियांत्रिकी सूचना",
    disclaimerText:
      "सेतू रक्षक ही निर्णय-साहाय्य प्रणाली असून ती प्रत्यक्ष स्थापत्य अभियांत्रिकी तपासणी, प्रत्यक्ष चाचणी आणि मानवी अभियांत्रिकी निर्णयाची जागा घेत नाही. सर्व डेटा चाचणीसाठी source=सिम्युलेटेड म्हणून नोंदवला गेला आहे.",
  },
};

const BASIN_METRICS = [
  {
    id: "mula-mutha",
    name: "Mula-Mutha Basin",
    nameLocal: "मुळा-मुठा खोरे (पुणे)",
    bridges: 14,
    status: "NORMAL",
    statusText: "0–29 DRI",
    waterLevel: "538.4m MSL",
    flow: "Safe (1.2m below HFL)",
    statusBg: "bg-emerald-50 text-emerald-800 border-emerald-300",
  },
  {
    id: "bhima",
    name: "Bhima River Basin",
    nameLocal: "भीमा खोरे (सोलापूर / पुणे)",
    bridges: 12,
    status: "WATCH",
    statusText: "30–54 DRI",
    waterLevel: "462.1m MSL",
    flow: "Elevated Scour Vigilance",
    statusBg: "bg-amber-50 text-amber-800 border-amber-300",
  },
  {
    id: "krishna",
    name: "Krishna River Basin",
    nameLocal: "कृष्णा खोरे (सातारा / सांगली)",
    bridges: 15,
    status: "NORMAL",
    statusText: "0–29 DRI",
    waterLevel: "554.8m MSL",
    flow: "Controlled Discharge",
    statusBg: "bg-emerald-50 text-emerald-800 border-emerald-300",
  },
  {
    id: "godavari",
    name: "Godavari River Basin",
    nameLocal: "गोदावरी खोरे (नाशिक / नांदेड)",
    bridges: 11,
    status: "WARNING",
    statusText: "55–74 DRI",
    waterLevel: "565.3m MSL",
    flow: "High Spillway Gate Flow",
    statusBg: "bg-orange-50 text-orange-800 border-orange-300",
  },
  {
    id: "konkan",
    name: "Konkan Coastal Basin",
    nameLocal: "कोकण किनारी खोरे (रत्नागिरी)",
    bridges: 8,
    status: "CRITICAL",
    statusText: "75–100 DRI",
    waterLevel: "Tidal Surge High",
    flow: "Accelerated Chloride Action",
    statusBg: "bg-rose-50 text-rose-800 border-rose-300",
  },
];

export default function Home() {
  const { activeLocale, useDevanagariDigits } = useAppStore();
  const t = I18N_HOME[activeLocale] || I18N_HOME.en;

  const [selectedBasin, setSelectedBasin] = useState<string>("mula-mutha");

  // Complete, sequential L1 through L7 Lifecycle
  const lifecycles = [
    {
      code: "01",
      systemLevel: "L1",
      title: {
        en: "Asset Registry & Infrastructure Locator",
        hi: "परिसंपत्ति रजिस्ट्री एवं पुल-फ्लाईओवर खोज",
        mr: "मालमत्ता नोंदवही व पूल-उड्डाणपूल शोध",
      },
      desc: {
        en: "National infrastructure grid: historical provenance, commissioning era, calculated operational age, civil engineering parameters, and GIS mapping for 32+ major bridges and flyovers across India.",
        hi: "राष्ट्रीय अवसंरचना ग्रिड: भारत भर के ३२+ प्रमुख पुलों और फ्लाईओवरों का इतिहास, सक्रिय आयु, सिविल पैरामीटर और सटीक जीआईएस मानचित्रण।",
        mr: "राष्ट्रीय पायाभूत सुविधा ग्रीड: देशभरातील ३२+ प्रमुख पूल आणि उड्डाणपुलांचा इतिहास, सक्रिय वय, अभियांत्रिकी मापदंड आणि अचूक जीआयएस नकाशा.",
      },
      tag: "IRC:6 / IS 1893 / Wikipedia Verified",
      href: "/bridges",
      icon: <Layers className="w-4 h-4 text-slate-700" />,
    },
    {
      code: "02",
      systemLevel: "L2",
      title: {
        en: "Construction & Quality Testing",
        hi: "निर्माण एवं गुणवत्ता परीक्षण",
        mr: "बांधकाम व गुणवत्ता परीक्षण",
      },
      desc: {
        en: "Concrete cube compressive strength logs (M35-M50), contractor defect liability tracking, and initial proof-load verification.",
        hi: "कंक्रीट क्यूब संपीड़न शक्ति लॉग (M35-M50), ठेकेदार दोष दायित्व ट्रैकिंग और प्रारंभिक लोड टेस्ट सत्यापन।",
        mr: "काँक्रीट क्यूब क्षमता नोंदी (M35-M50), कंत्राटदार दोष दायित्व कालावधी आणि भार चाचणी पडताळणी.",
      },
      tag: "IRC:SP:35 QA",
      href: "/bridges?view=quality",
      icon: <Database className="w-4 h-4 text-slate-700" />,
    },
    {
      code: "03",
      systemLevel: "L3",
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
      tag: "50Hz Edge Stream",
      href: "/telemetry",
      icon: <Radio className="w-4 h-4 text-slate-700" />,
    },
    {
      code: "04",
      systemLevel: "AR",
      title: {
        en: "Photogrammetry 3D Defect Twin",
        hi: "फोटोग्रामेट्री 3D दोष ट्विन",
        mr: "फोटोग्रामेट्री 3D दोष ट्विन",
      },
      desc: {
        en: "CS543 multi-view SIFT feature matching, calibrated camera trajectories, and localized 3D spalling/scour bounding cubes.",
        hi: "CS543 मल्टी-व्यू SIFT मिलान, अंशांकित कैमरा प्रक्षेपवक्र और वास्तविक 3D स्पॉलिंग/कटाव बाउंडिंग क्यूब्स।",
        mr: "CS543 मल्टी-व्ह्यू SIFT जुळणी, कॅमेरा ट्रॅजेक्टरी आणि ३डी स्पॉलिंग/गाद बाउंडिंग क्युब्स.",
      },
      tag: "SIFT Multi-View",
      href: "/defect-ar",
      icon: <Box className="w-4 h-4 text-slate-700" />,
    },
    {
      code: "05",
      systemLevel: "L6",
      title: {
        en: "Deterministic SVI & RUL Engine",
        hi: "संरचनात्मक संवेदनशीलता एवं शेष जीवन (RUL)",
        mr: "संरचनात्मक संवेदनशीलता व उर्वरित आयुष्य (RUL)",
      },
      desc: {
        en: "Piecewise-linear SVI scoring, Dynamic Risk Index (DRI), Markov-chain degradation, and 11-rule Prescriptive Catalogue.",
        hi: "पीसवाइज़-रेखीय SVI स्कोरिंग, डायनामिक जोखिम सूचकांक (DRI), मार्कोव क्षरण और 11-नियम निर्धारित उपचार सूची।",
        mr: "तुकडा-रेषीय SVI गुण, डायनामिक जोखीम निर्देशांक (DRI), मार्कोव्ह क्षय अंदाज आणि ११ अधिकृत दुरुस्ती उपाय.",
      },
      tag: "Appendix D Math",
      href: "/risk",
      icon: <Cpu className="w-4 h-4 text-slate-700" />,
    },
    {
      code: "06",
      systemLevel: "L4",
      title: {
        en: "Incident Triage & Emergency Response",
        hi: "घटना नियंत्रण एवं आपातकालीन संचालन",
        mr: "घटना नियंत्रण व आपत्कालीन कक्ष",
      },
      desc: {
        en: "Automated alert scan, axle weight restrictions, arterial traffic diversions, and emergency bridge closure orders (CLOSE-01).",
        hi: "स्वचालित अलर्ट स्कैन, धुरा भार प्रतिबंध, यातायात डायवर्जन और आपातकालीन पुल बंदी आदेश (CLOSE-01)।",
        mr: "स्वयंचलित इशारा स्कॅन, वाहन भार मर्यादा, वाहतूक वळवणे आणि आपत्कालीन पूल बंदी आदेश (CLOSE-01).",
      },
      tag: "Division Ops",
      href: "/triage",
      icon: <AlertTriangle className="w-4 h-4 text-slate-700" />,
    },
    {
      code: "07",
      systemLevel: "L5",
      title: {
        en: "26-Factor Field Structural Audit",
        hi: "२६-घटक फील्ड संरचनात्मक ऑडिट",
        mr: "२६-घटक प्रत्यक्ष संरचनात्मक तपासणी",
      },
      desc: {
        en: "Digital inspection wizard capturing Structural, Hydraulic, Seismic, Load, and Age factors with immutable locking.",
        hi: "संरचनात्मक, हाइड्रोलिक, भूकंपीय, भार और आयु कारकों को अपरिवर्तनीय लॉकिंग के साथ दर्ज करने वाला डिजिटल विज़ार्ड।",
        mr: "संरचनात्मक, जलवैज्ञानिक, भूकंपीय, भार आणि वय निकष अपरिवर्तनीय लॉकिंगसह नोंदवणारा डिजिटल विझार्ड.",
      },
      tag: "IRC:SP:35 Tab 4.1",
      href: "/audits",
      icon: <FileCheck className="w-4 h-4 text-slate-700" />,
    },
    {
      code: "08",
      systemLevel: "L7",
      title: {
        en: "Public Citizen Transparency Portal",
        hi: "सार्वजनिक नागरिक पारदर्शिता पोर्टल",
        mr: "नागरिक पारदर्शकता दालन",
      },
      desc: {
        en: "Open citizen portal for bridge age, certified health tiers, open audit records, and direct public grievance lodging.",
        hi: "पुल निर्माण आयु, प्रमाणित सुरक्षा स्तर, खुले ऑडिट रिकॉर्ड और नागरिक शिकायत दर्ज करने का खुला पोर्टल।",
        mr: "पुलाचे वय, प्रमाणित सुरक्षा स्तर, खुली तपासणी माहिती आणि नागरिक तक्रार नोंदणीची खुली सोय.",
      },
      tag: "MoRTH Open Grid",
      href: "/public",
      icon: <Eye className="w-4 h-4 text-slate-700" />,
    },
  ];

  return (
    <div className="relative w-full text-slate-800 bg-[#fcfbf9]">
      {/* 1. CINEMATIC 3D LIVE OBSERVATION SCENE */}
      <BridgeHero3D />

      {/* 2. MAIN OPERATIONS GRID (RESTYLED INTO ENGINEERING CONTROL ROOM) */}
      <div id="operations-grid" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Live National Metric Wall (Clean engineering cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-xs">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider block mb-1">
              {t.statBridges}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 mb-1">
              {formatNumber(60, activeLocale, useDevanagariDigits)}
            </div>
            <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{t.statBridgesSub}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-xs">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider block mb-1">
              {t.statSensors}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 mb-1">
              {formatNumber(240, activeLocale, useDevanagariDigits)}
            </div>
            <div className="text-[11px] text-sky-800 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              <span>{t.statSensorsSub}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-xs">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider block mb-1">
              {t.statLeadTime}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 mb-1">
              {formatNumber(6.63, activeLocale, useDevanagariDigits)} hrs
            </div>
            <div className="text-[11px] text-emerald-800 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{t.statLeadTimeSub}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-xs">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider block mb-1">
              {t.statTarget}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 mb-1">
              99.2%
            </div>
            <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <span>{t.statTargetSub}</span>
            </div>
          </div>
        </div>

        {/* 3. L1–L7 STRUCTURED DATA PIPELINE */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 pb-3 border-b border-slate-300">
            <div>
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
                CIVIL ENGINEERING WORKFLOW PIPELINE
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight">
                {t.pipelineTitle}
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">{t.pipelineSub}</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
              <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                PWD Standard Formats
              </span>
              <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                MoRTH Specification
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {lifecycles.map((item) => {
              const localizedTitle = item.title[activeLocale] || item.title.en;
              const localizedDesc = item.desc[activeLocale] || item.desc.en;
              return (
                <Link
                  key={item.code}
                  href={item.href}
                  onClick={() => triggerHaptic("light")}
                  className="group bg-white p-4 rounded-lg border border-slate-300 hover:border-slate-500 transition-all shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-300">
                          {item.code}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {item.systemLevel}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-slate-600 bg-slate-50 px-1.5 py-0.2 rounded border border-slate-200">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-xs mb-1 group-hover:text-sky-800 transition-colors">
                      {localizedTitle}
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{localizedDesc}</p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-slate-900">
                    <span className="font-medium text-[11px]">
                      {activeLocale === "hi" ? "कंसोल खोलें" : activeLocale === "mr" ? "दालन उघडा" : "Open Console"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 4. STRATEGIC RIVER BASINS SPOTLIGHT */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 pb-3 border-b border-slate-300">
            <div>
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
                REGIONAL BASIN SURVEILLANCE
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight">
                {t.basinTitle}
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">{t.basinSub}</p>
            </div>
            <Link
              href="/bridges"
              onClick={() => triggerHaptic("light")}
              className="text-xs text-slate-800 hover:text-black font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto bg-white px-3 py-1.5 rounded border border-slate-300 shadow-xs"
            >
              <span>
                {activeLocale === "hi"
                  ? "GIS मानचित्र पर देखें"
                  : activeLocale === "mr"
                  ? "GIS नकाशावर पहा"
                  : "View in GIS Registry"}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {BASIN_METRICS.map((basin) => (
              <div
                key={basin.id}
                onClick={() => {
                  setSelectedBasin(basin.id);
                  triggerHaptic("selection");
                }}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedBasin === basin.id
                    ? "bg-white border-slate-600 shadow-sm ring-1 ring-slate-600"
                    : "bg-white border-slate-300 hover:border-slate-400 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-semibold text-slate-500">
                    {formatNumber(basin.bridges, activeLocale, useDevanagariDigits)} ASSETS
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${basin.statusBg}`}>
                    {basin.status}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-xs mb-0.5">{basin.name}</h4>
                <div className="text-[11px] text-slate-500 mb-2">{basin.nameLocal}</div>

                <div className="space-y-1 text-[11px] font-mono border-t border-slate-100 pt-2 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px]">STAGE:</span>
                    <span className="font-semibold text-slate-800">{basin.waterLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px]">DRI:</span>
                    <span className="font-semibold text-slate-800">{basin.statusText}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate pt-0.5">{basin.flow}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. OPERATIONAL CONTROL ROOM MODULES */}
        <div>
          <div className="mb-4">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
              ENGINEER CONTROL CONSOLES
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0f172a] tracking-tight">
              {t.quickAccessTitle}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">{t.quickAccessSub}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              href="/bridges"
              onClick={() => triggerHaptic("light")}
              className="p-3.5 bg-white border border-slate-300 rounded-lg flex items-center justify-between group hover:border-slate-500 transition-all shadow-xs"
            >
              <div>
                <span className="font-bold text-xs text-slate-900 block group-hover:text-sky-800">
                  01 Asset Registry & GIS
                </span>
                <span className="text-[11px] text-slate-500 font-mono">60 Registered Bridges</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/telemetry"
              onClick={() => triggerHaptic("light")}
              className="p-3.5 bg-white border border-slate-300 rounded-lg flex items-center justify-between group hover:border-slate-500 transition-all shadow-xs"
            >
              <div>
                <span className="font-bold text-xs text-slate-900 block group-hover:text-sky-800">
                  03 Live Telemetry Grid
                </span>
                <span className="text-[11px] text-slate-500 font-mono">240 Sensor Channels</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/risk"
              onClick={() => triggerHaptic("light")}
              className="p-3.5 bg-white border border-slate-300 rounded-lg flex items-center justify-between group hover:border-slate-500 transition-all shadow-xs"
            >
              <div>
                <span className="font-bold text-xs text-slate-900 block group-hover:text-sky-800">
                  05 SVI Risk & RUL Engine
                </span>
                <span className="text-[11px] text-slate-500 font-mono">11 Prescriptive Rules</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/triage"
              onClick={() => triggerHaptic("light")}
              className="p-3.5 bg-white border border-slate-300 rounded-lg flex items-center justify-between group hover:border-slate-500 transition-all shadow-xs"
            >
              <div>
                <span className="font-bold text-xs text-slate-900 block group-hover:text-rose-800">
                  06 Incident Triage Console
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Emergency Directives</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

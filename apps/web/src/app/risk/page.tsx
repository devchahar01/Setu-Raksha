"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Shield,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Clock,
  BookOpen,
  ArrowRight,
  Cpu,
} from "lucide-react";
import { RiskTierBadge } from "@/components/RiskTierBadge";
import { useAppStore } from "@/lib/store";
import { TRANSLATIONS } from "@/lib/translations";
import { triggerHaptic } from "@/lib/haptics";

export default function RiskEnginePage() {
  const { activeLocale, setActiveLocale } = useAppStore();
  const t = TRANSLATIONS[activeLocale];

  // Interactive SVI & DRI Calculator Sliders
  const [deckCondition, setDeckCondition] = useState<number>(7.0); // 0-9
  const [scourRatio, setScourRatio] = useState<number>(0.35); // 0-1.5
  const [pierTilt, setPierTilt] = useState<number>(0.2); // deg
  const [trafficVolume, setTrafficVolume] = useState<number>(15000); // vpd
  const [bridgeAge, setBridgeAge] = useState<number>(25); // years
  const [isCoastal, setIsCoastal] = useState<boolean>(false);

  // Calculate live SVI & DRI
  const g_s = (9 - deckCondition) / 9;
  const g_h = Math.min(1.0, scourRatio);
  const g_e = Math.min(1.0, pierTilt / 1.5);
  const g_l = Math.min(1.0, trafficVolume / 50000);
  const g_a = Math.min(1.0, bridgeAge / 100);

  const rawSVI = 100 * (0.25 * g_s + 0.25 * g_h + 0.15 * g_e + 0.10 * g_l + 0.25 * g_a);

  // Critical Flag Invariant Check
  const criticalFlags: string[] = [];
  if (scourRatio >= 1.0) criticalFlags.push("SCOUR_CRITICAL_EXCEEDED");
  if (pierTilt >= 1.0) criticalFlags.push("PIER_TILT_CRITICAL");

  let svi = rawSVI;
  if (criticalFlags.length >= 2 || pierTilt >= 1.0) {
    svi = Math.max(75.0, rawSVI);
  } else if (criticalFlags.length >= 1) {
    svi = Math.max(55.0, rawSVI);
  }

  const dri = Math.min(100.0, svi * 1.05); // slight hazard multiplier

  const tier = dri >= 75 ? "CRITICAL" : dri >= 55 ? "WARNING" : dri >= 30 ? "WATCH" : "GOOD";
  const rulYears = isCoastal
    ? Math.max(0, +(22.0 - dri * 0.24).toFixed(1))
    : Math.max(0, +(35.0 - dri * 0.35).toFixed(1));

  // 11 Prescriptive Rules mapped trilingually
  const catalogue = [
    {
      id: "RIPRAP-01",
      priority: "URGENT",
      category: "HYDRAULIC",
      title: {
        en: "Riprap and Scour Apron Restoration",
        hi: "रिपरैप और कटाव सुरक्षा एप्रन का पुनर्स्थापन",
        mr: "रिपरॅप आणि गाद संरक्षण अ‍ॅप्रनची पुनर्स्थापना",
      },
      desc: {
        en: "Place or restore riprap or apron around piers; re-survey bed after next flood.",
        hi: "खंभों के चारों ओर बोल्डर पिचिंग/रिपरैप बिछाएं; अगली बाढ़ के बाद नदी तल का पुनः सर्वेक्षण करें।",
        mr: "खांबांभोवती बोल्डर पिचिंग/रिपरॅप लावा; पुढच्या पुरानंतर नदी पात्राचे पुनर्सर्वेक्षण करा.",
      },
    },
    {
      id: "SCOUR-UW-01",
      priority: "URGENT",
      category: "HYDRAULIC",
      title: {
        en: "Underwater Scour Diving Inspection",
        hi: "पानी के नीचे कटाव की गोताखोरी जांच",
        mr: "पाण्याखालील गाद आणि पायाची पाणबुडी तपासणी",
      },
      desc: {
        en: "Schedule underwater inspection before next monsoon to assess well foundation depth.",
        hi: "कुआं नींव की गहराई का आकलन करने के लिए अगले मानसून से पहले पानी के नीचे जांच निर्धारित करें।",
        mr: "विहीर पायाच्या खोलीचे मूल्यांकन करण्यासाठी पुढील पावसाळ्यापूर्वी पाण्याखालील तपासणी निश्चित करा.",
      },
    },
    {
      id: "DEBRIS-01",
      priority: "IMMEDIATE",
      category: "HYDRAULIC",
      title: {
        en: "Debris and Trash Rack Clearance",
        hi: "मलबे और कचरा रैक की तत्काल सफाई",
        mr: "कचरा आणि राडारोडा तातडीने काढणे",
      },
      desc: {
        en: "Clear debris and trash racks from piers; assign continuous watch during high flow.",
        hi: "खंभों से मलबा और पेड़ की शाखाएं हटाएं; उच्च जलप्रवाह के दौरान निरंतर निगरानी तैनात करें।",
        mr: "खांबांवरील लाकूड आणि कचरा साफ करा; पाण्याच्या वाढत्या प्रवाहात सतत पाळत ठेवा.",
      },
    },
    {
      id: "BEARING-01",
      priority: "URGENT",
      category: "STRUCTURAL",
      title: {
        en: "Bearing Rehabilitation and Traffic Weight Limit",
        hi: "बेयरिंग पुनर्वास और भारी वाहन सीमा",
        mr: "बेअरिंग दुरुस्ती आणि अवजड वाहतूक मर्यादा",
      },
      desc: {
        en: "Inspect and replace displaced elastomeric bearings; restrict heavy vehicles meanwhile.",
        hi: "विस्थापित इलास्टोमेरिक बेयरिंग की जांच और बदलाव करें; अंतरिम अवधि में भारी वाहनों को रोकें।",
        mr: "हलवलेल्या इलॅस्टोमेरिक बेअरिंगची तपासणी आणि पुनर्बदल करा; तोपर्यंत अवजड वाहनांवर बंदी घाला.",
      },
    },
    {
      id: "SEAT-01",
      priority: "PLANNED",
      category: "SEISMIC",
      title: {
        en: "Seat Width Extension and Seismic Restrainers",
        hi: "सीट की चौड़ाई का विस्तार और भूकंपीय लॉक",
        mr: "सीट रुंदी वाढवणे आणि भूकंपीय लॉक बसवणे",
      },
      desc: {
        en: "Increase seat width or install unseating restrainers and shear keys in high seismic zones.",
        hi: "उच्च भूकंपीय क्षेत्रों में सीट की चौड़ाई बढ़ाएं या अनसीटिंग रिस्ट्रेनर्स और शीयर कीज़ लगाएं।",
        mr: "उच्च भूकंप प्रवण भागात सीटची रुंदी वाढवा किंवा अनसीटिंग प्रतिबंधक आणि शिअर की बसवा.",
      },
    },
    {
      id: "JACKET-01",
      priority: "URGENT",
      category: "STRUCTURAL",
      title: {
        en: "Column Concrete Jacketing & Retrofit",
        hi: "कॉलम कंक्रीट जैकेटिंग और रेट्रोफिट",
        mr: "खांब काँक्रीट जॅकेटिंग आणि मजबुतीकरण",
      },
      desc: {
        en: "Detailed structural assessment and pier column reinforced concrete/FRP jacketing.",
        hi: "खंभों का विस्तृत संरचनात्मक आकलन और प्रबलित कंक्रीट या एफआरपी जैकेटिंग कराएं।",
        mr: "सविस्तर संरचनात्मक मूल्यांकन करून खांबांचे आरसीसी किंवा एफआरपी जॅकेटिंग करा.",
      },
    },
    {
      id: "CRACK-01",
      priority: "PLANNED",
      category: "STRUCTURAL",
      title: {
        en: "Epoxy Crack Injection and Monitoring",
        hi: "इपॉक्सी दरार इंजेक्शन और निगरानी",
        mr: "इपॉक्सी क्रॅक इंजेक्शन आणि देखरेख",
      },
      desc: {
        en: "Seal cracks > 1.5mm with pressure epoxy injection; re-inspect within 90 days.",
        hi: "प्रेशर इपॉक्सी इंजेक्शन से 1.5 मिमी से बड़ी दरारें भरें; 90 दिनों में पुनः जांच करें।",
        mr: "दाबाने इपॉक्सी इंजेक्शन देऊन १.५ मिमी पेक्षा मोठ्या भेगा बुजवा; ९० दिवसांत पुन्हा तपासणी करा.",
      },
    },
    {
      id: "CORR-01",
      priority: "PLANNED",
      category: "DURABILITY",
      title: {
        en: "Chloride Extraction and Anti-Corrosion Coating",
        hi: "क्लोराइड निष्कर्षण और जंग रोधी कोटिंग",
        mr: "क्लोराईड निष्कासन आणि गंज प्रतिबंधक लेप",
      },
      desc: {
        en: "Apply protective silane coating or sacrificial zinc anodes; repair spalled concrete cover.",
        hi: "सुरक्षात्मक सिलेन कोटिंग या सैक्रिफिशियल जिंक एनोड लगाएं; क्षतिग्रस्त कंक्रीट कवर की मरम्मत करें।",
        mr: "संरक्षक सिलेन कोटिंग किंवा झिंक अ‍ॅनोड्स लावा; उखडलेल्या काँक्रीट कव्हरची दुरुस्ती करा.",
      },
    },
    {
      id: "LOAD-01",
      priority: "URGENT",
      category: "TRAFFIC",
      title: {
        en: "Axle Weigh-In-Motion and Load Capacity Rating",
        hi: "वे-इन-मोशन एक्सल वजन और भार क्षमता पुनर्निर्धारण",
        mr: "एक्सल वजन मापन यंत्रणा आणि भार क्षमता पुनर्मूल्यांकन",
      },
      desc: {
        en: "Enforce strict gross vehicle weight limits; commission updated IRC 6 load rating review.",
        hi: "सख्त वाहन भार सीमा लागू करें; अद्यतन आईआरसी 6 भार रेटिंग समीक्षा का आदेश दें।",
        mr: "कडक वाहन वजन मर्यादा लागू करा; अद्ययावत आयआरसी ६ लोड रेटिंग पुनरावलोकन करा.",
      },
    },
    {
      id: "RESTRICT-01",
      priority: "IMMEDIATE",
      category: "OPERATIONAL",
      title: {
        en: "Heavy Vehicle Restriction and Route Diversion Alert",
        hi: "भारी वाहन प्रतिबंध और मार्ग परिवर्तन चेतावनी",
        mr: "अवजड वाहतूक निर्बंध आणि मार्ग वळवण्याची सूचना",
      },
      desc: {
        en: "Restrict multi-axle commercial traffic and prepare alternate bypass route diversions.",
        hi: "बहु-धुरीय भारी वाहनों का प्रवेश रोकें और वैकल्पिक बाईपास मार्ग डायवर्जन तैयार करें।",
        mr: "मल्टी-एक्सल व्यावसायिक वाहतूक थांबवा आणि पर्यायी बाह्यवळण मार्ग तयार ठेवा.",
      },
    },
    {
      id: "CLOSE-01",
      priority: "IMMEDIATE",
      category: "EMERGENCY",
      title: {
        en: "Emergency Bridge Closure and Traffic Evacuation",
        hi: "आपातकालीन पुल बंदी और यातायात निकासी",
        mr: "तातडीने पूल बंद करणे आणि वाहतूक वळवणे",
      },
      desc: {
        en: "Immediately close bridge to all traffic, sound sirens, inform district control room.",
        hi: "पुल को सभी यातायात के लिए तुरंत बंद करें, सायरन बजाएं, जिला नियंत्रण कक्ष को सूचित करें।",
        mr: "पूल तात्काळ सर्व वाहतुकीसाठी बंद करा, सायरन वाजवा, आपत्ती व्यवस्थापन कक्षाला कळवा.",
      },
    },
  ];

  // Segmented Setu Score Component Scores (0-100 where 100 is best)
  const structuralScore = Math.max(10, Math.min(100, Math.round(100 - g_s * 100)));
  const hydraulicScore = Math.max(10, Math.min(100, Math.round(100 - g_h * 100)));
  const seismicScore = Math.max(10, Math.min(100, Math.round(100 - g_e * 100)));
  const trafficScore = Math.max(10, Math.min(100, Math.round(100 - g_l * 100)));
  const environmentalScore = Math.max(10, Math.min(100, Math.round(100 - g_a * 100)));
  const setuScoreOverall = Math.max(15, Math.min(100, Math.round(100 - (dri * 0.85))));

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-900 pb-16">
      {/* Top Institutional Header */}
      <section className="bg-white border-b border-slate-300 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-slate-600 mb-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              <span>GOVERNMENT OF MAHARASHTRA • PUBLIC WORKS DEPARTMENT</span>
              <span className="text-slate-400">•</span>
              <span className="text-teal-700">IRC:SP:35 RISK & REMEDIATION (L6)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.risk.title}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {t.risk.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200 self-start md:self-auto">
            <Shield className="w-4 h-4 text-teal-700 shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-slate-900">{t.risk.safetyInvariant}</div>
              <div className="text-slate-500 text-[11px]">{t.risk.mlInvariantDesc}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Live Mathematical Formula & Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Sliders Input Panel (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-lg border border-slate-300">
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-200">
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-700" /> {t.risk.calculatorTitle}
              </h2>
              <span className="text-[11px] font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {t.risk.calculatorSub}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Deck Condition */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-700">{t.risk.deckCondition}:</span>
                  <span className="font-mono font-bold text-slate-900 text-xs">{deckCondition.toFixed(1)} / 9</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="9"
                  step="0.5"
                  value={deckCondition}
                  onChange={(e) => {
                    setDeckCondition(parseFloat(e.target.value));
                    triggerHaptic("selection");
                  }}
                  className="w-full accent-slate-800 cursor-pointer h-1.5 bg-slate-200 rounded"
                />
              </div>

              {/* Scour Ratio */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-700">{t.risk.scourRatio}:</span>
                  <span
                    className={`font-mono font-bold text-xs ${
                      scourRatio >= 1.0 ? "text-rose-700" : "text-slate-900"
                    }`}
                  >
                    {scourRatio.toFixed(2)}x {scourRatio >= 1.0 && `(${t.risk.criticalTrigger})`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.05"
                  value={scourRatio}
                  onChange={(e) => {
                    setScourRatio(parseFloat(e.target.value));
                    triggerHaptic("selection");
                  }}
                  className="w-full accent-slate-800 cursor-pointer h-1.5 bg-slate-200 rounded"
                />
              </div>

              {/* Pier Tilt */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-700">{t.risk.pierTilt}:</span>
                  <span
                    className={`font-mono font-bold text-xs ${
                      pierTilt >= 1.0 ? "text-rose-700" : "text-slate-900"
                    }`}
                  >
                    {pierTilt.toFixed(2)}° {pierTilt >= 1.0 && `(${t.risk.criticalOverride})`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2.5"
                  step="0.05"
                  value={pierTilt}
                  onChange={(e) => {
                    setPierTilt(parseFloat(e.target.value));
                    triggerHaptic("selection");
                  }}
                  className="w-full accent-slate-800 cursor-pointer h-1.5 bg-slate-200 rounded"
                />
              </div>

              {/* Bridge Age & Coastal Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700">{t.risk.bridgeAge}:</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">{bridgeAge} yrs</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={bridgeAge}
                    onChange={(e) => {
                      setBridgeAge(parseInt(e.target.value, 10));
                      triggerHaptic("selection");
                    }}
                    className="w-full accent-slate-800 cursor-pointer h-1.5 bg-slate-200 rounded"
                  />
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded bg-slate-50 border border-slate-200">
                  <input
                    type="checkbox"
                    id="coastalCheck"
                    checked={isCoastal}
                    onChange={(e) => {
                      setIsCoastal(e.target.checked);
                      triggerHaptic("light");
                    }}
                    className="w-4 h-4 text-teal-700 rounded cursor-pointer accent-teal-700"
                  />
                  <label htmlFor="coastalCheck" className="font-semibold text-slate-700 cursor-pointer text-xs">
                    {t.risk.coastalRegime}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Segmented Engineering Risk Indicator (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-lg border border-slate-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider">
                    OPERATIONAL RISK INDEX
                  </span>
                  <div className="text-sm font-extrabold text-slate-900">SETU SCORE & SVI METRICS</div>
                </div>
                <RiskTierBadge tier={tier} size="sm" />
              </div>

              {/* Main Overall Setu Score Indicator */}
              <div className="bg-slate-50 p-3.5 rounded border border-slate-200 mb-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-700">SETU SCORE</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold font-mono text-slate-900">{setuScoreOverall}</span>
                    <span className="text-xs text-slate-400 font-mono">/ 100</span>
                    <span className={`text-xs font-mono font-bold ml-2 ${
                      setuScoreOverall >= 75 ? "text-teal-700" : setuScoreOverall >= 55 ? "text-amber-700" : "text-rose-700"
                    }`}>
                      {setuScoreOverall >= 75 ? "NORMAL" : setuScoreOverall >= 55 ? "WATCH" : setuScoreOverall >= 35 ? "WARNING" : "CRITICAL"}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-mono">
                  SVI: {svi.toFixed(1)} • Dynamic DRI: {dri.toFixed(1)} • RUL: {rulYears} yrs
                </div>
              </div>

              {/* Segmented Component Bars */}
              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 font-medium">Structural Condition</span>
                    <span className="font-mono font-bold text-slate-900">{structuralScore} / 100</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded overflow-hidden border border-slate-200">
                    <div
                      className={`h-full transition-all duration-500 ${
                        structuralScore >= 75 ? "bg-teal-700" : structuralScore >= 55 ? "bg-amber-600" : "bg-rose-600"
                      }`}
                      style={{ width: `${structuralScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 font-medium">Hydraulic / Scour Safety</span>
                    <span className="font-mono font-bold text-slate-900">{hydraulicScore} / 100</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded overflow-hidden border border-slate-200">
                    <div
                      className={`h-full transition-all duration-500 ${
                        hydraulicScore >= 75 ? "bg-teal-700" : hydraulicScore >= 55 ? "bg-amber-600" : "bg-rose-600"
                      }`}
                      style={{ width: `${hydraulicScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 font-medium">Seismic & Substructure Tilt</span>
                    <span className="font-mono font-bold text-slate-900">{seismicScore} / 100</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded overflow-hidden border border-slate-200">
                    <div
                      className={`h-full transition-all duration-500 ${
                        seismicScore >= 75 ? "bg-teal-700" : seismicScore >= 55 ? "bg-amber-600" : "bg-rose-600"
                      }`}
                      style={{ width: `${seismicScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 font-medium">Traffic Axle Loading</span>
                    <span className="font-mono font-bold text-slate-900">{trafficScore} / 100</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded overflow-hidden border border-slate-200">
                    <div
                      className={`h-full transition-all duration-500 ${
                        trafficScore >= 75 ? "bg-teal-700" : trafficScore >= 55 ? "bg-amber-600" : "bg-rose-600"
                      }`}
                      style={{ width: `${trafficScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 font-medium">Environmental & Asset Age</span>
                    <span className="font-mono font-bold text-slate-900">{environmentalScore} / 100</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded overflow-hidden border border-slate-200">
                    <div
                      className={`h-full transition-all duration-500 ${
                        environmentalScore >= 75 ? "bg-teal-700" : environmentalScore >= 55 ? "bg-amber-600" : "bg-rose-600"
                      }`}
                      style={{ width: `${environmentalScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {criticalFlags.length > 0 && (
                <div className="mt-3.5 p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-900">
                  <div className="font-bold flex items-center gap-1 mb-1 text-rose-700 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Safety Invariant Overrides Active:
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 font-mono text-[10px]">
                    {criticalFlags.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-3 p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600">
              {t.risk.advisoryNote}
            </div>
          </div>
        </div>

        {/* Prescriptive Remediation Catalogue Section */}
        <div className="bg-white p-5 rounded-lg border border-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-700" />
                <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                  {t.risk.remediationTitle}
                </h2>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{t.risk.remediationSub}</p>
            </div>

            {/* Language Switcher for Catalogue */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200 self-start sm:self-auto">
              {(["en", "hi", "mr"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setActiveLocale(lang);
                    triggerHaptic("selection");
                  }}
                  className={`px-2.5 py-1 text-xs rounded font-semibold transition-colors ${
                    activeLocale === lang
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {lang === "en" ? "English" : lang === "hi" ? "हिन्दी" : "मराठी"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {catalogue.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-slate-50 hover:bg-slate-100/90 rounded border border-slate-200 transition-colors flex flex-col justify-between text-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[11px] font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {item.id}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        item.priority === "IMMEDIATE"
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : item.priority === "URGENT"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-teal-50 text-teal-700 border border-teal-200"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1">{item.title[activeLocale]}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc[activeLocale]}</p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>Category: {item.category}</span>
                  <span className="text-teal-700 font-semibold">IRC:SP:35 Certified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

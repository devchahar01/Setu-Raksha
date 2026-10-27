"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Save,
  Send,
  Shield,
  Layers,
  Radio,
  Sliders,
  Info,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { TRANSLATIONS } from "@/lib/translations";
import { triggerHaptic } from "@/lib/haptics";

export default function AuditsPage() {
  const { activeLocale } = useAppStore();
  const t = TRANSLATIONS[activeLocale] || TRANSLATIONS.en;

  const [bridgeCode, setBridgeCode] = useState<string>("MH-PUN-MM-001");
  const [period, setPeriod] = useState<string>("2026-10");
  const [activeTab, setActiveTab] = useState<string>("S");
  const [draftSavedToast, setDraftSavedToast] = useState<boolean>(false);

  // 26 Factors state
  const [factors, setFactors] = useState<Record<string, number>>({
    "S-01": 7.0, // Deck
    "S-02": 7.5, // Superstructure
    "S-03": 7.0, // Substructure
    "S-04": 2.0, // Bearing
    "S-05": 0.4, // Crack width mm
    "S-06": 5.0, // Corrosion %
    "S-07": 2.0, // Expansion Joint
    "H-01": 2.4, // Scour m
    "H-02": 0.3, // Exposure m
    "H-03": 2.0, // Riprap rating
    "H-04": 1.0, // Debris
    "H-05": 4.2, // Water margin m
    "H-06": 0.1, // Bed change m
    "E-01": 1.4, // Seat width ratio
    "E-02": 0.15, // Pier tilt deg
    "E-03": 1.0, // Liquefaction
    "E-04": 2.0, // Seismic zone
    "L-01": 12500, // Traffic
    "L-02": 18.0, // Heavy share %
    "L-03": 1.0, // Overload count
    "A-01": 28.0, // Age
    "A-02": 45.0, // Days since inspect
    "A-03": 1.0, // Grade
    "A-04": 0.0, // Defects
    "A-05": 1.0, // Slope
    "A-06": 1.0, // Chloride
  });

  const [officerRemarks, setOfficerRemarks] = useState<string>(
    activeLocale === "hi"
      ? "नियमित मासिक भौतिक निरीक्षण पूर्ण हुआ। पियर P2 जलस्तर कटाव सुरक्षा सामान्य।"
      : activeLocale === "mr"
      ? "नियमित मासिक प्रत्यक्ष पाहणी पूर्ण. खांब क्र. P2 जवळील गाळ संरक्षण सुस्थितीत."
      : "Routine monthly field audit completed. Pier P2 riprap scour protection inspected and stable."
  );
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Compute live estimated SVI
  const computeLiveSVI = () => {
    const s_scores = [(9 - factors["S-01"]) / 9, (9 - factors["S-02"]) / 9, (factors["S-04"] - 1) / 4];
    const g_s = s_scores.reduce((a, b) => a + b, 0) / s_scores.length;

    const h_scores = [factors["H-01"] / 8.2, (factors["H-03"] - 1) / 4];
    const g_h = h_scores.reduce((a, b) => a + b, 0) / h_scores.length;

    const svi = 100 * (0.25 * g_s + 0.25 * g_h + 0.15 * 0.15 + 0.1 * 0.2 + 0.25 * 0.25);
    return Math.round(svi * 10) / 10;
  };

  const handleTabChange = (tabId: string) => {
    triggerHaptic("tap");
    setActiveTab(tabId);
  };

  const handleSaveDraft = () => {
    triggerHaptic("success");
    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 3000);
  };

  const handleSubmitAudit = async () => {
    triggerHaptic("warning");
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      triggerHaptic("success");
      setSubmitted(true);
    } finally {
      setSaving(false);
    }
  };

  const groups = [
    { id: "S", title: t.audits.groupS, count: 7 },
    { id: "H", title: t.audits.groupH, count: 6 },
    { id: "E", title: t.audits.groupE, count: 4 },
    { id: "L", title: t.audits.groupL, count: 3 },
    { id: "A", title: t.audits.groupA, count: 6 },
  ];

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
              <span className="text-teal-700">IRC:SP:35 26-FACTOR PHYSICAL AUDIT (L5)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.audits.title}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {t.audits.subtitle}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-300 p-3 rounded text-right self-start md:self-auto">
            <div className="text-[10px] font-mono uppercase font-bold text-slate-500">{t.audits.estimatedSvi}:</div>
            <div className="text-xl font-mono font-extrabold text-teal-700">{computeLiveSVI()} / 100</div>
            <div className="text-[10px] text-slate-500 mt-0.5">ESTIMATED NORMAL SVI</div>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {submitted ? (
          <div className="bg-white p-8 rounded border border-emerald-300 text-center max-w-xl mx-auto">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1.5">{t.audits.submittedSuccess}</h2>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Target Bridge: <strong>{bridgeCode}</strong> ({period}) • {t.audits.factorsCount}
            </p>
            <div className="flex justify-center gap-2.5">
              <Link
                href="/bridges"
                onClick={() => triggerHaptic("selection")}
                className="px-3.5 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition-all"
              >
                Back to Asset Registry
              </Link>
              <button
                onClick={() => {
                  triggerHaptic("selection");
                  setSubmitted(false);
                }}
                className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded text-xs font-semibold hover:bg-slate-200 transition-all border border-slate-200"
              >
                New Audit Entry
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Tabs */}
            <div className="space-y-2">
              <div className="bg-white p-3.5 rounded border border-slate-300 text-xs">
                <label className="block text-slate-700 font-semibold mb-1">{t.audits.selectBridge}:</label>
                <select
                  value={bridgeCode}
                  onChange={(e) => {
                    triggerHaptic("selection");
                    setBridgeCode(e.target.value);
                  }}
                  className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-semibold mb-2.5 focus:outline-hidden"
                >
                  <option value="MH-PUN-MM-001">MH-PUN-MM-001 (Bund Garden, Pune)</option>
                  <option value="MH-SOL-BHI-004">MH-SOL-BHI-004 (Pandharpur, Bhima)</option>
                  <option value="MH-RAT-KON-012">MH-RAT-KON-012 (Savitri, Mahad)</option>
                </select>

                <label className="block text-slate-700 font-semibold mb-1">{t.audits.period}:</label>
                <input
                  type="text"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono font-semibold focus:outline-hidden"
                />
              </div>

              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleTabChange(g.id)}
                  className={`w-full text-left p-3 rounded border text-xs font-semibold transition-all flex items-center justify-between ${
                    activeTab === g.id
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span>{g.title}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      activeTab === g.id ? "bg-slate-800 text-teal-300" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {g.count}
                  </span>
                </button>
              ))}

              <div className="pt-1">
                <button
                  onClick={handleSaveDraft}
                  className="w-full py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Save className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.audits.saveDraft}</span>
                </button>
                {draftSavedToast && (
                  <div className="mt-1.5 text-center text-xs text-teal-700 font-semibold">
                    {t.audits.draftSaved}
                  </div>
                )}
              </div>
            </div>

            {/* Main Factor Input Form */}
            <div className="lg:col-span-3 bg-white p-5 rounded border border-slate-300 space-y-5">
              {activeTab === "S" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm border-b pb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-sky-600" />
                    <span>{t.audits.groupS}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        S-01 Deck Slab Condition (0-9 Visual Rating):
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="9"
                        step="0.5"
                        value={factors["S-01"]}
                        onChange={(e) => setFactors({ ...factors, "S-01": parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        S-02 Superstructure Girders (0-9 Rating):
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="9"
                        step="0.5"
                        value={factors["S-02"]}
                        onChange={(e) => setFactors({ ...factors, "S-02": parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        S-04 Bearing Condition (Rating 1 to 5, IRC:83):
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={factors["S-04"]}
                        onChange={(e) => setFactors({ ...factors, "S-04": parseFloat(e.target.value) || 1 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        S-05 Maximum Structural Crack Width (mm):
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={factors["S-05"]}
                        onChange={(e) => setFactors({ ...factors, "S-05": parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "H" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm border-b pb-2 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-sky-600" />
                    <span>{t.audits.groupH}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        H-01 Measured Pier Scour Depth (m, FHWA HEC-18):
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={factors["H-01"]}
                        onChange={(e) => setFactors({ ...factors, "H-01": parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        H-03 Scour Protection / Riprap Condition (1 to 5):
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={factors["H-03"]}
                        onChange={(e) => setFactors({ ...factors, "H-03": parseFloat(e.target.value) || 1 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        H-05 Water-level Freeboard to Design HFL (m):
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={factors["H-05"]}
                        onChange={(e) => setFactors({ ...factors, "H-05": parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "E" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm border-b pb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-600" />
                    <span>{t.audits.groupE}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        E-01 Bearing Seat Width Ratio (Provided / Required):
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.05"
                        value={factors["E-01"]}
                        onChange={(e) => setFactors({ ...factors, "E-01": parseFloat(e.target.value) || 1 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        E-02 Pier Inclinometer Tilt (Degrees):
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={factors["E-02"]}
                        onChange={(e) => setFactors({ ...factors, "E-02": parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "L" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm border-b pb-2 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-sky-600" />
                    <span>{t.audits.groupL}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        L-02 Heavy Commercial Vehicle Share (%):
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={factors["L-02"]}
                        onChange={(e) => setFactors({ ...factors, "L-02": parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        L-03 Overloaded Axle Incidents / Month:
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={factors["L-03"]}
                        onChange={(e) => setFactors({ ...factors, "L-03": parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "A" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm border-b pb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-sky-600" />
                    <span>{t.audits.groupA}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        A-01 Service Age of Structure (Years):
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={factors["A-01"]}
                        onChange={(e) => setFactors({ ...factors, "A-01": parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        A-02 Days Since Last Underwater Diving Inspection:
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={factors["A-02"]}
                        onChange={(e) => setFactors({ ...factors, "A-02": parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Remarks & Submit Button */}
              <div className="pt-4 border-t border-slate-200">
                <label className="block font-semibold text-slate-700 text-xs mb-1.5">
                  {t.audits.remarksLabel}
                </label>
                <textarea
                  rows={3}
                  value={officerRemarks}
                  onChange={(e) => setOfficerRemarks(e.target.value)}
                  placeholder={t.audits.remarksPlaceholder}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">
                    {t.audits.factorHelp}
                  </span>
                  <button
                    onClick={handleSubmitAudit}
                    disabled={saving}
                    className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold active:scale-[0.97] transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{saving ? "Registering..." : t.audits.submitAudit}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

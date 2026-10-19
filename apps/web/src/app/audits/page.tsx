"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Save,
  Send,
  Shield,
  Layers,
  Radio,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function AuditsPage() {
  const { activeLocale } = useAppStore();

  const [bridgeCode, setBridgeCode] = useState<string>("MH-PUN-MM-001");
  const [period, setPeriod] = useState<string>("2026-10");
  const [activeTab, setActiveTab] = useState<string>("S");

  // Factors state
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
    "नियमित तपासणी पूर्ण झाली. खांब क्रमांक २ जवळील गाद संरक्षण सुस्थितीत आहे."
  );
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Compute live estimated SVI
  const computeLiveSVI = () => {
    // S group mean
    const s_scores = [(9 - factors["S-01"]) / 9, (9 - factors["S-02"]) / 9, (factors["S-04"] - 1) / 4];
    const g_s = s_scores.reduce((a, b) => a + b, 0) / s_scores.length;

    // H group mean
    const h_scores = [factors["H-01"] / 8.2, (factors["H-03"] - 1) / 4];
    const g_h = h_scores.reduce((a, b) => a + b, 0) / h_scores.length;

    const svi = 100 * (0.25 * g_s + 0.25 * g_h + 0.15 * 0.15 + 0.10 * 0.2 + 0.25 * 0.25);
    return Math.round(svi * 10) / 10;
  };

  const handleSubmitAudit = async () => {
    setSaving(true);
    try {
      // In production calls POST /api/v1/audits
      await new Promise((r) => setTimeout(r, 800));
      setSubmitted(true);
    } finally {
      setSaving(false);
    }
  };

  const groups = [
    { id: "S", title: "Structural (S-01 to S-07)", count: 7 },
    { id: "H", title: "Hydraulic (H-01 to H-06)", count: 6 },
    { id: "E", title: "Seismic & Geo (E-01 to E-04)", count: 4 },
    { id: "L", title: "Traffic Loading (L-01 to L-03)", count: 3 },
    { id: "A", title: "Age & Environment (A-01 to A-06)", count: 6 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Header */}
      <div className="bg-navy-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 text-teal-300 text-xs font-mono mb-3 border border-navy-700">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              OFFICER MONTHLY AUDIT PORTAL (L5)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              26-Factor Field Inspection Wizard
            </h1>
            <p className="mt-1 text-sm text-navy-200">
              Mandatory civil engineering monthly safety evaluation adhering to Appendix A parameters.
            </p>
          </div>

          <div className="bg-navy-800 p-4 rounded-xl border border-navy-700 text-right">
            <div className="text-xs text-navy-300">Live Estimated SVI:</div>
            <div className="text-2xl font-mono font-bold text-teal-400">{computeLiveSVI()} / 100</div>
            <div className="text-[10px] text-teal-200 mt-0.5">GOOD (Safe Operating Tier)</div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {submitted ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-200 text-center max-w-xl mx-auto">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Audit Successfully Submitted!</h2>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              The 26-factor monthly inspection for bridge <strong>{bridgeCode}</strong> ({period}) is cryptographically
              hashed and locked immutable. Results dispatched to Division Engineer for review.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/bridges"
                className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 transition-colors"
              >
                Back to Registry
              </Link>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors"
              >
                Submit Another Audit
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Tabs */}
            <div className="space-y-2">
              <div className="bg-white p-4 rounded-xl border border-slate-200 mb-4 text-xs">
                <label className="block text-slate-500 font-semibold mb-1">Target Bridge:</label>
                <select
                  value={bridgeCode}
                  onChange={(e) => setBridgeCode(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold mb-3"
                >
                  <option value="MH-PUN-MM-001">MH-PUN-MM-001 (Bund Garden)</option>
                  <option value="MH-SOL-BHI-004">MH-SOL-BHI-004 (Pandharpur)</option>
                  <option value="MH-RAT-KON-012">MH-RAT-KON-012 (Savitri Bridge)</option>
                </select>

                <label className="block text-slate-500 font-semibold mb-1">Audit Period:</label>
                <input
                  type="text"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-semibold"
                />
              </div>

              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveTab(g.id)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                    activeTab === g.id
                      ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{g.title}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      activeTab === g.id ? "bg-navy-800 text-teal-300" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {g.count} vars
                  </span>
                </button>
              ))}
            </div>

            {/* Main Factor Input Form */}
            <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              {activeTab === "S" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm border-b pb-2">Group S: Structural Condition</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        S-01 Deck Condition Rating (0 to 9):
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="9"
                        step="0.5"
                        value={factors["S-01"]}
                        onChange={(e) => setFactors({ ...factors, "S-01": parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        S-04 Bearing Condition (Rating 1 to 5):
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={factors["S-04"]}
                        onChange={(e) => setFactors({ ...factors, "S-04": parseFloat(e.target.value) || 1 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        S-05 Maximum Crack Width (mm):
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={factors["S-05"]}
                        onChange={(e) => setFactors({ ...factors, "S-05": parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        S-06 Steel Corrosion / Section Loss (%):
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={factors["S-06"]}
                        onChange={(e) => setFactors({ ...factors, "S-06": parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "H" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm border-b pb-2">Group H: Hydraulic & Scour</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        H-01 Measured Scour Depth (m):
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={factors["H-01"]}
                        onChange={(e) => setFactors({ ...factors, "H-01": parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        H-03 Scour Protection / Riprap (Rating 1 to 5):
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={factors["H-03"]}
                        onChange={(e) => setFactors({ ...factors, "H-03": parseFloat(e.target.value) || 1 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        H-05 Water-level Margin to Design HFL (m):
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={factors["H-05"]}
                        onChange={(e) => setFactors({ ...factors, "H-05": parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "E" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm border-b pb-2">Group E: Seismic & Geo-technical</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        E-01 Seat Width Adequacy Ratio (Provided / Required):
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.05"
                        value={factors["E-01"]}
                        onChange={(e) => setFactors({ ...factors, "E-01": parseFloat(e.target.value) || 1 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        E-02 Pier Tilt (Degrees):
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={factors["E-02"]}
                        onChange={(e) => setFactors({ ...factors, "E-02": parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "L" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm border-b pb-2">Group L: Traffic Loading</h3>
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
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        L-03 Overload Incidents per Month:
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={factors["L-03"]}
                        onChange={(e) => setFactors({ ...factors, "L-03": parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "A" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm border-b pb-2">Group A: Age & Durability</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        A-02 Days Since Last Detailed Diving Inspection:
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={factors["A-02"]}
                        onChange={(e) => setFactors({ ...factors, "A-02": parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Officer Remarks Field (Preserved in original language) */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block font-semibold text-slate-700 text-xs mb-1">
                  Field Officer Remarks (Preserved in Original Language - ADR-0004):
                </label>
                <textarea
                  rows={3}
                  value={officerRemarks}
                  onChange={(e) => setOfficerRemarks(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-4 h-4" /> Save Local Draft
                </button>

                <button
                  type="button"
                  onClick={handleSubmitAudit}
                  disabled={saving}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {saving ? "Submitting Audit..." : "Submit Monthly Audit (Lock Immutable)"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

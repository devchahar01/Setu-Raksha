"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Eye,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Search,
  ExternalLink,
  Info,
  Send,
  X,
  FileText,
  Shield,
  Activity,
  Check,
} from "lucide-react";
import { RiskTierBadge } from "@/components/RiskTierBadge";
import { useAppStore } from "@/lib/store";
import { TRANSLATIONS } from "@/lib/translations";
import { triggerHaptic } from "@/lib/haptics";

interface AuditLogEntry {
  timestamp: string;
  userOrSystem: string;
  action: string;
  asset: string;
  source: string;
  result: string;
}

export default function PublicTransparencyPage() {
  const { activeLocale, useDevanagariDigits } = useAppStore();
  const t = TRANSLATIONS[activeLocale];

  const [search, setSearch] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedBridgeCode, setSelectedBridgeCode] = useState<string>("");
  const [citizenName, setCitizenName] = useState<string>("");
  const [citizenPhone, setCitizenPhone] = useState<string>("");
  const [concernDesc, setConcernDesc] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Section 20 Government Audit Trail Entries
  const auditLogEntries: AuditLogEntry[] = [
    {
      timestamp: "19:14:32 IST",
      userOrSystem: "Monitoring Node 04",
      action: "Telemetry packet received",
      asset: "WB-HOW-001 (Hooghly)",
      source: "IoT Sensor Array",
      result: "Accepted",
    },
    {
      timestamp: "19:12:05 IST",
      userOrSystem: "Executive Engineer (Civil)",
      action: "Condition score updated",
      asset: "Pier P-04 (MH-PUN-MM-001)",
      source: "Field Inspection (PWD)",
      result: "Recorded in Ledger",
    },
    {
      timestamp: "18:55:40 IST",
      userOrSystem: "SDMA Automated Risk Engine",
      action: "Safety invariant validated",
      asset: "MH-SOL-BHI-004 (Bhima)",
      source: "IRC:SP:35 Engine",
      result: "Compliant",
    },
    {
      timestamp: "18:40:15 IST",
      userOrSystem: "Division Traffic Controller",
      action: "Heavy axle speed restriction",
      asset: "MH-RAT-KON-012 (Savitri)",
      source: "Triage Incident Desk",
      result: "Dispatched",
    },
    {
      timestamp: "17:30:00 IST",
      userOrSystem: "PWD Central Metrology",
      action: "MEMS Inclinometer Zero-Check",
      asset: "MH-PUN-MM-001 (Bund Garden)",
      source: "Calibration Bench",
      result: "Verified",
    },
  ];

  const publicBridges = [
    {
      code: "MH-PUN-MM-001",
      name: {
        en: "Bund Garden Bridge across Mula-Mutha",
        hi: "मुला-मुथा नदी पर बंड गार्डन पुल",
        mr: "मुळा-मुठा नदीवरील बंड गार्डन पूल",
      },
      river: {
        en: "Mula-Mutha",
        hi: "मुला-मुथा",
        mr: "मुळा-मुठा",
      },
      district: {
        en: "Pune",
        hi: "पुणे",
        mr: "पुणे",
      },
      yearBuilt: 1998,
      ageYears: 28,
      tier: "Good",
      lastAuditMonth: {
        en: "October 2026",
        hi: "अक्टूबर २०२६",
        mr: "ऑक्टोबर २०२६",
      },
    },
    {
      code: "MH-SOL-BHI-004",
      name: {
        en: "Pandharpur Pilgrim Bridge across Bhima",
        hi: "भीमा नदी पर पंढरपुर तीर्थयात्री पुल",
        mr: "भीमा नदीवरील पंढरपूर वारकरी पूल",
      },
      river: {
        en: "Bhima",
        hi: "भीमा",
        mr: "भीमा",
      },
      district: {
        en: "Solapur",
        hi: "सोलापुर",
        mr: "सोलापूर",
      },
      yearBuilt: 1974,
      ageYears: 52,
      tier: "Watch",
      lastAuditMonth: {
        en: "October 2026",
        hi: "अक्टूबर २०२६",
        mr: "ऑक्टोबर २०२६",
      },
    },
    {
      code: "MH-RAT-KON-012",
      name: {
        en: "Savitri Estuary Bridge",
        hi: "सावित्री नदी मुहाना पुल",
        mr: "सावित्री खाडी पूल",
      },
      river: {
        en: "Savitri (Konkan)",
        hi: "सावित्री (कोंकण)",
        mr: "सावित्री (कोकण)",
      },
      district: {
        en: "Ratnagiri",
        hi: "रत्नागिरि",
        mr: "रत्नागिरी",
      },
      yearBuilt: 2017,
      ageYears: 9,
      tier: "Good",
      lastAuditMonth: {
        en: "October 2026",
        hi: "अक्टूबर २०२६",
        mr: "ऑक्टोबर २०२६",
      },
    },
    {
      code: "MH-NAS-GOD-007",
      name: {
        en: "Godavari River Road Bridge",
        hi: "गोदावरी नदी सड़क पुल",
        mr: "गोदावरी नदी रस्ता पूल",
      },
      river: {
        en: "Godavari",
        hi: "गोदावरी",
        mr: "गोदावरी",
      },
      district: {
        en: "Nashik",
        hi: "नाशिक",
        mr: "नाशिक",
      },
      yearBuilt: 1985,
      ageYears: 41,
      tier: "Warning",
      lastAuditMonth: {
        en: "September 2026",
        hi: "सितंबर २०२६",
        mr: "सप्टेंबर २०२६",
      },
    },
    {
      code: "MH-SAT-KRI-003",
      name: {
        en: "Krishna River Highway Overpass",
        hi: "कृष्णा नदी हाईवे ओवरपास",
        mr: "कृष्णा नदी महामार्ग उड्डाणपूल",
      },
      river: {
        en: "Krishna",
        hi: "कृष्णा",
        mr: "कृष्णा",
      },
      district: {
        en: "Satara",
        hi: "सातारा",
        mr: "सातारा",
      },
      yearBuilt: 2012,
      ageYears: 14,
      tier: "Good",
      lastAuditMonth: {
        en: "October 2026",
        hi: "अक्टूबर २०२६",
        mr: "ऑक्टोबर २०२६",
      },
    },
  ];

  const filtered = publicBridges.filter((b) => {
    const q = search.toLowerCase();
    const nameStr = b.name[activeLocale]?.toLowerCase() || b.name.en.toLowerCase();
    const riverStr = b.river[activeLocale]?.toLowerCase() || b.river.en.toLowerCase();
    const districtStr = b.district[activeLocale]?.toLowerCase() || b.district.en.toLowerCase();
    return (
      b.code.toLowerCase().includes(q) ||
      nameStr.includes(q) ||
      riverStr.includes(q) ||
      districtStr.includes(q)
    );
  });

  const handleOpenReportModal = (code?: string) => {
    setSelectedBridgeCode(code || (publicBridges[0]?.code ?? ""));
    setSubmitted(false);
    setCitizenName("");
    setCitizenPhone("");
    setConcernDesc("");
    setModalOpen(true);
    triggerHaptic("selection");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName.trim() || !concernDesc.trim()) return;
    setSubmitted(true);
    triggerHaptic("success");
    setTimeout(() => {
      setModalOpen(false);
      setSubmitted(false);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-900 pb-16">
      {/* Top Government Institutional Header */}
      <section className="bg-white border-b border-slate-300 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-slate-600 mb-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              <span>GOVERNMENT OF MAHARASHTRA • STATUTORY PUBLIC DISCLOSURE</span>
              <span className="text-slate-400">•</span>
              <span className="text-teal-700">RTI 4(1)(B) TRANSPARENCY (L7)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.publicPortal.title}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {t.publicPortal.subtitle}
            </p>
          </div>

          <button
            onClick={() => handleOpenReportModal()}
            className="self-start md:self-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold flex items-center gap-2 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.publicPortal.reportConcern}</span>
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Tier Meaning Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-3.5 rounded border border-slate-300">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 shrink-0"></span>
              <strong className="text-xs text-slate-900">{t.common.tiers.good}</strong>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">{t.publicPortal.tierGoodDesc}</p>
          </div>

          <div className="bg-white p-3.5 rounded border border-slate-300">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
              <strong className="text-xs text-slate-900">{t.common.tiers.watch}</strong>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">{t.publicPortal.tierWatchDesc}</p>
          </div>

          <div className="bg-white p-3.5 rounded border border-slate-300">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span>
              <strong className="text-xs text-slate-900">{t.common.tiers.warning}</strong>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">{t.publicPortal.tierWarningDesc}</p>
          </div>

          <div className="bg-white p-3.5 rounded border border-slate-300">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0"></span>
              <strong className="text-xs text-slate-900">{t.common.tiers.critical}</strong>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">{t.publicPortal.tierCriticalDesc}</p>
          </div>
        </div>

        {/* Section 20 Government Audit Trail Ledger */}
        <div className="bg-white rounded-lg border border-slate-300 overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-teal-700" />
                <span>GOVERNMENT AUDIT TRAIL & SYSTEM LEDGER</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Immutable, verifiable audit record of physical inspections, automated telemetry packets, and incident directives
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-300">
              LEDGER: PROD-SYNC-01
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-mono text-[11px]">
                <tr>
                  <th className="py-2.5 px-4 font-bold">TIMESTAMP</th>
                  <th className="py-2.5 px-4 font-bold">USER / SYSTEM</th>
                  <th className="py-2.5 px-4 font-bold">ACTION</th>
                  <th className="py-2.5 px-4 font-bold">ASSET</th>
                  <th className="py-2.5 px-4 font-bold">SOURCE</th>
                  <th className="py-2.5 px-4 font-bold text-right">RESULT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {auditLogEntries.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-slate-600 text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800">{log.userOrSystem}</td>
                    <td className="py-2.5 px-4 text-slate-900 font-medium">{log.action}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-700 text-[11px]">{log.asset}</td>
                    <td className="py-2.5 px-4 text-slate-500 text-[11px]">{log.source}</td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        <Check className="w-3 h-3 text-teal-700" />
                        <span>{log.result}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Public Bridge Asset Roster */}
        <div className="bg-white rounded-lg border border-slate-300 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                PUBLIC INFRASTRUCTURE CONDITION ROSTER
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Public disclosure of bridge safety condition grades and audit intervals
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded border border-slate-200 w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder={t.publicPortal.searchBridge}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs bg-transparent focus:outline-none text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((b) => (
              <div
                key={b.code}
                className="p-4 bg-slate-50 rounded border border-slate-200 flex flex-col justify-between text-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {b.code}
                    </span>
                    <RiskTierBadge tier={b.tier} size="sm" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs mb-1">{b.name[activeLocale]}</h3>
                  <p className="text-[11px] text-slate-500 mb-3">
                    {b.river[activeLocale]} River • {b.district[activeLocale]} District
                  </p>

                  <div className="space-y-1 bg-white p-2.5 rounded border border-slate-200 text-[11px] mb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t.publicPortal.ageYears}:</span>
                      <span className="font-mono text-slate-800 font-semibold">
                        {b.ageYears} yrs (Built {b.yearBuilt})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t.publicPortal.latestAudit}:</span>
                      <span className="font-mono text-slate-800 font-semibold">{b.lastAuditMonth[activeLocale]}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenReportModal(b.code)}
                    className="text-[11px] font-bold text-slate-900 hover:text-teal-700 flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{t.publicPortal.reportConcern}</span>
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono">PWD Certified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Citizen Grievance Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-5 border border-slate-300 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-teal-700" />
                  {t.publicPortal.grievanceTitle}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{t.publicPortal.grievanceSub}</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitted ? (
              <div className="p-5 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">
                  {t.publicPortal.reportSubmitted}
                </h4>
                <p className="text-xs text-slate-500">
                  Acknowledgement SMS dispatched with complaint tracking ID #SR-MH-2026-8812.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Bridge Structure
                  </label>
                  <select
                    value={selectedBridgeCode}
                    onChange={(e) => setSelectedBridgeCode(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 bg-white font-medium focus:outline-none"
                  >
                    {publicBridges.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.code} — {b.name[activeLocale]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {t.publicPortal.namePlaceholder} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patil"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {t.publicPortal.phonePlaceholder}
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9823012345"
                      value={citizenPhone}
                      onChange={(e) => setCitizenPhone(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Observed Defect / Safety Concern *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder={t.publicPortal.descPlaceholder}
                    value={concernDesc}
                    onChange={(e) => setConcernDesc(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    {t.publicPortal.closeModal}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.publicPortal.submitGrievance}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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
} from "lucide-react";
import { RiskTierBadge } from "@/components/RiskTierBadge";
import { useAppStore } from "@/lib/store";
import { TRANSLATIONS } from "@/lib/translations";
import { triggerHaptic } from "@/lib/haptics";

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
        hi: "रत्नागिरी",
        mr: "रत्नागिरी",
      },
      yearBuilt: 1968,
      ageYears: 58,
      tier: "Critical",
      lastAuditMonth: {
        en: "October 2026",
        hi: "अक्टूबर २०२६",
        mr: "ऑक्टोबर २०२६",
      },
    },
    {
      code: "MH-NAS-GOD-007",
      name: {
        en: "Godavari Old City Bridge",
        hi: "गोदावरी पुराना शहर पुल",
        mr: "गोदावरी जुने शहर पूल",
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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <div className="bg-navy-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-navy-800 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 text-teal-300 text-xs font-mono mb-3 border border-navy-700">
              <Eye className="w-3.5 h-3.5 text-teal-400" />
              <span>{t.publicPortal.badge}</span>
              <span className="text-navy-400">•</span>
              <span className="text-teal-400">{t.common.simulatedTag}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.publicPortal.title}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-navy-200 max-w-2xl leading-relaxed">
              {t.publicPortal.subtitle}
            </p>
          </div>

          <button
            onClick={() => handleOpenReportModal()}
            className="self-start md:self-auto px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>{t.publicPortal.reportConcern}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Tier Meaning Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
              <strong className="text-xs text-slate-900">{t.common.tiers.good}</strong>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">{t.publicPortal.tierGoodDesc}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
              <strong className="text-xs text-slate-900">{t.common.tiers.watch}</strong>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">{t.publicPortal.tierWatchDesc}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-orange-200 shadow-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-500 shrink-0"></span>
              <strong className="text-xs text-slate-900">{t.common.tiers.warning}</strong>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">{t.publicPortal.tierWarningDesc}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0"></span>
              <strong className="text-xs text-slate-900">{t.common.tiers.critical}</strong>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">{t.publicPortal.tierCriticalDesc}</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex items-center gap-3 shadow-xs">
          <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
          <input
            type="text"
            placeholder={t.publicPortal.searchBridge}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-transparent focus:outline-none text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Public Bridge Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((b) => (
            <div
              key={b.code}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                    {b.code}
                  </span>
                  <RiskTierBadge tier={b.tier} size="sm" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{b.name[activeLocale]}</h3>
                <p className="text-xs text-slate-500 mb-4">
                  {b.river[activeLocale]} River • {b.district[activeLocale]} District
                </p>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.publicPortal.ageYears}:</span>
                    <span className="font-semibold text-slate-900">
                      {b.ageYears} yrs ({t.publicPortal.builtYear} {b.yearBuilt})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.publicPortal.latestAudit}:</span>
                    <span className="font-semibold text-slate-900">{b.lastAuditMonth[activeLocale]}</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleOpenReportModal(b.code)}
                  className="w-full py-2 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 rounded-xl text-xs font-semibold border border-slate-200 transition-colors mb-3 flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t.publicPortal.reportConcern}</span>
                </button>

                <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span>Certified MoRTH Safety Grid</span>
                  <span className="font-mono text-[10px] text-teal-600 font-semibold">
                    {t.common.simulatedTag}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Citizen Grievance Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Shield className="w-4 h-4 text-teal-600" />
                  {t.publicPortal.grievanceTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{t.publicPortal.grievanceSub}</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-bold text-slate-900 text-sm">
                  {t.publicPortal.reportSubmitted}
                </h4>
                <p className="text-xs text-slate-500">
                  Acknowledgement SMS dispatched with complaint tracking ID #SR-MH-2026-8812.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Bridge Structure
                  </label>
                  <select
                    value={selectedBridgeCode}
                    onChange={(e) => setSelectedBridgeCode(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-teal-500 outline-none"
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.publicPortal.namePlaceholder} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patil"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.publicPortal.phonePlaceholder}
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9823012345"
                      value={citizenPhone}
                      onChange={(e) => setCitizenPhone(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Observed Defect / Safety Concern *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder={t.publicPortal.descPlaceholder}
                    value={concernDesc}
                    onChange={(e) => setConcernDesc(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    {t.publicPortal.closeModal}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
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

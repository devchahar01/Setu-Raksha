"use client";

import React from "react";
import { AlertTriangle, Info, ShieldCheck } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { TRANSLATIONS } from "@/lib/translations";

export const Footer: React.FC = () => {
  const { activeLocale } = useAppStore();
  const t = TRANSLATIONS[activeLocale] || TRANSLATIONS.en;

  return (
    <footer className="relative z-10 bg-slate-100/90 backdrop-blur-md text-slate-700 border-t border-slate-200 mt-auto">
      {/* Mandatory Statutory Advisory Banner */}
      <div className="bg-amber-50/90 border-b border-amber-200/80 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3 text-xs sm:text-sm text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
          <div className="leading-snug">
            <span className="font-bold uppercase tracking-wider mr-1.5 text-amber-950">
              {t.common.disclaimerTitle}:
            </span>
            <span>{t.common.disclaimerText}</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-sky-600" />
              <span className="font-bold text-slate-900 text-base tracking-wide">{t.common.appName}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-lg mb-3">
              {t.common.tagline}. {t.common.ministry}. {t.common.standardsTag}.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold">
              <Info className="w-3.5 h-3.5 text-sky-600" />
              <span>Target: Up to 90% disaster failure mitigation via predictive decision support (Phase 8 Benchmark)</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Lifecycle Coverage
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
              <li>{t.common.nav.registry}</li>
              <li>{t.common.nav.quality}</li>
              <li>{t.common.nav.telemetry}</li>
              <li>{t.common.nav.defectAr}</li>
              <li>{t.common.nav.triage}</li>
              <li>{t.common.nav.audits}</li>
              <li>{t.common.nav.risk}</li>
              <li>{t.common.nav.public}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Engineering Governance
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
              <li>IRC:SP:35 Substructure & Superstructure</li>
              <li>IRC:6 Bridge Loads & Stresses</li>
              <li>IS 1893:2016 Seismic Evaluation</li>
              <li>FHWA HEC-18 Scour & Hydraulic Flow</li>
              <li>WCAG 2.1 AA Certified Access</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
          <div>{t.common.copyright}</div>
          <div className="flex items-center gap-4 font-mono">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span className="text-sky-700 font-semibold">{t.common.simulatedTag}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

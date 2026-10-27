"use client";

import React from "react";
import { Shield, AlertTriangle } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { TRANSLATIONS } from "@/lib/translations";

export const Footer: React.FC = () => {
  const { activeLocale } = useAppStore();
  const t = TRANSLATIONS[activeLocale] || TRANSLATIONS.en;

  return (
    <footer className="relative z-10 bg-[#f4f2ec] text-slate-700 border-t border-slate-300 mt-auto">
      {/* Mandatory Statutory Advisory Banner */}
      <div className="bg-[#fffbeb] border-b border-amber-200/90 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-2.5 text-xs text-amber-900 leading-snug">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
          <div>
            <strong className="uppercase tracking-wider mr-1.5 text-amber-950 font-bold">
              {t.common.disclaimerTitle}:
            </strong>
            <span>{t.common.disclaimerText}</span>
          </div>
        </div>
      </div>

      {/* Clean Official Government Footer Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded bg-[#1e293b] flex items-center justify-center text-white">
              <Shield className="w-3 h-3 text-sky-300" />
            </div>
            <strong className="text-slate-900 font-bold tracking-tight">
              {t.common.appName} • Government of Maharashtra
            </strong>
          </div>
          <p className="text-slate-600 font-medium">
            Public Works Department (PWD) & State Disaster Management Authority (SDMA)
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            IRC:SP:35 Table 4.1 Calibration • IS 1893:2016 Seismic Standard • FHWA HEC-18 Scour Metric
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-mono text-slate-600">
          <div>
            <span className="text-slate-400">System Version: </span>
            <span className="font-semibold text-slate-800">v1.0.4-PROD</span>
          </div>
          <div className="hidden sm:inline text-slate-300">•</div>
          <div>
            <span className="text-slate-400">Data Source: </span>
            <span className="font-semibold text-slate-800">Maharashtra PWD Grid (Simulated)</span>
          </div>
          <div className="hidden sm:inline text-slate-300">•</div>
          <div>
            <span className="text-slate-400">Security Clearance: </span>
            <span className="font-semibold text-emerald-700">AUTHORITY_LEVEL_4</span>
          </div>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="bg-[#edeae1] border-t border-slate-300/80 py-2 px-4 sm:px-6 lg:px-8 text-[11px] text-slate-600 text-center font-mono">
        {t.common.copyright}
      </div>
    </footer>
  );
};

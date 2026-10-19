import React from "react";
import { AlertTriangle, Info, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-navy-200 border-t border-navy-800 mt-auto">
      {/* Mandatory Statutory Advisory Banner */}
      <div className="bg-navy-900 border-b border-navy-800 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3 text-xs sm:text-sm text-navy-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
          <div className="leading-snug">
            <span className="font-bold text-white uppercase tracking-wider mr-1.5">
              Engineering Advisory Notice:
            </span>
            <span>
              Setu Raksha provides predictive decision support to assist civil authorities and engineers in prioritizing inspection, traffic restrictions, and preventative maintenance. It <strong>never</strong> replaces detailed structural analysis, physical non-destructive testing (NDT), or a certified civil engineer&apos;s professional judgment. All sensor feeds, stream readings, and starter bridge records are <strong>SIMULATED</strong> for demonstration and testing purposes.
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              <span className="font-bold text-white text-base tracking-wide">SETU RAKSHA</span>
            </div>
            <p className="text-xs text-navy-300 leading-relaxed max-w-lg mb-3">
              National Bridge Infrastructure Safety & Intelligence Grid. Developed for the Department of Computer Engineering, Army Institute of Technology Pune. Built on IRC:SP:35, IS 1893, and FHWA HEC-18 structural vulnerability guidelines.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-navy-800 text-teal-300 text-xs font-mono">
              <Info className="w-3.5 h-3.5" />
              <span>Target: Up to 90% reduction in preventable disaster bridge failures (Simulation Target)</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Engineering Lifecycle
            </h4>
            <ul className="space-y-1.5 text-xs text-navy-300">
              <li>L1 Pre-construction & Design</li>
              <li>L2 Quality Audits & Materials</li>
              <li>L3 Live IoT Ingestion (Simulated)</li>
              <li>L4 Monthly Audit Scheduler</li>
              <li>L5 26-Factor Field Audits</li>
              <li>L6 SVI & Prescriptive Remediation</li>
              <li>L7 Public Transparency Portal</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Standards & Compliance
            </h4>
            <ul className="space-y-1.5 text-xs text-navy-300">
              <li>IRC:6 & IRC:SP:35 Bridge Inspection</li>
              <li>IS 1893 Seismic Evaluation</li>
              <li>FHWA HEC-18 Scour Calculations</li>
              <li>WCAG 2.1 AA Accessibility</li>
              <li>Trilingual Architecture (EN, HI, MR)</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-navy-800 flex flex-col sm:flex-row justify-between items-center text-xs text-navy-400 gap-2">
          <div>
            © 2026 Setu Raksha Platform. Army Institute of Technology Pune.
          </div>
          <div className="flex items-center gap-4">
            <span>Version 0.1.0 (Phase 0 Platform)</span>
            <span>•</span>
            <span>All Data Source: SIMULATED</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

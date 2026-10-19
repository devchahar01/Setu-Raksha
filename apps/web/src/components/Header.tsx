"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Globe, Activity } from "lucide-react";

export const Header: React.FC = () => {
  const [currentLocale, setCurrentLocale] = useState<string>("en");

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "mr", label: "मराठी" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-navy-900 text-white border-b border-navy-700 shadow-md">
      {/* Top Bar with Ministry / Dept Branding */}
      <div className="bg-navy-950 py-1 px-4 text-xs text-navy-200 border-b border-navy-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">GOVERNMENT INFRASTRUCTURE GRID</span>
          <span className="text-navy-400">|</span>
          <span>Public Works Department & Disaster Management Authority</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 text-teal-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            SIMULATED MODE (TEST GRID)
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-lg p-1">
            <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-inner">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg leading-tight tracking-wide text-white">
                SETU RAKSHA
              </div>
              <div className="text-[11px] text-teal-300 font-medium tracking-wider uppercase">
                National Bridge Safety & Intelligence Grid
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-navy-100">
          <Link href="/bridges" className="hover:text-teal-300 transition-colors">
            Bridge Registry (L1)
          </Link>
          <Link href="/audits" className="hover:text-teal-300 transition-colors">
            Monthly Audits (L5)
          </Link>
          <Link href="/telemetry" className="hover:text-teal-300 transition-colors flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-teal-400" />
            Live Sensors (L3)
          </Link>
          <Link href="/risk" className="hover:text-teal-300 transition-colors">
            Risk & Remediation (L6)
          </Link>
          <Link href="/public" className="hover:text-teal-300 transition-colors">
            Citizen Transparency (L7)
          </Link>
        </nav>

        {/* Right Section: Language Switcher Placeholder */}
        <div className="flex items-center gap-3">
          <div className="relative inline-flex items-center bg-navy-800 rounded-lg p-1 border border-navy-700">
            <Globe className="w-4 h-4 text-teal-400 ml-1.5 mr-1" aria-hidden="true" />
            <div className="flex gap-1" role="group" aria-label="Select language">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setCurrentLocale(lang.code)}
                  aria-pressed={currentLocale === lang.code}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                    currentLocale === lang.code
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-navy-200 hover:text-white hover:bg-navy-700"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

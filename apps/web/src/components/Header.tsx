"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Activity,
  Layers,
  FileCheck,
  Cpu,
  Eye,
  AlertTriangle,
  Globe,
  Radio,
  Clock,
  Terminal,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { activeLocale, setLocale } = useAppStore();

  const [istTime, setIstTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);
      setIstTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const languages: { code: "en" | "hi" | "mr"; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "hi", label: "हिन्दी" },
    { code: "mr", label: "मराठी" },
  ];

  const navLinks = [
    { href: "/bridges", label: "Registry (L1)", icon: <Layers className="w-3.5 h-3.5" /> },
    { href: "/audits", label: "Audits (L5)", icon: <FileCheck className="w-3.5 h-3.5" /> },
    { href: "/telemetry", label: "Live IoT (L3)", icon: <Radio className="w-3.5 h-3.5" /> },
    { href: "/risk", label: "Risk & SVI (L6)", icon: <Cpu className="w-3.5 h-3.5" /> },
    { href: "/triage", label: "Triage (L4)", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    { href: "/public", label: "Transparency (L7)", icon: <Eye className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#060A12]/95 backdrop-blur-md text-slate-100 border-b border-slate-800">
      {/* Top Institutional Bar */}
      <div className="bg-[#03070E] py-1 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200 tracking-wider">
            GOVT OF MAHARASHTRA • PWD & SDMA
          </span>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-slate-400">
            IRC:SP:35 • IS 1893:2016 COMPLIANT
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 text-teal-400">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
            <span>SYSTEM: NOMINAL (14ms)</span>
          </div>

          <div className="flex items-center gap-1 text-slate-300">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{istTime || "12:00:00"} IST</span>
          </div>

          <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-teal-300 border border-slate-800">
            source=simulated
          </span>
        </div>
      </div>

      {/* Main Command Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 transition-colors">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-wider text-white flex items-center gap-1.5">
              SETU RAKSHA
              <span className="text-[10px] font-mono text-teal-400 px-1.5 py-0.2 bg-teal-950/60 border border-teal-800/60 rounded">
                v1.0
              </span>
            </div>
            <div className="text-[10px] text-slate-400 tracking-tight hidden sm:block">
              National Bridge Safety & Intelligence Grid
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 text-xs font-medium text-slate-300">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-slate-800/90 text-teal-300 border border-slate-700 shadow-sm"
                    : "hover:text-white hover:bg-slate-800/40"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Trilingual Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLocale(lang.code)}
                aria-pressed={activeLocale === lang.code}
                className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                  activeLocale === lang.code
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

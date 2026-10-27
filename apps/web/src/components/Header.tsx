"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Layers,
  FileCheck,
  Cpu,
  Eye,
  AlertTriangle,
  Globe,
  Radio,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { TRANSLATIONS } from "@/lib/translations";
import { triggerHaptic } from "@/lib/haptics";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { activeLocale, setLocale } = useAppStore();
  const t = TRANSLATIONS[activeLocale] || TRANSLATIONS.en;

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

  // Complete, properly ordered L1 through L7 Lifecycle Navigation
  const navLinks = [
    { href: "/bridges", label: t.common.nav.registry, icon: <Layers className="w-3.5 h-3.5" /> },
    { href: "/bridges?view=quality", label: t.common.nav.quality, icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { href: "/telemetry", label: t.common.nav.telemetry, icon: <Radio className="w-3.5 h-3.5" /> },
    { href: "/defect-ar", label: t.common.nav.defectAr, icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" /> },
    { href: "/triage", label: t.common.nav.triage, icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    { href: "/audits", label: t.common.nav.audits, icon: <FileCheck className="w-3.5 h-3.5" /> },
    { href: "/risk", label: t.common.nav.risk, icon: <Cpu className="w-3.5 h-3.5" /> },
    { href: "/public", label: t.common.nav.public, icon: <Eye className="w-3.5 h-3.5" /> },
  ];

  const handleLanguageChange = (code: "en" | "hi" | "mr") => {
    triggerHaptic("select");
    setLocale(code);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md text-slate-800 border-b border-slate-200 shadow-xs">
      {/* Top Institutional Information Bar */}
      <div className="bg-slate-100 py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 flex items-center justify-between text-xs font-mono text-slate-600">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-800 tracking-wide">
            {t.common.ministry}
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-slate-600">
            {t.common.standardsTag}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t.common.systemNominal}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{istTime || "12:00:00"} IST</span>
          </div>

          <span className="text-[11px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded border border-sky-200 font-semibold">
            {t.common.simulatedTag}
          </span>
        </div>
      </div>

      {/* Main Command Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          onClick={() => triggerHaptic("tap")}
          className="flex items-center gap-2.5 group active:scale-[0.98] transition-transform"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-xs group-hover:bg-sky-500 transition-colors">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-wider text-slate-900 flex items-center gap-1.5">
              {t.common.appName}
              <span className="text-[10px] font-mono text-sky-700 px-1.5 py-0.2 bg-sky-100 border border-sky-200 rounded font-bold">
                v1.0
              </span>
            </div>
            <div className="text-[10px] text-slate-500 tracking-tight hidden sm:block">
              {t.common.tagline}
            </div>
          </div>
        </Link>

        {/* Desktop Navigation with Complete L1–L7 Ordering */}
        <nav className="hidden lg:flex items-center space-x-1 text-xs font-semibold text-slate-600">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => triggerHaptic("tap")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg active:scale-[0.97] transition-all ${
                  isActive
                    ? "bg-sky-50 text-sky-800 border border-sky-200 shadow-xs font-bold"
                    : "hover:text-slate-900 hover:bg-slate-100"
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
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                aria-pressed={activeLocale === lang.code}
                className={`px-2.5 py-1 rounded text-xs active:scale-[0.95] transition-all ${
                  activeLocale === lang.code
                    ? "bg-sky-600 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
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

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layers,
  CheckCircle2,
  Radio,
  Box,
  AlertTriangle,
  FileCheck,
  Cpu,
  Eye,
  Clock,
  Globe,
  Shield,
  Activity,
  UserCheck,
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

  // Professional Government Engineering Operational Workflow Navigation
  const navLinks = [
    {
      step: "01",
      href: "/bridges",
      label: activeLocale === "hi" ? "परिसंपत्ति रजिस्ट्री" : activeLocale === "mr" ? "मालमत्ता नोंदवही" : "ASSET REGISTRY",
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      step: "02",
      href: "/bridges?view=quality",
      label: activeLocale === "hi" ? "गुणवत्ता परीक्षण" : activeLocale === "mr" ? "गुणवत्ता चाचणी" : "QUALITY & TESTING",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    {
      step: "03",
      href: "/telemetry",
      label: activeLocale === "hi" ? "लाइव निगरानी" : activeLocale === "mr" ? "थेट सेन्सर देखरेख" : "LIVE MONITORING",
      icon: <Radio className="w-3.5 h-3.5" />,
    },
    {
      step: "04",
      href: "/defect-ar",
      label: activeLocale === "hi" ? "डिजिटल ट्विन" : activeLocale === "mr" ? "डिजिटल ट्विन" : "DIGITAL TWIN",
      icon: <Box className="w-3.5 h-3.5" />,
    },
    {
      step: "05",
      href: "/risk",
      label: activeLocale === "hi" ? "जोखिम मूल्यांकन" : activeLocale === "mr" ? "जोखीम मूल्यमापन" : "RISK ASSESSMENT",
      icon: <Cpu className="w-3.5 h-3.5" />,
    },
    {
      step: "06",
      href: "/triage",
      label: activeLocale === "hi" ? "घटना नियंत्रण" : activeLocale === "mr" ? "आपत्कालीन कक्ष" : "INCIDENT TRIAGE",
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
    },
    {
      step: "07",
      href: "/audits",
      label: activeLocale === "hi" ? "फील्ड ऑडिट" : activeLocale === "mr" ? "प्रत्यक्ष तपासणी" : "FIELD AUDIT",
      icon: <FileCheck className="w-3.5 h-3.5" />,
    },
    {
      step: "08",
      href: "/public",
      label: activeLocale === "hi" ? "नागरिक पारदर्शिता" : activeLocale === "mr" ? "नागरिक पारदर्शकता" : "TRANSPARENCY",
      icon: <Eye className="w-3.5 h-3.5" />,
    },
  ];

  const handleLanguageChange = (code: "en" | "hi" | "mr") => {
    triggerHaptic("selection");
    setLocale(code);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fcfbf9] text-slate-800 border-b border-slate-200">
      {/* 1. Top Institutional Government Strip */}
      <div className="bg-[#f4f2ec] border-b border-slate-200/90 py-1 px-4 sm:px-6 lg:px-8 text-[11px] font-medium text-slate-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 tracking-wide font-semibold text-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
            <span>GOVERNMENT OF MAHARASHTRA</span>
            <span className="text-slate-400">•</span>
            <span>PUBLIC WORKS DEPARTMENT</span>
            <span className="text-slate-400 hidden md:inline">•</span>
            <span className="hidden md:inline">STATE DISASTER MANAGEMENT AUTHORITY</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-600">
            <span className="hidden sm:inline">IRC:SP:35 • IS 1893</span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="px-1.5 py-0.2 bg-white text-slate-700 border border-slate-300 rounded font-semibold text-[10px]">
              GRID_NODE_MH01
            </span>
            <span className="px-1.5 py-0.2 bg-sky-50 text-sky-800 border border-sky-200 rounded font-semibold text-[10px]">
              {t.common.simulatedTag}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Executive Application Header */}
      <div className="bg-[#fcfbf9] border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Institutional Mark & Title */}
          <Link
            href="/"
            onClick={() => triggerHaptic("light")}
            className="flex items-center gap-3 group"
          >
            {/* Restrained Official Emblem */}
            <div className="w-9 h-9 rounded bg-[#1e293b] flex items-center justify-center text-white border border-slate-700 shadow-xs">
              <Shield className="w-5 h-5 text-sky-300" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-[#0f172a] font-sans">
                  SETU RAKSHAK
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  (सेतुरक्षक)
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-1 py-0.2 rounded">
                  v1.0.4
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                National Bridge Infrastructure Safety & Intelligence Grid
              </p>
            </div>
          </Link>

          {/* Right Status Block: System Status, Sync & Authority */}
          <div className="flex items-center gap-4 text-xs font-mono">
            {/* System Status */}
            <div className="hidden md:flex items-center gap-1.5 bg-white px-2.5 py-1 rounded border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] text-slate-700 font-semibold font-sans">
                STATUS: <span className="text-emerald-700 font-mono">NOMINAL</span>
              </span>
            </div>

            {/* Last Sync */}
            <div className="hidden lg:flex items-center gap-1.5 text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>SYNC: {istTime || "19:21:00"} IST</span>
            </div>

            {/* Authority Profile */}
            <div className="hidden sm:flex items-center gap-1.5 bg-white px-2.5 py-1 rounded border border-slate-200 text-[11px] text-slate-700 font-sans">
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold">PWD DESK</span>
            </div>

            {/* Trilingual Selector */}
            <div className="flex items-center bg-white p-0.5 rounded border border-slate-200 text-xs font-sans">
              <Globe className="w-3 h-3 text-slate-400 ml-1.5 mr-1" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                    activeLocale === lang.code
                      ? "bg-[#1e293b] text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Operational Workflow Navigation Bar (01 to 08) */}
      <div className="bg-[#fcfbf9] px-4 sm:px-6 lg:px-8 border-b border-slate-200/90 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-1 text-xs">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href) && !link.href.includes("?"));
            return (
              <Link
                key={link.step}
                href={link.href}
                onClick={() => triggerHaptic("light")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all whitespace-nowrap text-[11px] font-semibold tracking-tight ${
                  isActive
                    ? "bg-[#1e293b] text-white font-bold"
                    : "text-slate-700 hover:text-slate-950 hover:bg-slate-100/90"
                }`}
              >
                <span className={`font-mono text-[10px] ${isActive ? "text-sky-300" : "text-slate-400"}`}>
                  {link.step}
                </span>
                <span className={isActive ? "text-sky-300" : "text-slate-500"}>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

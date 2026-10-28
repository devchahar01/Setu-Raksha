"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Layers,
  Activity,
  Radio,
  Box,
  AlertTriangle,
  FileCheck,
  Eye,
  Bell,
  ChevronDown,
  User,
  Globe,
  Shield,
  Circle,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { TRANSLATIONS } from "@/lib/translations";
import { triggerHaptic } from "@/lib/haptics";
import { PublicAdvisoryNotificationCenter } from "./PublicAdvisoryNotificationCenter";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { activeLocale, setLocale } = useAppStore();
  const t = TRANSLATIONS[activeLocale] || TRANSLATIONS.en;

  const [istTime, setIstTime] = useState<string>("19:16:32");
  const [mounted, setMounted] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
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

  // Exact 7 Workflow Steps matching reference screenshot
  const navLinks = [
    {
      step: "01",
      href: "/bridges",
      label: activeLocale === "hi" ? "परिसंपत्ति रजिस्ट्री" : activeLocale === "mr" ? "मालमत्ता नोंदवही" : "Asset Registry",
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      step: "02",
      href: "/condition",
      label: activeLocale === "hi" ? "स्थिति विश्लेषण" : activeLocale === "mr" ? "स्थिती विश्लेषण" : "Condition",
      icon: <Activity className="w-3.5 h-3.5" />,
    },
    {
      step: "03",
      href: "/",
      label: activeLocale === "hi" ? "लाइव निगरानी" : activeLocale === "mr" ? "थेट सेन्सर देखरेख" : "Live Monitoring",
      icon: <Radio className="w-3.5 h-3.5" />,
    },
    {
      step: "04",
      href: "/defect-ar",
      label: activeLocale === "hi" ? "डिजिटल ट्विन" : activeLocale === "mr" ? "डिजिटल ट्विन" : "Digital Twin",
      icon: <Box className="w-3.5 h-3.5" />,
    },
    {
      step: "05",
      href: "/risk",
      label: activeLocale === "hi" ? "जोखिम ट्राइएज" : activeLocale === "mr" ? "जोखीम ट्राइएज" : "Risk Triage",
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
    },
    {
      step: "06",
      href: "/audits",
      label: activeLocale === "hi" ? "निरीक्षण" : activeLocale === "mr" ? "तपासणी" : "Inspection",
      icon: <FileCheck className="w-3.5 h-3.5" />,
    },
    {
      step: "07",
      href: "/public",
      label: activeLocale === "hi" ? "ऑडिट एवं पारदर्शिता" : activeLocale === "mr" ? "ऑडिट व पारदर्शकता" : "Audit & Transparency",
      icon: <Shield className="w-3.5 h-3.5" />,
    },
  ];

  const handleLanguageChange = (code: "en" | "hi" | "mr") => {
    triggerHaptic("selection");
    setLocale(code);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#ffffff] text-slate-800 border-b border-slate-200 shadow-2xs">
      {/* 1. Top Institutional Strip (Exact layout from reference screenshot) */}
      <div className="bg-[#f8f9fa] border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-1.5 text-[11px] text-slate-700">
        <div className="w-full flex items-center justify-between">
          {/* Left: Ashoka Emblem + Institutional Titles */}
          <div className="flex items-center gap-2 tracking-wide font-semibold text-slate-800">
            <div className="relative w-4 h-5 shrink-0 opacity-80">
              <Image
                src="/images/emblem_india.jpg"
                alt="Emblem of India"
                width={16}
                height={20}
                className="object-contain"
                priority
              />
            </div>
            <span className="uppercase text-[11px] font-bold text-slate-800">
              GOVERNMENT OF MAHARASHTRA
            </span>
            <span className="text-slate-300 font-light">|</span>
            <span className="uppercase text-[11px] text-slate-700">
              PUBLIC WORKS DEPARTMENT
            </span>
            <span className="text-slate-300 font-light hidden md:inline">|</span>
            <span className="uppercase text-[11px] text-slate-700 hidden md:inline">
              STATE DISASTER MANAGEMENT AUTHORITY
            </span>
          </div>

          {/* Right: System Online, Sync, Bell, PWD Authority, Lang Switcher */}
          <div className="flex items-center gap-4 text-[11px] text-slate-600 font-medium">
            {/* System Online Indicator */}
            <div className="flex items-center gap-1.5 font-sans">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
              <span className="text-emerald-800 font-semibold text-[11px]">System Online</span>
            </div>

            {/* Last Sync */}
            <div className="hidden sm:flex items-center gap-1 text-slate-500 font-mono text-[11px]">
              <span>Last Sync: {mounted ? istTime : "19:16"} IST</span>
            </div>

            {/* Notification Bell with Advisory Indicator */}
            <button
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen);
                triggerHaptic("selection");
              }}
              className={`relative p-1.5 rounded transition-colors ${
                isNotificationOpen
                  ? "bg-slate-200 text-slate-900 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title="Official Bridge Safety & Public Advisories"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            </button>

            {/* PWD Authority User Profile Dropdown */}
            <div className="flex items-center gap-1.5 text-slate-800 font-semibold cursor-pointer hover:text-slate-950">
              <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                <User className="w-3 h-3" />
              </div>
              <span className="text-[11px]">PWD Authority</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            {/* Trilingual Selector */}
            <div className="flex items-center bg-white px-1 py-0.5 rounded border border-slate-200 text-[10px] font-sans">
              <Globe className="w-3 h-3 text-slate-400 mr-1" />
              {languages.map((lang, idx) => (
                <React.Fragment key={lang.code}>
                  <button
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`px-1.5 py-0.5 rounded transition-colors ${
                      activeLocale === lang.code
                        ? "bg-[#1e293b] text-white font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {lang.label}
                  </button>
                  {idx < languages.length - 1 && <span className="text-slate-300 mx-0.5">|</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Header & Navigation Row (Exact match for reference screenshot) */}
      <div className="px-4 sm:px-6 lg:px-8 py-2 bg-white flex items-center justify-between gap-4">
        {/* Left: Brand / Logo */}
        <Link
          href="/"
          onClick={() => triggerHaptic("light")}
          className="flex items-center gap-3 shrink-0 group"
        >
          {/* Bridge Shield Icon */}
          <div className="w-8 h-8 rounded bg-[#1e293b] flex items-center justify-center text-white border border-slate-700 shadow-2xs">
            <svg
              className="w-4 h-4 text-sky-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="M7 14c2-2 4-2 6-2s4 0 6 2" />
              <path d="M10 14v4" />
              <path d="M14 14v4" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-[15px] tracking-tight text-[#0f172a] font-sans">
                SETU RAKSHAK
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
              National Bridge Infrastructure Safety &amp; Intelligence Grid
            </p>
          </div>
        </Link>

        {/* Right: 01 to 07 Horizontal Engineering Workflow Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-0.5">
          {navLinks.map((link) => {
            // Determine active state: on "/" path, 03 Live Monitoring is active
            const isActive =
              (pathname === "/" && link.step === "03") ||
              (pathname === link.href && link.href !== "/") ||
              (pathname.startsWith(link.href) && link.href !== "/" && !link.href.includes("?"));

            return (
              <Link
                key={link.step}
                href={link.href}
                onClick={() => triggerHaptic("light")}
                className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded transition-all whitespace-nowrap text-xs font-medium ${
                  isActive
                    ? "text-[#0284c7] font-semibold bg-sky-50/70"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <span className={`text-[10px] font-mono ${isActive ? "text-[#0284c7]" : "text-slate-400"}`}>
                  {link.step}
                </span>
                <span className={isActive ? "text-[#0284c7]" : "text-slate-400 group-hover:text-slate-600"}>
                  {link.icon}
                </span>
                <span className={isActive ? "text-[#0f172a] font-bold" : "text-slate-700"}>
                  {link.label}
                </span>

                {/* Active Indicator Underline Bar */}
                {isActive && (
                  <span className="absolute bottom-[-8px] left-2 right-2 h-[2.5px] bg-[#0284c7] rounded-full"></span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Public Advisory & Critical Bridge Notification Modal */}
      <PublicAdvisoryNotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </header>
  );
};

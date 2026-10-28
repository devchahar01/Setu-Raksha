"use client";

import React, { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";

export const Footer: React.FC = () => {
  const [istTime, setIstTime] = useState<string>("19:16 IST");
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now);
      setIstTime(`${timeStr} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-[#f8f9fa] border-t border-slate-200/90 py-2.5 px-4 sm:px-6 lg:px-8 text-[11px] text-slate-600 font-sans mt-auto">
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left Institutional Disclaimer */}
        <div className="flex items-center gap-2 text-slate-700">
          <span>Government of Maharashtra</span>
          <span className="text-slate-300">|</span>
          <span>Public Works Department</span>
          <span className="text-slate-300">|</span>
          <span>State Disaster Management Authority</span>
        </div>

        {/* Right Metadata Strip */}
        <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
          <span>Version 3.8.0</span>
          <span className="text-slate-300">|</span>
          <span>Data: Sentinel-1 / IMD / CWC</span>
          <span className="text-slate-300">|</span>
          <span>Last Sync: {mounted ? istTime : "19:16 IST"}</span>
        </div>
      </div>
    </footer>
  );
};

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Eye,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Search,
  ExternalLink,
  Info,
} from "lucide-react";
import { RiskTierBadge } from "@/components/RiskTierBadge";
import { useAppStore } from "@/lib/store";

export default function PublicTransparencyPage() {
  const { activeLocale } = useAppStore();

  const [search, setSearch] = useState<string>("");

  const publicBridges = [
    {
      code: "MH-PUN-MM-001",
      name: "Bund Garden Bridge across Mula-Mutha",
      river: "Mula-Mutha",
      district: "Pune",
      yearBuilt: 1998,
      ageYears: 28,
      tier: "Good",
      lastAuditMonth: "October 2026",
    },
    {
      code: "MH-SOL-BHI-004",
      name: "Pandharpur Pilgrim Bridge across Bhima",
      river: "Bhima",
      district: "Solapur",
      yearBuilt: 1974,
      ageYears: 52,
      tier: "Watch",
      lastAuditMonth: "October 2026",
    },
    {
      code: "MH-RAT-KON-012",
      name: "Savitri Estuary Bridge",
      river: "Savitri (Konkan)",
      district: "Ratnagiri",
      yearBuilt: 1968,
      ageYears: 58,
      tier: "Critical",
      lastAuditMonth: "October 2026",
    },
    {
      code: "MH-NAS-GOD-007",
      name: "Godavari Old City Bridge",
      river: "Godavari",
      district: "Nashik",
      yearBuilt: 1985,
      ageYears: 41,
      tier: "Warning",
      lastAuditMonth: "September 2026",
    },
    {
      code: "MH-SAT-KRI-003",
      name: "Krishna River Highway Overpass",
      river: "Krishna",
      district: "Satara",
      yearBuilt: 2012,
      ageYears: 14,
      tier: "Good",
      lastAuditMonth: "October 2026",
    },
  ];

  const filtered = publicBridges.filter(
    (b) =>
      b.code.toLowerCase().includes(search.toLowerCase()) ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.river.toLowerCase().includes(search.toLowerCase()) ||
      b.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <div className="bg-navy-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 text-teal-300 text-xs font-mono mb-3 border border-navy-700">
            <Eye className="w-3.5 h-3.5 text-teal-400" />
            PUBLIC CITIZEN TRANSPARENCY PORTAL (L7)
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            National Bridge Safety Open Intelligence Grid
          </h1>
          <p className="mt-2 text-sm text-navy-200 max-w-2xl">
            Empowering citizens with certified safety ratings, structural age, and verified audit logs for bridges across Maharashtra.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Tier Meaning Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <strong className="text-xs text-slate-900">Good / सुरक्षित</strong>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Normal operating condition. All structural metrics within safe design tolerances.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <strong className="text-xs text-slate-900">Watch / दक्ष राहा</strong>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Minor non-structural wear detected. Elevated surveillance and scheduled maintenance.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-orange-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <strong className="text-xs text-slate-900">Warning / इशारा</strong>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Active structural warning. Heavy traffic restrictions may be imposed by PWD.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-rose-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <strong className="text-xs text-slate-900">Critical / धोकादायक</strong>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Immediate intervention required. Emergency closure & traffic diversion activated.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Search bridge by name, river or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-transparent focus:outline-none"
          />
        </div>

        {/* Public Bridge Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((b) => (
            <div key={b.code} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  {b.code}
                </span>
                <RiskTierBadge tier={b.tier} size="sm" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">{b.name}</h3>
              <p className="text-xs text-slate-500 mb-4">
                {b.river} River • {b.district} District
              </p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Structure Age:</span>
                  <span className="font-semibold text-slate-900">{b.ageYears} years (Built {b.yearBuilt})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Latest Verified Audit:</span>
                  <span className="font-semibold text-slate-900">{b.lastAuditMonth}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3 flex items-center justify-between">
                <span>Certified MoRTH Safety Grid</span>
                <span className="font-mono text-[10px] text-teal-600 font-semibold">source=simulated</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

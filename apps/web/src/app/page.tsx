import React from "react";
import Link from "next/link";
import {
  Shield,
  Activity,
  Layers,
  FileCheck,
  Cpu,
  Eye,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  Database,
  Radio,
} from "lucide-react";
import { RiskTierBadge } from "@/components/RiskTierBadge";

export default function Home() {
  const lifecycles = [
    {
      code: "L1",
      title: "Pre-construction & Design",
      desc: "IRC loading class, seismic zone (IS 1893), design life, foundation depth, and design HFL.",
      icon: <Layers className="w-5 h-5 text-teal-600" />,
      tag: "Registry",
    },
    {
      code: "L2",
      title: "Construction & Quality Audits",
      desc: "Material test logs, cube test results, initial load-tests, and contractor defect liability tracking.",
      icon: <Database className="w-5 h-5 text-teal-600" />,
      tag: "Quality",
    },
    {
      code: "L3",
      title: "Live Monitoring & Telemetry",
      desc: "Ultrasonic water level, pier inclinometers, accelerometers, and rainfall streams. Device-ready ingestion.",
      icon: <Radio className="w-5 h-5 text-teal-600" />,
      tag: "IoT (Simulated)",
    },
    {
      code: "L4",
      title: "Routine Audit Scheduler",
      desc: "Automated reminders dispatched 7 days before month-end, with escalation ladders for missed audits.",
      icon: <FileCheck className="w-5 h-5 text-teal-600" />,
      tag: "Scheduler",
    },
    {
      code: "L5",
      title: "26-Factor Monthly Inspection",
      desc: "Structured field audit across structural, hydraulic, seismic, load, and age variables (Appendix A).",
      icon: <Activity className="w-5 h-5 text-teal-600" />,
      tag: "Field Audits",
    },
    {
      code: "L6",
      title: "AI Predictive Risk Engine",
      desc: "Structural Vulnerability Index (SVI), Dynamic Risk Index (DRI), Remaining Useful Life, and prescriptive actions.",
      icon: <Cpu className="w-5 h-5 text-teal-600" />,
      tag: "Risk Engine",
    },
    {
      code: "L7",
      title: "Public Transparency Portal",
      desc: "Citizen view of bridge age, build quality, and live health tiers with safe cryptographic redaction.",
      icon: <Eye className="w-5 h-5 text-teal-600" />,
      tag: "Citizen View",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-teal-900 rounded-2xl p-8 sm:p-12 text-white shadow-xl border border-navy-700 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            Decision Support & Disaster Prevention Grid
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Setu Raksha
          </h1>
          <p className="text-lg text-navy-100 leading-relaxed font-light">
            National Bridge Infrastructure Safety & Intelligence Grid. Unifying monthly 26-factor field engineering audits with live telemetry to predict structural vulnerabilities before disasters strike.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <Link
              href="/bridges"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-500 text-navy-950 font-bold hover:bg-teal-400 transition-colors shadow-md text-sm"
            >
              Explore Bridge Grid
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-950/70 text-xs text-navy-200 border border-navy-700 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              API Status: Ready (Simulated)
            </div>
          </div>
        </div>
      </section>

      {/* Risk Tiers Matrix (Appendix D specification) */}
      <section className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-navy-900">
              Standard Risk Classification Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Derived from Structural Vulnerability Index (SVI) & Live Hazard Multipliers (Appendix D)
            </p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md self-start sm:self-auto">
            Trilingual Classification (EN / HI / MR)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* GOOD */}
          <div className="rounded-lg p-4 border border-emerald-200 bg-emerald-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Tier 1
              </span>
              <RiskTierBadge tier="GOOD" />
            </div>
            <div className="font-bold text-slate-900">Score: 0 – 29</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Structure sound. Routine preventive maintenance. No immediate hazard.
            </p>
            <div className="text-[11px] text-emerald-800 pt-1 border-t border-emerald-100">
              हिन्दी: सुरक्षित | मराठी: सुरक्षित
            </div>
          </div>

          {/* WATCH */}
          <div className="rounded-lg p-4 border border-amber-200 bg-amber-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Tier 2
              </span>
              <RiskTierBadge tier="WATCH" />
            </div>
            <div className="font-bold text-slate-900">Score: 30 – 54</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Early signs of distress or ageing. Scheduled inspection required.
            </p>
            <div className="text-[11px] text-amber-800 pt-1 border-t border-amber-100">
              हिन्दी: निगरानी | मराठी: नजर ठेवा
            </div>
          </div>

          {/* WARNING */}
          <div className="rounded-lg p-4 border border-orange-200 bg-orange-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-900">
                Tier 3
              </span>
              <RiskTierBadge tier="WARNING" />
            </div>
            <div className="font-bold text-slate-900">Score: 55 – 74</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Significant defect or live hazard spike. Restrict heavy traffic & prepare diversion.
            </p>
            <div className="text-[11px] text-orange-900 pt-1 border-t border-orange-100">
              हिन्दी: चेतावनी | मराठी: चेतावणी
            </div>
          </div>

          {/* CRITICAL */}
          <div className="rounded-lg p-4 border border-red-200 bg-red-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-900">
                Tier 4
              </span>
              <RiskTierBadge tier="CRITICAL" />
            </div>
            <div className="font-bold text-slate-900">Score: 75 – 100</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Severe defect or critical flag triggered. Close bridge immediately, dispatch inspection team.
            </p>
            <div className="text-[11px] text-red-900 pt-1 border-t border-red-100">
              हिन्दी: गंभीर खतरा | मराठी: गंभीर धोका
            </div>
          </div>
        </div>
      </section>

      {/* 7 Lifecycles Grid */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">
            Comprehensive Bridge Lifecycle Coverage (L1–L7)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full cradle-to-grave monitoring architecture specified in Part A.4
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lifecycles.map((item) => (
            <div
              key={item.code}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                  {item.code} • {item.tag}
                </span>
              </div>
              <h3 className="font-bold text-sm text-navy-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

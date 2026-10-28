"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Activity,
  Shield,
  Layers,
  Waves,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  FileCheck,
  Radio,
  Search,
  Filter,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Info,
  Droplets,
  Wind,
  Compass,
} from "lucide-react";
import { RiskTierBadge } from "@/components/RiskTierBadge";
import { useAppStore } from "@/lib/store";
import { formatNumber } from "@/lib/formatters";
import { triggerHaptic } from "@/lib/haptics";
import {
  MASTER_BRIDGES_DATABASE,
  BridgeAsset,
  getBridgeBasin,
} from "@/lib/bridgesData";

// The Official 26-Factor Inspection Model (IRC:SP:35 & IS:1893)
interface ConditionFactor {
  id: string;
  group: "STRUCTURAL" | "HYDRAULIC" | "SEISMIC" | "LOAD" | "ENVIRONMENTAL";
  name: string;
  name_hi: string;
  name_mr: string;
  unit: string;
  inputDescription: string;
  getMeasurement: (bridge: BridgeAsset) => {
    value: string;
    baseline: string;
    status: "NORMAL" | "WATCH" | "WARNING" | "CRITICAL";
    deviation: string;
  };
}

const CONDITION_FACTORS: ConditionFactor[] = [
  // STRUCTURAL (S-01 to S-07)
  {
    id: "S-01",
    group: "STRUCTURAL",
    name: "Deck Surface & Wearing Coat Condition",
    name_hi: "डेक सतह और वियरिंग कोट की स्थिति",
    name_mr: "डेक पृष्ठभाग व वियरिंग कोट स्थिती",
    unit: "Rating (0-9)",
    inputDescription: "Spalling, potholes, asphalt rutting, and delamination",
    getMeasurement: (b) => {
      if (b.tier === "Critical") return { value: "3 / 9 (Poor)", baseline: "7 / 9", status: "CRITICAL", deviation: "-57%" };
      if (b.tier === "Warning") return { value: "5 / 9 (Fair)", baseline: "7 / 9", status: "WARNING", deviation: "-28%" };
      if (b.tier === "Watch") return { value: "6 / 9 (Satisfactory)", baseline: "7 / 9", status: "WATCH", deviation: "-14%" };
      return { value: "8 / 9 (Sound)", baseline: "7 / 9", status: "NORMAL", deviation: "+14%" };
    },
  },
  {
    id: "S-02",
    group: "STRUCTURAL",
    name: "Superstructure Main Load-Bearing Girders",
    name_hi: "सुपरस्ट्रक्चर मुख्य लोड-बेयरिंग गर्डर",
    name_mr: "सुपरस्ट्रक्चर मुख्य लोड-बेअरिंग गर्डर",
    unit: "Rating (0-9)",
    inputDescription: "Truss member distortion, prestress sag, or steel buckling",
    getMeasurement: (b) => {
      if (b.tier === "Critical") return { value: "4 / 9 (Marginal)", baseline: "8 / 9", status: "CRITICAL", deviation: "-50%" };
      if (b.tier === "Warning") return { value: "6 / 9 (Fair)", baseline: "8 / 9", status: "WARNING", deviation: "-25%" };
      if (b.tier === "Watch") return { value: "7 / 9 (Good)", baseline: "8 / 9", status: "WATCH", deviation: "-12%" };
      return { value: "8 / 9 (Intact)", baseline: "8 / 9", status: "NORMAL", deviation: "0%" };
    },
  },
  {
    id: "S-03",
    group: "STRUCTURAL",
    name: "Substructure Piers, Caps & Abutments",
    name_hi: "सबस्ट्रक्चर पियर्स, कैप्स और एब्यूटमेंट्स",
    name_mr: "सबस्ट्रक्चर पियर्स, कॅप्स व अ‍ॅबटमेंट्स",
    unit: "Rating (0-9)",
    inputDescription: "Pier masonry mortar leaching, concrete shear cracking, tilting",
    getMeasurement: (b) => {
      if (b.tier === "Critical") return { value: "3 / 9 (Severe Scour)", baseline: "7 / 9", status: "CRITICAL", deviation: "-57%" };
      if (b.tier === "Warning") return { value: "5 / 9 (Fair)", baseline: "7 / 9", status: "WARNING", deviation: "-28%" };
      return { value: "8 / 9 (Sound)", baseline: "7 / 9", status: "NORMAL", deviation: "+14%" };
    },
  },
  {
    id: "S-04",
    group: "STRUCTURAL",
    name: "Bearings Condition & Lateral Displacement",
    name_hi: "बेयरिंग की स्थिति और पार्श्व विस्थापन",
    name_mr: "बेअरिंग स्थिती व बाजूचे विस्थापन",
    unit: "mm shift",
    inputDescription: "Elastomeric shear strain or pot bearing seizure",
    getMeasurement: (b) => {
      if (b.tier === "Critical") return { value: "18.5 mm displacement", baseline: "< 5.0 mm", status: "CRITICAL", deviation: "+270%" };
      if (b.tier === "Warning") return { value: "8.2 mm displacement", baseline: "< 5.0 mm", status: "WARNING", deviation: "+64%" };
      return { value: "2.1 mm displacement", baseline: "< 5.0 mm", status: "NORMAL", deviation: "-58%" };
    },
  },
  {
    id: "S-05",
    group: "STRUCTURAL",
    name: "Maximum Crack Width & Propagation Rate",
    name_hi: "अधिकतम दरार की चौड़ाई और प्रसार दर",
    name_mr: "कमाल तड्यांची रुंदी व वाढीचा दर",
    unit: "mm width",
    inputDescription: "Measured flexural and shear crack opening across main span",
    getMeasurement: (b) => {
      if (b.tier === "Critical") return { value: "0.48 mm (Structural)", baseline: "< 0.20 mm", status: "CRITICAL", deviation: "+140%" };
      if (b.tier === "Warning") return { value: "0.24 mm (Micro-cracks)", baseline: "< 0.20 mm", status: "WARNING", deviation: "+20%" };
      return { value: "0.08 mm (Hairline)", baseline: "< 0.20 mm", status: "NORMAL", deviation: "-60%" };
    },
  },
  {
    id: "S-06",
    group: "STRUCTURAL",
    name: "Corrosion & Rebar / Steel Section Loss",
    name_hi: "जंग और रीबार / स्टील सेक्शन लॉस",
    name_mr: "गंज व रीबार / स्टील क्रॉस-सेक्शन घट",
    unit: "% section loss",
    inputDescription: "Ultrasonic thickness measurement on steel lattice or flanges",
    getMeasurement: (b) => {
      if (b.tier === "Critical") return { value: "14.2% section loss", baseline: "< 3.0%", status: "CRITICAL", deviation: "+373%" };
      if (b.tier === "Warning") return { value: "6.8% section loss", baseline: "< 3.0%", status: "WARNING", deviation: "+126%" };
      return { value: "1.1% section loss", baseline: "< 3.0%", status: "NORMAL", deviation: "-63%" };
    },
  },
  {
    id: "S-07",
    group: "STRUCTURAL",
    name: "Expansion Joint Gap Alignment & Seal",
    name_hi: "विस्तार जोड़ अंतराल संरेखण और सील",
    name_mr: "विस्तार सांधा अंतर संरेखन व सील",
    unit: "mm gap deviation",
    inputDescription: "ToF sensor measurement of modular expansion joint gap",
    getMeasurement: (b) => {
      if (b.tier === "Critical") return { value: "+29.5% deviation", baseline: "± 5.0%", status: "WARNING", deviation: "+24.5%" };
      if (b.tier === "Warning") return { value: "+14.0% deviation", baseline: "± 5.0%", status: "WARNING", deviation: "+9.0%" };
      return { value: "+1.8% deviation", baseline: "± 5.0%", status: "NORMAL", deviation: "Within Tolerance" };
    },
  },

  // HYDRAULIC (H-01 to H-06)
  {
    id: "H-01",
    group: "HYDRAULIC",
    name: "Measured Scour Depth vs. Design Scour",
    name_hi: "मापा गया कटाव गहराई बनाम डिजाइन कटाव",
    name_mr: "मोजलेली स्कोअर खोली विरुद्ध डिझाइन स्कोअर",
    unit: "m depth",
    inputDescription: "Sonar bathymetry sounding around pier foundations",
    getMeasurement: (b) => {
      const designScour = b.design_scour_m || 8.0;
      if (b.tier === "Critical") return { value: `${(designScour * 1.15).toFixed(1)} m`, baseline: `< ${designScour.toFixed(1)} m`, status: "CRITICAL", deviation: "+15% Exceeded" };
      if (b.tier === "Warning") return { value: `${(designScour * 0.88).toFixed(1)} m`, baseline: `< ${designScour.toFixed(1)} m`, status: "WARNING", deviation: "88% of limit" };
      return { value: `${(designScour * 0.45).toFixed(1)} m`, baseline: `< ${designScour.toFixed(1)} m`, status: "NORMAL", deviation: "Safe Margins" };
    },
  },
  {
    id: "H-02",
    group: "HYDRAULIC",
    name: "Foundation Exposure Depth Below Riverbed",
    name_hi: "नदी तल के नीचे नींव अनावरण गहराई",
    name_mr: "नदीपात्राखाली पाया उघडा पडण्याची खोली",
    unit: "m exposed",
    inputDescription: "Loss of protective alluvial overburden above well cap",
    getMeasurement: (b) => {
      if (b.tier === "Critical") return { value: "2.8 m well exposed", baseline: "0.0 m (Buried)", status: "CRITICAL", deviation: "+2.8m" };
      if (b.tier === "Warning") return { value: "1.2 m exposed", baseline: "0.0 m (Buried)", status: "WARNING", deviation: "+1.2m" };
      return { value: "0.0 m (Fully Embedded)", baseline: "0.0 m", status: "NORMAL", deviation: "Stable" };
    },
  },
  {
    id: "H-03",
    group: "HYDRAULIC",
    name: "Scour Protection Riprap & Gabion Apron",
    name_hi: "कटाव संरक्षण रिपरैप और गैबियन एप्रन",
    name_mr: "स्कोअर संरक्षण रिपरॅप व गॅबियन अ‍ॅप्रन",
    unit: "Rating (1-5)",
    inputDescription: "Displacement and settlement of heavy armor boulder stones",
    getMeasurement: (b) => {
      if (b.tier === "Critical") return { value: "2 / 5 (Severe Washout)", baseline: "4 / 5", status: "CRITICAL", deviation: "-50%" };
      if (b.tier === "Warning") return { value: "3 / 5 (Partial Loss)", baseline: "4 / 5", status: "WARNING", deviation: "-25%" };
      return { value: "5 / 5 (Intact Apron)", baseline: "4 / 5", status: "NORMAL", deviation: "Sound" };
    },
  },
  {
    id: "H-04",
    group: "HYDRAULIC",
    name: "Debris Accumulation & River Choke",
    name_hi: "मलबा संचय और नदी रुकावट",
    name_mr: "कचरा साचणे व नदी अडथळा",
    unit: "Category",
    inputDescription: "Tree trunks and trash trapped across pier cutwaters",
    getMeasurement: (b) => {
      if (b.tier === "Critical") return { value: "High (35% waterway choked)", baseline: "None / Low", status: "WARNING", deviation: "Flow obstructed" };
      if (b.tier === "Warning") return { value: "Medium (Cutwater logs)", baseline: "None / Low", status: "WATCH", deviation: "Clearing advised" };
      return { value: "Low / None", baseline: "None / Low", status: "NORMAL", deviation: "Free channel" };
    },
  },
  {
    id: "H-05",
    group: "HYDRAULIC",
    name: "Water-Level Margin to Design High Flood Level (HFL)",
    name_hi: "डिजाइन उच्च बाढ़ स्तर (HFL) तक जल स्तर मार्जिन",
    name_mr: "डिझाइन उच्च पूर पातळी (HFL) पर्यंत पाण्याचा मार्जिन",
    unit: "m freeboard",
    inputDescription: "Continuous radar ultrasonic river stage clearance to deck soffit",
    getMeasurement: (b) => {
      if (b.tier === "Critical") return { value: "1.42 m freeboard", baseline: "> 2.50 m", status: "WARNING", deviation: "Monsoon Watch" };
      return { value: "4.82 m freeboard", baseline: "> 2.50 m", status: "NORMAL", deviation: "Safe Clearance" };
    },
  },
  {
    id: "H-06",
    group: "HYDRAULIC",
    name: "Channel Bed Level Change Since Last Audit",
    name_hi: "अंतिम ऑडिट के बाद से चैनल बेड स्तर में परिवर्तन",
    name_mr: "मागील तपासणीपासून नदीपात्र पातळीतील बदल",
    unit: "m shift",
    inputDescription: "General degradation or aggradation of river channel cross-section",
    getMeasurement: (b) => {
      if (b.tier === "Critical") return { value: "-1.85 m degradation", baseline: "± 0.50 m", status: "CRITICAL", deviation: "Bed lowered" };
      if (b.tier === "Warning") return { value: "-0.90 m degradation", baseline: "± 0.50 m", status: "WARNING", deviation: "Active erosion" };
      return { value: "+0.15 m stable", baseline: "± 0.50 m", status: "NORMAL", deviation: "Equilibrium" };
    },
  },

  // SEISMIC (E-01 to E-04)
  {
    id: "E-01",
    group: "SEISMIC",
    name: "Seat Width Adequacy Ratio (IS 1893:2016)",
    name_hi: "सीट चौड़ाई पर्याप्तता अनुपात",
    name_mr: "सीट रुंदी पर्याप्तता गुणोत्तर",
    unit: "Provided / Required",
    inputDescription: "Pier cap unseating prevention clearance under seismic shaking",
    getMeasurement: (b) => {
      if (b.tier === "Critical") return { value: "0.82 (Sub-standard)", baseline: "> 1.10", status: "CRITICAL", deviation: "-25% Deficit" };
      if (b.tier === "Warning") return { value: "1.02 (Borderline)", baseline: "> 1.10", status: "WATCH", deviation: "-7%" };
      return { value: "1.38 (Generous)", baseline: "> 1.10", status: "NORMAL", deviation: "Compliant" };
    },
  },
  {
    id: "E-02",
    group: "SEISMIC",
    name: "Permanent Pier Tilt & Verticality Deviation",
    name_hi: "स्थायी पियर झुकाव और लंबवत विचलन",
    name_mr: "कायमस्वरूपी पियर कलणे व लंबवत विचलन",
    unit: "mm/m or deg",
    inputDescription: "Biaxial MEMS inclinometer structural telemetry",
    getMeasurement: (b) => {
      if (b.tier === "Critical") return { value: "14.2 mm/m (0.81°)", baseline: "< 4.0 mm/m", status: "CRITICAL", deviation: "+255% Out-of-plumb" };
      if (b.tier === "Warning") return { value: "5.8 mm/m (0.33°)", baseline: "< 4.0 mm/m", status: "WARNING", deviation: "+45%" };
      return { value: "1.2 mm/m (0.07°)", baseline: "< 4.0 mm/m", status: "NORMAL", deviation: "Vertical" };
    },
  },
  {
    id: "E-03",
    group: "SEISMIC",
    name: "Subsoil Liquefaction Susceptibility",
    name_hi: "उपमृदा द्रवीकरण संवेदनशीलता",
    name_mr: "उप-माती द्रवीभवन संवेदनशीलता",
    unit: "Category",
    inputDescription: "Standard Penetration Test (SPT N-values) in sandy river alluvium",
    getMeasurement: (b) => {
      if (b.foundation_type.toLowerCase().includes("well") || b.river.includes("Godavari")) {
        return { value: "Medium (Saturated Silt/Sand)", baseline: "Low", status: "WATCH", deviation: "SPT N=18" };
      }
      return { value: "Low (Rock / Hard Strata)", baseline: "Low", status: "NORMAL", deviation: "SPT N>50" };
    },
  },
  {
    id: "E-04",
    group: "SEISMIC",
    name: "Bureau of Indian Standards Seismic Zone (IS 1893)",
    name_hi: "भारतीय मानक ब्यूरो भूकंपीय क्षेत्र",
    name_mr: "भारतीय मानक ब्युरो भूकंपीय क्षेत्र",
    unit: "Zone II - V",
    inputDescription: "Macro-seismic hazard mapping of bridge location",
    getMeasurement: (b) => {
      const z = b.seismic_zone || "Zone III";
      if (z === "Zone V") return { value: "Zone V (Severe)", baseline: "Design Accel 0.36g", status: "CRITICAL", deviation: "Maximum Hazard" };
      if (z === "Zone IV") return { value: "Zone IV (High)", baseline: "Design Accel 0.24g", status: "WARNING", deviation: "High Hazard" };
      return { value: `${z} (Moderate)`, baseline: "Design Accel 0.16g", status: "NORMAL", deviation: "Standard" };
    },
  },

  // LOAD & TRAFFIC (L-01 to L-03)
  {
    id: "L-01",
    group: "LOAD",
    name: "Average Daily Traffic Volume (ADT / PCU)",
    name_hi: "औसत दैनिक यातायात मात्रा (PCU)",
    name_mr: "सरासरी दैनिक वाहतूक प्रमाण (PCU)",
    unit: "PCU / day",
    inputDescription: "Total vehicular payload units crossing deck per 24 hours",
    getMeasurement: (b) => {
      const pcu = b.traffic_pcu_per_day || 25000;
      if (pcu > 50000) return { value: `${pcu.toLocaleString()} PCU/day`, baseline: "Cap 45,000", status: "WARNING", deviation: "Capacity Strain" };
      return { value: `${pcu.toLocaleString()} PCU/day`, baseline: "Cap 45,000", status: "NORMAL", deviation: "Within Capacity" };
    },
  },
  {
    id: "L-02",
    group: "LOAD",
    name: "Heavy Commercial Vehicle Share (%)",
    name_hi: "भारी वाणिज्यिक वाहन हिस्सा (%)",
    name_mr: "अवजड व्यावसायिक वाहनांचे प्रमाण (%)",
    unit: "% multi-axle",
    inputDescription: "Multi-axle trucks (IRC Class 70R) causing cyclic fatigue loading",
    getMeasurement: (b) => {
      if (b.district.includes("Thane") || b.category === "Rail-cum-Road") {
        return { value: "42.8% Multi-axle", baseline: "< 25.0%", status: "WARNING", deviation: "High Fatigue Impact" };
      }
      return { value: "18.4% Heavy Vehicles", baseline: "< 25.0%", status: "NORMAL", deviation: "Standard Freight" };
    },
  },
  {
    id: "L-03",
    group: "LOAD",
    name: "Overload Weight-In-Motion Incidents",
    name_hi: "ओवरलोड वज़न-इन-मोशन घटनाएं",
    name_mr: "ओव्हरलोड वजन-इन-मोशन घटना",
    unit: "Incidents / month",
    inputDescription: "WIM sensor detections exceeding axle weight limits",
    getMeasurement: (b) => {
      if (b.tier === "Critical" || b.tier === "Warning") {
        return { value: "148 incidents / mo", baseline: "< 20 / mo", status: "WARNING", deviation: "+640% Overloading" };
      }
      return { value: "12 incidents / mo", baseline: "< 20 / mo", status: "NORMAL", deviation: "Enforced" };
    },
  },

  // AGE, HISTORY & ENVIRONMENT (A-01 to A-06)
  {
    id: "A-01",
    group: "ENVIRONMENTAL",
    name: "Service Life Consumed vs. Design Life",
    name_hi: "सेवा आयु उपयोग बनाम डिजाइन आयु",
    name_mr: "वापरलेले सेवा आयुष्य विरुद्ध डिझाइन आयुष्य",
    unit: "% life used",
    inputDescription: "Operational chronological age divided by certified design life",
    getMeasurement: (b) => {
      const pct = Math.min(100, Math.round((b.age_years / b.design_life_y) * 100));
      if (pct >= 100) return { value: `${pct}% (${b.age_years} / ${b.design_life_y} y)`, baseline: "< 75%", status: "CRITICAL", deviation: "Design Life Expired" };
      if (pct >= 75) return { value: `${pct}% (${b.age_years} / ${b.design_life_y} y)`, baseline: "< 75%", status: "WARNING", deviation: "Senior Asset" };
      return { value: `${pct}% (${b.age_years} / ${b.design_life_y} y)`, baseline: "< 75%", status: "NORMAL", deviation: `${b.remaining_life_y} yrs left` };
    },
  },
  {
    id: "A-02",
    group: "ENVIRONMENTAL",
    name: "Days Elapsed Since Certified Structural Audit",
    name_hi: "प्रमाणित संरचनात्मक ऑडिट के बाद से बीते दिन",
    name_mr: "प्रमाणित स्ट्रक्चरल ऑडिटनंतर उलटलेले दिवस",
    unit: "Days",
    inputDescription: "Time gap since last physical underwater and ultrasonic inspection",
    getMeasurement: (b) => {
      if (b.tier === "Critical") return { value: "18 days ago", baseline: "Max 90 days", status: "NORMAL", deviation: "Under active audit" };
      return { value: "48 days ago", baseline: "Max 180 days", status: "NORMAL", deviation: "Up to Date" };
    },
  },
  {
    id: "A-03",
    group: "ENVIRONMENTAL",
    name: "Construction Quality Grade (As-Built Provenance)",
    name_hi: "निर्माण गुणवत्ता ग्रेड",
    name_mr: "बांधकाम गुणवत्ता श्रेणी",
    unit: "Grade A-D",
    inputDescription: "Historical contractor execution standards and materials certification",
    getMeasurement: (b) => {
      if (b.tier === "Critical" && b.age_years > 80) return { value: "Grade C (Heritage Hand-built)", baseline: "Grade A", status: "WATCH", deviation: "Lime Mortar" };
      return { value: "Grade A (Engineered PWD)", baseline: "Grade A", status: "NORMAL", deviation: "Compliant" };
    },
  },
  {
    id: "A-04",
    group: "ENVIRONMENTAL",
    name: "Open High-Priority Structural Defects",
    name_hi: "खुले उच्च-प्राथमिकता संरचनात्मक दोष",
    name_mr: "प्रलंबित उच्च-प्राधान्य स्ट्रक्चरल दोष",
    unit: "Count",
    inputDescription: "Unremedied critical triage defect tickets in registry",
    getMeasurement: (b) => {
      if (b.tier === "Critical") return { value: "3 Open Critical Defect(s)", baseline: "0 Open", status: "CRITICAL", deviation: "Action Required" };
      if (b.tier === "Warning") return { value: "1 Open Warning Defect(s)", baseline: "0 Open", status: "WARNING", deviation: "Review Pending" };
      return { value: "0 Open Defects", baseline: "0 Open", status: "NORMAL", deviation: "Clear" };
    },
  },
  {
    id: "A-05",
    group: "ENVIRONMENTAL",
    name: "Approach Embankment & Slope Stability",
    name_hi: "पहुंच तटबंध और ढलान स्थिरता",
    name_mr: "अ‍ॅप्रोच रस्ता व उतार स्थिरता",
    unit: "Category",
    inputDescription: "Slope landslide vulnerability or approach settlement",
    getMeasurement: (b) => {
      if (b.state.includes("Jammu") || b.district.includes("Ratnagiri")) {
        return { value: "Medium (Mountain Rain Slip)", baseline: "Low", status: "WATCH", deviation: "Retaining Wall Checked" };
      }
      return { value: "Low (Paved Embankment)", baseline: "Low", status: "NORMAL", deviation: "Stable" };
    },
  },
  {
    id: "A-06",
    group: "ENVIRONMENTAL",
    name: "Chloride, Salinity & Environmental Exposure",
    name_hi: "क्लोराइड, लवणता और पर्यावरणीय जोखिम",
    name_mr: "क्लोराईड, क्षारता व पर्यावरणीय धोका",
    unit: "Exposure Class",
    inputDescription: "Marine salt spray, chemical river effluents, or carbonation",
    getMeasurement: (b) => {
      if (b.category === "Sea Link" || b.district.includes("Thane") || b.district.includes("Mumbai") || b.district.includes("Ratnagiri")) {
        return { value: "Severe (Marine Tidal Saline)", baseline: "Moderate", status: "WARNING", deviation: "Cathodic protection active" };
      }
      return { value: "Moderate (Inland Riverbed)", baseline: "Moderate", status: "NORMAL", deviation: "Standard" };
    },
  },
];

const BASINS = [
  "All Basins",
  "Godavari",
  "Mula-Mutha",
  "Bhima",
  "Krishna",
  "Konkan",
  "Ganges/Hooghly",
  "Brahmaputra",
];

function ConditionPageContent() {
  const searchParams = useSearchParams();
  const { activeLocale } = useAppStore();

  const [selectedBridgeId, setSelectedBridgeId] = useState<string>("howrah-bridge");
  const [selectedBasin, setSelectedBasin] = useState<string>("All Basins");
  const [activeGroupTab, setActiveGroupTab] = useState<"ALL" | "STRUCTURAL" | "HYDRAULIC" | "SEISMIC" | "LOAD" | "ENVIRONMENTAL">("ALL");
  const [factorSearch, setFactorSearch] = useState<string>("");

  // Sync bridge selection with query parameters if present
  useEffect(() => {
    const bridgeParam = searchParams.get("bridge");
    if (bridgeParam) {
      const match = MASTER_BRIDGES_DATABASE.find(
        (b) => b.id.toLowerCase() === bridgeParam.toLowerCase() || b.code.toLowerCase() === bridgeParam.toLowerCase()
      );
      if (match) setSelectedBridgeId(match.id);
    }
  }, [searchParams]);

  // Active Bridge Object
  const activeBridge = useMemo(() => {
    return (
      MASTER_BRIDGES_DATABASE.find((b) => b.id === selectedBridgeId) ||
      MASTER_BRIDGES_DATABASE[0]
    );
  }, [selectedBridgeId]);

  // Bridges filtered by river basin
  const availableBridges = useMemo(() => {
    if (selectedBasin === "All Basins") return MASTER_BRIDGES_DATABASE;
    return MASTER_BRIDGES_DATABASE.filter(
      (b) => getBridgeBasin(b).toLowerCase() === selectedBasin.toLowerCase()
    );
  }, [selectedBasin]);

  // 26 Factors filtered by group and search query
  const filteredFactors = useMemo(() => {
    return CONDITION_FACTORS.filter((factor) => {
      if (activeGroupTab !== "ALL" && factor.group !== activeGroupTab) return false;
      if (factorSearch.trim() !== "") {
        const q = factorSearch.toLowerCase().trim();
        return (
          factor.id.toLowerCase().includes(q) ||
          factor.name.toLowerCase().includes(q) ||
          factor.name_hi.toLowerCase().includes(q) ||
          factor.name_mr.toLowerCase().includes(q) ||
          factor.inputDescription.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeGroupTab, factorSearch]);

  // Factor count breakdowns for active bridge
  const factorStatusCounts = useMemo(() => {
    let normal = 0;
    let watch = 0;
    let warning = 0;
    let critical = 0;

    CONDITION_FACTORS.forEach((f) => {
      const m = f.getMeasurement(activeBridge);
      if (m.status === "NORMAL") normal++;
      else if (m.status === "WATCH") watch++;
      else if (m.status === "WARNING") warning++;
      else if (m.status === "CRITICAL") critical++;
    });

    return { normal, watch, warning, critical };
  }, [activeBridge]);

  // Localized bridge name
  const localizedBridgeName = (b: BridgeAsset) => {
    if (activeLocale === "hi") return b.name_hi;
    if (activeLocale === "mr") return b.name_mr;
    return b.name;
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#0f172a] pb-16">
      {/* 1. Official Institutional Header */}
      <div className="bg-[#ffffff] text-slate-900 py-3.5 px-4 sm:px-6 lg:px-8 border-b border-slate-200 shadow-2xs">
        <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="font-bold uppercase tracking-wider text-slate-700">
                LEVEL 02 CONDITION ANALYSIS • THE 26-FACTOR STRUCTURAL &amp; HYDRAULIC MODEL
              </span>
              <span>•</span>
              <span>IRC:SP:35 • IS 1893:2016 COMPLIANT</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight">
              Bridge Condition &amp; Multi-Factor Structural Health Analysis
            </h1>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-xs">
            <div className="bg-[#f8fafc] px-3 py-1.5 rounded border border-slate-200">
              <span className="text-slate-400 block text-[9px] uppercase">Condition Health</span>
              <span className="font-bold text-sm text-emerald-700">
                {activeBridge.setu_score} / 100
              </span>
            </div>
            <div className="bg-[#f8fafc] px-3 py-1.5 rounded border border-slate-200">
              <span className="text-slate-400 block text-[9px] uppercase">Inspection Factors</span>
              <span className="font-bold text-sm text-slate-900">26 Criteria</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 mt-4 space-y-4">
        {/* 2. BRIDGE ASSET SELECTION & BASIN CONTROLS */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Bridge Selector Dropdown */}
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <span className="text-xs font-bold text-slate-700 uppercase font-mono shrink-0 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-sky-700" />
                <span>Select Asset:</span>
              </span>
              <select
                value={selectedBridgeId}
                onChange={(e) => {
                  setSelectedBridgeId(e.target.value);
                  triggerHaptic("selection");
                }}
                className="bg-[#f8fafc] border border-slate-300 rounded px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600 w-full max-w-xl"
              >
                {availableBridges.map((b) => (
                  <option key={b.id} value={b.id}>
                    [{b.code}] {b.name} — ({b.district}, {b.state}) • Grade: {b.tier}
                  </option>
                ))}
              </select>
            </div>

            {/* Direct Cockpit Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/defect-ar?bridge=${activeBridge.id}`}
                className="px-3 py-1.5 rounded text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Digital Twin
              </Link>
              <Link
                href={`/telemetry?bridge=${activeBridge.id}`}
                className="px-3 py-1.5 rounded text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                IoT Sensors
              </Link>
              <Link
                href={`/bridges/${activeBridge.id}`}
                className="px-3 py-1.5 rounded text-xs font-semibold bg-[#1e293b] text-white hover:bg-black transition-colors flex items-center gap-1"
              >
                <span>Full Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* River Basin Filter Bar */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-slate-500 font-mono text-[11px] shrink-0">
              River Basin:
            </span>
            <div className="flex items-center gap-1 flex-wrap">
              {BASINS.map((basin) => (
                <button
                  key={basin}
                  onClick={() => {
                    setSelectedBasin(basin);
                    triggerHaptic("selection");
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                    selectedBasin === basin
                      ? "bg-[#0284c7] text-white shadow-2xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {basin}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. PRIMARY CONDITION COCKPIT: 3 DIAGNOSTIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* CARD 1: SETU CONDITION SCORE & SUB-FACTORS */}
          <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Condition Health Rating
              </h3>
              <RiskTierBadge tier={activeBridge.tier} size="sm" />
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-mono text-slate-500 font-semibold">
                SETU CONDITION INDEX
              </span>
              <div className="font-extrabold font-mono text-2xl text-[#0f172a]">
                {activeBridge.setu_score}{" "}
                <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </div>
            </div>

            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  activeBridge.setu_score >= 80
                    ? "bg-emerald-700"
                    : activeBridge.setu_score >= 60
                    ? "bg-teal-600"
                    : activeBridge.setu_score >= 50
                    ? "bg-amber-500"
                    : "bg-rose-600"
                }`}
                style={{ width: `${activeBridge.setu_score}%` }}
              />
            </div>

            {/* 5 Sub-Factor Rating Bars */}
            <div className="space-y-1.5 text-[11px] font-mono pt-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-600 w-24">Structural</span>
                <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${Math.min(100, activeBridge.setu_score)}%` }}
                  />
                </div>
                <span className="w-6 text-right font-bold text-slate-800">{activeBridge.setu_score}</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-600 w-24">Hydraulic</span>
                <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full"
                    style={{ width: `${Math.max(30, activeBridge.setu_score - 8)}%` }}
                  />
                </div>
                <span className="w-6 text-right font-bold text-slate-800">
                  {Math.max(30, activeBridge.setu_score - 8)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-600 w-24">Seismic</span>
                <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-700 h-full rounded-full"
                    style={{ width: `${Math.min(95, activeBridge.setu_score + 9)}%` }}
                  />
                </div>
                <span className="w-6 text-right font-bold text-slate-800">
                  {Math.min(95, activeBridge.setu_score + 9)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-600 w-24">Traffic</span>
                <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${Math.max(40, activeBridge.setu_score - 14)}%` }}
                  />
                </div>
                <span className="w-6 text-right font-bold text-slate-800">
                  {Math.max(40, activeBridge.setu_score - 14)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-600 w-24">Environment</span>
                <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full"
                    style={{ width: `${Math.max(35, activeBridge.setu_score - 5)}%` }}
                  />
                </div>
                <span className="w-6 text-right font-bold text-slate-800">
                  {Math.max(35, activeBridge.setu_score - 5)}
                </span>
              </div>
            </div>
          </div>

          {/* CARD 2: SERVICE LIFE & PROVENANCE */}
          <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Service Life Consumption
              </h3>
              <span className="text-xs font-mono font-bold text-slate-600">
                Built {activeBridge.year_built}
              </span>
            </div>

            <div className="p-3 bg-[#f8fafc] rounded border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-slate-700">LIFESPAN EXHAUSTION</span>
                <span className="font-bold text-slate-900">
                  {Math.min(100, Math.round((activeBridge.age_years / activeBridge.design_life_y) * 100))}% (
                  {activeBridge.age_years} / {activeBridge.design_life_y} Yrs)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    activeBridge.age_years >= activeBridge.design_life_y
                      ? "bg-rose-600"
                      : activeBridge.age_years >= activeBridge.design_life_y * 0.75
                      ? "bg-amber-500"
                      : "bg-emerald-600"
                  }`}
                  style={{
                    width: `${Math.min(100, Math.round((activeBridge.age_years / activeBridge.design_life_y) * 100))}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Commissioned: {activeBridge.year_built}</span>
                <span>Remaining: {activeBridge.remaining_life_y} Years</span>
              </div>
            </div>

            <div className="space-y-1 text-[11px] font-mono text-slate-600">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-400">Total Length:</span>
                <span className="font-bold text-slate-900">{activeBridge.length_m} m ({activeBridge.spans} spans)</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-400">Superstructure:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[170px]">{activeBridge.category}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">Last Certified Audit:</span>
                <span className="font-bold text-slate-900">{activeBridge.last_inspection_date}</span>
              </div>
            </div>
          </div>

          {/* CARD 3: 26-FACTOR COMPLIANCE STATUS BREAKDOWN */}
          <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                26-Factor Audit Breakdown
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-700">
                {factorStatusCounts.normal} / 26 Normal
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center font-mono">
              <div className="bg-emerald-50 border border-emerald-200 p-2 rounded">
                <span className="text-[10px] text-emerald-700 block font-bold">NORMAL FACTORS</span>
                <span className="text-xl font-extrabold text-emerald-800">{factorStatusCounts.normal}</span>
              </div>
              <div className="bg-sky-50 border border-sky-200 p-2 rounded">
                <span className="text-[10px] text-sky-700 block font-bold">WATCH FACTORS</span>
                <span className="text-xl font-extrabold text-sky-800">{factorStatusCounts.watch}</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-2 rounded">
                <span className="text-[10px] text-amber-700 block font-bold">WARNING FACTORS</span>
                <span className="text-xl font-extrabold text-amber-800">{factorStatusCounts.warning}</span>
              </div>
              <div className="bg-rose-50 border border-rose-200 p-2 rounded">
                <span className="text-[10px] text-rose-700 block font-bold">CRITICAL DEFECTS</span>
                <span className="text-xl font-extrabold text-rose-800">{factorStatusCounts.critical}</span>
              </div>
            </div>

            <div className="pt-1 text-[11px] text-slate-500 font-mono flex items-center justify-between">
              <span>Telemetry Sensors:</span>
              <span className="font-bold text-slate-800">{activeBridge.active_sensors_count} Active Nodes</span>
            </div>
          </div>
        </div>

        {/* 4. THE 26-FACTOR DETAILED DIAGNOSTIC MATRIX */}
        <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden">
          {/* Matrix Header & Category Filter Tabs */}
          <div className="p-3.5 bg-[#f8fafc] border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-sky-700" />
                <span>The 26-Factor Inspection &amp; Degradation Matrix</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Dynamic risk inputs evaluated under IRC:SP:35 guidelines and IoT live telemetry
              </p>
            </div>

            {/* Factor Group Tabs */}
            <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded text-[11px] font-semibold flex-wrap">
              {(["ALL", "STRUCTURAL", "HYDRAULIC", "SEISMIC", "LOAD", "ENVIRONMENTAL"] as const).map((group) => (
                <button
                  key={group}
                  onClick={() => {
                    setActiveGroupTab(group);
                    triggerHaptic("selection");
                  }}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeGroupTab === group
                      ? "bg-white text-slate-900 shadow-2xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="p-2 px-3.5 bg-white border-b border-slate-100 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter factors by keyword (e.g. Scour, Crack width, Bearings, Tilt, ADT)..."
              value={factorSearch}
              onChange={(e) => setFactorSearch(e.target.value)}
              className="w-full text-xs bg-transparent focus:outline-none text-slate-800 placeholder-slate-400"
            />
            {factorSearch && (
              <button
                onClick={() => setFactorSearch("")}
                className="text-xs text-slate-400 hover:text-slate-700 px-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Factor Rows Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f1f5f9] text-slate-700 font-mono text-[11px] border-b border-slate-200">
                  <th className="py-2.5 px-3.5 font-bold">FACTOR ID</th>
                  <th className="py-2.5 px-3 font-bold">INSPECTION PARAMETER</th>
                  <th className="py-2.5 px-3 font-bold">DOMAIN</th>
                  <th className="py-2.5 px-3 font-bold">UNIT &amp; SCOPE</th>
                  <th className="py-2.5 px-3 font-bold">CURRENT MEASUREMENT</th>
                  <th className="py-2.5 px-3 font-bold">BASELINE THRESHOLD</th>
                  <th className="py-2.5 px-3 font-bold text-center">CONDITION STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredFactors.map((factor) => {
                  const measurement = factor.getMeasurement(activeBridge);
                  return (
                    <tr key={factor.id} className="hover:bg-slate-50 transition-colors">
                      {/* Factor ID */}
                      <td className="py-2.5 px-3.5 font-mono font-bold text-slate-900">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {factor.id}
                        </span>
                      </td>

                      {/* Factor Name & Description */}
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900 text-xs">{factor.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{factor.inputDescription}</div>
                      </td>

                      {/* Domain */}
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                          {factor.group}
                        </span>
                      </td>

                      {/* Unit */}
                      <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">
                        {factor.unit}
                      </td>

                      {/* Measurement */}
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {measurement.value}
                      </td>

                      {/* Baseline */}
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {measurement.baseline}
                      </td>

                      {/* Status Badge */}
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                            measurement.status === "NORMAL"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : measurement.status === "WATCH"
                              ? "bg-sky-50 text-sky-700 border-sky-200"
                              : measurement.status === "WARNING"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {measurement.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. ACTIONABLE DIRECTIVES & AUDIT RECOMMENDATIONS */}
        <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>Civil Maintenance &amp; Structural Directives</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
              Authority: PWD Bridge Inspection Directorate
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded border border-slate-200 bg-[#f8fafc] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Epoxy Injection for S-05 Cracks</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Execute low-viscosity epoxy resin pressure injection across Pier P-03 beam-slab junctions to seal flexural crack widths before monsoon moisture ingress.
              </p>
            </div>

            <div className="p-3 rounded border border-slate-200 bg-[#f8fafc] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>H-01 Scour Riprap Replenishment</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Deposit minimum 400 tonnes of Grade-A basalt armor boulders (80–120 kg per unit) around pier foundations to restore lost alluvial overburden.
              </p>
            </div>

            <div className="p-3 rounded border border-slate-200 bg-[#f8fafc] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Radio className="w-3.5 h-3.5 text-sky-600" />
                <span>Live Accelerometer Telemetry</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Maintain continuous 100 Hz triaxial accelerometer sampling on mid-span deck to capture modal frequency response shift under peak freight hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConditionPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-8 text-slate-500 font-mono text-xs">
          Loading 26-Factor Bridge Condition Analysis...
        </div>
      }
    >
      <ConditionPageContent />
    </React.Suspense>
  );
}

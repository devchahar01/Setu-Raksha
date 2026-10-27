"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import {
  Sparkles,
  Camera,
  Layers,
  Box,
  Compass,
  RotateCcw,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  Shield,
  Activity,
  Eye,
  Sliders,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Crosshair,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { triggerHaptic } from "@/lib/haptics";

interface CameraData {
  id: number;
  focal: number;
  center: [number, number, number];
  direction: [number, number, number];
}

interface DefectMatch {
  camera_id: number;
  match_score: number;
  inlier_ratio: number;
  reference_view: string;
}

interface DefectData {
  defect_id: string;
  defect_name: string;
  defect_type: string;
  structural_component: string;
  severity_score: number;
  svi_impact: number;
  position_3d: [number, number, number];
  bounding_box: {
    center: [number, number, number];
    min_coord: [number, number, number];
    max_coord: [number, number, number];
    dimensions: [number, number, number];
  };
  top_matches: DefectMatch[];
  total_keypoints: number;
  remediation_code: string;
  remediation_title: string;
  remediation_steps: string[];
  image_url: string;
  match_visualization_url?: string;
}

interface StructuralElement {
  id: string;
  name: string;
  category: "DECK" | "PIER" | "BEARING" | "JOINT" | "FOUNDATION" | "APPROACH";
  condition: "NORMAL" | "WATCH" | "WARNING" | "CRITICAL";
  lastInspection: string;
  tilt?: string;
  scourDepth?: string;
  defectsCount: number;
  defectKey?: string;
  measurements: string;
  trend: string;
  risk: string;
  remediationCode: string;
}

const STRUCTURAL_ELEMENTS: StructuralElement[] = [
  {
    id: "PIER-P03",
    name: "Pier P-03 (Central Waterway)",
    category: "PIER",
    condition: "CRITICAL",
    lastInspection: "09 Oct 2026",
    tilt: "0.38°",
    scourDepth: "2.40 m",
    defectsCount: 1,
    defectKey: "test2",
    measurements: "Scour: 2.40m • Core Loss: 14% • Tilt: 0.38°",
    trend: "Accelerating scour under monsoon surge",
    risk: "High Hydraulic Vulnerability",
    remediationCode: "IRC:SP:35 Cl 6.4",
  },
  {
    id: "PIER-P02",
    name: "Pier P-02 (Shaft Web)",
    category: "PIER",
    condition: "WATCH",
    lastInspection: "12 Oct 2026",
    tilt: "0.12°",
    scourDepth: "0.80 m",
    defectsCount: 1,
    defectKey: "test1",
    measurements: "Crack: 0.85mm • Shear Strain: 180 µε",
    trend: "Stable under Class 70R axle traffic",
    risk: "Moderate Shear Degradation",
    remediationCode: "IRC:SP:35 Cl 5.3",
  },
  {
    id: "ABUT-A01",
    name: "Abutment A-01 (Bearing Seat)",
    category: "BEARING",
    condition: "WATCH",
    lastInspection: "14 Oct 2026",
    tilt: "0.05°",
    defectsCount: 1,
    defectKey: "test3",
    measurements: "Transverse Displacement: 6.2mm",
    trend: "Slow creep under temperature cycling",
    risk: "Pedestal Spalling Risk",
    remediationCode: "IRC:83 Part II",
  },
  {
    id: "DECK-D01",
    name: "Deck Girder D-01 (Span 3 Midspan)",
    category: "DECK",
    condition: "NORMAL",
    lastInspection: "14 Oct 2026",
    tilt: "0.02°",
    defectsCount: 0,
    measurements: "Modal Freq: 2.14 Hz • Deflection: 1.2mm",
    trend: "Nominal harmonic response",
    risk: "Low Risk • Baseline Healthy",
    remediationCode: "Routine Seal Coat",
  },
  {
    id: "EXP-J02",
    name: "Expansion Joint J-02 (South Abutment)",
    category: "JOINT",
    condition: "WATCH",
    lastInspection: "14 Oct 2026",
    defectsCount: 0,
    measurements: "Gap: 42.6mm (Deviation +6.5%)",
    trend: "Elastomeric seal hardening",
    risk: "Water Ingress to Pier Cap",
    remediationCode: "IRC:SP:69",
  },
  {
    id: "PIER-P04",
    name: "Pier P-04 (Deep Well Foundation)",
    category: "FOUNDATION",
    condition: "WATCH",
    lastInspection: "09 Oct 2026",
    tilt: "0.21°",
    scourDepth: "1.80 m",
    defectsCount: 0,
    measurements: "Scour: 1.80m • Embedment: 14.8m",
    trend: "Minor bed degradation",
    risk: "Riprap replenishment required",
    remediationCode: "FHWA HEC-18",
  },
  {
    id: "APP-NORTH",
    name: "North Approach Embankment",
    category: "APPROACH",
    condition: "NORMAL",
    lastInspection: "14 Oct 2026",
    defectsCount: 0,
    measurements: "Settlement: 0.4mm • Weep Holes: Clear",
    trend: "Stable fill embankment",
    risk: "Nominal",
    remediationCode: "Routine Clearance",
  },
];

const SAMPLE_DEFECTS_DATA: Record<string, DefectData> = {
  test2: {
    defect_id: "DEF-CS543-02",
    defect_name: "Pier P-03 Waterline Spalling & Scour Void",
    defect_type: "concrete_spalling_and_scour",
    structural_component: "Pier P-03 (Substructure / Waterline)",
    severity_score: 88.5,
    svi_impact: 0.31,
    position_3d: [-0.452, -0.621, 0.849],
    bounding_box: {
      center: [-0.452, -0.621, 0.849],
      min_coord: [-0.952, -1.121, 0.349],
      max_coord: [0.048, -0.121, 1.349],
      dimensions: [1.0, 1.0, 1.0],
    },
    top_matches: [
      { camera_id: 0, match_score: 142, inlier_ratio: 0.82, reference_view: "/defects/Figure_0.png" },
      { camera_id: 1, match_score: 118, inlier_ratio: 0.76, reference_view: "/defects/Figure_1.png" },
      { camera_id: 2, match_score: 95, inlier_ratio: 0.71, reference_view: "/defects/Figure_2.png" },
      { camera_id: 3, match_score: 84, inlier_ratio: 0.68, reference_view: "/defects/Figure_3.png" },
      { camera_id: 4, match_score: 67, inlier_ratio: 0.64, reference_view: "/defects/Figure_4.png" },
    ],
    total_keypoints: 458,
    remediation_code: "IRC:SP:35 Cl 6.4",
    remediation_title: "Hydro-Demolition, Rebar Passivation & Micro-Concrete Encasing",
    remediation_steps: [
      "Chip unsound and carbonated concrete back to 25mm behind corroded reinforcing bars.",
      "Apply zinc-rich epoxy anti-corrosion primer to steel rebar network (IS 13620).",
      "Cast micro-concrete jacket with high-early strength non-shrink grout (Grade M50).",
      "Install geotextile and heavy wire-caged riprap boulders (FHWA HEC-18) around pier perimeter.",
    ],
    image_url: "/defects/test2.jpg",
    match_visualization_url: "/defects/matching_score_for_100_image.png",
  },
  test1: {
    defect_id: "DEF-CS543-01",
    defect_name: "Pier P-02 Concrete Shear Crack",
    defect_type: "diagonal_shear_crack",
    structural_component: "Pier P-02 (Shaft Web)",
    severity_score: 74.0,
    svi_impact: 0.22,
    position_3d: [1.845, -1.254, -0.923],
    bounding_box: {
      center: [1.845, -1.254, -0.923],
      min_coord: [1.345, -1.754, -1.423],
      max_coord: [2.345, -0.754, -0.423],
      dimensions: [1.0, 1.0, 1.0],
    },
    top_matches: [
      { camera_id: 7, match_score: 131, inlier_ratio: 0.79, reference_view: "/defects/Figure_0.png" },
      { camera_id: 10, match_score: 104, inlier_ratio: 0.74, reference_view: "/defects/Figure_1.png" },
      { camera_id: 15, match_score: 88, inlier_ratio: 0.69, reference_view: "/defects/Figure_2.png" },
      { camera_id: 22, match_score: 76, inlier_ratio: 0.65, reference_view: "/defects/Figure_3.png" },
      { camera_id: 31, match_score: 62, inlier_ratio: 0.61, reference_view: "/defects/Figure_4.png" },
    ],
    total_keypoints: 392,
    remediation_code: "IRC:SP:35 Cl 5.3",
    remediation_title: "Low-Viscosity Epoxy Resin Pressure Injection",
    remediation_steps: [
      "Seal crack surface with thixotropic epoxy paste and install injection ports at 150mm centers.",
      "Pressure inject ultra-low viscosity epoxy resin (ASTM C881 Type I/IV) until refusal.",
      "Apply two plies of unidirectional Carbon Fiber Reinforced Polymer (CFRP) wrap across shear zone.",
    ],
    image_url: "/defects/test1.jpg",
    match_visualization_url: "/defects/matching_score_for_100_image.png",
  },
  test3: {
    defect_id: "DEF-CS543-03",
    defect_name: "Abutment A-01 Bearing Displacement & Joint Spall",
    defect_type: "bearing_shear_strain",
    structural_component: "Abutment A-01 Bearing Seat",
    severity_score: 66.0,
    svi_impact: 0.17,
    position_3d: [-3.102, 0.451, -1.554],
    bounding_box: {
      center: [-3.102, 0.451, -1.554],
      min_coord: [-3.602, -0.049, -2.054],
      max_coord: [-2.602, 0.951, -1.054],
      dimensions: [1.0, 1.0, 1.0],
    },
    top_matches: [
      { camera_id: 12, match_score: 115, inlier_ratio: 0.77, reference_view: "/defects/Figure_0.png" },
      { camera_id: 18, match_score: 98, inlier_ratio: 0.72, reference_view: "/defects/Figure_1.png" },
      { camera_id: 25, match_score: 83, inlier_ratio: 0.67, reference_view: "/defects/Figure_2.png" },
      { camera_id: 34, match_score: 71, inlier_ratio: 0.63, reference_view: "/defects/Figure_3.png" },
      { camera_id: 41, match_score: 59, inlier_ratio: 0.58, reference_view: "/defects/Figure_4.png" },
    ],
    total_keypoints: 345,
    remediation_code: "IRC:83 Part II",
    remediation_title: "Synchronized Hydraulic Jacking & Bearing Replacement",
    remediation_steps: [
      "Position synchronized multi-point hydraulic jacks on temporary support stools.",
      "Lift bridge superstructure by 5mm with live traffic closure.",
      "Remove deteriorated chloroprene bearing pad and machine pedestal to true level.",
      "Install replacement elastomeric bearing pad complying with IRC:83 (Part II).",
    ],
    image_url: "/defects/test3.jpg",
    match_visualization_url: "/defects/matching_score_for_100_image.png",
  },
};

const I18N_PAGE = {
  en: {
    badge: "GOVERNMENT OF MAHARASHTRA • STRUCTURAL DEFECT DIGITAL TWIN",
    title: "Structural Defect Digital Twin & 3D Localizer",
    subtitle:
      "Photogrammetric point-cloud twin and multi-view defect triangulation under IRC:SP:35 standards.",
    elementsTitle: "Structural Elements Roster",
    elementsSub: "Select a component to inspect telemetry, condition, and defects",
    pointCount: "19,447 Points Loaded",
    camCount: "100 Cameras Calibrated",
    viewPresetDefault: "Orbit View",
    viewPresetDefect: "Fly to Element",
    viewPresetTop: "Plan View",
    viewPresetSide: "Elevation",
    toggleCameras: "Toggle Cameras",
    toggleRotate: "Auto Rotate",
    resetView: "Reset Camera",
    siftTitle: "SIFT / FLANN Reference Keypoint Matches",
    siftSub: "Top calibrated camera angles matched against field photogrammetry",
    telemetryTitle: "Component Spatial Diagnostics",
    coords: "3D Coordinates [X, Y, Z]",
    severity: "Structural Severity",
    sviImpact: "SVI Risk Delta",
    component: "Target Structural Element",
    remediationTitle: "Prescriptive Civil Engineering Remediation",
    logAuditBtn: "Record Defect to 26-Factor Audit Ledger",
    auditLoggedMsg: "Defect entry logged to Setu Rakshak 26-Factor Audit Ledger!",
    arModeBtn: "Launch AR Viewfinder",
    exitAr: "Exit AR Viewfinder",
    arTargetLocked: "TARGET DEFECT ACQUIRED",
    arBearing: "AZIMUTH 042° • ELEV 14°",
    arDistance: "DISTANCE: 4.82m",
    statutoryNotice:
      "Statutory Notice: Setu Rakshak Digital Twin is an engineering decision-support tool. Physical NDT remains mandatory.",
  },
  hi: {
    badge: "महाराष्ट्र शासन • संरचनात्मक दोष डिजिटल ट्विन",
    title: "संरचनात्मक दोष डिजिटल ट्विन एवं 3D स्थानीयकरण",
    subtitle:
      "IRC:SP:35 मानकों के तहत फोटोग्रामेट्रिक पॉइंट-क्लाउड ट्विन और मल्टी-व्यू दोष त्रिकोणीय गणना।",
    elementsTitle: "संरचनात्मक घटक सूची",
    elementsSub: "टेलीमेट्री, स्थिति एवं दोष निरीक्षण के लिए घटक चुनें",
    pointCount: "१९,४४७ पॉइंट्स लोड",
    camCount: "१०० कैमरे अंशांकित",
    viewPresetDefault: "ऑर्बिट दृश्य",
    viewPresetDefect: "घटक पर ज़ूम",
    viewPresetTop: "शीर्ष योजना",
    viewPresetSide: "पार्श्व दृश्य",
    toggleCameras: "कैमरे टॉगल",
    toggleRotate: "स्वचालित घूर्णन",
    resetView: "कैमरा रीसेट",
    siftTitle: "SIFT / FLANN संदर्भ मिलान हिस्टोग्राम",
    siftSub: "फील्ड फोटोग्रामेट्री के विरुद्ध शीर्ष अंशांकित कैमरा कोण",
    telemetryTitle: "घटक स्थानिक टेलीमेट्री",
    coords: "3D निर्देशांक [X, Y, Z]",
    severity: "संरचनात्मक गंभीरता",
    sviImpact: "SVI जोखिम प्रभाव",
    component: "लक्षित संरचनात्मक घटक",
    remediationTitle: "मानक सिविल इंजीनियरिंग उपचार",
    logAuditBtn: "२६-घटक ऑडिट लेजर में दर्ज करें",
    auditLoggedMsg: "सेतु रक्षक मासिक ऑडिट लेजर में दोष सफलतापूर्वक दर्ज!",
    arModeBtn: "एआर व्यूफ़ाइंडर चालू करें",
    exitAr: "एआर व्यूफ़ाइंडर बंद करें",
    arTargetLocked: "दोष लक्ष्य लॉक हुआ",
    arBearing: "दिगंश ०४२° • उन्नयन १४°",
    arDistance: "दूरी: ४.८२ मीटर",
    statutoryNotice:
      "वैधानिक सूचना: सेतु रक्षक डिजिटल ट्विन निर्णय-सहायता प्रणाली है। प्रमाणित भौतिक निरीक्षण अनिवार्य है।",
  },
  mr: {
    badge: "महाराष्ट्र शासन • संरचनात्मक दोष डिजिटल ट्विन",
    title: "संरचनात्मक दोष डिजिटल ट्विन व 3D स्थाननिश्चिती",
    subtitle:
      "IRC:SP:35 मानकांनुसार फोटोग्रामेट्रिक पॉइंट-क्लाउड ट्विन आणि मल्टी-व्ह्यू ट्रायँग्युलेशन.",
    elementsTitle: "संरचनात्मक घटक यादी",
    elementsSub: "टेलीमेट्री, स्थिती व दोष तपासण्यासाठी घटक निवडा",
    pointCount: "१९,४४७ पॉइंट्स लोड",
    camCount: "१०० कॅमेरे कॅलिब्रेट",
    viewPresetDefault: "ऑर्बिट दृश्य",
    viewPresetDefect: "घटकावर थेट दृश्य",
    viewPresetTop: "वरचा प्लॅन",
    viewPresetSide: "बाजूचे दृश्य",
    toggleCameras: "कॅमेरे टॉगल",
    toggleRotate: "ऑटो फिरवा",
    resetView: "कॅमेरा पूर्ववत",
    siftTitle: "SIFT / FLANN संदर्भ मॅच हिस्टोग्राम",
    siftSub: "फोटोग्रामेट्रीद्वारे पडताळलेले शीर्ष कॅमेरा कोन",
    telemetryTitle: "घटक भूमितिक टेलीमेट्री",
    coords: "3D निर्देशांक [X, Y, Z]",
    severity: "संरचनात्मक तीव्रता",
    sviImpact: "SVI जोखीम वाढ",
    component: "लक्षित पूल घटक",
    remediationTitle: "स्थापत्य अभियांत्रिकी उपाययोजना",
    logAuditBtn: "२६-घटक तपासणी लेजरमध्ये नोंदवा",
    auditLoggedMsg: "सेतू रक्षक तपासणी लेजरमध्ये दोषाची नोंद यशस्वी!",
    arModeBtn: "एआर व्ह्यूफाइंडर उघडा",
    exitAr: "एआर व्ह्यूफाइंडर बंद करा",
    arTargetLocked: "दोष स्थान लॉक झाले",
    arBearing: "दिशा ०४२° • कोन १४°",
    arDistance: "अंतर: ४.८२ मी",
    statutoryNotice:
      "वैधानिक सूचना: सेतू रक्षक डिजिटल ट्विन हे निर्णय-साहाय्य साधन आहे. प्रत्यक्ष स्थापत्य तपासणी बंधनकारक आहे.",
  },
};

export default function DefectARPage() {
  const { activeLocale } = useAppStore();
  const t = I18N_PAGE[activeLocale] || I18N_PAGE.en;

  const [selectedElementId, setSelectedElementId] = useState<string>("PIER-P03");
  const [activeDefectKey, setActiveDefectKey] = useState<string>("test2");
  const [activeDefect, setActiveDefect] = useState<DefectData>(SAMPLE_DEFECTS_DATA.test2);
  const [showCameras, setShowCameras] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [arMode, setArMode] = useState<boolean>(false);
  const [auditLogged, setAuditLogged] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pointsMeshRef = useRef<THREE.Points | null>(null);
  const cameraGroupRef = useRef<THREE.Group | null>(null);
  const defectBoxRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number>(0);

  // Mouse interaction state for smooth orbit
  const isDraggingRef = useRef<boolean>(false);
  const prevMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const sphericalRef = useRef<{ radius: number; theta: number; phi: number }>({
    radius: 12.0,
    theta: Math.PI / 4,
    phi: Math.PI / 3,
  });
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  const selectedElement = useMemo(
    () => STRUCTURAL_ELEMENTS.find((el) => el.id === selectedElementId) || STRUCTURAL_ELEMENTS[0],
    [selectedElementId]
  );

  // Initialize Three.js Scene
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight || 560;

    // 1. Scene with clean engineering slate background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    sceneRef.current = scene;

    // Subtle grid on ground
    const grid = new THREE.GridHelper(24, 24, 0x334155, 0x1e293b);
    grid.position.y = -3.5;
    scene.add(grid);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    // 5. Defect Target Group
    const defectGroup = new THREE.Group();
    scene.add(defectGroup);
    defectBoxRef.current = defectGroup;

    // 6. Camera Frustums Group
    const camGroup = new THREE.Group();
    scene.add(camGroup);
    cameraGroupRef.current = camGroup;

    // 7. Load bundle.rd Point Cloud
    fetch("/defects/bundle_summary.json")
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch bundle summary");
        return res.json();
      })
      .then((data) => {
        const points = data.points || [];
        const count = points.length;
        if (count === 0) return;

        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
          const p = points[i];
          positions[i * 3 + 0] = p.x;
          positions[i * 3 + 1] = p.y;
          positions[i * 3 + 2] = p.z;

          colors[i * 3 + 0] = p.r / 255;
          colors[i * 3 + 1] = p.g / 255;
          colors[i * 3 + 2] = p.b / 255;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
          size: 0.055,
          vertexColors: true,
          transparent: true,
          opacity: 0.9,
        });

        const pointsMesh = new THREE.Points(geometry, material);
        scene.add(pointsMesh);
        pointsMeshRef.current = pointsMesh;
      })
      .catch((err) => {
        console.warn("Generating synthetic point cloud fallback for bridge twin:", err);
        const count = 12000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
          const u = (Math.random() - 0.5) * 14;
          const v = (Math.random() - 0.5) * 3;
          const w = (Math.random() - 0.5) * 4;

          positions[i * 3 + 0] = u;
          positions[i * 3 + 1] = v;
          positions[i * 3 + 2] = w;

          colors[i * 3 + 0] = 0.55 + Math.random() * 0.2;
          colors[i * 3 + 1] = 0.58 + Math.random() * 0.2;
          colors[i * 3 + 2] = 0.62 + Math.random() * 0.2;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
          size: 0.06,
          vertexColors: true,
          transparent: true,
          opacity: 0.85,
        });
        const pointsMesh = new THREE.Points(geometry, material);
        scene.add(pointsMesh);
        pointsMeshRef.current = pointsMesh;
      });

    // 8. Load Cameras JSON
    fetch("/defects/cameras_v2.json")
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch cameras json");
        return res.json();
      })
      .then((cams: CameraData[]) => {
        cams.forEach((c) => {
          const camHelper = new THREE.ConeGeometry(0.12, 0.35, 4);
          camHelper.rotateX(Math.PI / 2);
          const camMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            wireframe: true,
            transparent: true,
            opacity: 0.45,
          });
          const mesh = new THREE.Mesh(camHelper, camMat);
          mesh.position.set(...c.center);
          mesh.lookAt(c.center[0] + c.direction[0], c.center[1] + c.direction[1], c.center[2] + c.direction[2]);
          camGroup.add(mesh);
        });
      })
      .catch(() => {
        // Fallback synthetic ring of cameras
        for (let i = 0; i < 30; i++) {
          const angle = (i / 30) * Math.PI * 2;
          const cx = Math.cos(angle) * 7.5;
          const cz = Math.sin(angle) * 7.5;
          const cy = 2.0;

          const camHelper = new THREE.ConeGeometry(0.12, 0.35, 4);
          camHelper.rotateX(Math.PI / 2);
          const camMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            wireframe: true,
            transparent: true,
            opacity: 0.4,
          });
          const mesh = new THREE.Mesh(camHelper, camMat);
          mesh.position.set(cx, cy, cz);
          mesh.lookAt(0, 0, 0);
          camGroup.add(mesh);
        }
      });

    // Interaction Listeners
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      sphericalRef.current.theta -= dx * 0.008;
      sphericalRef.current.phi = Math.max(0.05, Math.min(Math.PI - 0.05, sphericalRef.current.phi - dy * 0.008));
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      sphericalRef.current.radius = Math.max(2.5, Math.min(28.0, sphericalRef.current.radius + e.deltaY * 0.015));
    };

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 560;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    mount.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    mount.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (autoRotate && !isDraggingRef.current) {
        sphericalRef.current.theta += delta * 0.25;
      }

      // Convert Spherical to Cartesian
      const { radius, theta, phi } = sphericalRef.current;
      const x = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.cos(theta);

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetLookAtRef.current.x + x, 0.08);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetLookAtRef.current.y + y, 0.08);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetLookAtRef.current.z + z, 0.08);

      camera.lookAt(targetLookAtRef.current);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      mount.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      mount.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [autoRotate]);

  // Update Defect 3D Box when activeDefect changes
  useEffect(() => {
    const defectGroup = defectBoxRef.current;
    if (!defectGroup) return;

    while (defectGroup.children.length > 0) {
      defectGroup.remove(defectGroup.children[0]);
    }

    const [px, py, pz] = activeDefect.position_3d;

    // 1. Red Wireframe Defect Cube
    const boxGeom = new THREE.BoxGeometry(1.0, 1.0, 1.0);
    const boxMat = new THREE.MeshBasicMaterial({
      color: 0xd97706,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });
    const boxMesh = new THREE.Mesh(boxGeom, boxMat);
    boxMesh.position.set(px, py, pz);
    defectGroup.add(boxMesh);

    // 2. Translucent Inner Danger Core
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xd97706,
      transparent: true,
      opacity: 0.2,
    });
    const coreMesh = new THREE.Mesh(boxGeom, coreMat);
    coreMesh.scale.set(0.95, 0.95, 0.95);
    coreMesh.position.set(px, py, pz);
    defectGroup.add(coreMesh);

    // 3. Center Point Beacon
    const beaconGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const beaconMesh = new THREE.Mesh(beaconGeom, beaconMat);
    beaconMesh.position.set(px, py, pz);
    defectGroup.add(beaconMesh);

    // 4. Vertical Anchor Line down to ground
    const points = [new THREE.Vector3(px, py, pz), new THREE.Vector3(px, -3.5, pz)];
    const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineDashedMaterial({
      color: 0xd97706,
      dashSize: 0.2,
      gapSize: 0.1,
    });
    const line = new THREE.Line(lineGeom, lineMat);
    line.computeLineDistances();
    defectGroup.add(line);
  }, [activeDefect]);

  // Camera Frustums Visibility
  useEffect(() => {
    if (cameraGroupRef.current) {
      cameraGroupRef.current.visible = showCameras;
    }
  }, [showCameras]);

  // View Preset Handler
  const handleViewPreset = (preset: "default" | "defect" | "top" | "side") => {
    triggerHaptic("selection");
    if (preset === "default") {
      targetLookAtRef.current.set(0, 0, 0);
      sphericalRef.current = { radius: 12.0, theta: Math.PI / 4, phi: Math.PI / 3 };
    } else if (preset === "defect") {
      const [px, py, pz] = activeDefect.position_3d;
      targetLookAtRef.current.set(px, py, pz);
      sphericalRef.current = { radius: 4.5, theta: Math.PI / 3, phi: Math.PI / 2.6 };
    } else if (preset === "top") {
      targetLookAtRef.current.set(0, 0, 0);
      sphericalRef.current = { radius: 14.0, theta: 0, phi: 0.05 };
    } else if (preset === "side") {
      targetLookAtRef.current.set(0, 0, 0);
      sphericalRef.current = { radius: 13.0, theta: Math.PI / 2, phi: Math.PI / 2 };
    }
  };

  // Switch Selected Structural Element
  const handleSelectElement = (elem: StructuralElement) => {
    triggerHaptic("selection");
    setSelectedElementId(elem.id);
    setAuditLogged(false);

    if (elem.defectKey && SAMPLE_DEFECTS_DATA[elem.defectKey]) {
      setActiveDefectKey(elem.defectKey);
      setActiveDefect(SAMPLE_DEFECTS_DATA[elem.defectKey]);
      const [px, py, pz] = SAMPLE_DEFECTS_DATA[elem.defectKey].position_3d;
      targetLookAtRef.current.set(px, py, pz);
      sphericalRef.current = { radius: 5.0, theta: Math.PI / 3, phi: Math.PI / 2.6 };
    } else {
      // Focus on representative position
      targetLookAtRef.current.set(0, 0, 0);
      sphericalRef.current = { radius: 9.0, theta: Math.PI / 4, phi: Math.PI / 3 };
    }
  };

  // Custom Image Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    triggerHaptic("medium");
    setUploadedFileName(file.name);

    const objectUrl = URL.createObjectURL(file);
    const customDefect: DefectData = {
      defect_id: `DEF-UPL-${Date.now().toString().slice(-4)}`,
      defect_name: `Field Inspection: ${file.name.slice(0, 20)}`,
      defect_type: "visual_surface_anomaly",
      structural_component: "Selected Structural Element",
      severity_score: 72.5,
      svi_impact: 0.2,
      position_3d: [0.25, -0.4, 0.15],
      bounding_box: {
        center: [0.25, -0.4, 0.15],
        min_coord: [-0.25, -0.9, -0.35],
        max_coord: [0.75, 0.1, 0.65],
        dimensions: [1.0, 1.0, 1.0],
      },
      top_matches: [
        { camera_id: 4, match_score: 108, inlier_ratio: 0.74, reference_view: "/defects/Figure_0.png" },
        { camera_id: 11, match_score: 87, inlier_ratio: 0.69, reference_view: "/defects/Figure_1.png" },
        { camera_id: 19, match_score: 75, inlier_ratio: 0.64, reference_view: "/defects/Figure_2.png" },
      ],
      total_keypoints: 380,
      remediation_code: "IRC:SP:35 Cl 5.1",
      remediation_title: "Non-Destructive Testing (NDT) & Micro-Crack Sealing",
      remediation_steps: [
        "Perform Ultrasonic Pulse Velocity (UPV) test (IS 516 Part 5) across suspect zone.",
        "Clean surface using grit blasting to remove laitance and contamination.",
        "Apply low-viscosity penetrative epoxy sealer or carbon-fiber composite wrap.",
      ],
      image_url: objectUrl,
      match_visualization_url: "/defects/matching_score_for_100_image.png",
    };

    setActiveDefectKey("custom");
    setActiveDefect(customDefect);
    setAuditLogged(false);
  };

  // Log Defect to 26-Factor Audit
  const handleLogToAudit = () => {
    triggerHaptic("success");
    setAuditLogged(true);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-900 flex flex-col">
      {/* Top Government Engineering Strip & Header */}
      <section className="bg-white border-b border-slate-300 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-slate-600 mb-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              <span>{t.badge}</span>
              <span className="text-slate-400">•</span>
              <span>IRC:SP:35 DIGITAL TWIN FRAMEWORK</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.title}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => {
                setArMode(!arMode);
                triggerHaptic("medium");
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-bold transition-all border ${
                arMode
                  ? "bg-rose-700 hover:bg-rose-800 text-white border-rose-800"
                  : "bg-slate-900 hover:bg-slate-800 text-white border-slate-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{arMode ? t.exitAr : t.arModeBtn}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Structural Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Structural Elements Roster Column (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-white rounded-lg border border-slate-300 p-4">
            <div className="mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-700" />
                <span>{t.elementsTitle}</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">{t.elementsSub}</p>
            </div>

            <div className="space-y-1.5">
              {STRUCTURAL_ELEMENTS.map((elem) => {
                const isSelected = elem.id === selectedElementId;
                const statusColor =
                  elem.condition === "CRITICAL"
                    ? "bg-rose-100 text-rose-800 border-rose-300"
                    : elem.condition === "WARNING"
                    ? "bg-amber-100 text-amber-800 border-amber-300"
                    : elem.condition === "WATCH"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200";

                return (
                  <button
                    key={elem.id}
                    onClick={() => handleSelectElement(elem)}
                    className={`w-full text-left p-2.5 rounded-md text-xs transition-all border ${
                      isSelected
                        ? "bg-slate-100 border-slate-800 text-slate-900 font-bold"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold">{elem.id}</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-bold ${statusColor}`}
                      >
                        {elem.condition}
                      </span>
                    </div>
                    <div className="text-[11px] mt-1 truncate">{elem.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Inspected: {elem.lastInspection}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Field Photo Upload */}
            <label className="w-full mt-3 cursor-pointer border border-dashed border-slate-300 hover:border-slate-500 bg-slate-50 hover:bg-slate-100 p-2.5 rounded-md flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 transition-colors">
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span className="truncate">{uploadedFileName || "Upload Field Photo"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Selected Element Engineering Card */}
          <div className="bg-white rounded-lg border border-slate-300 p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500 block mb-2">
              ELEMENT SPECIFICATION
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Element ID:</span>
                <span className="font-mono font-bold text-slate-900">{selectedElement.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-800">{selectedElement.category}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Condition Grade:</span>
                <span
                  className={`font-mono font-bold ${
                    selectedElement.condition === "CRITICAL"
                      ? "text-rose-600"
                      : selectedElement.condition === "WATCH"
                      ? "text-amber-600"
                      : "text-teal-700"
                  }`}
                >
                  {selectedElement.condition}
                </span>
              </div>
              {selectedElement.tilt && (
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Substructure Tilt:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedElement.tilt}</span>
                </div>
              )}
              {selectedElement.scourDepth && (
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Scour Depth:</span>
                  <span className="font-mono font-bold text-rose-700">{selectedElement.scourDepth}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Last Inspection:</span>
                <span className="font-mono text-slate-700">{selectedElement.lastInspection}</span>
              </div>
              <div className="pt-1">
                <span className="text-[11px] text-slate-500 block">Telemetry Measurements:</span>
                <span className="font-mono text-[11px] font-bold text-slate-800">
                  {selectedElement.measurements}
                </span>
              </div>
              <div className="pt-1">
                <span className="text-[11px] text-slate-500 block">Behavioral Trend:</span>
                <span className="text-[11px] text-slate-700">{selectedElement.trend}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Viewport Column (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="relative w-full h-[520px] bg-slate-950 rounded-lg border border-slate-300 overflow-hidden shadow-xs">
            {/* Three.js Canvas Container */}
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* Overlaid Engineering Crosshair HUD Elements */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
              <div className="bg-slate-900/90 border border-slate-700 px-2.5 py-1 rounded text-[11px] font-mono text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                <span>{t.pointCount}</span>
                <span className="text-slate-500">•</span>
                <span>{t.camCount}</span>
              </div>

              {/* Active Element Badge */}
              <div className="bg-slate-900/95 border border-slate-700 px-2.5 py-1 rounded text-[11px] font-mono text-slate-200 flex items-center gap-2">
                <Crosshair className="w-3 h-3 text-amber-400" />
                <span className="font-bold text-amber-400">{selectedElement.id}</span>
                <span className="text-slate-500">•</span>
                <span>{selectedElement.name}</span>
              </div>
            </div>

            {/* Top Right Position Readout */}
            <div className="absolute top-3 right-3 z-10">
              <div className="bg-slate-900/90 border border-slate-700 px-2.5 py-1 rounded text-[10px] font-mono text-slate-300">
                POS: [{activeDefect.position_3d.map((v) => v.toFixed(2)).join(", ")}]m
              </div>
            </div>

            {/* View Presets & Controls Bar */}
            <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 bg-slate-900/95 border border-slate-800 p-2 rounded text-xs font-medium">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleViewPreset("default")}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
                >
                  {t.viewPresetDefault}
                </button>
                <button
                  onClick={() => handleViewPreset("defect")}
                  className="px-2.5 py-1 rounded bg-amber-700 hover:bg-amber-600 text-white font-bold text-[11px] flex items-center gap-1"
                >
                  <Crosshair className="w-3 h-3" />
                  {t.viewPresetDefect}
                </button>
                <button
                  onClick={() => handleViewPreset("top")}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
                >
                  {t.viewPresetTop}
                </button>
                <button
                  onClick={() => handleViewPreset("side")}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
                >
                  {t.viewPresetSide}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowCameras(!showCameras)}
                  className={`px-2 py-1 rounded border text-[11px] flex items-center gap-1 ${
                    showCameras
                      ? "bg-slate-800 border-teal-500 text-teal-400"
                      : "bg-slate-900 border-slate-700 text-slate-400"
                  }`}
                >
                  <Camera className="w-3 h-3" />
                  <span>{t.toggleCameras}</span>
                </button>
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`px-2 py-1 rounded border text-[11px] flex items-center gap-1 ${
                    autoRotate
                      ? "bg-slate-800 border-amber-500 text-amber-400"
                      : "bg-slate-900 border-slate-700 text-slate-400"
                  }`}
                >
                  {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{t.toggleRotate}</span>
                </button>
                <button
                  onClick={() => handleViewPreset("default")}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title={t.resetView}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Simulated AR Viewfinder Overlay */}
            {arMode && (
              <div className="absolute inset-0 z-20 pointer-events-none bg-teal-950/20 flex flex-col justify-between p-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-teal-300">
                  <div className="flex items-center gap-2 bg-slate-950/95 px-2.5 py-1 rounded border border-teal-500/50">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
                    <span className="font-bold">{t.arTargetLocked}</span>
                  </div>
                  <div className="bg-slate-950/95 px-2.5 py-1 rounded border border-slate-700">
                    {t.arBearing} • {t.arDistance}
                  </div>
                </div>

                {/* Center AR Crosshair Reticle */}
                <div className="self-center flex flex-col items-center">
                  <div className="w-32 h-32 border border-dashed border-amber-400 rounded-lg flex items-center justify-center animate-pulse relative">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span className="absolute -top-3 px-1.5 py-0.5 bg-amber-600 text-[9px] text-white font-mono font-bold rounded">
                      {selectedElement.id}
                    </span>
                  </div>
                  <div className="mt-2 px-2.5 py-0.5 bg-slate-950/95 border border-slate-700 rounded text-[11px] font-mono text-slate-300">
                    SEVERITY: {activeDefect.severity_score}/100 • SVI: +{activeDefect.svi_impact}
                  </div>
                </div>

                <div className="text-center text-[10px] font-mono text-slate-300 bg-slate-950/90 p-1.5 rounded border border-slate-800">
                  PHOTOGRAMMETRIC MULTI-VIEW AR PROJECTION ACTIVE
                </div>
              </div>
            )}
          </div>

          {/* SIFT Keypoint Matches Card */}
          <div className="bg-white rounded-lg border border-slate-300 p-4">
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-700" />
                  <span>{t.siftTitle}</span>
                </h3>
                <p className="text-[11px] text-slate-500">{t.siftSub}</p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                5 Reference Angles
              </span>
            </div>

            {/* Histogram Bars */}
            <div className="space-y-1.5 mt-3">
              {activeDefect.top_matches.map((match, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs font-mono">
                  <span className="w-20 text-slate-500 text-[11px]">Camera #{match.camera_id}</span>
                  <div className="flex-1 bg-slate-100 rounded h-2.5 overflow-hidden border border-slate-200">
                    <div
                      className={`h-full transition-all duration-500 ${
                        idx === 0 ? "bg-amber-600" : "bg-teal-700"
                      }`}
                      style={{ width: `${Math.min(100, (match.match_score / 150) * 100)}%` }}
                    />
                  </div>
                  <span className="w-16 font-bold text-slate-800 text-right text-[11px]">
                    {match.match_score} pts
                  </span>
                  <span className="w-16 text-slate-400 text-right text-[10px]">
                    ({Math.round(match.inlier_ratio * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Field Evidence & Remediation Column (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Field Evidence Photo Card */}
          <div className="bg-white rounded-lg border border-slate-300 p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500 block mb-2">
              FIELD PHOTOGRAMMETRIC EVIDENCE
            </span>
            <div className="relative rounded border border-slate-200 h-36 bg-slate-100 flex items-center justify-center overflow-hidden">
              <img
                src={activeDefect.image_url}
                alt={activeDefect.defect_name}
                className="max-h-full max-w-full object-contain"
              />
              <div className="absolute bottom-1.5 left-1.5 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] font-mono text-teal-300">
                {activeDefect.total_keypoints} SIFT Points
              </div>
            </div>

            <div className="mt-3 space-y-1.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">{t.severity}:</span>
                <span className="font-mono font-bold text-amber-700">
                  {activeDefect.severity_score} / 100
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">{t.sviImpact}:</span>
                <span className="font-mono font-bold text-slate-800">
                  +{activeDefect.svi_impact} SVI
                </span>
              </div>
            </div>
          </div>

          {/* Prescriptive Remediation & 26-Factor Audit Ledger */}
          <div className="bg-white rounded-lg border border-slate-300 p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-teal-700" />
                  <span>{t.remediationTitle}</span>
                </h3>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {activeDefect.remediation_code}
                </span>
              </div>

              <div className="text-xs font-bold text-slate-900 mb-2">
                {activeDefect.remediation_title}
              </div>

              <ul className="space-y-1.5 text-[11px] text-slate-600 mb-4 list-disc pl-4 leading-relaxed">
                {activeDefect.remediation_steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-200">
              {auditLogged ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium text-[11px]">{t.auditLoggedMsg}</span>
                </div>
              ) : (
                <button
                  onClick={handleLogToAudit}
                  className="w-full py-2 px-3 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>{t.logAuditBtn}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Statutory Advisory Banner */}
      <footer className="bg-white border-t border-slate-300 px-4 sm:px-6 lg:px-8 py-2.5 text-center text-xs text-slate-500 font-mono">
        {t.statutoryNotice} • source=simulated
      </footer>
    </div>
  );
}

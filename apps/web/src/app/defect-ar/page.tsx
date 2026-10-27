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
  Maximize2,
  Minimize2,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  Shield,
  Activity,
  Zap,
  Eye,
  Info,
  Sliders,
  Play,
  Pause,
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

const SAMPLE_DEFECTS_DATA: Record<string, DefectData> = {
  test2: {
    defect_id: "DEF-CS543-02",
    defect_name: "Pier P3 Waterline Spalling & Scour Void",
    defect_type: "concrete_spalling_and_scour",
    structural_component: "Pier P3 (Substructure / Waterline)",
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
    defect_name: "Pier P2 Concrete Shear Crack",
    defect_type: "diagonal_shear_crack",
    structural_component: "Pier P2 (Shaft Web)",
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
      { camera_id: 31, match_score: 62, jealousy_ratio: 0.61, reference_view: "/defects/Figure_4.png" } as any,
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
    defect_name: "Abutment A1 Bearing Displacement & Joint Spall",
    defect_type: "bearing_shear_strain",
    structural_component: "Abutment A1 Bearing Seat",
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
    badge: "CS543 PHOTOGRAMMETRY & MULTI-VIEW AR TWIN",
    title: "Bridge Defect AR & 3D Twin Localization",
    subtitle:
      "Image-based defect pinpointing with SIFT keypoint matching, multi-view triangulation, and interactive Augmented Reality overlay on real bridge point clouds.",
    tabTest2: "Test 2: Pier 3 Spall (Benchmark)",
    tabTest1: "Test 1: Pier 2 Shear Crack",
    tabTest3: "Test 3: Abutment Bearing",
    tabCustom: "Upload Inspection Photo",
    cameraPoseTitle: "Calibrated Camera Trajectories",
    pointCloudTitle: "Bridge 3D Photogrammetric Twin",
    pointCount: "19,447 Points Loaded",
    camCount: "100 Cameras Calibrated",
    viewPresetDefault: "Orbit View",
    viewPresetDefect: "Fly to Defect",
    viewPresetTop: "Plan View",
    viewPresetSide: "Elevation",
    toggleCameras: "Toggle Cameras",
    toggleRotate: "Auto Rotate",
    resetView: "Reset Camera",
    siftTitle: "SIFT / FLANN Multi-View Match Histogram",
    siftSub: "Lowe's ratio test (0.7) match scores across 100 photogrammetry reference camera angles",
    telemetryTitle: "3D Defect Spatial Telemetry",
    coords: "3D Coordinate [X, Y, Z]",
    bounds: "Bounding Cube [dx, dy, dz]",
    severity: "Structural Severity",
    sviImpact: "SVI Risk Delta",
    component: "Impacted Element",
    remediationTitle: "Prescriptive Civil Engineering Remediation",
    logAuditBtn: "Log Defect to 26-Factor Audit",
    auditLoggedMsg: "Defect logged successfully to Setu Rakshak 26-Factor Monthly Audit!",
    arModeBtn: "Launch AR HUD Viewfinder",
    exitAr: "Exit AR Viewfinder",
    arTargetLocked: "TARGET DEFECT ACQUIRED",
    arBearing: "AZIMUTH 042° • ELEV 14°",
    arDistance: "DISTANCE: 4.82m",
    statutoryNotice:
      "Statutory Advisory: Setu Rakshak AR Defect Localization is an engineering decision-support tool. Certified inspection and physical NDT remain mandatory.",
  },
  hi: {
    badge: "CS543 फोटोग्रामेट्री एवं मल्टी-व्यू एआर ट्विन",
    title: "पुल दोष एआर एवं 3D डिजिटल ट्विन स्थानीयकरण",
    subtitle:
      "SIFT की-पॉइंट मिलान, मल्टी-व्यू त्रिकोणीय गणना और वास्तविक पुल पॉइंट क्लाउड पर ऑगमेंटेड रियलिटी ओवरले के माध्यम से दोष की 3D स्थिति का सटीक निर्धारण।",
    tabTest2: "परीक्षण २: पिलर ३ कंक्रीट स्पॉल",
    tabTest1: "परीक्षण १: पिलर २ कतरनी दरार",
    tabTest3: "परीक्षण ३: एबटमेंट बेयरिंग",
    tabCustom: "निरीक्षण फोटो अपलोड करें",
    cameraPoseTitle: "अंशांकित कैमरा पथ",
    pointCloudTitle: "पुल 3D फोटोग्रामेट्रिक ट्विन",
    pointCount: "१९,४४७ पॉइंट्स लोड",
    camCount: "१०० कैमरे अंशांकित",
    viewPresetDefault: "ऑर्बिट दृश्य",
    viewPresetDefect: "दोष पर ज़ूम",
    viewPresetTop: "शीर्ष योजना",
    viewPresetSide: "पार्श्व दृश्य",
    toggleCameras: "कैमरे टॉगल करें",
    toggleRotate: "स्वचालित घूर्णन",
    resetView: "कैमरा रीसेट",
    siftTitle: "SIFT / FLANN मल्टी-व्यू मिलान हिस्टोग्राम",
    siftSub: "१०० संदर्भ कैमरा कोणों पर लोवे अनुपात परीक्षण (०.७) मिलान स्कोर",
    telemetryTitle: "3D दोष स्थानिक टेलीमेट्री",
    coords: "3D निर्देशांक [X, Y, Z]",
    bounds: "बाउंडिंग क्यूब [dx, dy, dz]",
    severity: "संरचनात्मक गंभीरता",
    sviImpact: "SVI जोखिम प्रभाव",
    component: "प्रभावित संरचनात्मक घटक",
    remediationTitle: "मानक सिविल इंजीनियरिंग उपचार",
    logAuditBtn: "२६-घटक ऑडिट में दोष दर्ज करें",
    auditLoggedMsg: "सेतु रक्षक मासिक ऑडिट में दोष सफलतापूर्वक दर्ज किया गया!",
    arModeBtn: "एआर व्यूफ़ाइंडर चालू करें",
    exitAr: "एआर व्यूफ़ाइंडर बंद करें",
    arTargetLocked: "दोष लक्ष्य लॉक हुआ",
    arBearing: "दिगंश ०४२° • उन्नयन १४°",
    arDistance: "दूरी: ४.८२ मीटर",
    statutoryNotice:
      "वैधानिक सूचना: सेतु रक्षक एआर दोष स्थानीयकरण निर्णय-सहायता प्रणाली है। प्रमाणित निरीक्षण अनिवार्य है।",
  },
  mr: {
    badge: "CS543 फोटोग्रामेट्री व मल्टी-व्ह्यू एआर ट्विन",
    title: "पूल दोष एआर व 3D डिजिटल ट्विन स्थाननिश्चिती",
    subtitle:
      "SIFT की-पॉइंट मॅचिंग, मल्टी-व्ह्यू ट्रायँग्युलेशन आणि प्रत्यक्ष 3D पॉइंट क्लाउडवर संवर्धित वास्तव (AR) द्वारे दोषाचे अचूक 3D स्थान निर्धारण.",
    tabTest2: "चाचणी २: खांब ३ काँक्रीट स्पॉल",
    tabTest1: "चाचणी १: खांब २ तडा",
    tabTest3: "चाचणी ३: ॲबटमेंट बेअरिंग",
    tabCustom: "तपासणी फोटो अपलोड करा",
    cameraPoseTitle: "कॅमेरा ट्रॅजेक्टरी",
    pointCloudTitle: "पूल 3D फोटोग्रामेट्रिक ट्विन",
    pointCount: "१९,४४७ पॉइंट्स लोड",
    camCount: "१०० कॅमेरे कॅलिब्रेट",
    viewPresetDefault: "ऑर्बिट दृश्य",
    viewPresetDefect: "दोषावर थेट दृश्य",
    viewPresetTop: "वरचा प्लॅन",
    viewPresetSide: "बाजूचे दृश्य",
    toggleCameras: "कॅमेरे टॉगल",
    toggleRotate: "ऑटो फिरवा",
    resetView: "कॅमेरा पूर्ववत",
    siftTitle: "SIFT / FLANN मल्टी-व्ह्यू मॅच हिस्टोग्राम",
    siftSub: "१०० कॅमेरा कोनांमधील लोवे रेशिओ (०.७) गुणसंख्या",
    telemetryTitle: "3D दोष भौमितिक टेलीमेट्री",
    coords: "3D निर्देशांक [X, Y, Z]",
    bounds: "बाउंडिंग क्यूब आकार",
    severity: "संरचनात्मक तीव्रता",
    sviImpact: "SVI जोखीम वाढ",
    component: "प्रभावित पूल भाग",
    remediationTitle: "स्थापत्य अभियांत्रिकी उपाययोजना",
    logAuditBtn: "२६-घटक तपासणीत नोंदवा",
    auditLoggedMsg: "सेतू रक्षक मासिक तपासणीमध्ये दोषाची नोंद यशस्वी!",
    arModeBtn: "एआर व्ह्यूफाइंडर उघडा",
    exitAr: "एआर व्ह्यूफाइंडर बंद करा",
    arTargetLocked: "दोष स्थान लॉक झाले",
    arBearing: "दिशा ०४२° • कोन १४°",
    arDistance: "अंतर: ४.८२ मी",
    statutoryNotice:
      "वैधानिक सूचना: सेतू रक्षक एआर दोष स्थाननिश्चिती हे निर्णय-साहाय्य साधन आहे. प्रत्यक्ष स्थापत्य तपासणी बंधनकारक आहे.",
  },
};

export default function DefectARPage() {
  const { activeLocale } = useAppStore();
  const t = I18N_PAGE[activeLocale] || I18N_PAGE.en;

  const [activeDefectKey, setActiveDefectKey] = useState<string>("test2");
  const [activeDefect, setActiveDefect] = useState<DefectData>(SAMPLE_DEFECTS_DATA.test2);
  const [showCameras, setShowCameras] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [arMode, setArMode] = useState<boolean>(false);
  const [auditLogged, setAuditLogged] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  // Initialize Three.js scene
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight || 560;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.025);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Ambient and Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    dirLight.position.set(20, 30, 20);
    scene.add(dirLight);

    const redLight = new THREE.PointLight(0xef4444, 2.5, 15);
    redLight.position.set(0, 0, 0);
    scene.add(redLight);

    // Ground Grid
    const grid = new THREE.GridHelper(30, 30, 0x1e293b, 0x0f172a);
    grid.position.y = -3.5;
    scene.add(grid);

    // Group for Cameras
    const cameraGroup = new THREE.Group();
    scene.add(cameraGroup);
    cameraGroupRef.current = cameraGroup;

    // Group for Defect Box & Markers
    const defectGroup = new THREE.Group();
    scene.add(defectGroup);
    defectBoxRef.current = defectGroup;

    // Load Point Cloud JSON
    fetch("/data/bridge_pointcloud.json")
      .then((res) => res.json())
      .then((data) => {
        const positions = new Float32Array(data.positions);
        const colors = new Float32Array(data.colors);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
          size: 0.07,
          vertexColors: true,
          transparent: true,
          opacity: 0.95,
        });

        const pointsMesh = new THREE.Points(geometry, material);
        scene.add(pointsMesh);
        pointsMeshRef.current = pointsMesh;

        // Populate camera frustums
        if (data.cameras && data.cameras.length > 0) {
          const camGeom = new THREE.ConeGeometry(0.18, 0.45, 4);
          camGeom.rotateX(Math.PI / 2);
          const camMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            wireframe: true,
            transparent: true,
            opacity: 0.65,
          });

          data.cameras.forEach((c: CameraData) => {
            const cone = new THREE.Mesh(camGeom, camMat);
            cone.position.set(c.center[0], c.center[1], c.center[2]);
            const targetPos = new THREE.Vector3(
              c.center[0] + c.direction[0],
              c.center[1] + c.direction[1],
              c.center[2] + c.direction[2]
            );
            cone.lookAt(targetPos);
            cameraGroup.add(cone);
          });
        }
      })
      .catch((err) => console.error("Error loading bridge pointcloud:", err));

    // Mouse Controls
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
      sphericalRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI - 0.1, sphericalRef.current.phi - dy * 0.008)
      );
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      sphericalRef.current.radius = Math.max(
        3.0,
        Math.min(30.0, sphericalRef.current.radius + e.deltaY * 0.015)
      );
    };

    mount.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    mount.addEventListener("wheel", handleWheel, { passive: false });

    // Render loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (autoRotate) {
        sphericalRef.current.theta += 0.003;
      }

      const { radius, theta, phi } = sphericalRef.current;
      const x = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.cos(theta);

      const target = targetLookAtRef.current;
      camera.position.set(target.x + x, target.y + y, target.z + z);
      camera.lookAt(target);

      // Pulse defect marker
      if (defectGroup) {
        const time = Date.now() * 0.003;
        const ring = defectGroup.getObjectByName("pulseRing");
        if (ring) {
          const s = 1.0 + Math.sin(time) * 0.15;
          ring.scale.set(s, s, s);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mount || !renderer || !camera) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

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

    // Clear existing children
    while (defectGroup.children.length > 0) {
      defectGroup.remove(defectGroup.children[0]);
    }

    const [px, py, pz] = activeDefect.position_3d;

    // 1. Red Wireframe Defect Cube
    const boxGeom = new THREE.BoxGeometry(1.0, 1.0, 1.0);
    const boxMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });
    const boxMesh = new THREE.Mesh(boxGeom, boxMat);
    boxMesh.position.set(px, py, pz);
    defectGroup.add(boxMesh);

    // 2. Translucent Inner Danger Core
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.25,
    });
    const coreMesh = new THREE.Mesh(boxGeom, coreMat);
    coreMesh.scale.set(0.95, 0.95, 0.95);
    coreMesh.position.set(px, py, pz);
    defectGroup.add(coreMesh);

    // 3. Pulsing Targeting Ring
    const ringGeom = new THREE.RingGeometry(0.7, 0.85, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.name = "pulseRing";
    ringMesh.position.set(px, py, pz);
    ringMesh.lookAt(px + 1, py + 1, pz + 1);
    defectGroup.add(ringMesh);

    // 4. Center Point Beacon
    const beaconGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const beaconMesh = new THREE.Mesh(beaconGeom, beaconMat);
    beaconMesh.position.set(px, py, pz);
    defectGroup.add(beaconMesh);

    // 5. Vertical Anchor Line down to ground
    const points = [new THREE.Vector3(px, py, pz), new THREE.Vector3(px, -3.5, pz)];
    const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineDashedMaterial({
      color: 0xef4444,
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

  // Switch Sample Defect
  const handleSelectDefect = (key: string) => {
    triggerHaptic("selection");
    setActiveDefectKey(key);
    if (SAMPLE_DEFECTS_DATA[key]) {
      setActiveDefect(SAMPLE_DEFECTS_DATA[key]);
      setAuditLogged(false);
    }
  };

  // Custom Image Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    triggerHaptic("medium");
    setUploadedFileName(file.name);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const res = await fetch("/api/v1/defect-localization/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_base64: base64Data,
            bridge_id: "MH-BR-01",
          }),
        });
        if (res.ok) {
          const result: DefectData = await res.json();
          setActiveDefect(result);
          setActiveDefectKey("custom");
          setAuditLogged(false);
          triggerHaptic("success");
        }
      } catch (err) {
        console.error("Analysis error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Log Defect to Audit
  const handleLogToAudit = async () => {
    try {
      const res = await fetch("/api/v1/defect-localization/log-to-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          defect_id: activeDefect.defect_id,
          bridge_id: "MH-BR-01",
          assigned_factor: "F04_PIER_CRACKING",
          notes: `Logged from AR 3D Twin. Component: ${activeDefect.structural_component}. Severity: ${activeDefect.severity_score}`,
        }),
      });
      if (res.ok) {
        setAuditLogged(true);
        triggerHaptic("success");
      }
    } catch (err) {
      console.error("Audit logging error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Breadcrumb & Hero Banner */}
      <section className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              {t.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl mt-1 leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setArMode(!arMode);
                triggerHaptic("medium");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${
                arMode
                  ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50"
                  : "bg-sky-600 hover:bg-sky-500 text-white shadow-sky-900/50"
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{arMode ? t.exitAr : t.arModeBtn}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Workspace Layout: 3D Viewport on Left, Inspection Controls on Right */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Viewport Column (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative w-full h-[560px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            {/* Three.js Canvas Container */}
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* Overlaid HUD Elements */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{t.pointCount}</span>
                <span className="text-slate-600">•</span>
                <span>{t.camCount}</span>
              </div>

              {/* Active Defect Tag Badge */}
              <div className="bg-rose-950/80 backdrop-blur-md border border-rose-500/40 px-3 py-1.5 rounded-lg text-xs font-mono text-rose-300 flex items-center gap-2 shadow-lg">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-bold">{activeDefect.defect_id}</span>
                <span className="text-rose-400">•</span>
                <span>{activeDefect.structural_component}</span>
              </div>
            </div>

            {/* View Presets & Controls Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 bg-slate-900/85 backdrop-blur-md border border-slate-800/80 p-2.5 rounded-xl text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleViewPreset("default")}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  {t.viewPresetDefault}
                </button>
                <button
                  onClick={() => handleViewPreset("defect")}
                  className="px-3 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-500 text-white font-bold transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  {t.viewPresetDefect}
                </button>
                <button
                  onClick={() => handleViewPreset("top")}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  {t.viewPresetTop}
                </button>
                <button
                  onClick={() => handleViewPreset("side")}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  {t.viewPresetSide}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCameras(!showCameras)}
                  className={`px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
                    showCameras
                      ? "bg-sky-950/80 border-sky-600/60 text-sky-400"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{t.toggleCameras}</span>
                </button>
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
                    autoRotate
                      ? "bg-amber-950/80 border-amber-600/60 text-amber-400"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  }`}
                >
                  {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{t.toggleRotate}</span>
                </button>
                <button
                  onClick={() => handleViewPreset("default")}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title={t.resetView}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulated AR Viewfinder Overlay */}
            {arMode && (
              <div className="absolute inset-0 z-20 pointer-events-none bg-sky-950/20 backdrop-contrast-125 flex flex-col justify-between p-6">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                  <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-emerald-500/40">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="font-bold">{t.arTargetLocked}</span>
                  </div>
                  <div className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-700">
                    {t.arBearing} • {t.arDistance}
                  </div>
                </div>

                {/* Center AR Crosshair Reticle */}
                <div className="self-center flex flex-col items-center">
                  <div className="w-40 h-40 border-2 border-dashed border-rose-500/80 rounded-2xl flex items-center justify-center animate-pulse relative">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    <span className="absolute -top-3 px-2 bg-rose-600 text-[10px] text-white font-mono font-bold rounded">
                      {activeDefect.defect_id}
                    </span>
                  </div>
                  <div className="mt-3 px-3 py-1 bg-slate-950/90 border border-slate-700 rounded-lg text-xs font-mono text-slate-300">
                    SEVERITY: {activeDefect.severity_score}/100 • SVI: +{activeDefect.svi_impact}
                  </div>
                </div>

                <div className="text-center text-xs font-mono text-slate-400 bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                  PHOTOGRAMMETRIC DEFECT LOCALIZATION ACTIVE • LIVE AR PROJECTION
                </div>
              </div>
            )}
          </div>

          {/* SIFT Matching Score Histogram Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-400" />
                  {t.siftTitle}
                </h3>
                <p className="text-xs text-slate-400">{t.siftSub}</p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                Top 5 Reference Views
              </span>
            </div>

            {/* Visual Histogram Bars */}
            <div className="space-y-2 mt-4">
              {activeDefect.top_matches.map((match, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs font-mono">
                  <span className="w-20 text-slate-400">Camera #{match.camera_id}</span>
                  <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        idx === 0
                          ? "bg-rose-500"
                          : idx === 1
                          ? "bg-amber-500"
                          : "bg-sky-500"
                      }`}
                      style={{ width: `${Math.min(100, (match.match_score / 150) * 100)}%` }}
                    />
                  </div>
                  <span className="w-16 font-bold text-slate-200 text-right">
                    {match.match_score} pts
                  </span>
                  <span className="w-20 text-slate-500 text-right">
                    ({Math.round(match.inlier_ratio * 100)}% inliers)
                  </span>
                </div>
              ))}
            </div>

            {/* 2D Keypoint Matching Visualization Preview */}
            <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1.5">
                  Inspection Image (Field Photograph)
                </span>
                <div className="relative rounded-xl overflow-hidden border border-slate-700 h-40 bg-slate-950 flex items-center justify-center">
                  <img
                    src={activeDefect.image_url}
                    alt={activeDefect.defect_name}
                    className="max-h-full max-w-full object-contain"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                    {activeDefect.total_keypoints} SIFT Keypoints
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1.5">
                  Top-1 Reference View Keypoint Correspondences
                </span>
                <div className="relative rounded-xl overflow-hidden border border-slate-700 h-40 bg-slate-950 flex items-center justify-center">
                  <img
                    src={activeDefect.top_matches[0]?.reference_view || "/defects/Figure_0.png"}
                    alt="2D Match Correspondence"
                    className="max-h-full max-w-full object-contain"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] font-mono text-amber-400 border border-amber-500/30">
                    FLANN Matched (0.7 Ratio)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inspection & Remediation Column (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Defect Sample Selector */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              Defect Datasets (CS543 Reference)
            </span>
            <div className="space-y-1.5">
              <button
                onClick={() => handleSelectDefect("test2")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  activeDefectKey === "test2"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm"
                    : "bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-transparent"
                }`}
              >
                <span>{t.tabTest2}</span>
                <span className="font-mono text-[10px] bg-rose-950 px-1.5 py-0.5 rounded text-rose-400 border border-rose-800 font-bold">
                  88.5 Sev
                </span>
              </button>

              <button
                onClick={() => handleSelectDefect("test1")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  activeDefectKey === "test1"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm"
                    : "bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-transparent"
                }`}
              >
                <span>{t.tabTest1}</span>
                <span className="font-mono text-[10px] bg-amber-950 px-1.5 py-0.5 rounded text-amber-400 border border-amber-800 font-bold">
                  74.0 Sev
                </span>
              </button>

              <button
                onClick={() => handleSelectDefect("test3")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  activeDefectKey === "test3"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm"
                    : "bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-transparent"
                }`}
              >
                <span>{t.tabTest3}</span>
                <span className="font-mono text-[10px] bg-sky-950 px-1.5 py-0.5 rounded text-sky-400 border border-sky-800 font-bold">
                  66.0 Sev
                </span>
              </button>

              {/* Upload Field Inspection Photo */}
              <label className="w-full mt-2 cursor-pointer border border-dashed border-slate-700 hover:border-sky-500 bg-slate-950/60 hover:bg-slate-900 px-3.5 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-medium text-slate-400 hover:text-sky-300 transition-colors">
                <Upload className="w-4 h-4 text-sky-400" />
                <span>{uploadedFileName || t.tabCustom}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Defect Diagnostics Telemetry Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3.5">
              <Compass className="w-4 h-4 text-rose-400" />
              {t.telemetryTitle}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono">
                <span className="text-slate-500 block text-[11px] mb-1">{t.coords}</span>
                <span className="text-sky-400 font-bold text-sm">
                  X: {activeDefect.position_3d[0].toFixed(3)}m • Y:{" "}
                  {activeDefect.position_3d[1].toFixed(3)}m • Z:{" "}
                  {activeDefect.position_3d[2].toFixed(3)}m
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[11px]">{t.severity}</span>
                  <span className="text-rose-400 font-bold text-base">
                    {activeDefect.severity_score} / 100
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[11px]">{t.sviImpact}</span>
                  <span className="text-amber-400 font-bold text-base font-mono">
                    +{activeDefect.svi_impact} SVI
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[11px]">{t.component}</span>
                <span className="text-slate-200 font-semibold">
                  {activeDefect.structural_component}
                </span>
              </div>
            </div>
          </div>

          {/* Prescriptive Remediation & 26-Factor Audit Integration */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  {t.remediationTitle}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {activeDefect.remediation_code}
                </span>
              </div>

              <div className="text-xs font-semibold text-slate-200 mb-2">
                {activeDefect.remediation_title}
              </div>

              <ul className="space-y-1.5 text-xs text-slate-400 mb-4 list-disc pl-4">
                {activeDefect.remediation_steps.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button: Log to 26-Factor Audit */}
            <div className="pt-3 border-t border-slate-800">
              {auditLogged ? (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.auditLoggedMsg}</span>
                </div>
              ) : (
                <button
                  onClick={handleLogToAudit}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{t.logAuditBtn}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Statutory Advisory Banner */}
      <footer className="bg-slate-900/90 border-t border-slate-800 px-4 sm:px-6 lg:px-8 py-3 text-center text-xs text-slate-500 font-mono">
        {t.statutoryNotice} • source=simulated
      </footer>
    </div>
  );
}

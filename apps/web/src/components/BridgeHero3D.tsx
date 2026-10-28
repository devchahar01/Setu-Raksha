"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  ArrowDown,
  Radio,
  Sparkles,
  Shield,
  Sun,
  Sunset,
  Moon,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { triggerHaptic } from "@/lib/haptics";

interface CitizenEthos {
  role: string;
  roleLocal: string;
  tagline: string;
}

const CITIZEN_CALLOUTS: Record<"en" | "hi" | "mr", CitizenEthos[]> = {
  en: [
    {
      role: "FARMERS",
      roleLocal: "अन्नदाता (Farmers)",
      tagline: "Connecting agrarian harvest corridors across fertile river basins to national markets.",
    },
    {
      role: "DOCTORS",
      roleLocal: "चिकित्सक (Emergency Healthcare)",
      tagline: "Unbroken arterial transit for life-saving emergency medical transport and trauma access.",
    },
    {
      role: "ENGINEERS",
      roleLocal: "अभियंता (Engineers & Infrastructure)",
      tagline: "Continuous structural resilience monitoring preserving India's engineering marvels.",
    },
    {
      role: "DEFENSE FORCES",
      roleLocal: "सशस्त्र सेना (Armed Forces)",
      tagline: "Strategic heavy mobility corridors ensuring national security logistics.",
    },
    {
      role: "ENTERPRISE",
      roleLocal: "व्यापारी (Commerce & Supply)",
      tagline: "The economic lifeline accelerating interstate supply chains and daily trade.",
    },
  ],
  hi: [
    {
      role: "किसान",
      roleLocal: "अन्नदाता",
      tagline: "उपजाऊ नदी घाटियों से राष्ट्रीय मंडियों तक निर्बाध कृषि उपज परिवहन।",
    },
    {
      role: "चिकित्सक",
      roleLocal: "जीवन रक्षक",
      tagline: "आपातकालीन चिकित्सा सेवाओं और एम्बुलेंस के लिए अबाध जीवन रेखा।",
    },
    {
      role: "अभियंता",
      roleLocal: "राष्ट्र निर्माता",
      tagline: "संरचनात्मक सुरक्षा और वास्तविक समय टेलीमेट्री आधारित सुरक्षा प्रणाली।",
    },
    {
      role: "सशस्त्र सेना",
      roleLocal: "राष्ट्र रक्षा",
      tagline: "सामरिक रक्षा रसद और भारी वाहनों के लिए सुरक्षित सेतु गलियारा।",
    },
    {
      role: "व्यापारी",
      roleLocal: "आर्थिक विकास",
      tagline: "अंतरराज्यीय व्यापार और दैनिक आपूर्ति श्रृंखला को गति देने वाला मार्ग।",
    },
  ],
  mr: [
    {
      role: "शेतकरी",
      roleLocal: "बळीराजा",
      tagline: "सुपीक नदी खोऱ्यांमधून कृषी उत्पादनांना थेट बाजारपेठांशी जोडणारा सेतू.",
    },
    {
      role: "डॉक्टर",
      roleLocal: "आरोग्यदूत",
      tagline: "तातडीच्या रुग्णवाहिका आणि वैद्यकीय उपचारांसाठी अखंड जीवनवाहिनी.",
    },
    {
      role: "अभियंता",
      roleLocal: "स्थापत्य तज्ज्ञ",
      tagline: "संरचनात्मक आरोग्य व सुरक्षा देखरेखीसाठी निरंतर तंत्रज्ञान प्रणाली.",
    },
    {
      role: "संरक्षण दल",
      roleLocal: "देशरक्षक / जवान",
      tagline: "अवजड लष्करी वाहतूक आणि सामरिक हालचालींसाठी सुरक्षित मार्ग.",
    },
    {
      role: "व्यापारी",
      roleLocal: "उद्योजक",
      tagline: "आंतरराज्य मालवाहतूक आणि औद्योगिक विकासाला गती देणारी आर्थिक जीवनरेखा.",
    },
  ],
};

const HERO_TEXT = {
  en: {
    dept: "GOVERNMENT OF MAHARASHTRA • PUBLIC WORKS DEPARTMENT",
    title: "SETU RAKSHAK",
    subtitle: "Bandra-Worli Sea Link Digital Structural Twin",
    desc: "Experience real-time structural intelligence: scroll down to rotate cinematic angles of the Sea Link, transition the sun from bright noon to golden hour, and observe live Indian traffic.",
    scrollHint: "Scroll Down to Rotate Views & Shift Sun",
    liveTrafficBadge: "BANDRA-WORLI SEA LINK • DYNAMIC SOLAR ARC",
    solarNoon: "Midday Sun",
    solarGolden: "Golden Hour Sunset",
    solarDusk: "Twilight Dusk",
    solarElevation: "Solar Elevation",
    nationalEthos: "NATIONAL UNIFICATION ETHOS • राष्ट्र एकात्मता",
  },
  hi: {
    dept: "महाराष्ट्र शासन • सार्वजनिक बांधकाम विभाग",
    title: "सेतु रक्षक",
    subtitle: "बांद्रा-वर्ली सी लिंक डिजिटल संरचनात्मक ट्विन",
    desc: "वास्तविक समय संरचनात्मक इंटेलिजेंस: नीचे स्क्रॉल करके सी लिंक के कोण बदलें, दोपहर से सूर्यास्त तक धूप की तीव्रता देखें और वाहनों का आवागमन देखें।",
    scrollHint: "कोण बदलने एवं सूर्य प्रकाश देखने के लिए नीचे स्क्रॉल करें",
    liveTrafficBadge: "बांद्रा-वर्ली सी लिंक • गतिशील सूर्य चक्र",
    solarNoon: "दोपहर की धूप",
    solarGolden: "स्वर्ण सूर्यास्त",
    solarDusk: "गोधूलि संध्या",
    solarElevation: "सौर उन्नयन कोण",
    nationalEthos: "राष्ट्रीय एकात्मता संकल्प • राष्ट्र सेवा",
  },
  mr: {
    dept: "महाराष्ट्र शासन • सार्वजनिक बांधकाम विभाग",
    title: "सेतू रक्षक",
    subtitle: "वांद्रे-वरळी सी लिंक डिजिटल संरचनात्मक ट्विन",
    desc: "थेट संरचनात्मक देखरेख: खाली स्क्रोल करून सी लिंकचे विहंगम कोन फिरवा, दुपारच्या उन्हापासून सोनेरी सूर्यास्तापर्यंतचा प्रकाश आणि थेट वाहतूक पहा.",
    scrollHint: "कोन फिरवण्यासाठी व सूर्यप्रकाश बदलण्यासाठी खाली स्क्रोल करा",
    liveTrafficBadge: "वांद्रे-वरळी सी लिंक • गतिशील सूर्य चक्र",
    solarNoon: "दुपारचे ऊन",
    solarGolden: "सोनेरी सूर्यास्त",
    solarDusk: "संध्याकाळ",
    solarElevation: "सौर उन्नयन कोन",
    nationalEthos: "राष्ट्रीय एकात्मता संकल्प • महाराष्ट्र शासन",
  },
};

export const BridgeHero3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeLocale } = useAppStore();
  const text = HERO_TEXT[activeLocale] || HERO_TEXT.en;
  const callouts = CITIZEN_CALLOUTS[activeLocale] || CITIZEN_CALLOUTS.en;

  const [activeCalloutIdx, setActiveCalloutIdx] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const scrollTargetRef = useRef<number>(0);

  // Cycle callouts
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCalloutIdx((prev) => (prev + 1) % callouts.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [callouts.length]);

  // Track scroll position across the entire page for 3D camera rotation and dynamic sun
  useEffect(() => {
    let lastMilestone = 0;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      scrollTargetRef.current = progress;
      setScrollProgress(progress);

      const milestone = Math.floor(progress * 5);
      if (milestone !== lastMilestone) {
        lastMilestone = milestone;
        triggerHaptic("selection");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToOperations = () => {
    triggerHaptic("selection");
    const target = document.getElementById("operations-grid");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // THREE.JS BANDRA-WORLI SEA LINK SCENE WITH CINEMATIC SCROLL ROTATION & DYNAMIC SUN
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      1400
    );
    camera.position.set(-35, 28, 70);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Root Group for the Bridge
    const bridgeGroup = new THREE.Group();
    scene.add(bridgeGroup);

    // 2. DYNAMIC SUNLIGHT & SKY LIGHTING SETUP
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    sunLight.position.set(50, 75, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    // Glowing Sun Mesh in the Sky
    const sunMeshGeo = new THREE.SphereGeometry(4.5, 32, 32);
    const sunMeshMat = new THREE.MeshBasicMaterial({ color: 0xfffaed });
    const sunMesh = new THREE.Mesh(sunMeshGeo, sunMeshMat);
    sunMesh.position.set(120, 140, 80);
    scene.add(sunMesh);

    // Hemisphere Ambient Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xcfd8dc, 1.4);
    scene.add(hemiLight);

    // Ocean Water Plane (Mahim Bay / Arabian Sea)
    const oceanGeo = new THREE.PlaneGeometry(500, 380, 64, 48);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Shifts from turquoise to sunset deep sea
      roughness: 0.15,
      metalness: 0.85,
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -8;
    ocean.receiveShadow = true;
    scene.add(ocean);

    // 3. MUMBAI SKYLINE SILHOUETTES (WORLI & BANDRA COASTLINE)
    const skylineGroup = new THREE.Group();
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.8,
      metalness: 0.2,
    });
    for (let i = 0; i < 28; i++) {
      const bHeight = 16 + Math.sin(i * 3) * 14 + (i % 5) * 8;
      const bWidth = 4 + (i % 3) * 2;
      const bDepth = 4 + (i % 2) * 3;
      const bGeo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
      const bMesh = new THREE.Mesh(bGeo, buildingMat);
      bMesh.position.set(-140 + i * 10, bHeight / 2 - 8, -120 + Math.sin(i) * 15);
      skylineGroup.add(bMesh);
    }
    scene.add(skylineGroup);

    // 4. BANDRA-WORLI SEA LINK ARCHITECTURE: ICONIC DIAMOND PYLONS
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.35,
      metalness: 0.1,
    });

    // Pylon Twin Diamond Towers
    const towerXPositions = [-24, 24];

    towerXPositions.forEach((posX) => {
      // 1. Lower Inverted V Legs rising from submerged pier
      const lowerLegGeo = new THREE.CylinderGeometry(1.2, 2.2, 18, 8);
      // North Lower Leg
      const legNorthLower = new THREE.Mesh(lowerLegGeo, concreteMat);
      legNorthLower.position.set(posX, 1, -6);
      legNorthLower.rotation.x = 0.22;
      legNorthLower.castShadow = true;
      bridgeGroup.add(legNorthLower);

      // South Lower Leg
      const legSouthLower = new THREE.Mesh(lowerLegGeo, concreteMat);
      legSouthLower.position.set(posX, 1, 6);
      legSouthLower.rotation.x = -0.22;
      legSouthLower.castShadow = true;
      bridgeGroup.add(legSouthLower);

      // 2. Central Structural Pier Junction Beam
      const midBeam = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.0, 13), concreteMat);
      midBeam.position.set(posX, 10, 0);
      midBeam.castShadow = true;
      bridgeGroup.add(midBeam);

      // 3. Upper Converging Diamond Legs (Rising to Apex)
      const upperLegGeo = new THREE.CylinderGeometry(0.9, 1.4, 28, 8);
      // North Upper Leg
      const legNorthUpper = new THREE.Mesh(upperLegGeo, concreteMat);
      legNorthUpper.position.set(posX, 24, -3.2);
      legNorthUpper.rotation.x = -0.18;
      legNorthUpper.castShadow = true;
      bridgeGroup.add(legNorthUpper);

      // South Upper Leg
      const legSouthUpper = new THREE.Mesh(upperLegGeo, concreteMat);
      legSouthUpper.position.set(posX, 24, 3.2);
      legSouthUpper.rotation.x = 0.18;
      legSouthUpper.castShadow = true;
      bridgeGroup.add(legSouthUpper);

      // 4. Tower Apex Cap
      const apex = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.2, 2.8), concreteMat);
      apex.position.set(posX, 38, 0);
      apex.castShadow = true;
      bridgeGroup.add(apex);

      // Red Aviation Obstruction Beacon
      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xef4444 })
      );
      beacon.position.set(posX, 40, 0);
      bridgeGroup.add(beacon);

      // Submerged Foundation Pier
      const pier = new THREE.Mesh(
        new THREE.CylinderGeometry(5.0, 5.5, 14, 16),
        new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 })
      );
      pier.position.set(posX, -6, 0);
      bridgeGroup.add(pier);

      // 5. Bandra-Worli Harp Stay-Cables Array
      const cableMat = new THREE.LineBasicMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.75,
      });

      const numCables = 9;
      for (let i = 0; i < numCables; i++) {
        const topY = 36 - i * 1.6;
        const deckOffset = (i + 1) * 3.6;

        [-1, 1].forEach((dir) => {
          const cableX = posX + dir * deckOffset;
          if (Math.abs(cableX) <= 56) {
            [-5.5, 5.5].forEach((zPos) => {
              const points = [
                new THREE.Vector3(posX, topY, zPos * 0.25),
                new THREE.Vector3(cableX, 1.2, zPos),
              ];
              const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
              const cable = new THREE.Line(lineGeo, cableMat);
              bridgeGroup.add(cable);
            });
          }
        });
      }
    });

    // 5. CURVED ROADWAY DECK (BANDRA-WORLI SWEEPING VIADUCT)
    const deckLength = 120;
    const deckWidth = 12;
    const deckGeo = new THREE.BoxGeometry(deckLength, 1.8, deckWidth);
    const deckMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
      metalness: 0.1,
    });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(0, 0.2, 0);
    deck.receiveShadow = true;
    deck.castShadow = true;
    bridgeGroup.add(deck);

    // Double Center Yellow Lines
    const yellowGeo = new THREE.PlaneGeometry(deckLength, 0.25);
    const yellowMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const yLine1 = new THREE.Mesh(yellowGeo, yellowMat);
    yLine1.rotation.x = -Math.PI / 2;
    yLine1.position.set(0, 1.12, -0.2);
    bridgeGroup.add(yLine1);

    const yLine2 = new THREE.Mesh(yellowGeo, yellowMat);
    yLine2.rotation.x = -Math.PI / 2;
    yLine2.position.set(0, 1.12, 0.2);
    bridgeGroup.add(yLine2);

    // Concrete Crash Barriers (Jersey Barriers) & Steel Railings
    const barrierMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });
    const barrierNorth = new THREE.Mesh(new THREE.BoxGeometry(deckLength, 1.1, 0.45), barrierMat);
    barrierNorth.position.set(0, 1.4, -5.8);
    bridgeGroup.add(barrierNorth);

    const barrierSouth = new THREE.Mesh(new THREE.BoxGeometry(deckLength, 1.1, 0.45), barrierMat);
    barrierSouth.position.set(0, 1.4, 5.8);
    bridgeGroup.add(barrierSouth);

    // Viaduct Intermediate Support Piers across the bay
    [-52, 0, 52].forEach((xP) => {
      const vPier = new THREE.Mesh(
        new THREE.CylinderGeometry(2.5, 2.8, 12, 12),
        concreteMat
      );
      vPier.position.set(xP, -4.5, 0);
      bridgeGroup.add(vPier);
    });

    // 6. REAL INDIAN VEHICLES (AUTO-RICKSHAW, TRUCK, TRACTOR, SCOOTY, CAR)
    interface VehicleItem {
      group: THREE.Group;
      speed: number;
      laneZ: number;
      direction: 1 | -1;
      wheels: THREE.Mesh[];
      headlights: THREE.Mesh[];
    }
    const vehicles: VehicleItem[] = [];

    // Factory: Auto-Rickshaw (Yellow/Green)
    const makeAuto = (): { group: THREE.Group; wheels: THREE.Mesh[]; headlights: THREE.Mesh[] } => {
      const g = new THREE.Group();
      const wheels: THREE.Mesh[] = [];
      const headlights: THREE.Mesh[] = [];

      const body = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.8, 1.3),
        new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.3 })
      );
      body.position.y = 0.6;
      g.add(body);

      const hood = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.7, 1.25),
        new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.25 })
      );
      hood.position.set(0.1, 1.25, 0);
      g.add(hood);

      const canopy = new THREE.Mesh(
        new THREE.BoxGeometry(1.85, 0.15, 1.3),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 })
      );
      canopy.position.set(0.1, 1.65, 0);
      g.add(canopy);

      const hl = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      hl.position.set(1.15, 0.65, 0);
      g.add(hl);
      headlights.push(hl);

      const wGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.18, 12);
      wGeo.rotateZ(Math.PI / 2);
      const wMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });

      const fw = new THREE.Mesh(wGeo, wMat);
      fw.position.set(0.85, 0.3, 0);
      g.add(fw);
      wheels.push(fw);

      [-0.65, 0.65].forEach((zPos) => {
        const rw = new THREE.Mesh(wGeo, wMat);
        rw.position.set(-0.75, 0.3, zPos);
        g.add(rw);
        wheels.push(rw);
      });

      return { group: g, wheels, headlights };
    };

    // Factory: Heavy Indian Truck
    const makeTruck = (cabCol: number, cargoCol: number): { group: THREE.Group; wheels: THREE.Mesh[]; headlights: THREE.Mesh[] } => {
      const g = new THREE.Group();
      const wheels: THREE.Mesh[] = [];
      const headlights: THREE.Mesh[] = [];

      const cab = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 1.8, 2.2),
        new THREE.MeshStandardMaterial({ color: cabCol, roughness: 0.3 })
      );
      cab.position.set(2.4, 1.35, 0);
      g.add(cab);

      const cargo = new THREE.Mesh(
        new THREE.BoxGeometry(4.8, 1.7, 2.25),
        new THREE.MeshStandardMaterial({ color: cargoCol, roughness: 0.5 })
      );
      cargo.position.set(-1.1, 1.35, 0);
      g.add(cargo);

      const tarp = new THREE.Mesh(
        new THREE.BoxGeometry(4.4, 0.7, 2.1),
        new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 })
      );
      tarp.position.set(-1.1, 2.45, 0);
      g.add(tarp);

      [-0.8, 0.8].forEach((zL) => {
        const hl = new THREE.Mesh(
          new THREE.SphereGeometry(0.14, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xfef08a })
        );
        hl.position.set(3.5, 0.7, zL);
        g.add(hl);
        headlights.push(hl);
      });

      const wMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
      const wGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.28, 14);
      wGeo.rotateZ(Math.PI / 2);

      [-1.0, 1.0].forEach((zW) => {
        const w = new THREE.Mesh(wGeo, wMat);
        w.position.set(2.4, 0.42, zW);
        g.add(w);
        wheels.push(w);
      });
      [-1.8, -0.6].forEach((xP) => {
        [-1.05, 1.05].forEach((zW) => {
          const w = new THREE.Mesh(wGeo, wMat);
          w.position.set(xP, 0.42, zW);
          g.add(w);
          wheels.push(w);
        });
      });

      return { group: g, wheels, headlights };
    };

    // Factory: Farm Tractor
    const makeTractor = (): { group: THREE.Group; wheels: THREE.Mesh[]; headlights: THREE.Mesh[] } => {
      const g = new THREE.Group();
      const wheels: THREE.Mesh[] = [];
      const headlights: THREE.Mesh[] = [];

      const hood = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 0.85, 1.1),
        new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 })
      );
      hood.position.set(0.6, 1.0, 0);
      g.add(hood);

      const exhaust = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 1.2),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 })
      );
      exhaust.position.set(1.2, 1.8, 0.4);
      g.add(exhaust);

      const hl = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      hl.position.set(1.65, 0.95, 0);
      g.add(hl);
      headlights.push(hl);

      const rwGeo = new THREE.CylinderGeometry(0.74, 0.74, 0.4, 16);
      rwGeo.rotateZ(Math.PI / 2);
      [-0.75, 0.75].forEach((zW) => {
        const rw = new THREE.Mesh(rwGeo, new THREE.MeshStandardMaterial({ color: 0x1e293b }));
        rw.position.set(-0.55, 0.74, zW);
        g.add(rw);
        wheels.push(rw);
      });

      const fwGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.22, 14);
      fwGeo.rotateZ(Math.PI / 2);
      [-0.6, 0.6].forEach((zW) => {
        const fw = new THREE.Mesh(fwGeo, new THREE.MeshStandardMaterial({ color: 0x1e293b }));
        fw.position.set(1.25, 0.36, zW);
        g.add(fw);
        wheels.push(fw);
      });

      return { group: g, wheels, headlights };
    };

    // Factory: Scooty / Two-Wheeler
    const makeScooty = (col: number): { group: THREE.Group; wheels: THREE.Mesh[]; headlights: THREE.Mesh[] } => {
      const g = new THREE.Group();
      const wheels: THREE.Mesh[] = [];
      const headlights: THREE.Mesh[] = [];

      const chassis = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 0.4, 0.35),
        new THREE.MeshStandardMaterial({ color: col, roughness: 0.3 })
      );
      chassis.position.set(0, 0.5, 0);
      g.add(chassis);

      const rider = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.5, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x334155 })
      );
      rider.position.set(-0.05, 0.95, 0);
      g.add(rider);

      const helmet = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0x1e293b })
      );
      helmet.position.set(0, 1.35, 0);
      g.add(helmet);

      const hl = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      hl.position.set(0.65, 0.75, 0);
      g.add(hl);
      headlights.push(hl);

      const wGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.09, 12);
      wGeo.rotateZ(Math.PI / 2);
      [0.55, -0.55].forEach((xP) => {
        const w = new THREE.Mesh(wGeo, new THREE.MeshStandardMaterial({ color: 0x0f172a }));
        w.position.set(xP, 0.24, 0);
        g.add(w);
        wheels.push(w);
      });

      return { group: g, wheels, headlights };
    };

    // Factory: Sedan Car
    const makeCar = (col: number): { group: THREE.Group; wheels: THREE.Mesh[]; headlights: THREE.Mesh[] } => {
      const g = new THREE.Group();
      const wheels: THREE.Mesh[] = [];
      const headlights: THREE.Mesh[] = [];

      const body = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.6, 1.4),
        new THREE.MeshStandardMaterial({ color: col, roughness: 0.25 })
      );
      body.position.y = 0.5;
      g.add(body);

      const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.55, 1.25),
        new THREE.MeshStandardMaterial({ color: col, roughness: 0.25 })
      );
      cabin.position.set(-0.15, 1.05, 0);
      g.add(cabin);

      [-0.5, 0.5].forEach((zL) => {
        const hl = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xfef08a })
        );
        hl.position.set(1.42, 0.52, zL);
        g.add(hl);
        headlights.push(hl);
      });

      const wGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.16, 12);
      wGeo.rotateZ(Math.PI / 2);
      [-0.85, 0.85].forEach((xW) => {
        [-0.7, 0.7].forEach((zW) => {
          const w = new THREE.Mesh(wGeo, new THREE.MeshStandardMaterial({ color: 0x0f172a }));
          w.position.set(xW, 0.28, zW);
          g.add(w);
          wheels.push(w);
        });
      });

      return { group: g, wheels, headlights };
    };

    // Spawn Indian Vehicles in Dual Lanes
    // Eastbound (direction = 1)
    const auto1 = makeAuto();
    auto1.group.position.set(-45, 1.1, -2.4);
    bridgeGroup.add(auto1.group);
    vehicles.push({ group: auto1.group, speed: 0.16, laneZ: -2.4, direction: 1, wheels: auto1.wheels, headlights: auto1.headlights });

    const truck1 = makeTruck(0xea580c, 0x0284c7);
    truck1.group.position.set(-15, 1.1, -2.4);
    bridgeGroup.add(truck1.group);
    vehicles.push({ group: truck1.group, speed: 0.12, laneZ: -2.4, direction: 1, wheels: truck1.wheels, headlights: truck1.headlights });

    const car1 = makeCar(0xffffff);
    car1.group.position.set(15, 1.1, -2.4);
    bridgeGroup.add(car1.group);
    vehicles.push({ group: car1.group, speed: 0.22, laneZ: -2.4, direction: 1, wheels: car1.wheels, headlights: car1.headlights });

    const scooty1 = makeScooty(0x0d9488);
    scooty1.group.position.set(38, 1.1, -4.0);
    bridgeGroup.add(scooty1.group);
    vehicles.push({ group: scooty1.group, speed: 0.20, laneZ: -4.0, direction: 1, wheels: scooty1.wheels, headlights: scooty1.headlights });

    // Westbound (direction = -1)
    const tractor1 = makeTractor();
    tractor1.group.rotation.y = Math.PI;
    tractor1.group.position.set(45, 1.1, 2.4);
    bridgeGroup.add(tractor1.group);
    vehicles.push({ group: tractor1.group, speed: 0.11, laneZ: 2.4, direction: -1, wheels: tractor1.wheels, headlights: tractor1.headlights });

    const auto2 = makeAuto();
    auto2.group.rotation.y = Math.PI;
    auto2.group.position.set(20, 1.1, 2.4);
    bridgeGroup.add(auto2.group);
    vehicles.push({ group: auto2.group, speed: 0.15, laneZ: 2.4, direction: -1, wheels: auto2.wheels, headlights: auto2.headlights });

    const truck2 = makeTruck(0xdc2626, 0x15803d);
    truck2.group.rotation.y = Math.PI;
    truck2.group.position.set(-10, 1.1, 2.4);
    bridgeGroup.add(truck2.group);
    vehicles.push({ group: truck2.group, speed: 0.13, laneZ: 2.4, direction: -1, wheels: truck2.wheels, headlights: truck2.headlights });

    const scooty2 = makeScooty(0xef4444);
    scooty2.group.rotation.y = Math.PI;
    scooty2.group.position.set(-35, 1.1, 4.0);
    bridgeGroup.add(scooty2.group);
    vehicles.push({ group: scooty2.group, speed: 0.19, laneZ: 4.0, direction: -1, wheels: scooty2.wheels, headlights: scooty2.headlights });

    // 7. SMOOTH ANIMATION LOOP & SCROLL-DRIVEN CAMERA ROTATION + SOLAR ARC
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let currentScroll = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth interpolation of scroll progress
      currentScroll += (scrollTargetRef.current - currentScroll) * 0.05;

      // Animate Vehicles along the deck
      vehicles.forEach((veh) => {
        veh.group.position.x += veh.speed * veh.direction;
        veh.wheels.forEach((w) => {
          w.rotation.x += veh.speed * veh.direction * 3.5;
        });

        if (veh.direction === 1 && veh.group.position.x > deckLength / 2 + 6) {
          veh.group.position.x = -deckLength / 2 - 6;
        } else if (veh.direction === -1 && veh.group.position.x < -deckLength / 2 - 6) {
          veh.group.position.x = deckLength / 2 + 6;
        }
      });

      // Ocean Wave Ripples
      ocean.position.y = -8 + Math.sin(elapsedTime * 1.4) * 0.12;

      // DYNAMIC SUN & SOLAR ARC LINKED TO SCROLL
      // At scroll = 0 (Noon): Sun is high, crisp white daylight
      // At scroll = 0.5 (Sunset): Sun is low on horizon, warm fiery amber
      // At scroll = 1.0 (Twilight): Sun dips below, dusk indigo sky
      const sunAngle = (1 - currentScroll) * Math.PI * 0.5 + 0.15;
      const sunDistance = 140;
      const sunX = Math.cos(sunAngle) * sunDistance;
      const sunY = Math.max(8, Math.sin(sunAngle) * sunDistance);
      const sunZ = 50 + Math.sin(currentScroll * Math.PI) * 40;

      sunLight.position.set(sunX, sunY, sunZ);
      sunMesh.position.set(sunX, sunY, sunZ - 20);

      // Interpolate Sun Light Color and Intensity
      if (currentScroll < 0.5) {
        // Noon to Golden Hour
        const t = currentScroll * 2;
        sunLight.color.setRGB(1.0, 0.98 - t * 0.28, 0.92 - t * 0.6);
        sunMeshMat.color.setRGB(1.0, 0.95 - t * 0.3, 0.85 - t * 0.6);
        sunLight.intensity = 2.8 + t * 0.6;
        oceanMat.color.setRGB(0.01 + t * 0.12, 0.52 - t * 0.15, 0.78 - t * 0.35);
        hemiLight.color.setRGB(1.0, 1.0 - t * 0.15, 1.0 - t * 0.3);
      } else {
        // Golden Hour to Dusk Twilight
        const t = (currentScroll - 0.5) * 2;
        sunLight.color.setRGB(1.0 - t * 0.4, 0.70 - t * 0.45, 0.32 + t * 0.2);
        sunMeshMat.color.setRGB(1.0 - t * 0.3, 0.65 - t * 0.4, 0.25 + t * 0.15);
        sunLight.intensity = 3.4 - t * 2.2;
        oceanMat.color.setRGB(0.13 - t * 0.1, 0.37 - t * 0.28, 0.43 - t * 0.25);
        hemiLight.color.setRGB(0.85 - t * 0.4, 0.85 - t * 0.5, 0.7 + t * 0.1);
      }

      // Vehicles headlights brighten as sun sets
      const headlightIntensity = Math.min(1.0, Math.max(0.2, currentScroll * 1.5));
      vehicles.forEach((veh) => {
        veh.headlights.forEach((h) => {
          (h.material as THREE.MeshBasicMaterial).color.setRGB(
            1.0,
            0.94,
            0.54 + headlightIntensity * 0.4
          );
        });
      });

      // CINEMATIC ROTATING CAMERA PATH DRIVEN BY SCROLL
      // Camera smoothly rotates 180 degrees around the Bandra-Worli Sea Link
      const orbitAngle = -0.4 + currentScroll * Math.PI * 0.95;
      const camRadius = 78 - currentScroll * 18;
      const targetCamX = Math.sin(orbitAngle) * camRadius;
      const targetCamZ = Math.cos(orbitAngle) * camRadius;
      // Camera height descends towards deck, then rises for grand dusk panorama
      const targetCamY = 28 - Math.sin(currentScroll * Math.PI) * 14;

      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;

      // Look target moves along the bridge deck
      const lookX = Math.sin(currentScroll * Math.PI) * 12;
      const lookY = 6 - currentScroll * 3;
      camera.lookAt(lookX, lookY, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const activeCallout = callouts[activeCalloutIdx];

  // Derive dynamic solar status label based on scroll
  const solarStatus =
    scrollProgress < 0.35
      ? text.solarNoon
      : scrollProgress < 0.7
      ? text.solarGolden
      : text.solarDusk;

  const SolarIcon =
    scrollProgress < 0.35 ? Sun : scrollProgress < 0.7 ? Sunset : Moon;

  return (
    <>
      {/* 1. FIXED 3D WEBGL BACKGROUND CANVAS (PERSISTS AS YOU SCROLL THE ENTIRE PAGE) */}
      <div
        ref={containerRef}
        className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden transition-opacity duration-300"
        style={{
          background:
            scrollProgress < 0.4
              ? "linear-gradient(to bottom, #bae6fd 0%, #e0f2fe 50%, #f1f5f9 100%)"
              : scrollProgress < 0.75
              ? "linear-gradient(to bottom, #fdba74 0%, #fed7aa 40%, #bae6fd 100%)"
              : "linear-gradient(to bottom, #312e81 0%, #4338ca 40%, #1e1b4b 100%)",
        }}
      />

      {/* 2. INITIAL HERO VIEWPORT OVERLAY (TOP OF PAGE) */}
      <div className="relative min-h-[92vh] w-full flex flex-col justify-between p-6 sm:p-12 pointer-events-none">
        {/* Top HUD Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-none text-xs pt-2">
          {/* Live Sea Link Status */}
          <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-sm pointer-events-auto">
            <span className="flex items-center gap-1.5 font-bold text-sky-800">
              <Radio className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
              {text.liveTrafficBadge}
            </span>
            <span className="text-slate-300">|</span>
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <SolarIcon className="w-3.5 h-3.5 text-amber-500" />
              <span>{solarStatus}</span>
            </span>
          </div>

          {/* Dynamic Scroll Solar Progress Pill */}
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-sm pointer-events-auto flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">{text.solarElevation}:</span>
            <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-600 h-full transition-all duration-75"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="font-bold text-slate-800">{Math.round((1 - scrollProgress) * 75)}°</span>
          </div>
        </div>

        {/* Center Institutional Headline */}
        <div className="max-w-3xl pt-10 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 border border-slate-200 text-sky-800 text-xs font-semibold shadow-xs mb-3">
            <Shield className="w-3.5 h-3.5 text-sky-600" />
            <span>{text.dept}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none drop-shadow-xs">
            {text.title}
          </h1>
          <p className="text-lg sm:text-2xl font-bold text-sky-900 mt-2">
            {text.subtitle}
          </p>
          <p className="mt-2 text-sm sm:text-base text-slate-700 font-medium leading-relaxed max-w-2xl bg-white/75 backdrop-blur-md p-3.5 rounded-2xl border border-white/80 shadow-xs">
            {text.desc}
          </p>
        </div>

        {/* Bottom Unification Ethos Carousel & Prompt to Scroll */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
          {/* Active Citizen Group Callout */}
          <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-slate-200/90 max-w-lg pointer-events-auto shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  {text.nationalEthos}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-sky-700">
                {activeCalloutIdx + 1} / {callouts.length}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-xl font-black text-slate-900">{activeCallout.role}</span>
              <span className="text-xs font-semibold text-sky-700">
                ({activeCallout.roleLocal})
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {activeCallout.tagline}
            </p>

            {/* Carousel navigation dots */}
            <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100">
              {callouts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    triggerHaptic("selection");
                    setActiveCalloutIdx(i);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeCalloutIdx ? "w-6 bg-sky-600" : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Select citizen group ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Smooth Scroll Button to Operations Grid */}
          <div className="pointer-events-auto">
            <button
              onClick={scrollToOperations}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg active:scale-95 group cursor-pointer"
            >
              <span>{text.scrollHint}</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

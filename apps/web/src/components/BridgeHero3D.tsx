"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import {
  ArrowDown,
  Camera,
  Layers,
  Radio,
  Sparkles,
  Shield,
  Compass,
  Sun,
  Sunset,
  CloudRain,
  Moon,
  RotateCcw,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

interface CitizenEthos {
  role: string;
  roleLocal: string;
  tagline: string;
}

type AtmosphereMode = "auto" | "daylight" | "sunset" | "monsoon" | "dusk";

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
    subtitle: "National Bridge Infrastructure Safety & Intelligence Grid",
    desc: "Photorealistic structural digital twin: observe authentic Rabindra Setu landscapes across daylight, golden sunset, monsoon, and twilight with live Indian traffic and dynamic solar lighting.",
    scrollHint: "Scroll to Orbit & Vary Sun",
    liveTrafficBadge: "HOWRAH ARCHITECTURAL TWIN • HOOGHLY BASIN",
    modeDay: "Daylight",
    modeSunset: "Golden Sunset",
    modeMonsoon: "Monsoon",
    modeDusk: "Twilight",
    modeAuto: "Scroll Arc",
    solarNoon: "Midday Sun",
    solarGolden: "Golden Hour Sunset",
    solarMonsoon: "Monsoon Amber",
    solarDusk: "Twilight Dusk",
  },
  hi: {
    dept: "महाराष्ट्र शासन • सार्वजनिक बांधकाम विभाग",
    title: "सेतु रक्षक",
    subtitle: "राष्ट्रीय पुल अवसंरचना सुरक्षा एवं इंटेलिजेंस ग्रिड",
    desc: "यथार्थवादी संरचनात्मक डिजिटल ट्विन: दोपहर के सूर्य, स्वर्णिम सूर्यास्त, मान्सून और गोधूलि वेला में वास्तविक हावड़ा सेतु परिदृश्य और भारतीय वाहनों की लाइव गतिशीलता देखें।",
    scrollHint: "वातावरण बदलने व दृश्य घुमाने के लिए स्क्रॉल करें",
    liveTrafficBadge: "हावड़ा स्थापत्य ट्विन • हुगली बेसिन",
    modeDay: "दोपहर की धूप",
    modeSunset: "स्वर्णिम सूर्यास्त",
    modeMonsoon: "मान्सून मेघ",
    modeDusk: "गोधूलि वेला",
    modeAuto: "स्क्रोल चक्र",
    solarNoon: "दोपहर का सूर्य",
    solarGolden: "स्वर्णिम सूर्यास्त",
    solarMonsoon: "मान्सून प्रकाश",
    solarDusk: "गोधूलि संध्या",
  },
  mr: {
    dept: "महाराष्ट्र शासन • सार्वजनिक बांधकाम विभाग",
    title: "सेतू रक्षक",
    subtitle: "राष्ट्रीय पूल पायाभूत सुविधा सुरक्षा व गुप्तचर यंत्रणा",
    desc: "वास्तववादी संरचनात्मक डिजिटल ट्विन: दुपारचे ऊन, सोनेरी सूर्यास्त, मान्सून मेघ आणि गोधूलि वेळेतील प्रत्यक्ष हावडा पूल आणि भारतीय वाहनांची थेट हालचाल पहा.",
    scrollHint: "वातावरण बदलण्यासाठी व दृश्य फिरवण्यासाठी स्क्रोल करा",
    liveTrafficBadge: "हावडा स्थापत्य ट्विन • हुगळी खोरे",
    modeDay: "दुपारचे ऊन",
    modeSunset: "सोनेरी सूर्यास्त",
    modeMonsoon: "मान्सून संध्या",
    modeDusk: "गोधूलि वेला",
    modeAuto: "स्क्रोल चक्र",
    solarNoon: "दुपारचे ऊन",
    solarGolden: "सोनेरी सूर्यास्त",
    solarMonsoon: "मान्सून प्रकाश",
    solarDusk: "संध्याकाळ",
  },
};

export const BridgeHero3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeLocale } = useAppStore();
  const text = HERO_TEXT[activeLocale] || HERO_TEXT.en;
  const callouts = CITIZEN_CALLOUTS[activeLocale] || CITIZEN_CALLOUTS.en;

  const [activeCalloutIdx, setActiveCalloutIdx] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [atmosphereMode, setAtmosphereMode] = useState<AtmosphereMode>("auto");
  const scrollTargetRef = useRef<number>(0);
  const modeRef = useRef<AtmosphereMode>("auto");

  useEffect(() => {
    modeRef.current = atmosphereMode;
  }, [atmosphereMode]);

  // Tactile haptic feedback
  const triggerHaptic = (ms: number = 15) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // unsupported
      }
    }
  };

  // Cycle citizen callouts
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCalloutIdx((prev) => (prev + 1) % callouts.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [callouts.length]);

  // Track global scroll
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
        triggerHaptic(10);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToOperations = () => {
    triggerHaptic(20);
    const target = document.getElementById("operations-grid");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Compute opacities for the 4 photorealistic landscape background layers
  const opacities = useMemo(() => {
    if (atmosphereMode === "daylight") return { day: 1, sunset: 0, monsoon: 0, dusk: 0 };
    if (atmosphereMode === "sunset") return { day: 0, sunset: 1, monsoon: 0, dusk: 0 };
    if (atmosphereMode === "monsoon") return { day: 0, sunset: 0, monsoon: 1, dusk: 0 };
    if (atmosphereMode === "dusk") return { day: 0, sunset: 0, monsoon: 0, dusk: 1 };

    // Auto scroll-linked crossfade
    const p = scrollProgress;
    let day = 0, sunset = 0, monsoon = 0, dusk = 0;

    if (p < 0.26) {
      const t = p / 0.26;
      day = 1 - t;
      sunset = t;
    } else if (p < 0.56) {
      const t = (p - 0.26) / 0.3;
      sunset = 1 - t;
      monsoon = t;
    } else if (p < 0.82) {
      const t = (p - 0.56) / 0.26;
      monsoon = 1 - t;
      dusk = t;
    } else {
      dusk = 1;
    }
    return { day, sunset, monsoon, dusk };
  }, [atmosphereMode, scrollProgress]);

  // THREE.JS 3D BRIDGE, VEHICLES, BIRDS, WATER & DYNAMIC SOLAR ARC
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. WebGL Renderer with Alpha Transparency (Composited over high-res landscape photos)
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(-20, 15, 62);

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
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 2. DYNAMIC SOLAR LIGHTING SETUP
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    sunLight.position.set(60, 80, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    // Visible Glowing Sun Disc
    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(4.2, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xfffaed })
    );
    sunMesh.position.set(120, 140, 70);
    scene.add(sunMesh);

    // Soft Ambient Daylight
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0xb0bec5, 1.3);
    scene.add(hemiLight);

    // 3. REFLECTIVE WATER SURFACE & COUNTRY BOAT (HOOGHLY RIVER)
    const riverGeo = new THREE.PlaneGeometry(360, 240, 64, 48);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.15,
      metalness: 0.85,
      transparent: true,
      opacity: 0.75,
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.y = -6;
    river.receiveShadow = true;
    scene.add(river);

    // Traditional Wooden Country Boat on River (from the photograph)
    const boatGroup = new THREE.Group();
    const boatHull = new THREE.Mesh(
      new THREE.ConeGeometry(1.3, 5.5, 5),
      new THREE.MeshStandardMaterial({ color: 0x2e1d10, roughness: 0.9 })
    );
    boatHull.rotation.z = Math.PI / 2;
    boatHull.rotation.y = Math.PI / 2;
    boatHull.scale.set(0.4, 1.0, 0.7);
    boatHull.position.y = -5.6;
    boatGroup.add(boatHull);

    const boatCargo = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.5, 1.2),
      new THREE.MeshStandardMaterial({ color: 0xd7ccc8 })
    );
    boatCargo.position.set(0, -5.3, 0);
    boatGroup.add(boatCargo);

    boatGroup.position.set(-8, 0, 18);
    scene.add(boatGroup);

    // 4. FLOCK OF FLYING BIRDS (MATCHING THE TWILIGHT SILHOUETTE PHOTO)
    const birds: { group: THREE.Group; leftWing: THREE.Mesh; rightWing: THREE.Mesh; speed: number; phase: number }[] = [];
    const birdGeo = new THREE.BufferGeometry();
    const birdVertices = new Float32Array([
      0, 0, 0,
      1.2, 0.2, -0.6,
      0, 0, -0.4,
    ]);
    birdGeo.setAttribute("position", new THREE.BufferAttribute(birdVertices, 3));
    birdGeo.computeVertexNormals();

    const birdMat = new THREE.MeshBasicMaterial({ color: 0x1e293b, side: THREE.DoubleSide });

    for (let b = 0; b < 5; b++) {
      const bGroup = new THREE.Group();
      const lWing = new THREE.Mesh(birdGeo, birdMat);
      const rWing = new THREE.Mesh(birdGeo, birdMat);
      rWing.scale.x = -1;

      bGroup.add(lWing);
      bGroup.add(rWing);

      bGroup.position.set(
        -30 + b * 12 + Math.random() * 6,
        18 + Math.random() * 8,
        -10 + Math.random() * 15
      );
      bGroup.scale.set(0.65, 0.65, 0.65);
      scene.add(bGroup);

      birds.push({
        group: bGroup,
        leftWing: lWing,
        rightWing: rWing,
        speed: 0.08 + Math.random() * 0.04,
        phase: b * 1.3,
      });
    }

    // 5. CANTILEVER STEEL TRUSS BRIDGE ARCHITECTURE (MATCHING USER'S PHOTOS)
    const bridgeStructure = new THREE.Group();
    rootGroup.add(bridgeStructure);

    const steelMat = new THREE.MeshStandardMaterial({
      color: 0xcfd4dc,
      roughness: 0.38,
      metalness: 0.78,
    });

    // Main Cantilever Concrete Foundation Piers at Waterline
    const towerX = [-36, 36];
    towerX.forEach((posX) => {
      const pierMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85 });
      const pier = new THREE.Mesh(new THREE.BoxGeometry(7, 12, 13), pierMat);
      pier.position.set(posX, -3, 0);
      bridgeStructure.add(pier);

      // Steel Main Towers
      [-5.2, 5.2].forEach((posZ) => {
        const colGeo = new THREE.CylinderGeometry(0.85, 1.25, 34, 8);
        const col = new THREE.Mesh(colGeo, steelMat);
        col.position.set(posX, 14, posZ);
        col.castShadow = true;
        bridgeStructure.add(col);

        // Top cap pinnacle
        const cap = new THREE.Mesh(new THREE.ConeGeometry(1.2, 2.5, 6), steelMat);
        cap.position.set(posX, 32, posZ);
        bridgeStructure.add(cap);
      });

      // Transverse sway portals
      [8, 16, 24, 30].forEach((beamY) => {
        const portal = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 10.4), steelMat);
        portal.position.set(posX, beamY, 0);
        bridgeStructure.add(portal);
      });
    });

    // Cantilever Parabolic Top Chord Truss Curves
    const trussSegments = 24;
    const deckLength = 120;
    const segmentWidth = deckLength / trussSegments;

    [-5.2, 5.2].forEach((zPos) => {
      const topChordCurve = (x: number) => {
        const norm = Math.abs(x) / 60;
        if (norm < 0.6) {
          const t = Math.abs(x) / 36;
          return 31 - Math.pow(Math.abs(t - 1), 1.8) * 16;
        } else {
          const t = (norm - 0.6) / 0.4;
          return 31 - t * 20;
        }
      };

      for (let i = 0; i < trussSegments; i++) {
        const x1 = -deckLength / 2 + i * segmentWidth;
        const x2 = x1 + segmentWidth;
        const y1 = topChordCurve(x1);
        const y2 = topChordCurve(x2);

        // Top Chord Beam
        const chordVec = new THREE.Vector3(x2 - x1, y2 - y1, 0);
        const chordLen = chordVec.length();
        const chordMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.42, 0.42, chordLen, 6),
          steelMat
        );
        chordMesh.position.set((x1 + x2) / 2, (y1 + y2) / 2, zPos);
        chordMesh.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          chordVec.clone().normalize()
        );
        chordMesh.castShadow = true;
        bridgeStructure.add(chordMesh);

        // Vertical suspension hanger rods
        const vertHeight = y1 - 0.8;
        if (vertHeight > 1.0) {
          const vertHanger = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.18, vertHeight, 6),
            steelMat
          );
          vertHanger.position.set(x1, 0.8 + vertHeight / 2, zPos);
          bridgeStructure.add(vertHanger);
        }

        // Diagonal cross bracing
        if (i % 2 === 0) {
          const diagVec = new THREE.Vector3(x2 - x1, y2 - 0.8, 0);
          const diagLen = diagVec.length();
          const diagMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.22, 0.22, diagLen, 6),
            steelMat
          );
          diagMesh.position.set((x1 + x2) / 2, (0.8 + y2) / 2, zPos);
          diagMesh.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            diagVec.clone().normalize()
          );
          bridgeStructure.add(diagMesh);
        }
      }
    });

    // Roadway Deck & Safety Barriers
    const deckGeo = new THREE.BoxGeometry(deckLength, 1.2, 11);
    const deckMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Asphalt highway
      roughness: 0.82,
      metalness: 0.15,
    });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(0, 0.6, 0);
    deck.receiveShadow = true;
    deck.castShadow = true;
    bridgeStructure.add(deck);

    // Highway median & lane markings
    [-1.8, 1.8].forEach((zM) => {
      const lineMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(deckLength - 4, 0.16),
        new THREE.MeshBasicMaterial({ color: 0xfacc15 })
      );
      lineMesh.rotation.x = -Math.PI / 2;
      lineMesh.position.set(0, 1.21, zM);
      bridgeStructure.add(lineMesh);
    });

    // 6. DETAILED INDIAN VEHICLES IN DUAL LANES
    const vehicles: {
      group: THREE.Group;
      speed: number;
      laneZ: number;
      direction: number;
      wheels: THREE.Mesh[];
      headlights: THREE.Mesh[];
    }[] = [];

    // Auto-rickshaw
    const makeAuto = () => {
      const g = new THREE.Group();
      const wheels: THREE.Mesh[] = [];
      const headlights: THREE.Mesh[] = [];

      const body = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.9, 1.1),
        new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 })
      );
      body.position.y = 0.65;
      g.add(body);

      const hood = new THREE.Mesh(
        new THREE.BoxGeometry(1.7, 0.7, 1.12),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 })
      );
      hood.position.set(-0.05, 1.35, 0);
      g.add(hood);

      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.12, 1.15),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 })
      );
      roof.position.set(-0.05, 1.75, 0);
      g.add(roof);

      const hl = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      hl.position.set(0.92, 0.7, 0);
      g.add(hl);
      headlights.push(hl);

      const wGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.12, 12);
      wGeo.rotateZ(Math.PI / 2);
      const fw = new THREE.Mesh(wGeo, new THREE.MeshStandardMaterial({ color: 0x1e293b }));
      fw.position.set(0.75, 0.24, 0);
      g.add(fw);
      wheels.push(fw);

      [-0.45, 0.45].forEach((zW) => {
        const rw = new THREE.Mesh(wGeo, new THREE.MeshStandardMaterial({ color: 0x1e293b }));
        rw.position.set(-0.6, 0.24, zW);
        g.add(rw);
        wheels.push(rw);
      });

      return { group: g, wheels, headlights };
    };

    // Indian Heavy Goods Truck (Tata / Ashok Leyland)
    const makeTruck = (cabColor: number, freightColor: number) => {
      const g = new THREE.Group();
      const wheels: THREE.Mesh[] = [];
      const headlights: THREE.Mesh[] = [];

      const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 1.8, 1.6),
        new THREE.MeshStandardMaterial({ color: cabColor, roughness: 0.35 })
      );
      cabin.position.set(2.2, 1.25, 0);
      g.add(cabin);

      const container = new THREE.Mesh(
        new THREE.BoxGeometry(4.2, 2.1, 1.7),
        new THREE.MeshStandardMaterial({ color: freightColor, roughness: 0.5 })
      );
      container.position.set(-0.9, 1.45, 0);
      g.add(container);

      [-0.6, 0.6].forEach((zL) => {
        const hl = new THREE.Mesh(
          new THREE.SphereGeometry(0.14, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xfef08a })
        );
        hl.position.set(3.22, 0.65, zL);
        g.add(hl);
        headlights.push(hl);
      });

      const wGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.26, 14);
      wGeo.rotateZ(Math.PI / 2);
      [2.2, -0.4, -2.2].forEach((xW) => {
        [-0.8, 0.8].forEach((zW) => {
          const w = new THREE.Mesh(wGeo, new THREE.MeshStandardMaterial({ color: 0x0f172a }));
          w.position.set(xW, 0.42, zW);
          g.add(w);
          wheels.push(w);
        });
      });

      return { group: g, wheels, headlights };
    };

    // Indian Farm Tractor
    const makeTractor = () => {
      const g = new THREE.Group();
      const wheels: THREE.Mesh[] = [];
      const headlights: THREE.Mesh[] = [];

      const body = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.8, 1.1),
        new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 })
      );
      body.position.set(0.3, 0.8, 0);
      g.add(body);

      const hood = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.7, 0.8),
        new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.3 })
      );
      hood.position.set(0.7, 1.25, 0);
      g.add(hood);

      const exhaust = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 1.2, 8),
        new THREE.MeshStandardMaterial({ color: 0x334155 })
      );
      exhaust.position.set(1.2, 1.9, 0.35);
      g.add(exhaust);

      const hl = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      hl.position.set(1.55, 0.95, 0);
      g.add(hl);
      headlights.push(hl);

      const rwGeo = new THREE.CylinderGeometry(0.74, 0.74, 0.38, 16);
      rwGeo.rotateZ(Math.PI / 2);
      [-0.72, 0.72].forEach((zW) => {
        const rw = new THREE.Mesh(rwGeo, new THREE.MeshStandardMaterial({ color: 0x1e293b }));
        rw.position.set(-0.55, 0.74, zW);
        g.add(rw);
        wheels.push(rw);
      });

      const fwGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.22, 14);
      fwGeo.rotateZ(Math.PI / 2);
      [-0.58, 0.58].forEach((zW) => {
        const fw = new THREE.Mesh(fwGeo, new THREE.MeshStandardMaterial({ color: 0x1e293b }));
        fw.position.set(1.25, 0.36, zW);
        g.add(fw);
        wheels.push(fw);
      });

      return { group: g, wheels, headlights };
    };

    // Scooty with commuter rider
    const makeScooty = (col: number) => {
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

    // Sedan Car
    const makeCar = (col: number) => {
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

    // Spawn vehicles in dual lanes
    // Lane 1 (Eastbound)
    const auto1 = makeAuto();
    auto1.group.position.set(-45, 0.9, -2.4);
    bridgeStructure.add(auto1.group);
    vehicles.push({ group: auto1.group, speed: 0.16, laneZ: -2.4, direction: 1, wheels: auto1.wheels, headlights: auto1.headlights });

    const truck1 = makeTruck(0xea580c, 0x0284c7);
    truck1.group.position.set(-15, 0.9, -2.4);
    bridgeStructure.add(truck1.group);
    vehicles.push({ group: truck1.group, speed: 0.12, laneZ: -2.4, direction: 1, wheels: truck1.wheels, headlights: truck1.headlights });

    const car1 = makeCar(0xffffff);
    car1.group.position.set(15, 0.9, -2.4);
    bridgeStructure.add(car1.group);
    vehicles.push({ group: car1.group, speed: 0.22, laneZ: -2.4, direction: 1, wheels: car1.wheels, headlights: car1.headlights });

    const scooty1 = makeScooty(0x0d9488);
    scooty1.group.position.set(38, 0.9, -3.8);
    bridgeStructure.add(scooty1.group);
    vehicles.push({ group: scooty1.group, speed: 0.20, laneZ: -3.8, direction: 1, wheels: scooty1.wheels, headlights: scooty1.headlights });

    // Lane 2 (Westbound)
    const tractor1 = makeTractor();
    tractor1.group.rotation.y = Math.PI;
    tractor1.group.position.set(45, 0.9, 2.4);
    bridgeStructure.add(tractor1.group);
    vehicles.push({ group: tractor1.group, speed: 0.11, laneZ: 2.4, direction: -1, wheels: tractor1.wheels, headlights: tractor1.headlights });

    const auto2 = makeAuto();
    auto2.group.rotation.y = Math.PI;
    auto2.group.position.set(20, 0.9, 2.4);
    bridgeStructure.add(auto2.group);
    vehicles.push({ group: auto2.group, speed: 0.15, laneZ: 2.4, direction: -1, wheels: auto2.wheels, headlights: auto2.headlights });

    const truck2 = makeTruck(0xdc2626, 0x15803d);
    truck2.group.rotation.y = Math.PI;
    truck2.group.position.set(-10, 0.9, 2.4);
    bridgeStructure.add(truck2.group);
    vehicles.push({ group: truck2.group, speed: 0.13, laneZ: 2.4, direction: -1, wheels: truck2.wheels, headlights: truck2.headlights });

    const scooty2 = makeScooty(0xef4444);
    scooty2.group.rotation.y = Math.PI;
    scooty2.group.position.set(-35, 0.9, 3.8);
    bridgeStructure.add(scooty2.group);
    vehicles.push({ group: scooty2.group, speed: 0.19, laneZ: 3.8, direction: -1, wheels: scooty2.wheels, headlights: scooty2.headlights });

    // 7. ANIMATION LOOP WITH DYNAMIC SOLAR ARC & SCROLL PERSPECTIVE
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let currentScroll = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth scroll lerping
      const targetProgress =
        modeRef.current === "daylight"
          ? 0.05
          : modeRef.current === "sunset"
          ? 0.42
          : modeRef.current === "monsoon"
          ? 0.70
          : modeRef.current === "dusk"
          ? 0.95
          : scrollTargetRef.current;

      currentScroll += (targetProgress - currentScroll) * 0.05;

      // Animate Vehicles
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

      // Animate Birds (wing flapping and flight trajectory)
      birds.forEach((bird) => {
        const flap = Math.sin(elapsedTime * 6 + bird.phase) * 0.42;
        bird.leftWing.rotation.z = flap;
        bird.rightWing.rotation.z = -flap;
        bird.group.position.x += bird.speed;
        bird.group.position.y += Math.sin(elapsedTime * 1.5 + bird.phase) * 0.02;

        if (bird.group.position.x > 80) {
          bird.group.position.x = -80;
        }
      });

      // Water Ripples & Country Boat Rocking
      river.position.y = -6 + Math.sin(elapsedTime * 1.3) * 0.08;
      boatGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;
      boatGroup.rotation.z = Math.sin(elapsedTime * 1.2) * 0.04;

      // Dynamic Solar Arc Lighting calculation
      const sunAngle = (1 - currentScroll) * Math.PI * 0.48 + 0.15;
      const sunDist = 150;
      const sunX = Math.cos(sunAngle) * sunDist;
      const sunY = Math.max(8, Math.sin(sunAngle) * sunDist);
      const sunZ = 50 + Math.sin(currentScroll * Math.PI) * 40;

      sunLight.position.set(sunX, sunY, sunZ);
      sunMesh.position.set(sunX, sunY, sunZ - 20);

      if (currentScroll < 0.4) {
        // Daylight to Sunset
        const t = currentScroll / 0.4;
        sunLight.color.setRGB(1.0, 0.98 - t * 0.25, 0.9 - t * 0.55);
        sunMesh.material.color.setRGB(1.0, 0.95 - t * 0.3, 0.82 - t * 0.55);
        sunLight.intensity = 2.8 + t * 0.8;
        riverMat.color.setRGB(0.01 + t * 0.14, 0.52 - t * 0.16, 0.78 - t * 0.35);
        hemiLight.color.setRGB(1.0, 1.0 - t * 0.12, 1.0 - t * 0.28);
      } else if (currentScroll < 0.75) {
        // Sunset to Monsoon
        const t = (currentScroll - 0.4) / 0.35;
        sunLight.color.setRGB(1.0 - t * 0.15, 0.73 - t * 0.25, 0.35 - t * 0.15);
        sunMesh.material.color.setRGB(1.0 - t * 0.15, 0.65 - t * 0.25, 0.27 - t * 0.1);
        sunLight.intensity = 3.6 - t * 1.6;
        riverMat.color.setRGB(0.15 + t * 0.05, 0.36 - t * 0.12, 0.43 - t * 0.18);
        hemiLight.color.setRGB(0.88 - t * 0.2, 0.88 - t * 0.25, 0.72 - t * 0.15);
      } else {
        // Monsoon to Twilight Dusk
        const t = (currentScroll - 0.75) / 0.25;
        sunLight.color.setRGB(0.85 - t * 0.5, 0.48 - t * 0.3, 0.2 + t * 0.5);
        sunMesh.material.color.setRGB(0.85 - t * 0.4, 0.4 - t * 0.25, 0.17 + t * 0.4);
        sunLight.intensity = 2.0 - t * 1.2;
        riverMat.color.setRGB(0.2 - t * 0.12, 0.24 - t * 0.15, 0.25 + t * 0.05);
        hemiLight.color.setRGB(0.68 - t * 0.35, 0.63 - t * 0.35, 0.57 + t * 0.15);
      }

      // Vehicles headlights brighten as dusk falls
      const headlightIntensity = Math.min(1.0, Math.max(0.2, currentScroll * 1.4));
      vehicles.forEach((veh) => {
        veh.headlights.forEach((h) => {
          (h.material as THREE.MeshBasicMaterial).color.setRGB(
            1.0,
            0.94,
            0.54 + headlightIntensity * 0.4
          );
        });
      });

      // Scroll-driven camera orbit
      const orbitAngle = -0.32 + currentScroll * Math.PI * 0.80;
      const camRadius = 66 - currentScroll * 14;
      const targetCamX = Math.sin(orbitAngle) * camRadius;
      const targetCamZ = Math.cos(orbitAngle) * camRadius;
      const targetCamY = 14 - Math.sin(currentScroll * Math.PI) * 8;

      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;

      const lookX = Math.sin(currentScroll * Math.PI) * 8;
      const lookY = 3.5 - currentScroll * 1.5;
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

  // Current Solar Status label
  const solarStatus =
    atmosphereMode === "daylight" || (atmosphereMode === "auto" && scrollProgress < 0.28)
      ? text.solarNoon
      : atmosphereMode === "sunset" || (atmosphereMode === "auto" && scrollProgress < 0.58)
      ? text.solarGolden
      : atmosphereMode === "monsoon" || (atmosphereMode === "auto" && scrollProgress < 0.82)
      ? text.solarMonsoon
      : text.solarDusk;

  const SolarIcon =
    atmosphereMode === "daylight" || (atmosphereMode === "auto" && scrollProgress < 0.28)
      ? Sun
      : atmosphereMode === "sunset" || (atmosphereMode === "auto" && scrollProgress < 0.58)
      ? Sunset
      : atmosphereMode === "monsoon" || (atmosphereMode === "auto" && scrollProgress < 0.82)
      ? CloudRain
      : Moon;

  return (
    <>
      {/* 1. FIXED PERSISTENT PHOTOREALISTIC BACKGROUND LAYERS (YOUR REAL BRIDGE LANDSCAPES) */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        {/* Landscape Layer 1: Daylight (Clear Blue Sky) */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out scale-105"
          style={{
            backgroundImage: "url('/images/bridge_daylight.jpg')",
            opacity: opacities.day,
          }}
        />

        {/* Landscape Layer 2: Golden Sunset (Warm Amber Sun & Water Glow) */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out scale-105"
          style={{
            backgroundImage: "url('/images/bridge_sunset.jpg')",
            opacity: opacities.sunset,
          }}
        />

        {/* Landscape Layer 3: Monsoon Dusk (Dramatic Clouds with Sun Breakthrough) */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out scale-105"
          style={{
            backgroundImage: "url('/images/bridge_monsoon.jpg')",
            opacity: opacities.monsoon,
          }}
        />

        {/* Landscape Layer 4: Twilight Silhouette (Moody Dusk with Flying Bird) */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out scale-105"
          style={{
            backgroundImage: "url('/images/bridge_dusk.jpg')",
            opacity: opacities.dusk,
          }}
        />

        {/* Atmospheric Vignette & Soft Gradient Tint */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700"
          style={{
            background:
              scrollProgress < 0.35
                ? "linear-gradient(to bottom, rgba(2, 132, 199, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(2, 132, 199, 0.25) 100%)"
                : scrollProgress < 0.7
                ? "linear-gradient(to bottom, rgba(217, 119, 6, 0.22) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(217, 119, 6, 0.35) 100%)"
                : "linear-gradient(to bottom, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.15) 50%, rgba(30, 27, 75, 0.5) 100%)",
          }}
        />

        {/* WebGL 3D Bridge Canvas Overlay */}
        <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      </div>

      {/* 2. INITIAL HERO VIEWPORT OVERLAY (TOP OF PAGE) */}
      <div className="relative min-h-[92vh] w-full flex flex-col justify-between p-6 sm:p-12 pointer-events-none">
        {/* Top HUD Telemetry Bar with Atmospheric Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-none text-xs">
          {/* Live Bridge Landscape Status */}
          <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/80 shadow-sm pointer-events-auto">
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

          {/* Interactive Atmospheric Mode Selector */}
          <div className="bg-white/90 backdrop-blur-md p-1 rounded-xl border border-white/80 shadow-sm pointer-events-auto flex items-center gap-1">
            <button
              onClick={() => {
                triggerHaptic(12);
                setAtmosphereMode("daylight");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                atmosphereMode === "daylight"
                  ? "bg-sky-500 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Sun className="w-3 h-3" />
              <span>{text.modeDay}</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic(12);
                setAtmosphereMode("sunset");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                atmosphereMode === "sunset"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Sunset className="w-3 h-3" />
              <span>{text.modeSunset}</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic(12);
                setAtmosphereMode("monsoon");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                atmosphereMode === "monsoon"
                  ? "bg-orange-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <CloudRain className="w-3 h-3" />
              <span>{text.modeMonsoon}</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic(12);
                setAtmosphereMode("dusk");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                atmosphereMode === "dusk"
                  ? "bg-indigo-700 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Moon className="w-3 h-3" />
              <span>{text.modeDusk}</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic(12);
                setAtmosphereMode("auto");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                atmosphereMode === "auto"
                  ? "bg-slate-800 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
              title="Automatically transition atmosphere on scroll"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{text.modeAuto}</span>
            </button>
          </div>

          {/* Dynamic Solar Arc Progress Pill */}
          <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/80 shadow-sm pointer-events-auto flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">Solar Elevation:</span>
            <div className="w-20 bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-600 h-full transition-all duration-75"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="font-bold text-slate-800">
              {atmosphereMode === "daylight"
                ? "75°"
                : atmosphereMode === "sunset"
                ? "32°"
                : atmosphereMode === "monsoon"
                ? "18°"
                : atmosphereMode === "dusk"
                ? "6°"
                : `${Math.round((1 - scrollProgress) * 75)}°`}
            </span>
          </div>
        </div>

        {/* Center Institutional Headline */}
        <div className="max-w-2xl pt-8 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 border border-white/80 text-sky-800 text-xs font-semibold shadow-xs mb-3 backdrop-blur-md">
            <Shield className="w-3.5 h-3.5 text-sky-600" />
            <span>{text.dept}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none drop-shadow-sm">
            {text.title}
          </h1>
          <p className="text-lg sm:text-2xl font-bold text-sky-900 mt-2 drop-shadow-xs">
            {text.subtitle}
          </p>
          <p className="mt-2 text-sm sm:text-base text-slate-800 font-medium leading-relaxed max-w-xl bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/80 shadow-sm">
            {text.desc}
          </p>
        </div>

        {/* Bottom Unification Ethos Carousel & Prompt to Scroll */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
          {/* Active Citizen Group Callout */}
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-white/80 max-w-lg pointer-events-auto shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  NATIONAL UNIFICATION ETHOS • राष्ट्र एकात्मता
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
                    triggerHaptic(10);
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
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg active:scale-95 group"
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

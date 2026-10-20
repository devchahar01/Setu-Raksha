"use client";

import React, { useEffect, useRef, useState } from "react";
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
  Moon,
  Navigation,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

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
    title: "SETU RAKSHA",
    subtitle: "National Bridge Infrastructure Safety & Intelligence Grid",
    desc: "Photorealistic structural digital twin: scroll down to rotate panoramic angles of the bridge, transition the sun from bright midday to golden sunset, and watch live Indian traffic.",
    scrollHint: "Scroll Down to Rotate Views & Vary Sun",
    liveTrafficBadge: "HOWRAH & HOOGHLY RIVER TWIN • REALISTIC DYNAMICS",
    solarNoon: "Midday Sun",
    solarGolden: "Golden Hour Sunset",
    solarDusk: "Twilight Dusk",
  },
  hi: {
    dept: "महाराष्ट्र शासन • सार्वजनिक बांधकाम विभाग",
    title: "सेतु रक्षा",
    subtitle: "राष्ट्रीय पुल अवसंरचना सुरक्षा एवं इंटेलिजेंस ग्रिड",
    desc: "यथार्थवादी संरचनात्मक डिजिटल ट्विन: कोण बदलने के लिए नीचे स्क्रॉल करें, दोपहर से स्वर्णिम सूर्यास्त तक धूप की तीव्रता बदलें और वाहनों की लाइव गति देखें।",
    scrollHint: "दृश्य घुमाने और सूर्य चक्र देखने के लिए स्क्रॉल करें",
    liveTrafficBadge: "हावड़ा एवं हुगली नदी ट्विन • यथार्थवादी गतिशीलता",
    solarNoon: "दोपहर की धूप",
    solarGolden: "स्वर्णिम सूर्यास्त",
    solarDusk: "गोधूलि संध्या",
  },
  mr: {
    dept: "महाराष्ट्र शासन • सार्वजनिक बांधकाम विभाग",
    title: "सेतू रक्षा",
    subtitle: "राष्ट्रीय पूल पायाभूत सुविधा सुरक्षा व गुप्तचर यंत्रणा",
    desc: "वास्तववादी संरचनात्मक डिजिटल ट्विन: खाली स्क्रोल करून पुलाचे विहंगम दृश्य फिरवा, दुपारच्या उन्हापासून सोनेरी सूर्यास्तापर्यंतचा प्रकाश आणि थेट वाहतूक पहा.",
    scrollHint: "दृश्य फिरवण्यासाठी व सूर्यप्रकाश बदलण्यासाठी स्क्रोल करा",
    liveTrafficBadge: "हावडा व हुगळी नदी ट्विन • वास्तववादी गतिशीलता",
    solarNoon: "दुपारचे ऊन",
    solarGolden: "सोनेरी सूर्यास्त",
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
  const scrollTargetRef = useRef<number>(0);

  // Trigger subtle tactile haptic
  const triggerHaptic = (ms: number = 15) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // unsupported hardware
      }
    }
  };

  // Cycle callouts
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
        triggerHaptic(12);
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

  // THREE.JS REALISTIC BRIDGE LANDSCAPE + DYNAMIC SOLAR ARC & SCROLL-DRIVEN CAMERA ROTATION
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, WebGL Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      1200
    );
    camera.position.set(-25, 14, 68);

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

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 2. PHOTOREALISTIC LANDSCAPE BACKDROP MESH (LOAD USER'S GIVEN IMAGE)
    const textureLoader = new THREE.TextureLoader();
    const landscapeTexture = textureLoader.load(
      "/images/bridge_landscape.jpg",
      () => {
        renderer.render(scene, camera);
      }
    );
    landscapeTexture.colorSpace = THREE.SRGBColorSpace;

    // Curved Panoramic Sky Backdrop Plane
    const backdropGeo = new THREE.CylinderGeometry(
      260,
      260,
      130,
      48,
      1,
      true,
      Math.PI * 0.45,
      Math.PI * 1.1
    );
    const backdropMat = new THREE.MeshBasicMaterial({
      map: landscapeTexture,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const backdrop = new THREE.Mesh(backdropGeo, backdropMat);
    backdrop.position.set(0, 35, -40);
    scene.add(backdrop);

    // 3. DYNAMIC SUNLIGHT & ATMOSPHERIC LIGHTING SETUP
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    sunLight.position.set(60, 80, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    // Visible Glowing Sun Disc
    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(5.0, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xfffaed })
    );
    sunMesh.position.set(130, 150, 70);
    scene.add(sunMesh);

    // Soft Ambient Daylight
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0xb0bec5, 1.4);
    scene.add(hemiLight);

    // 4. REFLECTIVE RIVER WATER SURFACE (CALM SHIMMER MIRRORING BRIDGE & SUN)
    const riverGeo = new THREE.PlaneGeometry(360, 240, 64, 48);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.12,
      metalness: 0.88,
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.y = -6;
    river.receiveShadow = true;
    scene.add(river);

    // Traditional Wooden Country Boat on River (just like in the photo!)
    const boatGroup = new THREE.Group();
    const boatHull = new THREE.Mesh(
      new THREE.ConeGeometry(1.4, 6.0, 5),
      new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.9 })
    );
    boatHull.rotation.z = Math.PI / 2;
    boatHull.rotation.y = Math.PI / 2;
    boatHull.scale.set(0.4, 1.0, 0.7);
    boatHull.position.y = -5.6;
    boatGroup.add(boatHull);

    // Boat cargo bags
    const boatCargo = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.5, 1.2),
      new THREE.MeshStandardMaterial({ color: 0xd7ccc8 })
    );
    boatCargo.position.set(0, -5.3, 0);
    boatGroup.add(boatCargo);

    boatGroup.position.set(-6, 0, 18);
    scene.add(boatGroup);

    // 5. ICONIC CANTILEVER STEEL TRUSS BRIDGE ARCHITECTURE (MATCHING USER'S PHOTO)
    const bridgeStructure = new THREE.Group();
    rootGroup.add(bridgeStructure);

    const steelMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db, // Clean steel truss in daylight
      roughness: 0.4,
      metalness: 0.8,
    });

    const rustSteelMat = new THREE.MeshStandardMaterial({
      color: 0x9ca3af,
      roughness: 0.6,
      metalness: 0.7,
    });

    // Main Cantilever Steel Tower Pylons
    const pylonHeight = 36;
    const towerX = [-36, 36];

    towerX.forEach((posX) => {
      // Massive Concrete Foundation Pier at Waterline
      const pierMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.85 });
      const pier = new THREE.Mesh(new THREE.BoxGeometry(8, 12, 14), pierMat);
      pier.position.set(posX, -3, 0);
      bridgeStructure.add(pier);

      // Steel Main Towers: 4 vertical/diagonal truss columns
      [-5.2, 5.2].forEach((zSide) => {
        // Front column
        const col1 = new THREE.Mesh(
          new THREE.CylinderGeometry(0.8, 1.2, pylonHeight, 8),
          steelMat
        );
        col1.position.set(posX - 1.5, pylonHeight / 2 - 3, zSide);
        col1.castShadow = true;
        bridgeStructure.add(col1);

        // Rear diagonal column
        const col2 = new THREE.Mesh(
          new THREE.CylinderGeometry(0.8, 1.2, pylonHeight, 8),
          steelMat
        );
        col2.position.set(posX + 1.5, pylonHeight / 2 - 3, zSide);
        col2.castShadow = true;
        bridgeStructure.add(col2);

        // Diagonal Cross-braces along tower
        for (let b = 0; b < 4; b++) {
          const bY = 4 + b * 7;
          const brace = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25, 0.25, 5.0, 6),
            steelMat
          );
          brace.position.set(posX, bY, zSide);
          brace.rotation.z = b % 2 === 0 ? 0.6 : -0.6;
          bridgeStructure.add(brace);
        }
      });

      // Top Transverse Arch Portal Beam
      const topBeam = new THREE.Mesh(new THREE.BoxGeometry(4, 2.2, 13), steelMat);
      topBeam.position.set(posX, pylonHeight - 3, 0);
      topBeam.castShadow = true;
      bridgeStructure.add(topBeam);
    });

    // Upper Sweeping Cantilever Truss Chords (Parabolic Steel Arch Curve)
    const numTrussSegments = 16;
    const bridgeSpan = 96;
    const segmentWidth = bridgeSpan / numTrussSegments;

    [-5.2, 5.2].forEach((zSide) => {
      for (let s = 0; s < numTrussSegments; s++) {
        const segX = -bridgeSpan / 2 + s * segmentWidth + segmentWidth / 2;
        // Parabolic arch curve: higher at the towers (-36, 36) and dipping gently in center
        const distFromCenter = Math.abs(segX);
        const trussTopY = 8 + Math.pow(distFromCenter / 36, 1.4) * 22;

        // Top chord segment
        const chordGeo = new THREE.BoxGeometry(segmentWidth + 0.4, 0.7, 0.7);
        const chord = new THREE.Mesh(chordGeo, steelMat);
        chord.position.set(segX, trussTopY, zSide);
        bridgeStructure.add(chord);

        // Vertical suspension hanger rods connecting top chord to road deck
        const hangerHeight = Math.max(1, trussTopY - 1.2);
        const hangerGeo = new THREE.CylinderGeometry(0.12, 0.12, hangerHeight, 6);
        const hanger = new THREE.Mesh(hangerGeo, steelMat);
        hanger.position.set(segX, trussTopY - hangerHeight / 2, zSide);
        bridgeStructure.add(hanger);

        // Diagonal truss lattice cross-ties
        const diagGeo = new THREE.CylinderGeometry(0.16, 0.16, hangerHeight * 1.2, 6);
        const diag = new THREE.Mesh(diagGeo, rustSteelMat);
        diag.position.set(segX, trussTopY - hangerHeight / 2, zSide);
        diag.rotation.z = s % 2 === 0 ? 0.4 : -0.4;
        bridgeStructure.add(diag);
      }
    });

    // 6. ROADWAY DECK (ASPHALT WITH REALISTIC ROADWAY LANES & CRASH BARRIERS)
    const deckLength = 110;
    const deckWidth = 11;
    const deckGeo = new THREE.BoxGeometry(deckLength, 1.4, deckWidth);
    const deckMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.75,
      metalness: 0.1,
    });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(0, 0.2, 0);
    deck.receiveShadow = true;
    deck.castShadow = true;
    bridgeStructure.add(deck);

    // Double Center Yellow Lines
    const yGeo = new THREE.PlaneGeometry(deckLength, 0.24);
    const yMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const yLine1 = new THREE.Mesh(yGeo, yMat);
    yLine1.rotation.x = -Math.PI / 2;
    yLine1.position.set(0, 0.92, -0.2);
    bridgeStructure.add(yLine1);

    const yLine2 = new THREE.Mesh(yGeo, yMat);
    yLine2.rotation.x = -Math.PI / 2;
    yLine2.position.set(0, 0.92, 0.2);
    bridgeStructure.add(yLine2);

    // Concrete Crash Barriers (Jersey Barriers) along deck sides
    const barrierMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });
    const bNorth = new THREE.Mesh(new THREE.BoxGeometry(deckLength, 1.1, 0.45), barrierMat);
    bNorth.position.set(0, 1.3, -5.3);
    bridgeStructure.add(bNorth);

    const bSouth = new THREE.Mesh(new THREE.BoxGeometry(deckLength, 1.1, 0.45), barrierMat);
    bSouth.position.set(0, 1.3, 5.3);
    bridgeStructure.add(bSouth);

    // 7. REAL INDIAN VEHICLES (AUTO-RICKSHAW, TRUCK, TRACTOR, SCOOTY, CAR)
    interface VehicleItem {
      group: THREE.Group;
      speed: number;
      laneZ: number;
      direction: 1 | -1;
      wheels: THREE.Mesh[];
      headlights: THREE.Mesh[];
    }
    const vehicles: VehicleItem[] = [];

    // Factory: Auto-Rickshaw
    const makeAuto = (): { group: THREE.Group; wheels: THREE.Mesh[]; headlights: THREE.Mesh[] } => {
      const g = new THREE.Group();
      const wheels: THREE.Mesh[] = [];
      const headlights: THREE.Mesh[] = [];

      const body = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.7, 1.4),
        new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.3 })
      );
      body.position.y = 0.55;
      g.add(body);

      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.24, 1.42),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 })
      );
      roof.position.set(-0.05, 1.6, 0);
      g.add(roof);

      const hl = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      hl.position.set(1.22, 0.65, 0);
      g.add(hl);
      headlights.push(hl);

      const wMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
      const wGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.16, 12);
      wGeo.rotateZ(Math.PI / 2);

      const fw = new THREE.Mesh(wGeo, wMat);
      fw.position.set(0.95, 0.24, 0);
      g.add(fw);
      wheels.push(fw);

      [-0.65, 0.65].forEach((zW) => {
        const rw = new THREE.Mesh(wGeo, wMat);
        rw.position.set(-0.75, 0.24, zW);
        g.add(rw);
        wheels.push(rw);
      });

      return { group: g, wheels, headlights };
    };

    // Factory: Heavy Indian Truck (Tata / Ashok Leyland Lorry)
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

    // Factory: Scooty
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

    // Westbound (direction = -1)
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

    // 8. ANIMATION LOOP & SCROLL-DRIVEN CAMERA ROTATION + DYNAMIC SUN
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let currentScroll = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth damping interpolation
      currentScroll += (scrollTargetRef.current - currentScroll) * 0.05;

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

      // River Water Ripples and gentle boat rocking
      river.position.y = -6 + Math.sin(elapsedTime * 1.3) * 0.08;
      boatGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;
      boatGroup.rotation.z = Math.sin(elapsedTime * 1.2) * 0.04;

      // DYNAMIC SUN & SOLAR INTENSITY VARYING BASED ON SCROLL
      // Top: High Noon Sun
      // Mid: Golden Sunset Sun with fiery warm glow
      // Bottom: Twilight Horizon Sun
      const sunAngle = (1 - currentScroll) * Math.PI * 0.48 + 0.18;
      const sunDist = 150;
      const sunX = Math.cos(sunAngle) * sunDist;
      const sunY = Math.max(10, Math.sin(sunAngle) * sunDist);
      const sunZ = 50 + Math.sin(currentScroll * Math.PI) * 40;

      sunLight.position.set(sunX, sunY, sunZ);
      sunMesh.position.set(sunX, sunY, sunZ - 20);

      if (currentScroll < 0.5) {
        // Noon to Golden Hour
        const t = currentScroll * 2;
        sunLight.color.setRGB(1.0, 0.98 - t * 0.25, 0.9 - t * 0.55);
        sunMesh.material.color.setRGB(1.0, 0.95 - t * 0.3, 0.82 - t * 0.55);
        sunLight.intensity = 2.8 + t * 0.7; // Golden hour intense warm bloom
        riverMat.color.setRGB(0.01 + t * 0.14, 0.52 - t * 0.16, 0.78 - t * 0.35);
        hemiLight.color.setRGB(1.0, 1.0 - t * 0.12, 1.0 - t * 0.28);
      } else {
        // Golden Hour to Dusk Twilight
        const t = (currentScroll - 0.5) * 2;
        sunLight.color.setRGB(1.0 - t * 0.35, 0.72 - t * 0.45, 0.35 + t * 0.2);
        sunMesh.material.color.setRGB(1.0 - t * 0.3, 0.65 - t * 0.4, 0.25 + t * 0.15);
        sunLight.intensity = 3.5 - t * 2.2;
        riverMat.color.setRGB(0.15 - t * 0.1, 0.36 - t * 0.28, 0.43 - t * 0.25);
        hemiLight.color.setRGB(0.88 - t * 0.4, 0.88 - t * 0.5, 0.72 + t * 0.1);
      }

      // Vehicles headlights brighten as dusk falls
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

      // SCROLL-DRIVEN CAMERA ORBIT (ROTATES VIEWS OF THE BRIDGE BEAUTIFULLY)
      // View 1 (Top): Panoramic side vista showing bridge spanning river
      // View 2 (Mid): Swoop down to roadway level with traffic
      // View 3 (Deep): Low-angle looking up at the cantilever truss and sunset sky
      const orbitAngle = -0.35 + currentScroll * Math.PI * 0.85;
      const camRadius = 72 - currentScroll * 16;
      const targetCamX = Math.sin(orbitAngle) * camRadius;
      const targetCamZ = Math.cos(orbitAngle) * camRadius;
      const targetCamY = 16 - Math.sin(currentScroll * Math.PI) * 10;

      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;

      const lookX = Math.sin(currentScroll * Math.PI) * 10;
      const lookY = 4 - currentScroll * 2;
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
      {/* 1. FIXED PERSISTENT 3D BACKGROUND CANVAS */}
      <div
        ref={containerRef}
        className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden transition-opacity duration-300"
        style={{
          background:
            scrollProgress < 0.4
              ? "linear-gradient(to bottom, #0284c7 0%, #38bdf8 30%, #bae6fd 60%, #e0f2fe 100%)"
              : scrollProgress < 0.75
              ? "linear-gradient(to bottom, #d97706 0%, #f59e0b 30%, #fdba74 60%, #fed7aa 100%)"
              : "linear-gradient(to bottom, #1e1b4b 0%, #312e81 35%, #4338ca 70%, #1e1b4b 100%)",
        }}
      />

      {/* 2. INITIAL HERO VIEWPORT OVERLAY (TOP OF PAGE) */}
      <div className="relative min-h-[92vh] w-full flex flex-col justify-between p-6 sm:p-12 pointer-events-none">
        {/* Top HUD Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-none text-xs">
          {/* Live Bridge Landscape Status */}
          <div className="flex items-center gap-2.5 bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/80 shadow-sm pointer-events-auto">
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
          <div className="bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/80 shadow-sm pointer-events-auto flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">Solar Arc:</span>
            <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-600 h-full transition-all duration-75"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="font-bold text-slate-800">{Math.round((1 - scrollProgress) * 75)}°</span>
          </div>
        </div>

        {/* Center Institutional Headline (Positioned with clean layout so bridge remains visible) */}
        <div className="max-w-2xl pt-8 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-white/80 text-sky-800 text-xs font-semibold shadow-xs mb-3 backdrop-blur-md">
            <Shield className="w-3.5 h-3.5 text-sky-600" />
            <span>{text.dept}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none drop-shadow-xs">
            {text.title}
          </h1>
          <p className="text-lg sm:text-2xl font-bold text-sky-900 mt-2">
            {text.subtitle}
          </p>
          <p className="mt-2 text-sm sm:text-base text-slate-700 font-medium leading-relaxed max-w-xl bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/80 shadow-sm">
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

"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  ArrowDown,
  Camera,
  Layers,
  Radio,
  Sparkles,
  Volume2,
  Shield,
  Truck,
  Car,
  Compass,
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
    subtitle: "National Bridge Safety & Intelligence System",
    desc: "Real-time structural health monitoring, flood scour early warnings, and predictive maintenance protecting India's vital transport arteries.",
    viewDeck: "Deck Traffic View",
    viewAerial: "Aerial River Vista",
    viewPiers: "Pier Scour View",
    scrollHint: "Scroll to Explore Operations Grid",
    liveTrafficBadge: "LIVE SIMULATION • INDIAN TRAFFIC IN TRANSIT",
    bridgesMonitored: "60 Strategic Bridges Monitored",
  },
  hi: {
    dept: "महाराष्ट्र शासन • सार्वजनिक बांधकाम विभाग",
    title: "सेतु रक्षा",
    subtitle: "राष्ट्रीय पुल सुरक्षा एवं इंटेलिजेंस प्रणाली",
    desc: "भारत की प्रमुख नदी घाटियों में पुलों के संरचनात्मक स्वास्थ्य, कटाव और बाढ़ सुरक्षा की निरंतर निगरानी प्रणाली।",
    viewDeck: "डेक ट्रैफिक दृश्य",
    viewAerial: "विहंगम नदी दृश्य",
    viewPiers: "पिलर व जल स्तर",
    scrollHint: "संचालन ग्रिड देखने के लिए नीचे स्क्रॉल करें",
    liveTrafficBadge: "लाइव सिमुलेशन • सक्रिय भारतीय वाहन यातायात",
    bridgesMonitored: "६० सामरिक पुलों की निरंतर निगरानी",
  },
  mr: {
    dept: "महाराष्ट्र शासन • सार्वजनिक बांधकाम विभाग",
    title: "सेतू रक्षा",
    subtitle: "राष्ट्रीय पूल सुरक्षा व गुप्तचर यंत्रणा",
    desc: "महाराष्ट्रातील प्रमुख नदी खोऱ्यांमधील सर्व पुलांच्या संरचनात्मक आरोग्याची, गाद पातळीची आणि पूर सुरक्षेची थेट देखरेख.",
    viewDeck: "डेक वाहतूक दृश्य",
    viewAerial: "विहंगम दृश्य",
    viewPiers: "पाया व गाद पातळी",
    scrollHint: "संचालन दालन पाहण्यासाठी खाली स्क्रोल करा",
    liveTrafficBadge: "थेट सिमुलेशन • सक्रिय भारतीय वाहने",
    bridgesMonitored: "६० महत्त्वाच्या पुलांची थेट देखरेख",
  },
};

export const BridgeHero3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeLocale } = useAppStore();
  const text = HERO_TEXT[activeLocale] || HERO_TEXT.en;
  const callouts = CITIZEN_CALLOUTS[activeLocale] || CITIZEN_CALLOUTS.en;

  const [activeCalloutIdx, setActiveCalloutIdx] = useState<number>(0);
  const [cameraMode, setCameraMode] = useState<"aerial" | "deck" | "piers">("aerial");
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Trigger light haptic pulse if available
  const triggerHaptic = (ms: number = 15) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // Ignore haptic errors on unsupported hardware
      }
    }
  };

  // Cycle callouts every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCalloutIdx((prev) => (prev + 1) % callouts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [callouts.length]);

  // Track scroll position for dynamic 3D camera transitions and haptics
  useEffect(() => {
    let lastHapticSection = 0;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / 700, 1);
      setScrollProgress(progress);

      // Trigger subtle haptic milestone when crossing into operations grid
      const currentSection = Math.floor(scrollY / 450);
      if (currentSection !== lastHapticSection) {
        lastHapticSection = currentSection;
        triggerHaptic(10);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToDashboard = () => {
    triggerHaptic(20);
    const target = document.getElementById("operations-grid");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // THREE.JS REALISTIC DAYLIGHT SCENE WITH INDIAN VEHICLES
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdbeafe); // Crisp sky blue
    scene.fog = new THREE.FogExp2(0xdbeafe, 0.007);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 22, 60);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // Main bridge container group
    const bridgeGroup = new THREE.Group();
    scene.add(bridgeGroup);

    // 2. Realistic Daylight Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xcfd8dc, 1.3);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.6);
    sunLight.position.set(45, 75, 35);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 200;
    const shadowD = 60;
    sunLight.shadow.camera.left = -shadowD;
    sunLight.shadow.camera.right = shadowD;
    sunLight.shadow.camera.top = shadowD;
    sunLight.shadow.camera.bottom = -shadowD;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Secondary soft fill light
    const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.8);
    fillLight.position.set(-40, 30, -30);
    scene.add(fillLight);

    // 3. Realistic River Surface & Wave Animation
    const waterGeo = new THREE.PlaneGeometry(260, 160, 64, 48);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Vibrant river blue
      roughness: 0.15,
      metalness: 0.8,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -10;
    water.receiveShadow = true;
    scene.add(water);

    // 4. Riverbanks & Gorge Terrain (Lush Greenery & Stone Abutments)
    const bankGeo = new THREE.BoxGeometry(50, 24, 160);
    const bankMat = new THREE.MeshStandardMaterial({
      color: 0x15803d, // Lush green hillside
      roughness: 0.85,
      metalness: 0.1,
    });
    const leftBank = new THREE.Mesh(bankGeo, bankMat);
    leftBank.position.set(-78, -4, 0);
    leftBank.receiveShadow = true;
    scene.add(leftBank);

    const rightBank = new THREE.Mesh(bankGeo, bankMat);
    rightBank.position.set(78, -4, 0);
    rightBank.receiveShadow = true;
    scene.add(rightBank);

    // Rocky abutment walls
    const abutmentMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Grey stone
      roughness: 0.9,
    });
    const leftAbutment = new THREE.Mesh(new THREE.BoxGeometry(8, 14, 18), abutmentMat);
    leftAbutment.position.set(-51, -1, 0);
    scene.add(leftAbutment);

    const rightAbutment = new THREE.Mesh(new THREE.BoxGeometry(8, 14, 18), abutmentMat);
    rightAbutment.position.set(51, -1, 0);
    scene.add(rightAbutment);

    // 5. Realistic Bridge Roadway Deck (Asphalt, Markings & Crash Barriers)
    const deckLength = 104;
    const deckWidth = 11;
    const deckGeo = new THREE.BoxGeometry(deckLength, 1.8, deckWidth);
    const deckMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Dark asphalt
      roughness: 0.7,
      metalness: 0.15,
    });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(0, 0, 0);
    deck.receiveShadow = true;
    deck.castShadow = true;
    bridgeGroup.add(deck);

    // Center Double Yellow Lines
    const yellowLineGeo = new THREE.PlaneGeometry(deckLength, 0.22);
    const yellowLineMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const yellowLine1 = new THREE.Mesh(yellowLineGeo, yellowLineMat);
    yellowLine1.rotation.x = -Math.PI / 2;
    yellowLine1.position.set(0, 0.92, -0.18);
    bridgeGroup.add(yellowLine1);

    const yellowLine2 = new THREE.Mesh(yellowLineGeo, yellowLineMat);
    yellowLine2.rotation.x = -Math.PI / 2;
    yellowLine2.position.set(0, 0.92, 0.18);
    bridgeGroup.add(yellowLine2);

    // White Outer Edge Lines
    const whiteLineGeo = new THREE.PlaneGeometry(deckLength, 0.18);
    const whiteLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const whiteLineLeft = new THREE.Mesh(whiteLineGeo, whiteLineMat);
    whiteLineLeft.rotation.x = -Math.PI / 2;
    whiteLineLeft.position.set(0, 0.92, -4.6);
    bridgeGroup.add(whiteLineLeft);

    const whiteLineRight = new THREE.Mesh(whiteLineGeo, whiteLineMat);
    whiteLineRight.rotation.x = -Math.PI / 2;
    whiteLineRight.position.set(0, 0.92, 4.6);
    bridgeGroup.add(whiteLineRight);

    // Concrete Crash Barriers (Jersey Barriers) & Steel Railings
    const barrierGeo = new THREE.BoxGeometry(deckLength, 1.1, 0.45);
    const barrierMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // Clean light concrete
      roughness: 0.5,
    });
    const barrierNorth = new THREE.Mesh(barrierGeo, barrierMat);
    barrierNorth.position.set(0, 1.2, -5.2);
    bridgeGroup.add(barrierNorth);

    const barrierSouth = new THREE.Mesh(barrierGeo, barrierMat);
    barrierSouth.position.set(0, 1.2, 5.2);
    bridgeGroup.add(barrierSouth);

    // Steel Safety Railing Handrails
    const handrailGeo = new THREE.CylinderGeometry(0.08, 0.08, deckLength, 8);
    const handrailMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85 });
    const handrailNorth = new THREE.Mesh(handrailGeo, handrailMat);
    handrailNorth.rotation.z = Math.PI / 2;
    handrailNorth.position.set(0, 1.85, -5.2);
    bridgeGroup.add(handrailNorth);

    const handrailSouth = new THREE.Mesh(handrailGeo, handrailMat);
    handrailSouth.rotation.z = Math.PI / 2;
    handrailSouth.position.set(0, 1.85, 5.2);
    bridgeGroup.add(handrailSouth);

    // 6. Realistic Reinforced Concrete H-Pylons & Stay-Cables
    const pylonHeight = 36;
    const pylonMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9, // Crisp architectural white/light grey concrete
      roughness: 0.4,
      metalness: 0.1,
    });
    const cableMat = new THREE.LineBasicMaterial({
      color: 0xcfd8dc, // Steel cables in daylight
      transparent: true,
      opacity: 0.85,
    });

    const pylonXPositions = [-26, 26];

    pylonXPositions.forEach((posX) => {
      // Left leg
      const legNorth = new THREE.Mesh(
        new THREE.CylinderGeometry(0.9, 1.7, pylonHeight, 8),
        pylonMat
      );
      legNorth.position.set(posX, pylonHeight / 2 - 8, -5);
      legNorth.rotation.z = posX < 0 ? -0.05 : 0.05;
      legNorth.castShadow = true;
      bridgeGroup.add(legNorth);

      // Right leg
      const legSouth = new THREE.Mesh(
        new THREE.CylinderGeometry(0.9, 1.7, pylonHeight, 8),
        pylonMat
      );
      legSouth.position.set(posX, pylonHeight / 2 - 8, 5);
      legSouth.rotation.z = posX < 0 ? -0.05 : 0.05;
      legSouth.castShadow = true;
      bridgeGroup.add(legSouth);

      // Horizontal Crossbeam
      const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 11), pylonMat);
      crossBeam.position.set(posX, 14, 0);
      crossBeam.castShadow = true;
      bridgeGroup.add(crossBeam);

      // Aviation Obstruction Warning Beacon Light
      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xef4444 })
      );
      beacon.position.set(posX, pylonHeight - 7.5, 0);
      bridgeGroup.add(beacon);

      // Massive Underwater Pier Foundation
      const pierFoundation = new THREE.Mesh(
        new THREE.CylinderGeometry(4.2, 4.6, 12, 16),
        abutmentMat
      );
      pierFoundation.position.set(posX, -6, 0);
      bridgeGroup.add(pierFoundation);

      // Scour Sensor Status Light on Pier
      const scourSensor = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x10b981 })
      );
      scourSensor.position.set(posX, -2.5, 4.6);
      bridgeGroup.add(scourSensor);

      // Stay Cables Fan Array
      const topCableY = pylonHeight - 10;
      const cableCount = 8;
      for (let i = 0; i < cableCount; i++) {
        const cableY = topCableY - i * 1.5;
        const deckOffset = (i + 1) * 3.4;

        [-1, 1].forEach((dir) => {
          const cableDeckX = posX + dir * deckOffset;
          if (Math.abs(cableDeckX) <= deckLength / 2) {
            [-4.8, 4.8].forEach((zSide) => {
              const points = [
                new THREE.Vector3(posX, cableY, zSide * 0.4),
                new THREE.Vector3(cableDeckX, 0.9, zSide),
              ];
              const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
              const cableLine = new THREE.Line(lineGeo, cableMat);
              bridgeGroup.add(cableLine);
            });
          }
        });
      }
    });

    // 7. REAL INDIAN VEHICLE 3D MODELS (AUTO, TRUCK, TRACTOR, SCOOTY, CAR)
    interface VehicleItem {
      group: THREE.Group;
      speed: number;
      laneZ: number;
      direction: 1 | -1;
      wheels: THREE.Mesh[];
    }

    const vehicles: VehicleItem[] = [];

    // Factory A: Authentic Indian Auto-Rickshaw
    const createAutoRickshaw = (): { group: THREE.Group; wheels: THREE.Mesh[] } => {
      const auto = new THREE.Group();
      const wheels: THREE.Mesh[] = [];

      // Lower Metal Body (Signature Emerald Green)
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.3 });
      const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 1.4), bodyMat);
      lowerBody.position.y = 0.5;
      auto.add(lowerBody);

      // Yellow Curved Roof Canopy
      const roofMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
      const roof = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.25, 1.45), roofMat);
      roof.position.set(-0.05, 1.55, 0);
      auto.add(roof);

      // Slanted windshield & frame
      const windowMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.1,
        transparent: true,
        opacity: 0.7,
      });
      const windshield = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.75), windowMat);
      windshield.rotation.y = Math.PI / 2;
      windshield.rotation.z = -0.3;
      windshield.position.set(1.05, 1.15, 0);
      auto.add(windshield);

      // Canopy Pillars (Black steel rods)
      const rodMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
      [-0.6, 0.6].forEach((zP) => {
        const rearPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8), rodMat);
        rearPillar.position.set(-1.0, 1.15, zP);
        auto.add(rearPillar);

        const frontPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8), rodMat);
        frontPillar.position.set(0.9, 1.15, zP);
        auto.add(frontPillar);
      });

      // Front chrome headlight
      const light = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      light.position.set(1.22, 0.65, 0);
      auto.add(light);

      // Wheels (1 front, 2 rear)
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
      const wheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.16, 12);
      wheelGeo.rotateZ(Math.PI / 2);

      const frontWheel = new THREE.Mesh(wheelGeo, wheelMat);
      frontWheel.position.set(0.95, 0.24, 0);
      auto.add(frontWheel);
      wheels.push(frontWheel);

      [-0.65, 0.65].forEach((zW) => {
        const rearWheel = new THREE.Mesh(wheelGeo, wheelMat);
        rearWheel.position.set(-0.75, 0.24, zW);
        auto.add(rearWheel);
        wheels.push(rearWheel);
      });

      return { group: auto, wheels };
    };

    // Factory B: Indian Heavy Cargo Truck (Tata / Ashok Leyland Lorry)
    const createIndianTruck = (cabColor: number, cargoColor: number): { group: THREE.Group; wheels: THREE.Mesh[] } => {
      const truck = new THREE.Group();
      const wheels: THREE.Mesh[] = [];

      // Front Driver Cab (High-visibility Saffron or Orange)
      const cabMat = new THREE.MeshStandardMaterial({ color: cabColor, roughness: 0.3 });
      const cab = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.8, 2.2), cabMat);
      cab.position.set(2.4, 1.3, 0);
      truck.add(cab);

      // Chrome Front Grille & Bumper
      const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.2 });
      const bumper = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 2.3), chromeMat);
      bumper.position.set(3.45, 0.45, 0);
      truck.add(bumper);

      // Windshield & Sun Visor
      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.18, 2.22), cabMat);
      visor.position.set(3.2, 2.15, 0);
      truck.add(visor);

      const windshield = new THREE.Mesh(
        new THREE.PlaneGeometry(1.9, 0.7),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65 })
      );
      windshield.rotation.y = Math.PI / 2;
      windshield.position.set(3.46, 1.6, 0);
      truck.add(windshield);

      // Rear Cargo Body / Carrier Bed
      const cargoMat = new THREE.MeshStandardMaterial({ color: cargoColor, roughness: 0.5 });
      const cargoBody = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.7, 2.25), cargoMat);
      cargoBody.position.set(-1.1, 1.35, 0);
      truck.add(cargoBody);

      // Covered Tarpaulin Goods Load
      const tarpMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
      const tarp = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.7, 2.1), tarpMat);
      tarp.position.set(-1.1, 2.45, 0);
      truck.add(tarp);

      // Headlights
      [-0.8, 0.8].forEach((zL) => {
        const hl = new THREE.Mesh(
          new THREE.SphereGeometry(0.14, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xfef08a })
        );
        hl.position.set(3.48, 0.7, zL);
        truck.add(hl);
      });

      // 6 Wheels (2 front, 4 dual rear)
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85 });
      const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.28, 14);
      wheelGeo.rotateZ(Math.PI / 2);

      // Front axle
      [-1.0, 1.0].forEach((zW) => {
        const w = new THREE.Mesh(wheelGeo, wheelMat);
        w.position.set(2.4, 0.42, zW);
        truck.add(w);
        wheels.push(w);
      });

      // Dual rear axles
      [-1.8, -0.6].forEach((xPos) => {
        [-1.05, 1.05].forEach((zW) => {
          const w = new THREE.Mesh(wheelGeo, wheelMat);
          w.position.set(xPos, 0.42, zW);
          truck.add(w);
          wheels.push(w);
        });
      });

      return { group: truck, wheels };
    };

    // Factory C: Indian Farm Tractor (Mahindra / Swaraj)
    const createTractor = (): { group: THREE.Group; wheels: THREE.Mesh[] } => {
      const tractor = new THREE.Group();
      const wheels: THREE.Mesh[] = [];

      // Classic Red Engine Hood
      const hoodMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 });
      const hood = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.85, 1.1), hoodMat);
      hood.position.set(0.6, 0.95, 0);
      tractor.add(hood);

      // Front Grille
      const grille = new THREE.Mesh(
        new THREE.PlaneGeometry(0.9, 0.65),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 })
      );
      grille.rotation.y = Math.PI / 2;
      grille.position.set(1.61, 0.95, 0);
      tractor.add(grille);

      // Vertical Exhaust Stack Chimney
      const exhaustMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
      const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.1), exhaustMat);
      exhaust.position.set(1.2, 1.7, 0.4);
      tractor.add(exhaust);

      // Driver Seat & Steering Wheel
      const seat = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.4, 0.65),
        new THREE.MeshStandardMaterial({ color: 0x1e293b })
      );
      seat.position.set(-0.4, 1.25, 0);
      tractor.add(seat);

      const steering = new THREE.Mesh(
        new THREE.TorusGeometry(0.2, 0.03, 8, 16),
        new THREE.MeshStandardMaterial({ color: 0x0f172a })
      );
      steering.rotation.y = Math.PI / 2;
      steering.rotation.x = -0.5;
      steering.position.set(0.1, 1.5, 0);
      tractor.add(steering);

      // Big Oversized Rear Tires
      const rearWheelGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.4, 16);
      rearWheelGeo.rotateZ(Math.PI / 2);
      const tireMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });

      [-0.75, 0.75].forEach((zW) => {
        const rw = new THREE.Mesh(rearWheelGeo, tireMat);
        rw.position.set(-0.55, 0.72, zW);
        tractor.add(rw);
        wheels.push(rw);
      });

      // Smaller Front Steering Tires
      const frontWheelGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.22, 14);
      frontWheelGeo.rotateZ(Math.PI / 2);
      [-0.6, 0.6].forEach((zW) => {
        const fw = new THREE.Mesh(frontWheelGeo, tireMat);
        fw.position.set(1.25, 0.36, zW);
        tractor.add(fw);
        wheels.push(fw);
      });

      return { group: tractor, wheels };
    };

    // Factory D: Two-Wheeler / Scooty / Bike
    const createScooty = (color: number): { group: THREE.Group; wheels: THREE.Mesh[] } => {
      const bike = new THREE.Group();
      const wheels: THREE.Mesh[] = [];

      const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3 });
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.4, 0.35), bodyMat);
      chassis.position.set(0, 0.48, 0);
      bike.add(chassis);

      // Handlebar & Headlight
      const bar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.65),
        new THREE.MeshStandardMaterial({ color: 0x0f172a })
      );
      bar.rotation.x = Math.PI / 2;
      bar.position.set(0.48, 0.85, 0);
      bike.add(bar);

      const headlight = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      headlight.position.set(0.65, 0.75, 0);
      bike.add(headlight);

      // Rider Silhouette (Helmet & Torso in dark slate)
      const riderMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, 0.3), riderMat);
      torso.position.set(-0.05, 0.95, 0);
      bike.add(torso);

      const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), riderMat);
      helmet.position.set(0.0, 1.35, 0);
      bike.add(helmet);

      // 2 Wheels
      const wheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.09, 12);
      wheelGeo.rotateZ(Math.PI / 2);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });

      const frontW = new THREE.Mesh(wheelGeo, wheelMat);
      frontW.position.set(0.55, 0.24, 0);
      bike.add(frontW);
      wheels.push(frontW);

      const rearW = new THREE.Mesh(wheelGeo, wheelMat);
      rearW.position.set(-0.55, 0.24, 0);
      bike.add(rearW);
      wheels.push(rearW);

      return { group: bike, wheels };
    };

    // Factory E: Passenger Sedan / Car
    const createCar = (carColor: number): { group: THREE.Group; wheels: THREE.Mesh[] } => {
      const car = new THREE.Group();
      const wheels: THREE.Mesh[] = [];

      const bodyMat = new THREE.MeshStandardMaterial({ color: carColor, roughness: 0.25 });
      const lower = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.6, 1.4), bodyMat);
      lower.position.y = 0.5;
      car.add(lower);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.55, 1.25), bodyMat);
      cabin.position.set(-0.15, 1.05, 0);
      car.add(cabin);

      // Glass Windows
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.6,
      });
      const glass = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.45, 1.28), glassMat);
      glass.position.set(-0.15, 1.05, 0);
      car.add(glass);

      // Headlights
      [-0.5, 0.5].forEach((zL) => {
        const hl = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xfef08a })
        );
        hl.position.set(1.42, 0.52, zL);
        car.add(hl);
      });

      // 4 Wheels
      const wheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.16, 12);
      wheelGeo.rotateZ(Math.PI / 2);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });

      [-0.85, 0.85].forEach((xW) => {
        [-0.7, 0.7].forEach((zW) => {
          const w = new THREE.Mesh(wheelGeo, wheelMat);
          w.position.set(xW, 0.28, zW);
          car.add(w);
          wheels.push(w);
        });
      });

      return { group: car, wheels };
    };

    // SPAWN FLEET OF INDIAN VEHICLES ACROSS DUAL LANES
    // Lane 1: Heading East (Z = -2.2, direction = 1)
    // Lane 2: Heading West (Z = +2.2, direction = -1)

    // 1. Auto-Rickshaw in Lane 1
    const auto1 = createAutoRickshaw();
    auto1.group.position.set(-35, 0.9, -2.2);
    bridgeGroup.add(auto1.group);
    vehicles.push({ group: auto1.group, speed: 0.16, laneZ: -2.2, direction: 1, wheels: auto1.wheels });

    // 2. Heavy Tata Truck in Lane 1
    const truck1 = createIndianTruck(0xea580c, 0x0284c7);
    truck1.group.position.set(-10, 0.9, -2.2);
    bridgeGroup.add(truck1.group);
    vehicles.push({ group: truck1.group, speed: 0.12, laneZ: -2.2, direction: 1, wheels: truck1.wheels });

    // 3. Passenger White Car in Lane 1
    const car1 = createCar(0xffffff);
    car1.group.position.set(15, 0.9, -2.2);
    bridgeGroup.add(car1.group);
    vehicles.push({ group: car1.group, speed: 0.22, laneZ: -2.2, direction: 1, wheels: car1.wheels });

    // 4. Scooty in Lane 1
    const bike1 = createScooty(0x0d9488);
    bike1.group.position.set(38, 0.9, -3.4);
    bridgeGroup.add(bike1.group);
    vehicles.push({ group: bike1.group, speed: 0.19, laneZ: -3.4, direction: 1, wheels: bike1.wheels });

    // 5. Farm Tractor in Lane 2 (Heading opposite direction)
    const tractor1 = createTractor();
    tractor1.group.rotation.y = Math.PI;
    tractor1.group.position.set(40, 0.9, 2.2);
    bridgeGroup.add(tractor1.group);
    vehicles.push({ group: tractor1.group, speed: 0.11, laneZ: 2.2, direction: -1, wheels: tractor1.wheels });

    // 6. Second Auto-Rickshaw in Lane 2
    const auto2 = createAutoRickshaw();
    auto2.group.rotation.y = Math.PI;
    auto2.group.position.set(18, 0.9, 2.2);
    bridgeGroup.add(auto2.group);
    vehicles.push({ group: auto2.group, speed: 0.15, laneZ: 2.2, direction: -1, wheels: auto2.wheels });

    // 7. Green Indian Truck in Lane 2
    const truck2 = createIndianTruck(0xdc2626, 0x15803d);
    truck2.group.rotation.y = Math.PI;
    truck2.group.position.set(-8, 0.9, 2.2);
    bridgeGroup.add(truck2.group);
    vehicles.push({ group: truck2.group, speed: 0.13, laneZ: 2.2, direction: -1, wheels: truck2.wheels });

    // 8. Motorbike in Lane 2
    const bike2 = createScooty(0xef4444);
    bike2.group.rotation.y = Math.PI;
    bike2.group.position.set(-30, 0.9, 3.4);
    bridgeGroup.add(bike2.group);
    vehicles.push({ group: bike2.group, speed: 0.20, laneZ: 3.4, direction: -1, wheels: bike2.wheels });

    // 8. Animation & Camera Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Realistic river water micro-oscillation
      water.position.y = -10 + Math.sin(elapsedTime * 1.2) * 0.1;

      // Animate Vehicles along the bridge
      vehicles.forEach((veh) => {
        veh.group.position.x += veh.speed * veh.direction;

        // Rotate wheels realistically according to vehicle displacement
        veh.wheels.forEach((w) => {
          w.rotation.x += (veh.speed * veh.direction) * 3.5;
        });

        // Loop vehicles seamlessly when exiting bridge abutment
        if (veh.direction === 1 && veh.group.position.x > deckLength / 2 + 6) {
          veh.group.position.x = -deckLength / 2 - 6;
        } else if (veh.direction === -1 && veh.group.position.x < -deckLength / 2 - 6) {
          veh.group.position.x = deckLength / 2 + 6;
        }
      });

      // Camera positions based on mode and scroll progress
      let targetCamX = 0;
      let targetCamY = 22;
      let targetCamZ = 60;
      let targetLookY = 2;

      // Dynamic Scroll Interpolation (Scroll haptics & camera descent)
      const scrollFactor = scrollProgress; // 0 (top) to 1 (scrolled)

      if (cameraMode === "deck") {
        // Deck eye-level perspective right next to moving traffic
        targetCamX = -12;
        targetCamY = 3.8 - scrollFactor * 1.5;
        targetCamZ = 12 - scrollFactor * 4;
        targetLookY = 2.5;
      } else if (cameraMode === "piers") {
        // Foundation & river scour sensor inspection
        targetCamX = 24;
        targetCamY = -2 + scrollFactor * 2;
        targetCamZ = 34;
        targetLookY = -6;
      } else {
        // Aerial Vista default: smoothly lowers and rotates as user scrolls down
        targetCamX = Math.sin(elapsedTime * 0.12) * 8;
        targetCamY = 22 - scrollFactor * 14; // Drops down towards deck level
        targetCamZ = 60 - scrollFactor * 25; // Zooms closer to bridge
        targetLookY = 2 - scrollFactor * 2;
      }

      // Smooth camera interpolation (damping)
      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      camera.lookAt(0, targetLookY, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
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
  }, [cameraMode, scrollProgress]);

  const activeCallout = callouts[activeCalloutIdx];

  return (
    <div className="relative w-full h-[90vh] min-h-[620px] bg-sky-100 overflow-hidden border-b border-slate-200">
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing" />

      {/* Top Institutional Notification Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none text-xs">
        {/* Left Live Badge */}
        <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-sm pointer-events-auto">
          <span className="flex items-center gap-1.5 font-bold text-sky-700">
            <Radio className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
            {text.liveTrafficBadge}
          </span>
          <span className="text-slate-300">|</span>
          <span className="font-semibold text-slate-700">{text.bridgesMonitored}</span>
        </div>

        {/* Right Camera View Switcher Buttons */}
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-slate-200/90 shadow-sm pointer-events-auto">
          <button
            onClick={() => {
              triggerHaptic(15);
              setCameraMode("aerial");
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              cameraMode === "aerial"
                ? "bg-sky-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{text.viewAerial}</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic(15);
              setCameraMode("deck");
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              cameraMode === "deck"
                ? "bg-sky-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>{text.viewDeck}</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic(15);
              setCameraMode("piers");
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              cameraMode === "piers"
                ? "bg-sky-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{text.viewPiers}</span>
          </button>
        </div>
      </div>

      {/* Main Foreground Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-12 pointer-events-none">
        {/* Top Header Information Card */}
        <div className="max-w-2xl pt-12 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 border border-slate-200 text-sky-800 text-xs font-semibold shadow-xs mb-3">
            <Shield className="w-3.5 h-3.5 text-sky-600" />
            <span>{text.dept}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none drop-shadow-xs">
            {text.title}
          </h1>
          <p className="text-lg sm:text-xl font-bold text-sky-900 mt-2">
            {text.subtitle}
          </p>
          <p className="mt-2 text-sm sm:text-base text-slate-700 font-medium leading-relaxed max-w-xl bg-white/70 backdrop-blur-sm p-3 rounded-xl border border-white/80 shadow-xs">
            {text.desc}
          </p>
        </div>

        {/* Bottom Unification Ethos Carousel & Scroll Prompt */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
          {/* Active Citizen Group Callout */}
          <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-slate-200/90 max-w-lg pointer-events-auto shadow-md relative overflow-hidden">
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
              onClick={scrollToDashboard}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg active:scale-95 group"
            >
              <span>{text.scrollHint}</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

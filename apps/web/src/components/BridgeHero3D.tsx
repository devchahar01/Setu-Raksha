"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowDown, Play, SkipForward, Volume2, Shield, Radio, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";

interface CitizenEgos {
  role: string;
  roleLocal: string;
  tagline: string;
  color: string;
}

const CITIZEN_CALLOUTS: Record<"en" | "hi" | "mr", CitizenEgos[]> = {
  en: [
    {
      role: "FARMERS",
      roleLocal: "अन्नदाता / किसान",
      tagline: "Connecting agrarian harvest corridors across fertile river basins to national markets.",
      color: "from-emerald-400 to-teal-200",
    },
    {
      role: "DOCTORS",
      roleLocal: "चिकित्सक / आरोग्य",
      tagline: "Unbroken arterial transit for life-saving emergency medical transport and trauma access.",
      color: "from-sky-400 to-cyan-200",
    },
    {
      role: "ENGINEERS",
      roleLocal: "अभियंता / नवोन्मेष",
      tagline: "24/7 AI-monitored structural resilience preserving national engineering assets.",
      color: "from-teal-400 to-emerald-200",
    },
    {
      role: "DEFENSE FORCES",
      roleLocal: "सेना / राष्ट्र रक्षा",
      tagline: "IRC Class 70R heavy mobility corridors ensuring strategic defense logistics.",
      color: "from-amber-400 to-orange-200",
    },
    {
      role: "ENTERPRISE",
      roleLocal: "व्यापारी / आर्थिक विकास",
      tagline: "The economic lifeline accelerating interstate supply chains and national commerce.",
      color: "from-indigo-400 to-cyan-200",
    },
  ],
  hi: [
    {
      role: "किसान",
      roleLocal: "अन्नदाता",
      tagline: "उपजाऊ नदी घाटियों से राष्ट्रीय मंडियों तक निर्बाध कृषि गलियारा।",
      color: "from-emerald-400 to-teal-200",
    },
    {
      role: "चिकित्सक",
      roleLocal: "जीवन रक्षक",
      tagline: "आपातकालीन चिकित्सा सेवाओं और एम्बुलेंस के लिए अबाध जीवन रेखा।",
      color: "from-sky-400 to-cyan-200",
    },
    {
      role: "अभियंता",
      roleLocal: "राष्ट्र निर्माता",
      tagline: "२४/७ एआई और टेलीमेट्री आधारित संरचनात्मक सुरक्षा निगरानी।",
      color: "from-teal-400 to-emerald-200",
    },
    {
      role: "सशस्त्र सेना",
      roleLocal: "राष्ट्र रक्षा",
      tagline: "सामरिक रक्षा रसद और भारी सैन्य वाहनों के लिए आईआरसी ७०आर गलियारा।",
      color: "from-amber-400 to-orange-200",
    },
    {
      role: "व्यापारी",
      roleLocal: "आर्थिक विकास",
      tagline: "अंतरराज्यीय आपूर्ति श्रृंखला और वाणिज्य को गति देने वाली जीवन रेखा।",
      color: "from-indigo-400 to-cyan-200",
    },
  ],
  mr: [
    {
      role: "शेतकरी",
      roleLocal: "बळीराजा / अन्नदाता",
      tagline: "सुपीक नदी खोऱ्यांमधून कृषी उत्पादनांना राष्ट्रीय बाजारपेठांशी जोडणारा सेतू.",
      color: "from-emerald-400 to-teal-200",
    },
    {
      role: "डॉक्टर",
      roleLocal: "आरोग्यदूत",
      tagline: "तातडीच्या रुग्णवाहिका आणि वैद्यकीय उपचारांसाठी अखंड जीवनवाहिनी.",
      color: "from-sky-400 to-cyan-200",
    },
    {
      role: "अभियंता",
      roleLocal: "स्थापत्य तज्ज्ञ",
      tagline: "२४/७ एआय व आयओटी आधारित सेतू आरोग्य देखरेख व सुरक्षा यंत्रणा.",
      color: "from-teal-400 to-emerald-200",
    },
    {
      role: "संरक्षण दल",
      roleLocal: "देशरक्षक / जवान",
      tagline: "अवजड लष्करी वाहतूक आणि सामरिक हालचालींसाठी सुरक्षित मार्ग.",
      color: "from-amber-400 to-orange-200",
    },
    {
      role: "व्यापारी",
      roleLocal: "उद्योजक",
      tagline: "आंतरराज्य मालवाहतूक आणि औद्योगिक विकासाला गती देणारी आर्थिक धमनी.",
      color: "from-indigo-400 to-cyan-200",
    },
  ],
};

const HERO_TEXT = {
  en: {
    badge: "CRITICAL NATIONAL INFRASTRUCTURE • DIGITAL TWIN GRID",
    titleMain: "BRIDGING A BILLION LIVES",
    titleSub: "National Bridge Infrastructure Safety & Intelligence Grid",
    desc: "A unified AI decision-support platform continuously monitoring structural health, hydraulic scour, and seismic integrity across India's vital transport arteries.",
    skip: "Skip Intro • Enter Operations Grid",
    scrollHint: "Scroll to Explore National Intelligence Grid",
    liveTelemetry: "LIVE STRUCTURAL TWIN • CABLE-STAYED PROTOTYPE",
    sensorsActive: "Sensors Active: 240 Nodes",
    sviBenchmark: "Target Prevention: 90%+",
  },
  hi: {
    badge: "महत्वपूर्ण राष्ट्रीय अवसंरचना • डिजिटल ट्विन ग्रिड",
    titleMain: "राष्ट्र सेतु: १०० करोड़ नागरिकों का विश्वास",
    titleSub: "राष्ट्रीय पुल अवसंरचना सुरक्षा एवं इंटेलिजेंस ग्रिड",
    desc: "भारत की प्रमुख नदी घाटियों में पुलों के संरचनात्मक स्वास्थ्य, कटाव और भूकंपीय सुरक्षा की २४/७ एआई आधारित निगरानी प्रणाली।",
    skip: "इंट्रो छोड़ें • ऑपरेशन्स ग्रिड में प्रवेश करें",
    scrollHint: "राष्ट्रीय इंटेलिजेंस ग्रिड देखने के लिए नीचे स्क्रॉल करें",
    liveTelemetry: "लाइव स्ट्रक्चरल ट्विन • केबल-स्टेड प्रोटोटाइप",
    sensorsActive: "सक्रिय सेंसर्स: २४० नोड्स",
    sviBenchmark: "लक्ष्य आपदा निवारण: ९०%+",
  },
  mr: {
    badge: "महत्त्वपूर्ण राष्ट्रीय पायाभूत सुविधा • डिजिटल ट्विन ग्रीड",
    titleMain: "राष्ट्र सेतू: १०० कोटी जनतेचा अखंड विश्वास",
    titleSub: "राष्ट्रीय पूल पायाभूत सुविधा सुरक्षा व गुप्तचर ग्रीड",
    desc: "महाराष्ट्रातील ५ प्रमुख नदी खोऱ्यांमधील सर्व पुलांच्या संरचनात्मक आरोग्याची, गाद पातळीची आणि भूकंपाच्या सुरक्षिततेची २४/७ थेट देखरेख.",
    skip: "इंट्रो वगळा • ऑपरेशन्स ग्रीडमध्ये प्रवेश करा",
    scrollHint: "राष्ट्रीय इंटेलिजेंस ग्रीड पाहण्यासाठी खाली स्क्रोल करा",
    liveTelemetry: "थेट संरचनात्मक मॉडेल • केबल-स्टेड प्रोटोटाइप",
    sensorsActive: "सक्रिय सेन्सर्स: २४० नोड्स",
    sviBenchmark: "आपत्ती प्रतिबंध लक्ष्य: ९०%+",
  },
};

export const BridgeHero3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeLocale } = useAppStore();
  const text = HERO_TEXT[activeLocale] || HERO_TEXT.en;
  const callouts = CITIZEN_CALLOUTS[activeLocale] || CITIZEN_CALLOUTS.en;

  const [activeCalloutIdx, setActiveCalloutIdx] = useState<number>(0);
  const [autoProgress, setAutoProgress] = useState<number>(0);
  const [introDismissed, setIntroDismissed] = useState<boolean>(false);

  // Cycle callouts
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCalloutIdx((prev) => (prev + 1) % callouts.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [callouts.length]);

  // 4-second auto transition ticker
  useEffect(() => {
    if (introDismissed) return;
    const stepMs = 50;
    const totalMs = 4500;
    const timer = setInterval(() => {
      setAutoProgress((prev) => {
        const next = prev + (stepMs / totalMs) * 100;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, stepMs);

    return () => clearInterval(timer);
  }, [introDismissed]);

  const scrollToDashboard = () => {
    setIntroDismissed(true);
    const target = document.getElementById("operations-grid");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Three.js Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060a12, 0.015);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 18, 55);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Group for entire bridge
    const bridgeGroup = new THREE.Group();
    scene.add(bridgeGroup);

    // 1. River Gorge Water Surface
    const waterGeometry = new THREE.PlaneGeometry(160, 120, 32, 32);
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x051e3e,
      roughness: 0.1,
      metalness: 0.85,
      wireframe: false,
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -8;
    scene.add(water);

    // Water wireframe subtle grid
    const waterWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(waterGeometry),
      new THREE.LineBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.15 })
    );
    waterWire.rotation.x = -Math.PI / 2;
    waterWire.position.y = -7.95;
    scene.add(waterWire);

    // 2. Canyon / Gorge Slopes (Left and Right Abutments)
    const canyonGeo = new THREE.BoxGeometry(35, 16, 80);
    const canyonMat = new THREE.MeshStandardMaterial({
      color: 0x0b1424,
      roughness: 0.9,
      metalness: 0.2,
    });
    const leftAbutment = new THREE.Mesh(canyonGeo, canyonMat);
    leftAbutment.position.set(-55, -2, 0);
    scene.add(leftAbutment);

    const rightAbutment = new THREE.Mesh(canyonGeo, canyonMat);
    rightAbutment.position.set(55, -2, 0);
    scene.add(rightAbutment);

    // 3. Bridge Deck (Box Girder)
    const deckLength = 90;
    const deckWidth = 8.5;
    const deckGeo = new THREE.BoxGeometry(deckLength, 1.2, deckWidth);
    const deckMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.3,
    });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(0, 0, 0);
    bridgeGroup.add(deck);

    // Deck glowing edge wireframe
    const deckEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(deckGeo),
      new THREE.LineBasicMaterial({ color: 0x14b8a6, transparent: true, opacity: 0.8 })
    );
    deck.add(deckEdges);

    // Central lane divider glow line
    const lanePoints = [
      new THREE.Vector3(-deckLength / 2, 0.65, 0),
      new THREE.Vector3(deckLength / 2, 0.65, 0),
    ];
    const laneGeo = new THREE.BufferGeometry().setFromPoints(lanePoints);
    const laneLine = new THREE.Line(
      laneGeo,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9 })
    );
    deck.add(laneLine);

    // 4. Twin Modern Cable-Stayed Pylons (H-shaped / Diamond Towers)
    const pylonHeight = 32;
    const pylonGeo = new THREE.CylinderGeometry(0.8, 1.6, pylonHeight, 8);
    const pylonMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.2,
    });

    // Pylon positions
    const pylonXPositions = [-22, 22];
    pylonXPositions.forEach((posX) => {
      // Left leg
      const legLeft = new THREE.Mesh(pylonGeo, pylonMat);
      legLeft.position.set(posX, pylonHeight / 2 - 8, -4);
      legLeft.rotation.z = posX < 0 ? -0.06 : 0.06;
      bridgeGroup.add(legLeft);

      // Right leg
      const legRight = new THREE.Mesh(pylonGeo, pylonMat);
      legRight.position.set(posX, pylonHeight / 2 - 8, 4);
      legRight.rotation.z = posX < 0 ? -0.06 : 0.06;
      bridgeGroup.add(legRight);

      // Crossbeam connecting legs
      const crossBeam = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.4, 9),
        pylonMat
      );
      crossBeam.position.set(posX, 12, 0);
      bridgeGroup.add(crossBeam);

      // Warning beacon light on top
      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xef4444 })
      );
      beacon.position.set(posX, pylonHeight - 8, 0);
      bridgeGroup.add(beacon);

      // Pier foundation well below water
      const pierFoundation = new THREE.Mesh(
        new THREE.CylinderGeometry(3.5, 3.8, 10, 16),
        canyonMat
      );
      pierFoundation.position.set(posX, -6, 0);
      bridgeGroup.add(pierFoundation);

      // 5. Cable-Stayed Harp Arrangement
      const cableAnchorTopY = pylonHeight - 10;
      const numCables = 7;
      for (let i = 0; i < numCables; i++) {
        const topY = cableAnchorTopY - i * 1.6;
        const deckOffset = (i + 1) * 3.2;

        // Front fan cables
        [-1, 1].forEach((dir) => {
          const deckX = posX + dir * deckOffset;
          if (Math.abs(deckX) <= deckLength / 2) {
            [-3.8, 3.8].forEach((zPos) => {
              const cablePoints = [
                new THREE.Vector3(posX, topY, zPos * 0.4),
                new THREE.Vector3(deckX, 0.6, zPos),
              ];
              const cableGeo = new THREE.BufferGeometry().setFromPoints(cablePoints);
              const cableLine = new THREE.Line(
                cableGeo,
                new THREE.LineBasicMaterial({
                  color: 0x2dd4bf,
                  transparent: true,
                  opacity: 0.45,
                })
              );
              bridgeGroup.add(cableLine);
            });
          }
        });
      }
    });

    // 6. Traveling Telemetry Data Packets (Glowing Particles Moving Along Deck)
    const particleCount = 120;
    const packetGeo = new THREE.BufferGeometry();
    const packetPositions = new Float32Array(particleCount * 3);
    const packetSpeeds = new Float32Array(particleCount);
    const packetDirections = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      packetPositions[i * 3] = (Math.random() - 0.5) * deckLength;
      packetPositions[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      packetPositions[i * 3 + 2] = (Math.random() - 0.5) * 6; // lanes
      packetSpeeds[i] = 0.15 + Math.random() * 0.25;
      packetDirections[i] = Math.random() > 0.5 ? 1 : -1;
    }

    packetGeo.setAttribute("position", new THREE.BufferAttribute(packetPositions, 3));
    const packetMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.65,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const packetParticles = new THREE.Points(packetGeo, packetMat);
    bridgeGroup.add(packetParticles);

    // 7. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x2dd4bf, 2.5);
    dirLight1.position.set(30, 40, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0284c7, 2.0);
    dirLight2.position.set(-30, 20, -20);
    scene.add(dirLight2);

    const riverLight = new THREE.PointLight(0x0ea5e9, 3, 50);
    riverLight.position.set(0, -4, 0);
    scene.add(riverLight);

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera pan and gentle orbit
      const targetCamX = Math.sin(elapsedTime * 0.18) * 12 + mouseX * 6;
      const targetCamY = 16 + Math.cos(elapsedTime * 0.12) * 3 - mouseY * 4;
      const targetCamZ = 52 + Math.sin(elapsedTime * 0.14) * 6;

      camera.position.x += (targetCamX - camera.position.x) * 0.04;
      camera.position.y += (targetCamY - camera.position.y) * 0.04;
      camera.position.z += (targetCamZ - camera.position.z) * 0.04;
      camera.lookAt(0, 3, 0);

      // Bridge subtle respiration / structural resonance
      bridgeGroup.rotation.y = Math.sin(elapsedTime * 0.08) * 0.03;

      // Animate telemetry packets along the bridge deck
      const positions = packetGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        positions[idx] += packetSpeeds[i] * packetDirections[i];
        if (positions[idx] > deckLength / 2) {
          positions[idx] = -deckLength / 2;
        } else if (positions[idx] < -deckLength / 2) {
          positions[idx] = deckLength / 2;
        }
      }
      packetGeo.attributes.position.needsUpdate = true;

      // Gentle water ripple effect
      water.position.y = -8 + Math.sin(elapsedTime * 1.5) * 0.12;

      renderer.render(scene, camera);
    };
    animate();

    // Window Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const activeCallout = callouts[activeCalloutIdx];

  return (
    <div className="relative w-full h-[92vh] min-h-[640px] bg-[#060A12] overflow-hidden border-b border-slate-800/80">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing" />

      {/* Subtle Grid Lines Overlay (NASA / GovTech Grid Aesthetic) */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Top HUD Telemetry Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between pointer-events-none text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-slate-800 pointer-events-auto">
          <span className="flex items-center gap-1.5 text-teal-400 font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            {text.liveTelemetry}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">{text.sensorsActive}</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400">{text.sviBenchmark}</span>
        </div>

        {/* Skip to Grid Control */}
        <button
          onClick={scrollToDashboard}
          className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 transition-all font-sans font-semibold text-xs shadow-lg backdrop-blur-md group"
        >
          <span>{text.skip}</span>
          <SkipForward className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Center Cinematic Narrative Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-12 pointer-events-none">
        {/* Top Header Block */}
        <div className="max-w-3xl pt-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-teal-500/30 text-teal-300 text-[11px] font-mono tracking-widest uppercase backdrop-blur-md mb-4 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            {text.badge}
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none drop-shadow-2xl">
            {text.titleMain}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 font-medium leading-relaxed drop-shadow max-w-2xl">
            {text.desc}
          </p>
        </div>

        {/* Bottom Unification Callout: Bridging Every Citizen */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-4">
          {/* Active Citizen Callout Box */}
          <div className="bg-slate-950/85 backdrop-blur-xl p-5 rounded-2xl border border-slate-800/90 max-w-xl pointer-events-auto shadow-2xl relative overflow-hidden">
            {/* Animated Glow Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-sky-500 to-indigo-500" />

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
                  NATIONAL UNIFICATION ETHOS • राष्ट्र एकात्मता
                </span>
              </div>
              <span className="font-mono text-[10px] text-teal-400 font-semibold">
                {activeCalloutIdx + 1} / {callouts.length}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-lg font-black text-white">{activeCallout.role}</span>
              <span className={`text-xs font-bold bg-gradient-to-r ${activeCallout.color} bg-clip-text text-transparent`}>
                ({activeCallout.roleLocal})
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {activeCallout.tagline}
            </p>

            {/* Callout Indicator Dots */}
            <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-800/60">
              {callouts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCalloutIdx(i)}
                  className={`h-1 rounded-full transition-all ${
                    i === activeCalloutIdx ? "w-6 bg-teal-400" : "w-2 bg-slate-700 hover:bg-slate-600"
                  }`}
                  aria-label={`Show ${callouts[i].role}`}
                />
              ))}
            </div>
          </div>

          {/* Transition Action & Scroll Button */}
          <div className="flex flex-col items-start sm:items-end gap-3 pointer-events-auto">
            {/* Auto progress bar */}
            {!introDismissed && (
              <div className="w-48 bg-slate-900/90 rounded-full h-1.5 border border-slate-800 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-400 to-sky-400 h-full transition-all duration-75"
                  style={{ width: `${autoProgress}%` }}
                />
              </div>
            )}

            <button
              onClick={scrollToDashboard}
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs tracking-wide uppercase transition-all shadow-lg hover:shadow-teal-500/25 active:scale-95 group"
            >
              <span>{text.scrollHint}</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import Link from "next/link";
import {
  ArrowDown,
  Camera,
  Layers,
  Radio,
  Shield,
  Compass,
  Sun,
  Sunset,
  CloudRain,
  Moon,
  RotateCcw,
  Box,
  Activity,
  Wind,
  Droplets,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { triggerHaptic } from "@/lib/haptics";

type EnvironmentMode = "daylight" | "sunset" | "monsoon" | "dusk";
type CameraViewMode = "live" | "structure" | "deck" | "piers" | "aerial" | "cam1" | "cam2";

interface EnvironmentData {
  timeStr: string;
  weather: string;
  windSpeed: string;
  rainfall: string;
  visibility: string;
  riverStage: string;
}

const ENV_PRESETS: Record<EnvironmentMode, EnvironmentData> = {
  daylight: {
    timeStr: "14:30 IST",
    weather: "Clear Sky",
    windSpeed: "18 km/h NW",
    rainfall: "0.0 mm/hr",
    visibility: "9.8 km",
    riverStage: "+4.82 m MSL",
  },
  sunset: {
    timeStr: "17:45 IST",
    weather: "Golden Hour",
    windSpeed: "14 km/h W",
    rainfall: "0.0 mm/hr",
    visibility: "7.8 km",
    riverStage: "+4.85 m MSL",
  },
  monsoon: {
    timeStr: "16:15 IST",
    weather: "Monsoon Surge",
    windSpeed: "34 km/h SW",
    rainfall: "18.4 mm/hr",
    visibility: "4.2 km",
    riverStage: "+6.12 m MSL",
  },
  dusk: {
    timeStr: "18:50 IST",
    weather: "Twilight Dusk",
    windSpeed: "11 km/h N",
    rainfall: "0.0 mm/hr",
    visibility: "6.5 km",
    riverStage: "+4.88 m MSL",
  },
};

export const BridgeHero3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeLocale } = useAppStore();

  const [envMode, setEnvMode] = useState<EnvironmentMode>("daylight");
  const [camMode, setCamMode] = useState<CameraViewMode>("live");
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const envRef = useRef<EnvironmentMode>("daylight");
  const camModeRef = useRef<CameraViewMode>("live");

  useEffect(() => {
    envRef.current = envMode;
  }, [envMode]);

  useEffect(() => {
    camModeRef.current = camMode;
  }, [camMode]);

  // Track global scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      setScrollProgress(progress);
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

  // Compute opacities for the photorealistic landscape background layers
  const opacities = useMemo(() => {
    if (envMode === "daylight") return { day: 1, sunset: 0, monsoon: 0, dusk: 0 };
    if (envMode === "sunset") return { day: 0, sunset: 1, monsoon: 0, dusk: 0 };
    if (envMode === "monsoon") return { day: 0, sunset: 0, monsoon: 1, dusk: 0 };
    if (envMode === "dusk") return { day: 0, sunset: 0, monsoon: 0, dusk: 1 };
    return { day: 1, sunset: 0, monsoon: 0, dusk: 0 };
  }, [envMode]);

  // THREE.JS SCENE SETUP
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(-22, 14, 60);

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
    renderer.toneMappingExposure = 1.12;
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Dynamic Directional Sun Light
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.6);
    sunLight.position.set(60, 80, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    // Glowing Sun Disc
    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(4.0, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xfffaed })
    );
    sunMesh.position.set(120, 140, 70);
    scene.add(sunMesh);

    // Ambient Lighting
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0xb0bec5, 1.25);
    scene.add(hemiLight);

    // Calibrated River Water Surface
    const riverGeo = new THREE.PlaneGeometry(380, 260, 64, 48);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.18,
      metalness: 0.82,
      transparent: true,
      opacity: 0.78,
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.y = -6;
    river.receiveShadow = true;
    scene.add(river);

    // Traditional Wooden Survey Country Boat
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

    // Cantilever Steel Truss Bridge
    const bridgeStructure = new THREE.Group();
    scene.add(bridgeStructure);

    // Steel Structural Truss Materials
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.42,
      metalness: 0.78,
    });

    const concretePierMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.9,
      metalness: 0.08,
    });

    const waterlineScourMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.95,
      metalness: 0.05,
    });

    // Concrete Piers at Waterline
    const pierPositions = [-38, -12, 12, 38];
    pierPositions.forEach((xP, idx) => {
      const pier = new THREE.Mesh(
        new THREE.CylinderGeometry(2.4, 3.2, 8.5, 16),
        idx === 1 ? waterlineScourMat : concretePierMat
      );
      pier.position.set(xP, -2.5, 0);
      pier.castShadow = true;
      pier.receiveShadow = true;
      bridgeStructure.add(pier);

      // Deep Well Foundation Base
      const wellBase = new THREE.Mesh(
        new THREE.CylinderGeometry(3.6, 3.8, 3.0, 16),
        concretePierMat
      );
      wellBase.position.set(xP, -6.8, 0);
      wellBase.receiveShadow = true;
      bridgeStructure.add(wellBase);
    });

    // Cantilever Steel Truss Towers
    [-25, 25].forEach((xTower) => {
      [-4.2, 4.2].forEach((zT) => {
        const tower = new THREE.Mesh(
          new THREE.BoxGeometry(2.2, 28, 1.8),
          steelMat
        );
        tower.position.set(xTower, 14, zT);
        tower.castShadow = true;
        bridgeStructure.add(tower);

        // Diagonal Bracings
        const diag1 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 32, 0.9), steelMat);
        diag1.rotation.z = 0.54;
        diag1.position.set(xTower - 5.5, 14, zT);
        bridgeStructure.add(diag1);

        const diag2 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 32, 0.9), steelMat);
        diag2.rotation.z = -0.54;
        diag2.position.set(xTower + 5.5, 14, zT);
        bridgeStructure.add(diag2);
      });

      // Overhead Portal Struts
      const portal = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.6, 10), steelMat);
      portal.position.set(xTower, 27.5, 0);
      portal.castShadow = true;
      bridgeStructure.add(portal);
    });

    // Bridge Highway Deck (2-way traffic)
    const deckLength = 110;
    const deckGeo = new THREE.BoxGeometry(deckLength, 1.2, 9.2);
    const deckMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Asphalt highway
      roughness: 0.85,
      metalness: 0.12,
    });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(0, 0.6, 0);
    deck.receiveShadow = true;
    deck.castShadow = true;
    bridgeStructure.add(deck);

    // Highway Lane Dividers
    [-1.8, 1.8].forEach((zM) => {
      const lineMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(deckLength - 4, 0.16),
        new THREE.MeshBasicMaterial({ color: 0xfacc15 })
      );
      lineMesh.rotation.x = -Math.PI / 2;
      lineMesh.position.set(0, 1.21, zM);
      bridgeStructure.add(lineMesh);
    });

    // HIGHWAY TRAFFIC SIMULATION (Tata Trucks, Buses, Cars, Scooters)
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

      const hl = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
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

    // Heavy Goods Truck (Tata / Ashok Leyland)
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
        const hl = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
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

    // Passenger Car (Sedan)
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
        const hl = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
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

    // Commuter Scooter
    const makeScooter = (col: number) => {
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

      const hl = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
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

    // Spawn initial vehicles
    // Lane 1 (Eastbound)
    const auto1 = makeAuto();
    auto1.group.position.set(-45, 0.9, -2.4);
    bridgeStructure.add(auto1.group);
    vehicles.push({ group: auto1.group, speed: 0.16, laneZ: -2.4, direction: 1, wheels: auto1.wheels, headlights: auto1.headlights });

    const truck1 = makeTruck(0xea580c, 0x0284c7);
    truck1.group.position.set(-18, 0.9, -2.4);
    bridgeStructure.add(truck1.group);
    vehicles.push({ group: truck1.group, speed: 0.12, laneZ: -2.4, direction: 1, wheels: truck1.wheels, headlights: truck1.headlights });

    const car1 = makeCar(0xffffff);
    car1.group.position.set(16, 0.9, -2.4);
    bridgeStructure.add(car1.group);
    vehicles.push({ group: car1.group, speed: 0.22, laneZ: -2.4, direction: 1, wheels: car1.wheels, headlights: car1.headlights });

    const scooter1 = makeScooter(0x0d9488);
    scooter1.group.position.set(38, 0.9, -3.8);
    bridgeStructure.add(scooter1.group);
    vehicles.push({ group: scooter1.group, speed: 0.19, laneZ: -3.8, direction: 1, wheels: scooter1.wheels, headlights: scooter1.headlights });

    // Lane 2 (Westbound)
    const truck2 = makeTruck(0xdc2626, 0x15803d);
    truck2.group.rotation.y = Math.PI;
    truck2.group.position.set(40, 0.9, 2.4);
    bridgeStructure.add(truck2.group);
    vehicles.push({ group: truck2.group, speed: 0.13, laneZ: 2.4, direction: -1, wheels: truck2.wheels, headlights: truck2.headlights });

    const auto2 = makeAuto();
    auto2.group.rotation.y = Math.PI;
    auto2.group.position.set(12, 0.9, 2.4);
    bridgeStructure.add(auto2.group);
    vehicles.push({ group: auto2.group, speed: 0.15, laneZ: 2.4, direction: -1, wheels: auto2.wheels, headlights: auto2.headlights });

    const car2 = makeCar(0x0f172a);
    car2.group.rotation.y = Math.PI;
    car2.group.position.set(-16, 0.9, 2.4);
    bridgeStructure.add(car2.group);
    vehicles.push({ group: car2.group, speed: 0.21, laneZ: 2.4, direction: -1, wheels: car2.wheels, headlights: car2.headlights });

    const scooter2 = makeScooter(0xef4444);
    scooter2.group.rotation.y = Math.PI;
    scooter2.group.position.set(-42, 0.9, 3.8);
    bridgeStructure.add(scooter2.group);
    vehicles.push({ group: scooter2.group, speed: 0.18, laneZ: 3.8, direction: -1, wheels: scooter2.wheels, headlights: scooter2.headlights });

    // Camera view presets
    const CAM_PRESETS: Record<CameraViewMode, { pos: [number, number, number]; lookAt: [number, number, number] }> = {
      live: { pos: [-22, 14, 60], lookAt: [0, 2, 0] },
      structure: { pos: [-12, 10, 32], lookAt: [-4, 5, 0] },
      deck: { pos: [-38, 2.8, -2.4], lookAt: [10, 2.0, -2.4] },
      piers: { pos: [-16, -2.5, 22], lookAt: [-8, -4.5, 0] },
      aerial: { pos: [0, 72, 35], lookAt: [0, 0, 0] },
      cam1: { pos: [-28, 18, 55], lookAt: [2, 1, 0] },
      cam2: { pos: [28, 16, 55], lookAt: [-2, 1, 0] },
    };

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Animate Vehicles with lane wrap
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

      // Subtle Water Rippling & Boat Sway
      river.position.y = -6 + Math.sin(elapsedTime * 1.2) * 0.05;
      boatGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.08;
      boatGroup.rotation.z = Math.sin(elapsedTime * 1.1) * 0.03;

      // Update Lighting Based on envRef
      const curEnv = envRef.current;
      if (curEnv === "daylight") {
        sunLight.color.setRGB(1.0, 0.98, 0.92);
        sunLight.intensity = 2.6;
        riverMat.color.setRGB(0.01, 0.52, 0.78);
        hemiLight.color.setRGB(1.0, 1.0, 1.0);
      } else if (curEnv === "sunset") {
        sunLight.color.setRGB(1.0, 0.72, 0.35);
        sunLight.intensity = 3.2;
        riverMat.color.setRGB(0.18, 0.36, 0.42);
        hemiLight.color.setRGB(0.95, 0.88, 0.75);
      } else if (curEnv === "monsoon") {
        sunLight.color.setRGB(0.85, 0.75, 0.65);
        sunLight.intensity = 1.8;
        riverMat.color.setRGB(0.20, 0.28, 0.32);
        hemiLight.color.setRGB(0.72, 0.75, 0.78);
      } else {
        // Dusk
        sunLight.color.setRGB(0.65, 0.35, 0.45);
        sunLight.intensity = 1.2;
        riverMat.color.setRGB(0.12, 0.16, 0.22);
        hemiLight.color.setRGB(0.55, 0.52, 0.65);
      }

      // Smooth Camera Interpolation towards selected Camera Preset
      const targetCam = CAM_PRESETS[camModeRef.current] || CAM_PRESETS.live;
      camera.position.x += (targetCam.pos[0] - camera.position.x) * 0.04;
      camera.position.y += (targetCam.pos[1] - camera.position.y) * 0.04;
      camera.position.z += (targetCam.pos[2] - camera.position.z) * 0.04;

      // Gentle continuous observation sway (very subtle, non-disorienting)
      const swayX = Math.sin(elapsedTime * 0.3) * 0.8;
      const targetLookX = targetCam.lookAt[0] + swayX;
      camera.lookAt(targetLookX, targetCam.lookAt[1], targetCam.lookAt[2]);

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

  const curEnvData = ENV_PRESETS[envMode];

  return (
    <>
      {/* 1. PHOTOREALISTIC BACKGROUND LAYERS (CALIBRATED TO ACTUAL TIME/WEATHER) */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out scale-105"
          style={{ backgroundImage: "url('/images/bridge_daylight.jpg')", opacity: opacities.day }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out scale-105"
          style={{ backgroundImage: "url('/images/bridge_sunset.jpg')", opacity: opacities.sunset }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out scale-105"
          style={{ backgroundImage: "url('/images/bridge_monsoon.jpg')", opacity: opacities.monsoon }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out scale-105"
          style={{ backgroundImage: "url('/images/bridge_dusk.jpg')", opacity: opacities.dusk }}
        />

        {/* Crisp Neutral Overlay (Not Heavy Dark Gradient) */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#fcfbf9]/40 via-transparent to-[#fcfbf9]/80" />

        {/* WebGL 3D Bridge Canvas */}
        <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      </div>

      {/* 2. OPERATIONAL ENGINEERING CONTROL ROOM OVERLAYS */}
      <div className="relative min-h-[92vh] w-full flex flex-col justify-between p-4 sm:p-8 pointer-events-none">
        {/* TOP BAR: Asset Identifier & Environmental Telemetry */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 pointer-events-none">
          {/* Top Left: Operational Asset Tag */}
          <div className="bg-[#ffffff]/95 backdrop-blur-sm p-3 rounded-lg border border-slate-300 shadow-xs pointer-events-auto max-w-md">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono text-[11px] font-bold text-slate-900 tracking-tight">
                LIVE STRUCTURAL OBSERVATION • FEED 01
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded font-bold">
                NORMAL
              </span>
            </div>
            <div className="font-extrabold text-sm text-[#0f172a] tracking-tight">
              RABINDRA SETU (HOWRAH) • CLASS 70R CANTILEVER
            </div>
            <div className="text-[11px] text-slate-600 font-mono mt-0.5 flex items-center gap-2">
              <span>ID: WB-HOW-001</span>
              <span>•</span>
              <span>RIVER: HOOGHLY</span>
              <span>•</span>
              <span className="text-sky-700 font-semibold">12 SENSORS ONLINE</span>
            </div>
          </div>

          {/* Top Right: Environmental Observation Controls */}
          <div className="bg-[#ffffff]/95 backdrop-blur-sm p-2.5 rounded-lg border border-slate-300 shadow-xs pointer-events-auto flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 border-b border-slate-200 pb-1.5 gap-4">
              <span className="font-bold text-slate-800">ENVIRONMENTAL TELEMETRY</span>
              <span className="text-slate-500">{curEnvData.timeStr}</span>
            </div>

            {/* Environmental Mode Selector Buttons */}
            <div className="flex items-center gap-1">
              {(["daylight", "sunset", "monsoon", "dusk"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setEnvMode(mode);
                    triggerHaptic("selection");
                  }}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
                    envMode === mode
                      ? "bg-[#1e293b] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {mode === "daylight"
                    ? "Day (14:30)"
                    : mode === "sunset"
                    ? "Sunset (17:45)"
                    : mode === "monsoon"
                    ? "Monsoon (16:15)"
                    : "Twilight (18:50)"}
                </button>
              ))}
            </div>

            {/* Live Meteorological Readings */}
            <div className="grid grid-cols-4 gap-2 pt-1 text-[10px] font-mono text-slate-700">
              <div className="bg-[#f8fafc] p-1.5 rounded border border-slate-200 text-center">
                <span className="text-slate-400 block text-[9px]">WIND</span>
                <span className="font-bold text-slate-800">{curEnvData.windSpeed}</span>
              </div>
              <div className="bg-[#f8fafc] p-1.5 rounded border border-slate-200 text-center">
                <span className="text-slate-400 block text-[9px]">RAINFALL</span>
                <span className="font-bold text-slate-800">{curEnvData.rainfall}</span>
              </div>
              <div className="bg-[#f8fafc] p-1.5 rounded border border-slate-200 text-center">
                <span className="text-slate-400 block text-[9px]">VISIBILITY</span>
                <span className="font-bold text-slate-800">{curEnvData.visibility}</span>
              </div>
              <div className="bg-[#f8fafc] p-1.5 rounded border border-slate-200 text-center">
                <span className="text-slate-400 block text-[9px]">STAGE</span>
                <span className="font-bold text-sky-800">{curEnvData.riverStage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Operational Status Panel & Camera Observation Presets */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mt-auto">
          {/* Bottom Left: Engineering Status & Setu Risk Breakdown */}
          <div className="bg-[#ffffff]/95 backdrop-blur-sm p-4 rounded-lg border border-slate-300 shadow-xs pointer-events-auto max-w-lg w-full">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                  STRUCTURAL HEALTH INDEX
                </span>
                <span className="font-extrabold text-sm text-[#0f172a]">
                  SETU SCORE: 82 / 100 • NORMAL
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded">
                TIER 1 (SAFE)
              </span>
            </div>

            {/* Segmented Engineering Bar */}
            <div className="grid grid-cols-5 gap-1.5 my-2">
              <div className="text-center">
                <div className="h-1.5 bg-emerald-600 rounded-xs mb-1" />
                <span className="text-[9px] font-mono text-slate-500 block">STRUCT</span>
                <span className="text-[10px] font-mono font-bold text-slate-800">82</span>
              </div>
              <div className="text-center">
                <div className="h-1.5 bg-emerald-600 rounded-xs mb-1" />
                <span className="text-[9px] font-mono text-slate-500 block">HYDRAUL</span>
                <span className="text-[10px] font-mono font-bold text-slate-800">74</span>
              </div>
              <div className="text-center">
                <div className="h-1.5 bg-emerald-600 rounded-xs mb-1" />
                <span className="text-[9px] font-mono text-slate-500 block">SEISMIC</span>
                <span className="text-[10px] font-mono font-bold text-slate-800">91</span>
              </div>
              <div className="text-center">
                <div className="h-1.5 bg-amber-500 rounded-xs mb-1" />
                <span className="text-[9px] font-mono text-slate-500 block">TRAFFIC</span>
                <span className="text-[10px] font-mono font-bold text-amber-800">68</span>
              </div>
              <div className="text-center">
                <div className="h-1.5 bg-emerald-600 rounded-xs mb-1" />
                <span className="text-[9px] font-mono text-slate-500 block">AGE</span>
                <span className="text-[10px] font-mono font-bold text-slate-800">77</span>
              </div>
            </div>

            {/* Key Sensor Measurements */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-[11px] font-mono text-slate-700">
              <div>
                <span className="text-slate-400 block text-[9px]">DECK VIBRATION</span>
                <span className="font-bold text-slate-900">2.14 Hz</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">PIER P-02 TILT</span>
                <span className="font-bold text-slate-900">0.12 mrad</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">NEXT REVIEW</span>
                <span className="font-semibold text-slate-800">14 Jan 2027</span>
              </div>
            </div>
          </div>

          {/* Bottom Right: Camera Observation Presets & Operations Link */}
          <div className="bg-[#ffffff]/95 backdrop-blur-sm p-3 rounded-lg border border-slate-300 shadow-xs pointer-events-auto flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 pb-1 border-b border-slate-200">
              <span className="font-bold text-slate-800">OBSERVATION CAMERA MODES</span>
              <span className="text-slate-500">PZT SENSOR FEED</span>
            </div>

            {/* Camera Preset Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1">
              {[
                { id: "live", label: "LIVE VIEW" },
                { id: "structure", label: "TRUSS" },
                { id: "deck", label: "DECK" },
                { id: "piers", label: "PIERS" },
                { id: "aerial", label: "AERIAL" },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => {
                    setCamMode(btn.id as CameraViewMode);
                    triggerHaptic("selection");
                  }}
                  className={`px-2 py-1 text-[11px] font-mono font-semibold rounded text-center transition-colors ${
                    camMode === btn.id
                      ? "bg-[#1e293b] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
              <Link
                href="/defect-ar"
                onClick={() => triggerHaptic("selection")}
                className="flex-1 py-1.5 px-3 bg-[#1e293b] hover:bg-[#0f172a] text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Box className="w-3.5 h-3.5 text-sky-300" />
                <span>INSPECT DIGITAL TWIN</span>
              </Link>

              <button
                onClick={scrollToOperations}
                className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold flex items-center gap-1 border border-slate-300 transition-colors"
              >
                <span>GRID TELEMETRY</span>
                <ArrowDown className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

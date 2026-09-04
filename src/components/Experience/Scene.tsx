"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, lazy, useEffect } from "react";
import * as THREE from "three";
import Atmosphere from "./Atmosphere";
import CameraController from "./CameraController";
import CharacterController from "./CharacterController";
import MonitorFocusPlane from "./MonitorFocusPlane";
import Weather from "./Weather";
import { useStore } from "@/lib/store";
import { useIsMobile } from "@/lib/useIsMobile";

const City = lazy(() => import("./City"));
const BuildingInterior = lazy(() => import("./BuildingInterior"));
const FootballArena = lazy(() => import("./FootballArena"));

function LoadingFallback() {
  return (
    <mesh position={[0, 2, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#ffd700"
        emissive="#ffd700"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

export default function Scene() {
  const { interiorOpen, selectedBuilding, introComplete, teleportOpen } = useStore();
  const isMobile = useIsMobile();

  // Disable canvas pointer events when teleport panel is open
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const wrapper = canvas.parentElement;
    canvas.style.pointerEvents = teleportOpen ? "none" : "auto";
    if (wrapper) wrapper.style.pointerEvents = teleportOpen ? "none" : "auto";
    return () => {
      canvas.style.pointerEvents = "auto";
      if (wrapper) wrapper.style.pointerEvents = "auto";
    };
  }, [teleportOpen]);

  return (
    <Canvas
      shadows={!isMobile}
      dpr={isMobile ? 1 : [1, 1.5]}
      camera={{ position: [20, 16, 20], fov: isMobile ? 55 : 45, near: 0.1, far: isMobile ? 140 : 220 }}
      gl={{
        antialias: !isMobile,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        powerPreference: isMobile ? "low-power" : "high-performance",
      }}
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Atmosphere />
        <Weather />
        {!interiorOpen && <City />}
        {!interiorOpen && (
          <Suspense fallback={null}>
            <FootballArena />
          </Suspense>
        )}
        {interiorOpen && selectedBuilding ? (
          <BuildingInterior buildingId={selectedBuilding} />
        ) : null}
        <CameraController />
        {introComplete && <CharacterController />}
        <MonitorFocusPlane />
      </Suspense>
    </Canvas>
  );
}

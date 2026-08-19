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
      shadows
      camera={{ position: [20, 16, 20], fov: 45, near: 0.1, far: 220 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        powerPreference: "high-performance",
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

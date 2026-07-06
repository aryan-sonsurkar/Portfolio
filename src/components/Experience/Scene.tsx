"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, lazy } from "react";
import Atmosphere from "./Atmosphere";
import CameraController from "./CameraController";
import CharacterController from "./CharacterController";
import Weather from "./Weather";
import { useStore } from "@/lib/store";

const City = lazy(() => import("./City"));
const BuildingInterior = lazy(() => import("./BuildingInterior"));

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
  const { interiorOpen, selectedBuilding, introComplete } = useStore();

  return (
    <Canvas
      shadows
      camera={{ position: [20, 16, 20], fov: 45, near: 0.1, far: 220 }}
      gl={{
        antialias: true,
        toneMapping: 3,
        toneMappingExposure: 1.1,
        powerPreference: "high-performance",
      }}
      style={{ position: "fixed", inset: 0 }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Atmosphere />
        <Weather />
        {!interiorOpen && <City />}
        {interiorOpen && selectedBuilding ? (
          <BuildingInterior buildingId={selectedBuilding} />
        ) : null}
        <CameraController />
        {introComplete && <CharacterController />}
      </Suspense>
    </Canvas>
  );
}

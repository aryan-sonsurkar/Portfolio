"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import City from "./City";
import Atmosphere from "./Atmosphere";
import CameraController from "./CameraController";

function LoadingFallback() {
  return (
    <mesh position={[0, 2, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.5} />
    </mesh>
  );
}

export default function Scene() {
  return (
    <Canvas
      shadows
      camera={{ position: [20, 16, 20], fov: 45, near: 0.1, far: 200 }}
      gl={{
        antialias: true,
        toneMapping: 3, // ACESFilmic
        toneMappingExposure: 1.1,
      }}
      style={{ position: "fixed", inset: 0 }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Atmosphere />
        <City />
        <CameraController />
      </Suspense>
    </Canvas>
  );
}

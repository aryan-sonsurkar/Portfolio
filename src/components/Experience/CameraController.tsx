"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { BUILDINGS } from "../Buildings/BuildingData";

const INTRO_DURATION_SECONDS = 9;

export default function CameraController() {
  const { cameraMode, focusedBuilding, introComplete, selectedBuilding } = useStore();
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  const targetPosition = useRef(new THREE.Vector3(0, 1.6, 6));
  const targetLookAt = useRef(new THREE.Vector3(0, 1.2, 0));
  const introStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (!introComplete) {
      introStartRef.current = performance.now();
      camera.position.set(0, 60, 200);
      targetPosition.current.set(0, 60, 200);
      targetLookAt.current.set(0, 8, -70);
    }
  }, [introComplete, camera]);

  useEffect(() => {
    if (cameraMode === "orbit") {
      targetPosition.current.set(16, 10, 16);
      targetLookAt.current.set(0, 1, -3);
    } else if (cameraMode === "focused" && focusedBuilding) {
      const building = BUILDINGS.find((b) => b.id === focusedBuilding);
      if (building) {
        const [bx, , bz] = building.position;
        const bh = building.scale[1];
        targetPosition.current.set(bx + 5, bh * 0.7, bz + 5);
        targetLookAt.current.set(bx, bh * 0.45, bz);
      }
    }
    // cameraMode === "screen": camera stays in place — MonitorFocusPlane handles the visual
    // cameraMode === "fpv": CharacterController handles the camera
  }, [cameraMode, focusedBuilding, selectedBuilding, camera]);

  useFrame((_, delta) => {
    // FPV and screen modes: CharacterController / MonitorFocusPlane own the camera
    if (cameraMode === "fpv" || cameraMode === "screen") return;

    if (!introComplete) {
      const startedAt = introStartRef.current ?? performance.now();
      const elapsed = (performance.now() - startedAt) / 1000;
      const t = Math.min(elapsed / INTRO_DURATION_SECONDS, 1);
      const eased = t * t * (3 - 2 * t);

      const keyframes = [
        { position: [0, 60, 200], lookAt: [0, 8, -70] },
        { position: [0, 30, 80], lookAt: [0, 8, -70] },
        { position: [0, 12, -10], lookAt: [0, 5, -20] },
        { position: [0, 5, 12], lookAt: [0, 2, 0] },
        { position: [0, 1.6, 6], lookAt: [0, 1.2, 0] },
      ];

      const segment = Math.min(Math.floor(eased * (keyframes.length - 1)), keyframes.length - 2);
      const localT = eased * (keyframes.length - 1) - segment;
      const start = keyframes[segment];
      const end = keyframes[segment + 1];

      const position = new THREE.Vector3(
        THREE.MathUtils.lerp(start.position[0], end.position[0], localT),
        THREE.MathUtils.lerp(start.position[1], end.position[1], localT),
        THREE.MathUtils.lerp(start.position[2], end.position[2], localT)
      );
      const lookAt = new THREE.Vector3(
        THREE.MathUtils.lerp(start.lookAt[0], end.lookAt[0], localT),
        THREE.MathUtils.lerp(start.lookAt[1], end.lookAt[1], localT),
        THREE.MathUtils.lerp(start.lookAt[2], end.lookAt[2], localT)
      );

      camera.position.copy(position);
      camera.lookAt(lookAt);
      return;
    }

    // Orbit / focused mode — smooth follow
    const lerpSpeed = delta * 2.8;
    camera.position.lerp(targetPosition.current, lerpSpeed);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, delta * 2.8);
      controlsRef.current.update();
    }
  });

  if (!introComplete || cameraMode === "fpv" || cameraMode === "screen") return null;

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      enableRotate={cameraMode === "orbit"}
      minDistance={4}
      maxDistance={28}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.15}
      autoRotate={cameraMode === "orbit"}
      autoRotateSpeed={0.25}
      target={[0, 1, -3]}
    />
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { BUILDINGS } from "../Buildings/BuildingData";

const INTRO_DURATION_SECONDS = 16;

export default function CameraController() {
  const { cameraMode, focusedBuilding, introComplete } = useStore();
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  const targetPosition = useRef(new THREE.Vector3(12, 10, 12));
  const targetLookAt = useRef(new THREE.Vector3(0, 1, -1));
  const introStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (!introComplete) {
      introStartRef.current = performance.now();
      camera.position.set(34, 24, 38);
      targetPosition.current.set(34, 24, 38);
      targetLookAt.current.set(0, 0, -28);
    }
  }, [introComplete, camera]);

  useEffect(() => {
    if (cameraMode === "orbit") {
      targetPosition.current.set(14, 9, 14);
      targetLookAt.current.set(0, 1, -3);
    } else if (cameraMode === "focused" && focusedBuilding) {
      const building = BUILDINGS.find((b) => b.id === focusedBuilding);
      if (building) {
        const [bx, , bz] = building.position;
        const bh = building.scale[1];
        targetPosition.current.set(bx + 6, bh * 0.7, bz + 6);
        targetLookAt.current.set(bx, bh * 0.35, bz);
      }
    }
  }, [cameraMode, focusedBuilding]);

  useFrame((_, delta) => {
    if (!introComplete) {
      const startedAt = introStartRef.current ?? performance.now();
      const elapsed = (performance.now() - startedAt) / 1000;
      const t = Math.min(elapsed / INTRO_DURATION_SECONDS, 1);
      const eased = t * t * (3 - 2 * t);

      const keyframes = [
        {
          position: [34, 24, 38],
          lookAt: [0, 0, -28],
        },
        {
          position: [18, 14, -22],
          lookAt: [0, 0, -12],
        },
        {
          position: [10, 7, -8],
          lookAt: [0, 1.8, -3],
        },
        {
          position: [2.6, 3.4, -1.2],
          lookAt: [0, 2.2, -0.3],
        },
      ];

      const segment = Math.min(
        Math.floor(eased * (keyframes.length - 1)),
        keyframes.length - 2
      );
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

    camera.position.lerp(targetPosition.current, delta * 1.2);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, delta * 1.2);
      controlsRef.current.update();
    }
  });

  if (!introComplete) return null;

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      enableRotate={cameraMode === "orbit"}
      minDistance={6}
      maxDistance={30}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.2}
      autoRotate={cameraMode === "orbit"}
      autoRotateSpeed={0.3}
      target={[0, 1, -3]}
    />
  );
}

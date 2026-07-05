"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { BUILDINGS } from "../Buildings/BuildingData";

export default function CameraController() {
  const { cameraMode, focusedBuilding, introComplete } = useStore();
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  const targetPosition = useRef(new THREE.Vector3(12, 10, 12));
  const targetLookAt = useRef(new THREE.Vector3(0, 1, -1));

  useEffect(() => {
    if (!introComplete) {
      camera.position.set(20, 16, 20);
      targetPosition.current.set(20, 16, 20);
      targetLookAt.current.set(0, 1, -3);
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
    if (!introComplete) return;

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

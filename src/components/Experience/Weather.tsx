"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/lib/store";

function Rain() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 900;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const drops = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 50,
        y: Math.random() * 25,
        z: (Math.random() - 0.5) * 40,
        speed: 10 + Math.random() * 8,
        windOffset: (Math.random() - 0.5) * 2,
      })),
    [count]
  );

  useFrame((_, delta) => {
    if (!ref.current) return;
    for (let i = 0; i < count; i++) {
      drops[i].y -= drops[i].speed * delta;
      drops[i].x += drops[i].windOffset * delta;
      if (drops[i].y < -0.5) {
        drops[i].y = 20 + Math.random() * 5;
        drops[i].x = (Math.random() - 0.5) * 50;
        drops[i].z = (Math.random() - 0.5) * 40;
      }
      dummy.position.set(drops[i].x, drops[i].y, drops[i].z);
      dummy.scale.set(0.008, 0.25, 0.008);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[0.5, 0.5, 1, 3]} />
      <meshBasicMaterial color="#7799bb" transparent opacity={0.35} />
    </instancedMesh>
  );
}

function Lightning() {
  const ref = useRef<THREE.PointLight>(null);
  const timer = useRef(0);
  const nextFlash = useRef(3 + Math.random() * 8);

  useFrame((_, delta) => {
    if (!ref.current) return;
    timer.current += delta;
    if (timer.current > nextFlash.current) {
      ref.current.intensity = 15 + Math.random() * 10;
      timer.current = 0;
      nextFlash.current = 5 + Math.random() * 12;
    }
    if (ref.current.intensity > 0) {
      ref.current.intensity *= 0.85;
      if (ref.current.intensity < 0.1) ref.current.intensity = 0;
    }
  });

  return (
    <pointLight
      ref={ref}
      position={[(Math.random() - 0.5) * 20, 15, (Math.random() - 0.5) * 20]}
      color="#ccddff"
      intensity={0}
      distance={60}
    />
  );
}

function SplashRing() {
  const ref = useRef<THREE.Mesh>(null);
  const timer = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    timer.current += delta;
    if (timer.current > 0.3) {
      timer.current = 0;
      ref.current.position.x = (Math.random() - 0.5) * 16;
      ref.current.position.z = (Math.random() - 0.5) * 12;
      ref.current.scale.set(0.1, 0.1, 0.1);
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.3;
    }
    const s = ref.current.scale.x;
    if (s < 0.5) {
      ref.current.scale.set(s + delta * 0.4, s + delta * 0.4, 1);
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        Math.max(0, 0.3 - s * 0.6);
    }
  });

  return (
    <mesh ref={ref} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.3, 0.35, 16]} />
      <meshBasicMaterial
        color="#8899bb"
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function Weather() {
  const { weatherActive } = useStore();

  if (!weatherActive) return null;

  return (
    <group>
      <Rain />
      <Lightning />
      <SplashRing />
      {/* Dim the scene slightly during rain */}
      <ambientLight intensity={0.08} color="#667799" />
    </group>
  );
}

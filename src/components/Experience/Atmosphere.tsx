"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Clouds() {
  const groupRef = useRef<THREE.Group>(null);

  const clouds = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 60,
        8 + Math.random() * 6,
        (Math.random() - 0.5) * 40,
      ] as [number, number, number],
      scale: 1 + Math.random() * 2.5,
      speed: 0.02 + Math.random() * 0.03,
      opacity: 0.15 + Math.random() * 0.15,
    }));
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      child.position.x += clouds[i].speed * delta;
      if (child.position.x > 35) child.position.x = -35;
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={cloud.position}>
          <sphereGeometry args={[cloud.scale, 8, 6]} />
          <meshStandardMaterial
            color="#fff5e6"
            transparent
            opacity={cloud.opacity}
            roughness={1}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);

  const count = 200;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = Math.random() * 15;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      (pos.array as Float32Array)[i * 3 + 1] += delta * 0.15;
      if ((pos.array as Float32Array)[i * 3 + 1] > 15) {
        (pos.array as Float32Array)[i * 3 + 1] = 0;
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ffd700"
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </points>
  );
}

function SkyGradient() {
  return (
    <>
      <mesh position={[0, 0, -30]} rotation={[0, 0, 0]}>
        <planeGeometry args={[120, 60]} />
        <meshBasicMaterial
          color="#1a0a2e"
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Horizon glow */}
      <mesh position={[0, 2, -25]}>
        <planeGeometry args={[120, 15]} />
        <meshBasicMaterial
          color="#ff6b35"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

function Moon() {
  return (
    <group position={[15, 18, -20]}>
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#f0e6d8" />
      </mesh>
      {/* Glow */}
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial
          color="#f0e6d8"
          transparent
          opacity={0.1}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function Atmosphere() {
  return (
    <>
      <color attach="background" args={["#0a0612"]} />
      <fog attach="fog" args={["#0a0612", 25, 65]} />
      <SkyGradient />
      <Moon />
      <Clouds />
      <Particles />
      {/* Ambient */}
      <ambientLight intensity={0.2} color="#b4c6e7" />
      {/* Main directional — warm golden */}
      <directionalLight
        position={[8, 12, 5]}
        intensity={1.8}
        color="#ffd4a8"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      {/* Fill — cool blue */}
      <directionalLight
        position={[-5, 8, -3]}
        intensity={0.4}
        color="#4a6fa5"
      />
      {/* Rim — warm accent */}
      <directionalLight
        position={[0, 3, -10]}
        intensity={0.3}
        color="#ff8c42"
      />
    </>
  );
}

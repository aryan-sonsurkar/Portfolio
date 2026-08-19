"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/lib/store";

function Clouds() {
  const groupRef = useRef<THREE.Group>(null);
  const { weatherActive } = useStore();
  const windPhase = useRef(0);

  const clouds = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 60,
        8 + Math.random() * 6,
        (Math.random() - 0.5) * 40,
      ] as [number, number, number],
      scale: 1 + Math.random() * 2.5,
      baseSpeed: 0.02 + Math.random() * 0.03,
      opacity: 0.15 + Math.random() * 0.15,
    }));
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    windPhase.current += delta * 0.5;
    const windMultiplier = weatherActive
      ? 1.5 + Math.sin(windPhase.current * 1.7) * 0.8
      : 1;

    groupRef.current.children.forEach((child, i) => {
      child.position.x += clouds[i].baseSpeed * windMultiplier * delta;
      if (child.position.x > 35) child.position.x = -35;
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={cloud.position}>
          <sphereGeometry args={[cloud.scale, 8, 6]} />
          <meshBasicMaterial
            color="#fff5e6"
            transparent
            opacity={cloud.opacity}
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
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
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
        <sphereGeometry args={[1.5, 20, 20]} />
        <meshBasicMaterial color="#f0e6d8" />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.2, 20, 20]} />
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

function DropPod() {
  const groupRef = useRef<THREE.Group>(null);
  const { introProgress } = useStore();

  useFrame(() => {
    if (!groupRef.current) return;
    if (introProgress >= 0.35) return;

    const eased = introProgress < 0.35 ? introProgress / 0.35 : 1;
    const x = THREE.MathUtils.lerp(-70, 0, eased);
    const y = THREE.MathUtils.lerp(24, 4, eased);
    const z = THREE.MathUtils.lerp(30, -10, eased);

    groupRef.current.position.set(x, y, z);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(0.15, -0.35, eased);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(0.08, -0.12, eased);
  });

  return (
    <group ref={groupRef} position={[-70, 24, 30]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.8, 0.95, 2.2, 18]} />
        <meshStandardMaterial color="#3f2b2d" emissive="#ff6b35" emissiveIntensity={0.8} metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.72, 0.78, 0.6, 18]} />
        <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <coneGeometry args={[0.7, 1.1, 18]} />
        <meshStandardMaterial color="#1f2937" emissive="#ffd166" emissiveIntensity={0.7} />
      </mesh>
      <pointLight position={[0, 0.4, 0]} color="#ffd166" intensity={2.4} distance={12} />
    </group>
  );
}

function Stars() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(1200 * 3);
    for (let i = 0; i < 1200; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 180;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 100;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 220;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.002;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.2} color="#dfe7ff" transparent opacity={0.9} depthWrite={false} />
    </points>
  );
}

function Earth() {
  const groupRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  const earthTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const size = 1024;
    canvas.width = size;
    canvas.height = size / 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const gradient = ctx.createLinearGradient(0, 0, size, size / 2);
    gradient.addColorStop(0, "#0f3d70");
    gradient.addColorStop(0.55, "#1d6b89");
    gradient.addColorStop(1, "#7bd4ff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size / 2);

    ctx.fillStyle = "#2ca25f";
    [
      [0.2, 0.28, 0.16, 0.12],
      [0.35, 0.26, 0.12, 0.1],
      [0.58, 0.3, 0.14, 0.12],
      [0.7, 0.2, 0.16, 0.1],
      [0.78, 0.45, 0.12, 0.12],
    ].forEach(([x, y, w, h]) => {
      ctx.beginPath();
      ctx.ellipse(x * size, y * (size / 2), w * size, h * (size / 2), 0, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = "#f2c94c";
    ctx.beginPath();
    ctx.arc(0.75 * size, 0.18 * (size / 2), 0.04 * size, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }, []);

  const cloudTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    for (let i = 0; i < 140; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = 10 + Math.random() * 24;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }, []);

  const lightPositions = useMemo(() => {
    const arr = new Float32Array(240 * 3);
    for (let i = 0; i < 240; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 0.97;
      arr[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      arr[i * 3 + 1] = Math.cos(phi) * radius;
      arr[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.02;
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.012;
    }
  });

  return (
    <group ref={groupRef} position={[0, 8, -70]} scale={[16, 16, 16]}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial
          map={earthTexture || undefined}
          emissive="#173b63"
          emissiveIntensity={0.12}
        />
      </mesh>
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.01, 32, 32]} />
        <meshBasicMaterial
          map={cloudTexture || undefined}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lightPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.008} color="#ffd166" transparent opacity={0.9} depthWrite={false} />
      </points>
      <mesh>
        <sphereGeometry args={[1.02, 32, 32]} />
        <meshBasicMaterial color="#82d3ff" transparent opacity={0.08} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function Atmosphere() {
  return (
    <>
      <color attach="background" args={["#0a0612"]} />
      <fog attach="fog" args={["#0a0612", 25, 65]} />
      <Stars />
      <SkyGradient />
      <Moon />
      <Earth />
      <DropPod />
      <Clouds />
      <Particles />
      <ambientLight intensity={0.2} color="#b4c6e7" />
      <directionalLight
        position={[8, 12, 5]}
        intensity={1.8}
        color="#ffd4a8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />
      <directionalLight position={[-5, 8, -3]} intensity={0.4} color="#4a6fa5" />
      <directionalLight position={[0, 3, -10]} intensity={0.3} color="#ff8c42" />
    </>
  );
}

"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

const ARENA_CENTER: [number, number, number] = [10, 0, -6];

function Turf() {
  return (
    <group position={ARENA_CENTER}>
      {/* Main turf */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#1a6a1a" roughness={0.9} />
      </mesh>

      {/* Grass stripes */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh
          key={`stripe-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.015, -5 + i * 0.85]}
          receiveShadow
        >
          <planeGeometry args={[12, 0.42]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#1a6a1a" : "#1e7e1e"}
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* Center circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[1.5, 1.55, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Center dot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <circleGeometry args={[0.08, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function Football() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={[ARENA_CENTER[0], 0.15, ARENA_CENTER[2]]}>
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      {/* Football pattern - black pentagons */}
      {[0, 1.2, 2.4, 3.6, 4.8].map((angle, i) => (
        <mesh
          key={`pent-${i}`}
          position={[
            Math.cos(angle) * 0.152,
            0,
            Math.sin(angle) * 0.152,
          ]}
          rotation={[0, angle, 0]}
        >
          <boxGeometry args={[0.04, 0.04, 0.001]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      ))}
    </group>
  );
}

function RonaldoPhoto({
  position,
  rotation,
  label,
  color,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  label: string;
  color: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[1.0, 0.8, 0.05]} />
        <meshStandardMaterial color="#1a1a24" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Photo area */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[0.85, 0.65]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Label */}
      <Text
        position={[0, -0.5, 0.03]}
        fontSize={0.08}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-Bold.woff"
      >
        {label}
      </Text>
      {/* Frame glow */}
      <pointLight color="#ffd700" intensity={0.5} distance={2} position={[0, 0, 0.3]} />
    </group>
  );
}

function Banner({
  position,
  text,
  color,
}: {
  position: [number, number, number];
  text: string;
  color: string;
}) {
  return (
    <group position={position}>
      {/* Banner background */}
      <mesh>
        <boxGeometry args={[2.5, 0.5, 0.05]} />
        <meshStandardMaterial color="#0a0a14" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Banner text */}
      <Text
        position={[0, 0, 0.03]}
        fontSize={0.15}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-Bold.woff"
        letterSpacing={0.1}
      >
        {text}
      </Text>
      {/* Glow */}
      <pointLight color={color} intensity={0.8} distance={3} position={[0, 0, 0.5]} />
    </group>
  );
}

function NPC({
  position,
  color,
  armAngle,
}: {
  position: [number, number, number];
  color: string;
  armAngle: number;
}) {
  return (
    <group position={position}>
      {/* Head */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#ffccaa" roughness={0.7} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.35, 0.6, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.25, 1.3, 0]} rotation={[0, 0, armAngle]}>
        <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.25, 1.3, 0]} rotation={[0, 0, -armAngle]}>
        <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.08, 0.65, 0]}>
        <capsuleGeometry args={[0.06, 0.35, 4, 8]} />
        <meshStandardMaterial color="#1a1a2a" roughness={0.7} />
      </mesh>
      <mesh position={[0.08, 0.65, 0]}>
        <capsuleGeometry args={[0.06, 0.35, 4, 8]} />
        <meshStandardMaterial color="#1a1a2a" roughness={0.7} />
      </mesh>
    </group>
  );
}

function NPCGroup() {
  const npcData = [
    { pos: [-3, 0, 1] as [number, number, number], color: "#ff4444", armAngle: 0.8 },
    { pos: [-2.2, 0, 1.5] as [number, number, number], color: "#4444ff", armAngle: 1.0 },
    { pos: [-1.4, 0, 1.2] as [number, number, number], color: "#44ff44", armAngle: 0.6 },
    { pos: [3, 0, 1] as [number, number, number], color: "#ffaa00", armAngle: 0.9 },
    { pos: [2.2, 0, 1.5] as [number, number, number], color: "#ff44ff", armAngle: 1.1 },
    { pos: [1.4, 0, 1.2] as [number, number, number], color: "#44ffff", armAngle: 0.7 },
    { pos: [-3.5, 0, -1] as [number, number, number], color: "#ff8800", armAngle: 0.5 },
    { pos: [3.5, 0, -1] as [number, number, number], color: "#88ff00", armAngle: 0.8 },
  ];

  return (
    <group position={ARENA_CENTER}>
      {npcData.map((npc, i) => (
        <NPC key={i} position={npc.pos} color={npc.color} armAngle={npc.armAngle} />
      ))}
    </group>
  );
}

function ArenaSign() {
  return (
    <group position={[ARENA_CENTER[0], 4.5, ARENA_CENTER[2] - 5]}>
      {/* Sign background */}
      <mesh>
        <boxGeometry args={[6, 1.2, 0.2]} />
        <meshStandardMaterial color="#0a0a14" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Border glow */}
      <mesh position={[0, 0, 0.11]}>
        <boxGeometry args={[6.2, 1.4, 0.02]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={2}
          transparent
          opacity={0.4}
        />
      </mesh>
      {/* Text */}
      <Text
        position={[0, 0.15, 0.12]}
        fontSize={0.5}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-Bold.woff"
      >
        ARYAN ARENA
      </Text>
      <Text
        position={[0, -0.3, 0.12]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-Bold.woff"
        letterSpacing={0.2}
      >
        WHERE PASSION MEETS CODE
      </Text>
      {/* Spotlight */}
      <spotLight
        position={[0, 1.5, 1.5]}
        angle={0.5}
        penumbra={0.5}
        intensity={2}
        color="#00ff88"
      />
    </group>
  );
}

function FloodLights() {
  const positions: [number, number, number][] = [
    [6, 6, -2],
    [-6, 6, -2],
    [6, 6, -10],
    [-6, 6, -10],
  ];

  return (
    <group>
      {positions.map((pos, i) => (
        <group key={`light-${i}`} position={[ARENA_CENTER[0] + pos[0], pos[1], ARENA_CENTER[2] + pos[2]]}>
          {/* Pole */}
          <mesh position={[0, -3, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 6, 6]} />
            <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Light housing */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.8, 0.2, 0.5]} />
            <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Bulb */}
          <mesh position={[0, -0.15, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color="#ffffee" emissive="#ffffee" emissiveIntensity={3} />
          </mesh>
          <spotLight
            position={[0, -0.2, 0]}
            angle={0.7}
            penumbra={0.5}
            intensity={3}
            color="#ffffee"
            distance={18}
            castShadow
          />
        </group>
      ))}
    </group>
  );
}

export default function FootballArena() {
  return (
    <group>
      <Turf />
      <Football />
      <ArenaSign />
      <NPCGroup />
      <FloodLights />

      {/* Ronaldo photos on stands */}
      <group position={ARENA_CENTER}>
        <RonaldoPhoto
          position={[-3.5, 1.5, -4]}
          rotation={[0, 0.3, 0]}
          label="CR7 - THE GOAT"
          color="#ff0000"
        />
        <RonaldoPhoto
          position={[3.5, 1.5, -4]}
          rotation={[0, -0.3, 0]}
          label="CHAMPIONS LEAGUE"
          color="#ffffff"
        />
        <RonaldoPhoto
          position={[-4, 1.5, 0]}
          rotation={[0, Math.PI / 2, 0]}
          label="SIIII celebration"
          color="#ffd700"
        />
        <RonaldoPhoto
          position={[4, 1.5, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          label="MAN UNITED #7"
          color="#ff4444"
        />
      </group>

      {/* Banners */}
      <group position={ARENA_CENTER}>
        <Banner
          position={[0, 3.5, -4.5]}
          text="TALENT WITHOUT HARD WORK IS NOTHING"
          color="#ffd700"
        />
        <Banner
          position={[-4.5, 3, 0]}
          text="CR7 THE GOAT"
          color="#00ff88"
        />
        <Banner
          position={[4.5, 3, 0]}
          text="SIIII!"
          color="#ff4444"
        />
      </group>

      {/* Ambient lighting */}
      <ambientLight intensity={0.4} color="#ffffff" />
      <pointLight
        position={[ARENA_CENTER[0], 8, ARENA_CENTER[2]]}
        intensity={1.5}
        color="#ffffee"
        distance={25}
      />
      {/* Green accent light */}
      <pointLight
        position={[ARENA_CENTER[0], 2, ARENA_CENTER[2]]}
        intensity={0.8}
        color="#00ff88"
        distance={15}
      />
    </group>
  );
}

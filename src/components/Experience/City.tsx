"use client";

import { useRef } from "react";
import * as THREE from "three";
import Building from "./Building";
import { BUILDINGS } from "../Buildings/BuildingData";

function Ground() {
  return (
    <>
      {/* Main ground plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#1a1520" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* City block platform */}
      <mesh position={[0, -0.05, -3]} receiveShadow>
        <boxGeometry args={[24, 0.1, 22]} />
        <meshStandardMaterial color="#1e1825" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Subtle grid lines */}
      {Array.from({ length: 17 }, (_, i) => (
        <mesh
          key={`line-x-${i}`}
          position={[-8 + i, 0.01, -3]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.015, 22]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.03} />
        </mesh>
      ))}
      {Array.from({ length: 15 }, (_, i) => (
        <mesh
          key={`line-z-${i}`}
          position={[0, 0.01, -14 + i]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        >
          <planeGeometry args={[0.015, 24]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.03} />
        </mesh>
      ))}

      {/* Road / path */}
      <mesh position={[0, 0.005, 3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[22, 2]} />
        <meshStandardMaterial color="#151018" roughness={0.95} />
      </mesh>
    </>
  );
}

function StreetLamps() {
  const positions: [number, number, number][] = [
    [-9, 0, 4],
    [-4, 0, 4],
    [4, 0, 4],
    [9, 0, 4],
    [-9, 0, -13],
    [9, 0, -13],
    [-1, 0, -13],
    [1, 0, -13],
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Pole */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 2.4, 8]} />
            <meshStandardMaterial color="#3a3540" metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Lamp */}
          <mesh position={[0, 2.5, 0]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial
              color="#ffd700"
              emissive="#ffd700"
              emissiveIntensity={2}
            />
          </mesh>
          {/* Light */}
          <pointLight
            color="#ffd700"
            intensity={1.5}
            distance={6}
            position={[0, 2.5, 0]}
          />
        </group>
      ))}
    </>
  );
}

function Bench({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Seat */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.2, 0.08, 0.4]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.8} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.5, 0.17, 0]}>
        <boxGeometry args={[0.06, 0.34, 0.35]} />
        <meshStandardMaterial color="#3a3530" metalness={0.4} />
      </mesh>
      <mesh position={[0.5, 0.17, 0]}>
        <boxGeometry args={[0.06, 0.34, 0.35]} />
        <meshStandardMaterial color="#3a3530" metalness={0.4} />
      </mesh>
    </group>
  );
}

export default function City() {
  return (
    <group>
      <Ground />
      <StreetLamps />
      <Bench position={[-5, 0, 4.5]} />
      <Bench position={[5, 0, 4.5]} />
      <Bench position={[-7, 0, -12]} />
      <Bench position={[7, 0, -12]} />

      {BUILDINGS.map((config) => (
        <Building key={config.id} config={config} />
      ))}
    </group>
  );
}

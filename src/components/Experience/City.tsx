"use client";

import { useRef } from "react";
import * as THREE from "three";
import Building from "./Building";
import { BUILDINGS } from "../Buildings/BuildingData";

function Ground() {
  return (
    <>
      {/* Main ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#141018" roughness={0.97} metalness={0.02} />
      </mesh>

      {/* City block platform */}
      <mesh position={[0, -0.06, -3]} receiveShadow>
        <boxGeometry args={[26, 0.12, 26]} />
        <meshStandardMaterial color="#1a1525" roughness={0.92} metalness={0.04} />
      </mesh>

      {/* Sidewalk strips */}
      <mesh position={[0, 0.005, 4.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 1.4]} />
        <meshStandardMaterial color="#1c1828" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.005, -14.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 1.4]} />
        <meshStandardMaterial color="#1c1828" roughness={0.9} />
      </mesh>

      {/* Road */}
      <mesh position={[0, 0.006, 3.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 2.4]} />
        <meshStandardMaterial color="#130f16" roughness={0.97} />
      </mesh>
      {/* Road center dashes */}
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} position={[-9 + i * 2, 0.008, 3.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.8, 0.08]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.25} />
        </mesh>
      ))}

      {/* Subtle grid lines on platform */}
      {Array.from({ length: 18 }, (_, i) => (
        <mesh key={`gx-${i}`} position={[-8.5 + i, 0.01, -3]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.012, 24]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.025} />
        </mesh>
      ))}
      {Array.from({ length: 16 }, (_, i) => (
        <mesh key={`gz-${i}`} position={[0, 0.01, -15 + i]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[0.012, 26]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.025} />
        </mesh>
      ))}
    </>
  );
}

function StreetLamps() {
  const positions: [number, number, number][] = [
    [-10, 0, 4.5],
    [-5, 0, 4.5],
    [5, 0, 4.5],
    [10, 0, 4.5],
    [-10, 0, -14],
    [-3, 0, -14],
    [3, 0, -14],
    [10, 0, -14],
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Pole */}
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 3, 8]} />
            <meshStandardMaterial color="#2a2535" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Arm */}
          <mesh position={[0.25, 2.95, 0]} rotation={[0, 0, Math.PI / 8]}>
            <cylinderGeometry args={[0.025, 0.025, 0.55, 6]} />
            <meshStandardMaterial color="#2a2535" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Lamp globe */}
          <mesh position={[0.45, 3.2, 0]}>
            <sphereGeometry args={[0.14, 10, 10]} />
            <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={3} />
          </mesh>
          <pointLight color="#ffd700" intensity={2.5} distance={7} position={[0.45, 3.2, 0]} />
        </group>
      ))}
    </>
  );
}

function Bench({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[1.3, 0.07, 0.42]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.65, -0.18]} castShadow>
        <boxGeometry args={[1.3, 0.35, 0.06]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.8} />
      </mesh>
      {([-0.55, 0.55] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 0.19, 0]}>
          <boxGeometry args={[0.06, 0.38, 0.38]} />
          <meshStandardMaterial color="#2a2828" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function Mailbox({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.22, 0.18, 0.3]} />
        <meshStandardMaterial color="#1a3a5c" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 0.64, 6]} />
        <meshStandardMaterial color="#2a2535" metalness={0.7} />
      </mesh>
    </group>
  );
}

function TrashCan({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.11, 0.48, 8]} />
        <meshStandardMaterial color="#1c1c24" metalness={0.3} roughness={0.7} />
      </mesh>
    </group>
  );
}

/** Under-construction building — "The Future is Under Construction" */
function ConstructionSite() {
  return (
    <group position={[8, 0, 4]}>
      {/* Foundation slab */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[3.5, 0.1, 3.5]} />
        <meshStandardMaterial color="#1a1820" roughness={0.95} />
      </mesh>
      {/* Scaffold poles */}
      {[[-1.5, 1.5, -1.5], [1.5, 1.5, -1.5], [-1.5, 1.5, 1.5], [1.5, 1.5, 1.5]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.08, 3, 0.08]} />
          <meshStandardMaterial color="#b8860b" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* Horizontal bars */}
      {[1.0, 2.4].map((y, i) => (
        <mesh key={i} position={[0, y, -1.5]} castShadow>
          <boxGeometry args={[3.0, 0.07, 0.07]} />
          <meshStandardMaterial color="#b8860b" metalness={0.6} />
        </mesh>
      ))}
      {[1.0, 2.4].map((y, i) => (
        <mesh key={i} position={[0, y, 1.5]} castShadow>
          <boxGeometry args={[3.0, 0.07, 0.07]} />
          <meshStandardMaterial color="#b8860b" metalness={0.6} />
        </mesh>
      ))}
      {/* Concrete skeleton walls — partial */}
      <mesh position={[0, 0.8, -1.4]} castShadow>
        <boxGeometry args={[2.8, 1.6, 0.12]} />
        <meshStandardMaterial color="#2a2535" roughness={0.9} />
      </mesh>
      {/* Hazard tape */}
      <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, 3.6]} />
        <meshBasicMaterial color="#1a1520" transparent opacity={0.6} />
      </mesh>
      {/* Warning sign */}
      <group position={[0, 2.2, -1.3]}>
        <mesh>
          <boxGeometry args={[1.4, 0.48, 0.04]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <pointLight color="#f59e0b" intensity={1.5} distance={3} position={[0, 0, 0.3]} />
      </group>
      {/* Warning lights */}
      <mesh position={[-1.5, 3.1, -1.5]}>
        <sphereGeometry args={[0.09, 6, 6]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3} />
      </mesh>
      <pointLight color="#ef4444" intensity={1.2} distance={4} position={[-1.5, 3.1, -1.5]} />
      <mesh position={[1.5, 3.1, 1.5]}>
        <sphereGeometry args={[0.09, 6, 6]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3} />
      </mesh>
      <pointLight color="#ef4444" intensity={1.2} distance={4} position={[1.5, 3.1, 1.5]} />
    </group>
  );
}

/** Inaccessible "ARYAN v2.0" future building */
function FutureBuilding() {
  return (
    <group position={[-9, 0, 5]}>
      {/* Silhouette — dark, fogged out */}
      <mesh position={[0, 3, 0]} castShadow>
        <boxGeometry args={[2.2, 6, 2.2]} />
        <meshStandardMaterial
          color="#0a0810"
          emissive="#7c3aed"
          emissiveIntensity={0.06}
          roughness={0.98}
          metalness={0.02}
          transparent
          opacity={0.65}
        />
      </mesh>
      {/* Roof accent */}
      <mesh position={[0, 6.1, 0]}>
        <boxGeometry args={[2.0, 0.12, 2.0]} />
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.4} />
      </mesh>
      {/* Glowing outline effect */}
      <pointLight color="#7c3aed" intensity={1.0} distance={5} position={[0, 3, 0]} />
      {/* "COMING SOON" marker */}
      <mesh position={[0, 0.2, 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.0, 0.5]} />
        <meshBasicMaterial color="#0a0810" />
      </mesh>
    </group>
  );
}

export default function City() {
  return (
    <group>
      <Ground />
      <StreetLamps />

      {/* Benches */}
      <Bench position={[-5, 0, 4.8]} />
      <Bench position={[5, 0, 4.8]} />
      <Bench position={[-8, 0, -13.5]} />
      <Bench position={[8, 0, -13.5]} />

      {/* Street props */}
      <Mailbox position={[-11, 0, 4.5]} />
      <Mailbox position={[11, 0, 4.5]} />
      <TrashCan position={[-8, 0, 4.6]} />
      <TrashCan position={[8, 0, 4.6]} />
      <TrashCan position={[-2, 0, -14.5]} />

      {/* Construction site + future building */}
      <ConstructionSite />
      <FutureBuilding />

      {/* All main buildings */}
      {BUILDINGS.map((config) => (
        <Building key={config.id} config={config} />
      ))}
    </group>
  );
}

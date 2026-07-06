"use client";

import { Suspense, useEffect, useState } from "react";
import { Html, Text } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { BUILDINGS } from "../Buildings/BuildingData";
import { monitorConfig, type BuildingMonitors } from "@/config/monitors";
import ImageMonitor from "./ImageMonitor";

interface BuildingInteriorProps {
  buildingId: string;
}

// ═══════════════════════════════════════════════════════════════
// SHELL COMPONENTS
// ═══════════════════════════════════════════════════════════════

function RoomShell({ walls }: { walls: BuildingMonitors["walls"] }) {
  if (!walls || walls.length === 0) return null;
  return (
    <group>
      {walls.map((w, i) => (
        <mesh key={i} position={w.position} receiveShadow>
          <boxGeometry args={w.size} />
          <meshStandardMaterial
            color="#0f1218"
            roughness={0.95}
            metalness={w.position[1] === 0 ? 0.04 : 0.05}
          />
        </mesh>
      ))}
    </group>
  );
}

function CeilingLights({ lights }: { lights: BuildingMonitors["ceilingLights"] }) {
  return (
    <group>
      {lights.map((light, i) => (
        <group key={i} position={[light.x, 4.6, light.z]}>
          <mesh>
            <boxGeometry args={[1.6, 0.06, 0.18]} />
            <meshStandardMaterial
              color={light.color}
              emissive={light.color}
              emissiveIntensity={3.5}
            />
          </mesh>
          <pointLight color={light.color} intensity={10} distance={10} decay={2} />
        </group>
      ))}
    </group>
  );
}

function Desks({ desks }: { desks: BuildingMonitors["desks"] }) {
  if (!desks || desks.length === 0) return null;
  return (
    <group>
      {desks.map((desk, i) => (
        <mesh key={i} position={[desk.position[0], desk.position[1] + 0.75, desk.position[2]]} castShadow>
          <boxGeometry args={desk.size} />
          <meshStandardMaterial color="#1c1c24" roughness={0.5} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function ServerRacks({ racks }: { racks: BuildingMonitors["serverRacks"] }) {
  if (!racks || racks.length === 0) return null;
  return (
    <group>
      {racks.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh castShadow>
            <boxGeometry args={[0.5, 2.6, 0.4]} />
            <meshStandardMaterial color="#0d0f14" metalness={0.7} roughness={0.3} />
          </mesh>
          {Array.from({ length: 6 }, (_, j) => (
            <mesh key={j} position={[0, -1.1 + j * 0.42, 0.19]}>
              <boxGeometry args={[0.42, 0.08, 0.06]} />
              <meshStandardMaterial
                color={j % 3 === 0 ? "#22c55e" : j % 3 === 1 ? "#3b82f6" : "#f59e0b"}
                emissive={j % 3 === 0 ? "#22c55e" : j % 3 === 1 ? "#3b82f6" : "#f59e0b"}
                emissiveIntensity={0.8}
              />
            </mesh>
          ))}
          <pointLight position={[0, 0, 0.25]} color="#22c55e" intensity={0.6} distance={1.2} />
        </group>
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════
// ACHIEVEMENT TOWER — Certificate Frames (decorative, not image-based)
// ═══════════════════════════════════════════════════════════════

function CertificateFrame({
  position,
  title,
  subtitle,
  color,
}: {
  position: [number, number, number];
  title: string;
  subtitle: string;
  color: string;
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.8, 0.6, 0.04]} />
        <meshStandardMaterial color="#1a1a24" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.025]}>
        <planeGeometry args={[0.7, 0.5]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
      <Html transform position={[0, 0, 0.03]} scale={0.024} style={{ width: "140px", height: "100px", pointerEvents: "none" }}>
        <div style={{ background: "#0a0a14", color: "#ffd700", fontFamily: "monospace", fontSize: "8px", padding: "8px", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <div style={{ fontWeight: "bold", fontSize: "9px", marginBottom: "4px" }}>{title}</div>
          <div style={{ color: "#94a3b8", fontSize: "7px" }}>{subtitle}</div>
        </div>
      </Html>
      <pointLight color={color} intensity={0.8} distance={2} position={[0, 0, 0.3]} />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXIT DOOR
// ═══════════════════════════════════════════════════════════════

function ExitDoor({ onLeave }: { onLeave: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <group position={[3.6, 0, 2.7]}>
      <mesh
        position={[0, 1.1, 0]}
        castShadow
        onPointerEnter={() => { document.body.style.cursor = "pointer"; setHovered(true); }}
        onPointerLeave={() => { document.body.style.cursor = "default"; setHovered(false); }}
        onClick={onLeave}
      >
        <boxGeometry args={[1.0, 2.2, 0.1]} />
        <meshStandardMaterial color="#111827" emissive="#ffd166" emissiveIntensity={hovered ? 0.7 : 0.25} />
      </mesh>
      <Html transform position={[0, 2.5, 0]} style={{ width: "120px", textAlign: "center", pointerEvents: "none" }} scale={0.04}>
        <div style={{ color: "#ffd700", fontFamily: "monospace", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", opacity: hovered ? 1 : 0.5, transition: "opacity 0.2s" }}>
          [ EXIT ]
        </div>
      </Html>
      <pointLight color="#ffd166" intensity={hovered ? 3 : 1.2} distance={3} position={[0, 1.5, 0.3]} />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════
// DECORATIVE ELEMENTS (per-building, non-monitor props)
// ═══════════════════════════════════════════════════════════════

function AchievementTowerDecor() {
  return (
    <>
      {/* Trophy shelf */}
      <mesh position={[4.5, 1.8, -1]} castShadow>
        <boxGeometry args={[2.0, 0.06, 0.35]} />
        <meshStandardMaterial color="#1c1620" roughness={0.6} />
      </mesh>
      {[[-4.2, 2.05, -1], [-3.8, 2.05, -1], [-3.4, 2.15, -1]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.08, 0.35, 8]} />
            <meshStandardMaterial color="#b8860b" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <coneGeometry args={[0.1, 0.18, 8]} />
            <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.6} metalness={0.8} />
          </mesh>
          <pointLight position={[0, 0.35, 0]} color="#ffd700" intensity={0.8} distance={1.5} />
        </group>
      ))}
      {/* Certificate wall */}
      <CertificateFrame position={[-4.85, 2.2, -2]} title="Best Intern" subtitle="Kaevron Technologies 2024" color="#ffd700" />
      <CertificateFrame position={[-4.85, 2.2, -0.8]} title="SIH-2025" subtitle="Special Recognition" color="#f59e0b" />
      <CertificateFrame position={[-4.85, 2.2, 0.4]} title="Client Delivery" subtitle="Vishwanath Insurance" color="#3b82f6" />
    </>
  );
}

function DeveloperApartmentDecor() {
  return (
    <>
      {/* Bookshelf — tall, full of books */}
      <group position={[3.5, 1.6, -2.5]}>
        <mesh castShadow>
          <boxGeometry args={[1.4, 3.0, 0.25]} />
          <meshStandardMaterial color="#18141a" roughness={0.7} />
        </mesh>
        {Array.from({ length: 4 }, (_, shelf) =>
          Array.from({ length: 3 }, (_, book) => (
            <mesh key={`book-${shelf}-${book}`} position={[-0.4 + book * 0.35, -1.0 + shelf * 0.6, 0.1]} castShadow>
              <boxGeometry args={[0.06, 0.42, 0.08]} />
              <meshStandardMaterial color={["#7c3aed", "#3b82f6", "#22c55e", "#ef4444", "#f59e0b", "#ec4899"][(shelf + book) % 6]} roughness={0.6} />
            </mesh>
          ))
        )}
      </group>

      {/* Second bookshelf */}
      <group position={[4.2, 1.2, -1.5]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 2.2, 0.2]} />
          <meshStandardMaterial color="#1a1520" roughness={0.7} />
        </mesh>
        {Array.from({ length: 3 }, (_, shelf) =>
          Array.from({ length: 2 }, (_, book) => (
            <mesh key={`b2-${shelf}-${book}`} position={[-0.15 + book * 0.25, -0.7 + shelf * 0.55, 0.08]} castShadow>
              <boxGeometry args={[0.05, 0.38, 0.07]} />
              <meshStandardMaterial color={["#f97316", "#06b6d4", "#a855f7", "#ef4444", "#22c55e"][(shelf + book) % 5]} roughness={0.6} />
            </mesh>
          ))
        )}
      </group>

      {/* Bed / couch in corner */}
      <group position={[-3.5, 0.3, -2]}>
        <mesh castShadow>
          <boxGeometry args={[2.0, 0.5, 1.2]} />
          <meshStandardMaterial color="#2a1a2a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.3, -0.35]} castShadow>
          <boxGeometry args={[2.0, 0.3, 0.5]} />
          <meshStandardMaterial color="#3a2a3a" roughness={0.8} />
        </mesh>
        {/* Pillow */}
        <mesh position={[0.5, 0.55, 0.2]}>
          <boxGeometry args={[0.4, 0.12, 0.3]} />
          <meshStandardMaterial color="#e8d8c8" roughness={0.9} />
        </mesh>
      </group>

      {/* Coffee mug on desk */}
      <group position={[-1.0, 0.88, -0.5]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.035, 0.1, 10]} />
          <meshStandardMaterial color="#3a2a1a" roughness={0.7} />
        </mesh>
        {/* Steam particles */}
        {Array.from({ length: 3 }, (_, i) => (
          <mesh key={`steam-${i}`} position={[-0.01 + i * 0.01, 0.08 + i * 0.03, 0]}>
            <sphereGeometry args={[0.008, 4, 4]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.15 - i * 0.04} />
          </mesh>
        ))}
      </group>

      {/* Notebook on desk */}
      <mesh position={[-2.35, 0.78, 0.3]} castShadow>
        <boxGeometry args={[0.32, 0.02, 0.22]} />
        <meshStandardMaterial color="#f0e6d8" roughness={0.6} />
      </mesh>

      {/* Pen on notebook */}
      <mesh position={[-2.25, 0.8, 0.25]} rotation={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.15, 6]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} />
      </mesh>

      {/* Sticky notes on wall */}
      <group position={[-2.5, 1.8, -2.85]}>
        <mesh>
          <planeGeometry args={[0.4, 0.3]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.85} />
        </mesh>
      </group>
      <group position={[-2.0, 2.1, -2.85]}>
        <mesh>
          <planeGeometry args={[0.35, 0.25]} />
          <meshBasicMaterial color="#ff6b9d" transparent opacity={0.8} />
        </mesh>
      </group>
      <group position={[-3.0, 2.0, -2.85]}>
        <mesh>
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial color="#7c3aed" transparent opacity={0.75} />
        </mesh>
      </group>

      {/* Window with rain */}
      <group position={[3.0, 2.0, -2.85]}>
        <mesh>
          <planeGeometry args={[1.2, 1.4]} />
          <meshBasicMaterial color="#0a0a2a" />
        </mesh>
        {/* Window frame */}
        <mesh position={[0, 0, 0.005]}>
          <boxGeometry args={[1.22, 0.04, 0.02]} />
          <meshStandardMaterial color="#2a2a3a" />
        </mesh>
        <mesh position={[0, 0, 0.005]}>
          <boxGeometry args={[0.04, 1.42, 0.02]} />
          <meshStandardMaterial color="#2a2a3a" />
        </mesh>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={`rain-${i}`} position={[-0.45 + i * 0.12, 0, 0.01]}>
            <planeGeometry args={[0.008, 0.8]} />
            <meshBasicMaterial color="#7799bb" transparent opacity={0.25} />
          </mesh>
        ))}
        {/* City lights through window */}
        {Array.from({ length: 4 }, (_, i) => (
          <mesh key={`light-${i}`} position={[-0.3 + i * 0.2, -0.5 + (i % 2) * 0.3, 0.005]}>
            <planeGeometry args={[0.06, 0.04]} />
            <meshBasicMaterial color={["#ffd700", "#ff6b35", "#3b82f6", "#22c55e"][i]} transparent opacity={0.4} />
          </mesh>
        ))}
      </group>

      {/* Floor lamp */}
      <group position={[-4, 0, 1]}>
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.6, 6]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.7} />
        </mesh>
        <mesh position={[0, 1.65, 0]}>
          <coneGeometry args={[0.15, 0.2, 8]} />
          <meshStandardMaterial color="#ffd166" emissive="#ffd166" emissiveIntensity={1.5} transparent opacity={0.9} />
        </mesh>
        <pointLight position={[0, 1.5, 0]} color="#ffd166" intensity={2} distance={4} />
      </group>

      {/* Power strip / cables near desk */}
      <group position={[-1.5, 0.05, -1.5]}>
        <mesh>
          <boxGeometry args={[0.2, 0.04, 0.08]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.15, 0, 0.05]} rotation={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.3, 4]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>

      {/* Headphones on desk */}
      <group position={[-2.0, 0.86, -0.2]}>
        <mesh rotation={[0, 0, 0.2]}>
          <torusGeometry args={[0.06, 0.012, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.6} />
        </mesh>
      </group>
    </>
  );
}

function DeveloperMuseumDecor() {
  return (
    <>
      {/* First laptop display */}
      <group position={[2.5, 0.6, -1]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.3, 0.2, 0.4]} />
          <meshStandardMaterial color="#2a2a3a" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.25, 0.15]} castShadow rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.3, 0.2, 0.02]} />
          <meshStandardMaterial color="#111" roughness={0.3} />
        </mesh>
      </group>
    </>
  );
}

function IronmanDestinyLabDecor() {
  return (
    <>
      {/* Arc Reactor display */}
      <group position={[0, 1.5, -2.8]}>
        <mesh>
          <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
          <meshStandardMaterial color="#001133" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[0.3, 0.05, 8, 32]} />
          <meshStandardMaterial color="#00aaff" emissive="#00aaff" emissiveIntensity={3} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#00ddff" emissive="#00ddff" emissiveIntensity={5} />
        </mesh>
        <pointLight color="#00aaff" intensity={3} distance={4} />
      </group>

      {/* Workbench */}
      <mesh position={[-3, 0.75, -1]} castShadow>
        <boxGeometry args={[2.5, 0.08, 1.0]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Tools on workbench */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((x, i) => (
        <mesh key={i} position={[-3 + x, 0.82, -1]} castShadow>
          <boxGeometry args={[0.08, 0.04, 0.06]} />
          <meshStandardMaterial color={["#ff4400", "#ffd700", "#00aaff", "#ff6600", "#333"][i]} metalness={0.7} />
        </mesh>
      ))}

      {/* Iron Man Glove display */}
      <group position={[3.5, 1.0, -2.5]}>
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.3, 0.3]} />
          <meshStandardMaterial color="#ff4400" metalness={0.8} roughness={0.2} />
        </mesh>
        <pointLight color="#ff4400" intensity={1.5} distance={2} />
      </group>
    </>
  );
}

function FutureObservatoryDecor() {
  return (
    <>
      {/* Telescope */}
      <group position={[3, 1.5, -2]}>
        <mesh position={[0, 0, 0]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.1, 2, 8]} />
          <meshStandardMaterial color="#1a2a3a" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1, -0.5]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#0a1a2a" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Star map on ceiling */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={`star-${i}`}
          position={[
            (Math.random() - 0.5) * 8,
            4.6,
            (Math.random() - 0.5) * 5,
          ]}
        >
          <sphereGeometry args={[0.02, 4, 4]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={2}
          />
        </mesh>
      ))}

      {/* Glass panel displays */}
      <group position={[-4.5, 2, 0]}>
        <mesh>
          <planeGeometry args={[0.8, 1.2]} />
          <meshStandardMaterial
            color="#00aaff"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOM RENDERER — Config-driven
// ═══════════════════════════════════════════════════════════════

function ConfiguredRoom({ buildingId, config }: { buildingId: string; config: BuildingMonitors }) {
  return (
    <>
      <RoomShell walls={config.walls} />
      <CeilingLights lights={config.ceilingLights} />
      <Desks desks={config.desks} />
      <ServerRacks racks={config.serverRacks} />

      {/* Image-based monitors */}
      {config.monitors.map((monitor) => (
        <Suspense key={monitor.id} fallback={null}>
          <ImageMonitor config={monitor} />
        </Suspense>
      ))}

      {/* Per-building decorative elements */}
      {buildingId === "achievement-tower" && <AchievementTowerDecor />}
      {buildingId === "developer-apartment" && <DeveloperApartmentDecor />}
      {buildingId === "developer-museum" && <DeveloperMuseumDecor />}
      {buildingId === "ironman-destiny-lab" && <IronmanDestinyLabDecor />}
      {buildingId === "future-observatory" && <FutureObservatoryDecor />}

      {/* Lighting — bright enough to see everything */}
      <ambientLight intensity={0.6} color={config.room.ambientColor} />
      <hemisphereLight color="#b4c6e7" groundColor="#1a1a2e" intensity={0.4} />
      <pointLight position={[0, 4, 0]} intensity={8} color="#ffd166" distance={12} decay={2} />
      <pointLight position={[-3, 3, 1]} intensity={4} color="#ffffff" distance={10} decay={2} />
      <pointLight position={[3, 3, 1]} intensity={4} color="#ffffff" distance={10} decay={2} />
      <pointLight position={[0, 3, -2]} intensity={3} color={config.ceilingLights[0]?.color ?? "#ffffff"} distance={8} decay={2} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════

export default function BuildingInterior({ buildingId }: BuildingInteriorProps) {
  const { leaveBuilding, setExitPosition } = useStore();
  const config = monitorConfig[buildingId];

  useEffect(() => {
    const building = BUILDINGS.find((b) => b.id === buildingId);
    if (building) {
      const exitPos: [number, number, number] = [
        building.position[0],
        1.6,
        building.position[2] + building.scale[2] / 2 + 4.0,
      ];
      setExitPosition(exitPos, 0);
    }
  }, [buildingId, setExitPosition]);

  if (!config) return null;

  return (
    <group>
      <color attach="background" args={["#040608"]} />
      <ConfiguredRoom buildingId={buildingId} config={config} />
      <ExitDoor onLeave={leaveBuilding} />
    </group>
  );
}

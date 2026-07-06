"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import { BuildingConfig } from "@/types/building";
import { useStore } from "@/lib/store";

interface BuildingProps {
  config: BuildingConfig;
}

function WindowGrid({
  size,
  pattern,
  color,
}: {
  size: [number, number];
  pattern: string;
  color: string;
}) {
  const cols = Math.floor(size[0] * 3);
  const rows = Math.floor(size[1] * 4);

  const windows = useMemo(() => {
    const result: { x: number; y: number; opacity: number }[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let show = false;
        if (pattern === "grid") show = (r + c) % 3 !== 0;
        else if (pattern === "stripe") show = c % 2 === 0;
        else if (pattern === "dots") show = (r + c) % 2 === 0;

        if (show) {
          result.push({
            x: (c - cols / 2 + 0.5) * (size[0] / cols),
            y: (r - rows / 2 + 0.5) * (size[1] / rows),
            opacity: 0.3 + Math.random() * 0.5,
          });
        }
      }
    }
    return result;
  }, [size, pattern, cols, rows]);

  const winW = size[0] / cols * 0.6;
  const winH = size[1] / rows * 0.5;

  return (
    <>
      {windows.map((w, i) => (
        <mesh key={i} position={[w.x, w.y, 0]}>
          <planeGeometry args={[winW, winH]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={w.opacity * 0.6}
            transparent
            opacity={w.opacity}
          />
        </mesh>
      ))}
    </>
  );
}

function BuildingEntrance({ config }: { config: BuildingConfig }) {
  const [hovered, setHovered] = useState(false);
  const doorOpen = hovered ? 1 : 0.15;

  return (
    <group
      position={[0, -config.scale[1] / 2 + 0.1, config.scale[2] / 2 + 0.01]}
      onPointerEnter={() => {
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerLeave={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      {/* Door frame */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[0.9, 1.7, 0.06]} />
        <meshStandardMaterial color="#1a1520" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Door panel */}
      <group>
        <mesh position={[0.2, 0.85, 0.02]}>
          <boxGeometry args={[0.4, 1.5, 0.04]} />
          <meshStandardMaterial
            color={hovered ? "#2a1e2c" : "#120c16"}
            emissive={config.emissive || "#ffd700"}
            emissiveIntensity={doorOpen}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[-0.2, 0.85, 0.02]}>
          <boxGeometry args={[0.4, 1.5, 0.04]} />
          <meshStandardMaterial
            color={hovered ? "#2a1e2c" : "#120c16"}
            emissive={config.emissive || "#ffd700"}
            emissiveIntensity={doorOpen * 0.5}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
      </group>
      {/* Door handle */}
      <mesh position={[0.3, 0.85, 0.06]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Light above door */}
      <mesh position={[0, 1.75, 0]}>
        <boxGeometry args={[0.8, 0.04, 0.15]} />
        <meshStandardMaterial
          color={config.emissive || "#ffd700"}
          emissive={config.emissive || "#ffd700"}
          emissiveIntensity={hovered ? 3 : 1}
        />
      </mesh>
      <pointLight
        color={config.emissive || "#ffd700"}
        intensity={hovered ? 4 : 1.5}
        distance={4}
        position={[0, 1.75, 0.2]}
      />
    </group>
  );
}

function BuildingBody({ config }: { config: BuildingConfig }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { setHoveredBuilding, introComplete, introProgress } = useStore();
  const [hovered, setHovered] = useState(false);
  const glowStrength = config.id === "modcodes-hq"
    ? Math.max(0.2, Math.min(1.25, introProgress * 1.2 + (introComplete ? 0.35 : 0)))
    : hovered
      ? 0.35
      : 0.15;

  useFrame(() => {
    if (!meshRef.current) return;
    const target = hovered ? 1.02 : 1.0;
    meshRef.current.scale.lerp(
      new THREE.Vector3(target, target, target),
      0.08
    );
  });

  return (
    <group
      position={[
        config.position[0],
        config.scale[1] / 2,
        config.position[2],
      ]}
    >
      {/* Main body */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerEnter={(e) => {
          if (!introComplete) return;
          e.stopPropagation();
          setHovered(true);
          setHoveredBuilding(config.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          setHoveredBuilding(null);
          document.body.style.cursor = "default";
        }}
      >
        <boxGeometry args={config.scale} />
        <meshStandardMaterial
          color={config.color}
          roughness={0.85}
          metalness={0.05}
          emissive={config.emissive || "#ffd700"}
          emissiveIntensity={glowStrength}
        />
        <Edges threshold={15} color="#00000020" lineWidth={1} />
      </mesh>

      {/* Windows — front face */}
      <group position={[0, 0, config.scale[2] / 2 + 0.01]}>
        <WindowGrid
          size={[config.scale[0] * 0.85, config.scale[1] * 0.85]}
          pattern={config.windowPattern || "grid"}
          color={config.emissive || "#ffd700"}
        />
      </group>

      {/* Windows — back face */}
      <group
        position={[0, 0, -config.scale[2] / 2 - 0.01]}
        rotation={[0, Math.PI, 0]}
      >
        <WindowGrid
          size={[config.scale[0] * 0.85, config.scale[1] * 0.85]}
          pattern={config.windowPattern || "grid"}
          color={config.emissive || "#ffd700"}
        />
      </group>

      {/* Windows — left face */}
      <group
        position={[-config.scale[0] / 2 - 0.01, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <WindowGrid
          size={[config.scale[2] * 0.85, config.scale[1] * 0.85]}
          pattern={config.windowPattern || "grid"}
          color={config.emissive || "#ffd700"}
        />
      </group>

      {/* Windows — right face */}
      <group
        position={[config.scale[0] / 2 + 0.01, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <WindowGrid
          size={[config.scale[2] * 0.85, config.scale[1] * 0.85]}
          pattern={config.windowPattern || "grid"}
          color={config.emissive || "#ffd700"}
        />
      </group>

      {/* Roof accent */}
      <mesh position={[0, config.scale[1] / 2 + 0.08, 0]} castShadow>
        <boxGeometry
          args={[config.scale[0] * 0.92, 0.15, config.scale[2] * 0.92]}
        />
        <meshStandardMaterial
          color={config.roofColor || "#6b5b45"}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Antenna / spire for tall buildings */}
      {config.scale[1] > 4 && (
        <mesh position={[0, config.scale[1] / 2 + 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.08, 1.0, 8]} />
          <meshStandardMaterial color="#555" metalness={0.6} roughness={0.3} />
        </mesh>
      )}

      {/* Physical door entrance for every building */}
      <BuildingEntrance config={config} />

      {/* Point light from windows */}
      <pointLight
        color={config.emissive || "#ffd700"}
        intensity={hovered ? 2.0 : !introComplete && config.id === "modcodes-hq" ? 1.2 : 0.8}
        distance={8}
        position={[0, 0, config.scale[2] / 2 + 1]}
      />
    </group>
  );
}

export default function Building({ config }: BuildingProps) {
  return <BuildingBody config={config} />;
}

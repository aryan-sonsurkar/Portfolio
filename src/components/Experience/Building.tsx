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

function BuildingBody({ config }: { config: BuildingConfig }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { focusBuilding, focusedBuilding, setHoveredBuilding, introComplete, introProgress, enterBuilding } = useStore();
  const isFocused = focusedBuilding === config.id;
  const [hovered, setHovered] = useState(false);
  const canInteract = introComplete;
  const glowStrength = config.id === "modcodes-hq"
    ? Math.max(0.2, Math.min(1.25, introProgress * 1.2 + (introComplete ? 0.35 : 0)))
    : hovered
      ? 0.35
      : 0.15;
  const doorOpen = introComplete
    ? 1
    : Math.max(0, Math.min(1, (introProgress - 0.72) / 0.2));

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
        onClick={(e) => {
          if (!canInteract) return;
          e.stopPropagation();
          focusBuilding(config.id);
          enterBuilding(config.id);
        }}
        onPointerEnter={(e) => {
          if (!canInteract) return;
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
        <mesh
          position={[0, config.scale[1] / 2 + 0.6, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.03, 0.08, 1.0, 8]} />
          <meshStandardMaterial color="#555" metalness={0.6} roughness={0.3} />
        </mesh>
      )}

      {config.id === "modcodes-hq" && (
        <group position={[0, -0.2, config.scale[2] / 2 + 0.02]}>
          <group rotation={[0, doorOpen * -1.2, 0]}>
            <mesh position={[0.38, 0.1, 0]} castShadow>
              <boxGeometry args={[0.76, 1.6, 0.05]} />
              <meshStandardMaterial color="#120c16" metalness={0.4} roughness={0.3} />
            </mesh>
          </group>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.9, 1.7, 0.03]} />
            <meshStandardMaterial color="#2a1e2c" emissive="#ffd166" emissiveIntensity={0.25} />
          </mesh>
        </group>
      )}

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

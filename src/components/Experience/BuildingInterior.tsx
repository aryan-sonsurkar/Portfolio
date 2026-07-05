"use client";

import { useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/lib/store";

interface BuildingInteriorProps {
  buildingId: string;
}

function ScreenSurface({
  text,
  color,
  onClick,
}: {
  text: string;
  color: string;
  onClick?: () => void;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#060816";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 72px monospace";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }, [text, color]);

  return (
    <mesh onClick={onClick}>
      <planeGeometry args={[1.2, 0.7]} />
      <meshBasicMaterial map={texture || undefined} transparent />
    </mesh>
  );
}

function RoomShell({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 2.2, -3]} receiveShadow>
        <boxGeometry args={[10, 4.6, 0.2]} />
        <meshStandardMaterial color="#111827" roughness={0.9} metalness={0.2} />
      </mesh>
      <mesh position={[0, 2.2, 3]} receiveShadow>
        <boxGeometry args={[10, 4.6, 0.2]} />
        <meshStandardMaterial color="#111827" roughness={0.9} metalness={0.2} />
      </mesh>
      <mesh position={[-5, 2.2, 0]} receiveShadow>
        <boxGeometry args={[0.2, 4.6, 6.2]} />
        <meshStandardMaterial color="#111827" roughness={0.9} metalness={0.2} />
      </mesh>
      <mesh position={[5, 2.2, 0]} receiveShadow>
        <boxGeometry args={[0.2, 4.6, 6.2]} />
        <meshStandardMaterial color="#111827" roughness={0.9} metalness={0.2} />
      </mesh>
      <mesh position={[0, 4.6, 0]} receiveShadow>
        <boxGeometry args={[10.2, 0.2, 6.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[10, 0.2, 6]} />
        <meshStandardMaterial color={color} roughness={0.95} metalness={0.05} />
      </mesh>
    </group>
  );
}

export default function BuildingInterior({ buildingId }: BuildingInteriorProps) {
  const { leaveBuilding } = useStore();
  const [screenIndex, setScreenIndex] = useState(0);
  const [terminalMode, setTerminalMode] = useState(false);

  useFrame((state, delta) => {
    state.camera.position.lerp(new THREE.Vector3(0, 2.8, 7.8), delta * 1.2);
    state.camera.lookAt(0, 2.2, 0);
  });

  const renderContent = () => {
    switch (buildingId) {
      case "modcodes-hq":
        return (
          <>
            <mesh position={[0, 0.6, 0.6]} castShadow>
              <boxGeometry args={[3.4, 1.2, 1.4]} />
              <meshStandardMaterial color="#1f2937" roughness={0.6} metalness={0.2} />
            </mesh>
            <mesh position={[-2.7, 1.2, -1.2]} castShadow>
              <boxGeometry args={[1.8, 2.2, 0.4]} />
              <meshStandardMaterial color="#374151" roughness={0.4} metalness={0.2} />
            </mesh>
            <mesh position={[2.2, 1.3, -1.5]} castShadow>
              <boxGeometry args={[1.2, 2.1, 0.3]} />
              <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.4} />
            </mesh>
            <mesh position={[-0.8, 1.4, -1.2]}>
              <planeGeometry args={[2.4, 1.4]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
            <group position={[0.4, 1.2, -1.1]}>
              <ScreenSurface
                text={screenIndex === 0 ? "LIVE PROJECT" : screenIndex === 1 ? "GITHUB" : "ROADMAP"}
                color={screenIndex === 0 ? "#2563eb" : screenIndex === 1 ? "#f59e0b" : "#7c3aed"}
                onClick={() => setScreenIndex((prev) => (prev + 1) % 3)}
              />
            </group>
            <mesh position={[0, 0.55, -2.4]} castShadow>
              <boxGeometry args={[1.8, 0.9, 0.6]} />
              <meshStandardMaterial color="#111827" emissive="#ffd166" emissiveIntensity={0.2} />
            </mesh>
          </>
        );
      case "achievement-tower":
        return (
          <>
            <mesh position={[0, 1.3, -1.1]} castShadow>
              <boxGeometry args={[4.2, 2.6, 0.3]} />
              <meshStandardMaterial color="#f5f3ff" roughness={0.2} metalness={0.2} />
            </mesh>
            <mesh position={[-1.4, 0.9, 0.4]} castShadow>
              <boxGeometry args={[1.2, 0.8, 0.7]} />
              <meshStandardMaterial color="#7c3aed" />
            </mesh>
            <mesh position={[1.2, 0.9, 0.4]} castShadow>
              <boxGeometry args={[1.2, 0.8, 0.7]} />
              <meshStandardMaterial color="#f59e0b" />
            </mesh>
            <mesh position={[0, 1.3, -0.8]}>
              <planeGeometry args={[2.2, 1.2]} />
              <meshBasicMaterial color="#111827" />
            </mesh>
            <group position={[0, 1.2, -0.7]}>
              <ScreenSurface
                text={terminalMode ? "ARYAN@TOWER\ncat achievements.md" : "ACHIEVEMENTS"}
                color={terminalMode ? "#0f766e" : "#f59e0b"}
                onClick={() => setTerminalMode((prev) => !prev)}
              />
            </group>
            <mesh position={[0, 0.4, 1.5]} castShadow>
              <boxGeometry args={[1.6, 0.8, 0.8]} />
              <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.4} />
            </mesh>
          </>
        );
      case "developer-museum":
        return (
          <>
            <mesh position={[-2, 0.8, -0.7]} castShadow>
              <boxGeometry args={[1.4, 1.6, 0.2]} />
              <meshStandardMaterial color="#1e293b" roughness={0.7} />
            </mesh>
            <mesh position={[2, 1, -0.7]} castShadow>
              <boxGeometry args={[1.4, 2.0, 0.2]} />
              <meshStandardMaterial color="#0f172a" roughness={0.7} />
            </mesh>
            <mesh position={[0.2, 1.5, -0.8]}>
              <planeGeometry args={[2.6, 1.4]} />
              <meshBasicMaterial color="#111827" />
            </mesh>
            <group position={[0.2, 1.2, -0.7]}>
              <ScreenSurface text="JOURNEY TIMELINE" color="#22c55e" />
            </group>
          </>
        );
      case "project-factory":
        return (
          <>
            <mesh position={[-1.4, 0.8, -0.7]} castShadow>
              <boxGeometry args={[1.2, 1.6, 0.8]} />
              <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.4} />
            </mesh>
            <mesh position={[1.6, 0.8, -0.7]} castShadow>
              <boxGeometry args={[1.2, 1.6, 0.8]} />
              <meshStandardMaterial color="#1f2937" roughness={0.4} metalness={0.4} />
            </mesh>
            <group position={[0.1, 1.25, -0.65]}>
              <ScreenSurface text="PROJECT MACHINE" color="#ef4444" />
            </group>
          </>
        );
      case "innovation-lab":
        return (
          <>
            <mesh position={[-1.2, 1.1, -0.8]} castShadow>
              <boxGeometry args={[1.8, 1.8, 0.3]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.4} />
            </mesh>
            <mesh position={[1.2, 1.1, -0.8]} castShadow>
              <boxGeometry args={[1.6, 1.8, 0.3]} />
              <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.3} />
            </mesh>
            <group position={[0.1, 1.3, -0.7]}>
              <ScreenSurface text="AI LAB" color="#38bdf8" />
            </group>
          </>
        );
      case "open-source-center":
        return (
          <>
            <mesh position={[0, 1.8, -0.8]} castShadow>
              <boxGeometry args={[4.2, 2.6, 0.3]} />
              <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.4} />
            </mesh>
            <group position={[0, 1.5, -0.7]}>
              <ScreenSurface text="REPOS WALL" color="#22c55e" />
            </group>
          </>
        );
      case "university":
        return (
          <>
            <mesh position={[-2, 1.1, -0.8]} castShadow>
              <boxGeometry args={[2.2, 1.8, 0.4]} />
              <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.2} />
            </mesh>
            <mesh position={[2, 1.1, -0.8]} castShadow>
              <boxGeometry args={[2.2, 1.8, 0.4]} />
              <meshStandardMaterial color="#111827" roughness={0.5} metalness={0.2} />
            </mesh>
            <group position={[0, 1.3, -0.7]}>
              <ScreenSurface text="STUDY HALL" color="#f59e0b" />
            </group>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <group>
      <color attach="background" args={["#05070d"]} />
      <ambientLight intensity={0.35} color="#cbd5e1" />
      <pointLight position={[0, 3.5, 2]} intensity={8} color="#ffd166" />
      <pointLight position={[-3, 2.2, -2]} intensity={5} color="#38bdf8" />
      <RoomShell color={"#1f2937"} />
      {renderContent()}
      <mesh position={[3.2, 1.5, 2.4]} onClick={leaveBuilding} castShadow>
        <boxGeometry args={[1.4, 2.6, 0.35]} />
        <meshStandardMaterial color="#111827" emissive="#ffd166" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[3.2, 1.5, 2.45]}>
        <planeGeometry args={[0.8, 0.3]} />
        <meshBasicMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[3.2, 1.5, 2.55]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
    </group>
  );
}

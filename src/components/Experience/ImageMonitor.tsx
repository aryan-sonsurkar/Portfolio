"use client";

import { useState, useEffect } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { loadMonitorTexture } from "@/lib/monitorTextures";
import type { MonitorConfig } from "@/config/monitors";

interface ImageMonitorProps {
  config: MonitorConfig;
}

export default function ImageMonitor({ config }: ImageMonitorProps) {
  const { id, image, position, rotation = 0, width, height } = config;
  const { setActiveScreen, addAchievement } = useStore();
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadMonitorTexture(image)
      .then((tex) => {
        if (!cancelled) setTexture(tex);
      })
      .catch((e) => console.error(`[Monitor:${id}] load failed:`, e));

    return () => {
      cancelled = true;
    };
  }, [id, image]);

  const handleClick = () => {
    // Pass the exact same monitor config object — single source of truth
    setActiveScreen(id, config);
    addAchievement(id);
  };

  if (!texture) {
    // Fallback — show glowing panel while texture loads
    return (
      <group position={position} rotation={[0, rotation, 0]}>
        <mesh position={[0, height / 2 + 0.02, 0]}>
          <boxGeometry args={[width + 0.06, height + 0.06, 0.04]} />
          <meshStandardMaterial color="#111118" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, height / 2 + 0.02, 0.025]}>
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial
            color={config.emissiveColor}
            emissive={config.emissiveColor}
            emissiveIntensity={0.3}
            toneMapped={false}
          />
        </mesh>
      </group>
    );
  }

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Monitor bezel / frame */}
      <mesh
        position={[0, height / 2 + 0.02, 0]}
        onPointerEnter={() => { document.body.style.cursor = "pointer"; setHovered(true); }}
        onPointerLeave={() => { document.body.style.cursor = "default"; setHovered(false); }}
        onClick={handleClick}
      >
        <boxGeometry args={[width + 0.06, height + 0.06, 0.04]} />
        <meshStandardMaterial color="#111118" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Screen surface — texture mapped to the entire plane */}
      <mesh position={[0, height / 2 + 0.02, 0.025]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Hover hint */}
      {hovered && (
        <Html
          transform
          position={[0, height + 0.15, 0.05]}
          scale={0.035}
          style={{ pointerEvents: "none" }}
          zIndexRange={[100, 0]}
        >
          <div
            style={{
              background: "rgba(0, 0, 0, 0.75)",
              color: "#ffd700",
              fontFamily: "monospace",
              fontSize: "11px",
              letterSpacing: "2px",
              padding: "4px 10px",
              borderRadius: "3px",
              border: "1px solid rgba(255, 215, 0, 0.3)",
              whiteSpace: "nowrap",
              textTransform: "uppercase",
            }}
          >
            Click to Inspect
          </div>
        </Html>
      )}
    </group>
  );
}

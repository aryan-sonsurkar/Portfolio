"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NPCS, type NpcDef } from "@/config/npcDialogs";
import { useStore, fpvState } from "@/lib/store";

function TalkNPC({ npc }: { npc: NpcDef }) {
  const markerRef = useRef<THREE.Mesh>(null);
  const openNpcDialog = useStore((s) => s.openNpcDialog);
  const dialogNpc = useStore((s) => s.dialogNpc);

  useFrame((state) => {
    const m = markerRef.current;
    if (m) {
      m.position.y = 2.25 + Math.sin(state.clock.elapsedTime * 2.6 + npc.position[0]) * 0.06;
      m.rotation.y = state.clock.elapsedTime * 1.5;
    }
  });

  const handleTalk = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    const mode = useStore.getState().cameraMode;
    if (mode === "screen") return;
    openNpcDialog(npc.id);
  };

  return (
    <group
      position={npc.position}
      rotation={[0, npc.rotation, 0]}
      onClick={handleTalk}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      {/* Aura ring */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.62, 32]} />
        <meshBasicMaterial color={npc.accent} transparent opacity={0.35} />
      </mesh>
      {/* Legs */}
      {[-0.11, 0.11].map((x) => (
        <mesh key={x} position={[x, 0.26, 0]}>
          <boxGeometry args={[0.15, 0.52, 0.16]} />
          <meshStandardMaterial color="#1c1c24" roughness={0.8} />
        </mesh>
      ))}
      {/* Torso */}
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[0.44, 0.6, 0.26]} />
        <meshStandardMaterial color={npc.color} roughness={0.75} />
      </mesh>
      {/* Scarf accent */}
      <mesh position={[0, 1.08, 0]}>
        <boxGeometry args={[0.32, 0.07, 0.28]} />
        <meshStandardMaterial color={npc.accent} emissive={npc.accent} emissiveIntensity={0.35} roughness={0.6} />
      </mesh>
      {/* Arms */}
      {[-0.29, 0.29].map((x, i) => (
        <mesh key={x} position={[x, 0.78, 0]} rotation={[0, 0, i === 0 ? 0.12 : -0.12]}>
          <boxGeometry args={[0.1, 0.48, 0.13]} />
          <meshStandardMaterial color={npc.color} roughness={0.8} />
        </mesh>
      ))}
      {/* Head */}
      <mesh position={[0, 1.36, 0]}>
        <sphereGeometry args={[0.17, 14, 14]} />
        <meshStandardMaterial color="#d9a066" roughness={0.65} />
      </mesh>
      {/* Hair cap */}
      <mesh position={[0, 1.44, -0.02]}>
        <sphereGeometry args={[0.16, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2.4]} />
        <meshStandardMaterial color="#20202a" roughness={0.85} />
      </mesh>
      {/* Speech marker */}
      <mesh ref={markerRef} position={[0, 2.25, 0]}>
        <octahedronGeometry args={[0.11, 0]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={dialogNpc === npc.id ? 2 : 1.1}
        />
      </mesh>
    </group>
  );
}

function NpcProximity() {
  const setNearbyNpc = useStore((s) => s.setNearbyNpc);
  const nearbyRef = useRef<string | null>(null);

  useEffect(() => {
    return () => setNearbyNpc(null);
  }, [setNearbyNpc]);

  const last = useRef({ x: NaN, z: NaN });

  useFrame(() => {
    const [px, , pz] = fpvState.position;
    if (px === last.current.x && pz === last.current.z) return;
    last.current = { x: px, z: pz };
    let best: string | null = null;
    let bestD = 4.0;
    for (const npc of NPCS) {
      const d = Math.hypot(px - npc.position[0], pz - npc.position[2]);
      if (d < bestD) {
        bestD = d;
        best = npc.id;
      }
    }
    if (best !== nearbyRef.current) {
      nearbyRef.current = best;
      setNearbyNpc(best);
    }
  });

  return null;
}

export default function TalkNPCs() {
  return (
    <group>
      {NPCS.map((npc) => (
        <TalkNPC key={npc.id} npc={npc} />
      ))}
      <NpcProximity />
    </group>
  );
}

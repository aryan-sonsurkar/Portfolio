"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { isMobileDevice } from "@/lib/useIsMobile";

// Cheap ambient life: moving cars (emissive boxes, no lights/shadows) +
// rooftop beacons on tall buildings. Mobile gets 1 car + static beacons.
function Cars() {
  const mobile = isMobileDevice();
  const group = useRef<THREE.Group>(null);
  const cars = useMemo(() => {
    const n = mobile ? 1 : 3;
    return Array.from({ length: n }, (_, i) => ({
      x: -12 + i * 9,
      speed: (i % 2 === 0 ? 1 : -1) * (2.2 + i * 0.5),
      lane: i % 2 === 0 ? 2.7 : 3.7,
      color: ["#38bdf8", "#ffd700", "#22c55e"][i % 3],
    }));
  }, [mobile]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const d = Math.min(delta, 0.05);
    group.current.children.forEach((child, i) => {
      child.position.x += cars[i].speed * d;
      if (child.position.x > 13) child.position.x = -13;
      if (child.position.x < -13) child.position.x = 13;
    });
  });

  return (
    <group ref={group}>
      {cars.map((c, i) => (
        <group key={i} position={[c.x, 0, c.lane]}>
          {/* body */}
          <mesh position={[0, 0.22, 0]}>
            <boxGeometry args={[0.9, 0.22, 0.42]} />
            <meshStandardMaterial color="#14141c" roughness={0.5} metalness={0.4} />
          </mesh>
          {/* glow strip */}
          <mesh position={[0, 0.28, 0]}>
            <boxGeometry args={[0.92, 0.05, 0.44]} />
            <meshBasicMaterial color={c.color} toneMapped={false} />
          </mesh>
          {/* headlights */}
          <mesh position={[c.speed > 0 ? 0.46 : -0.46, 0.18, 0]}>
            <boxGeometry args={[0.04, 0.08, 0.34]} />
            <meshBasicMaterial color="#fff8d8" toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Beacons() {
  const mobile = isMobileDevice();
  const ref = useRef<THREE.Mesh>(null);
  // Tall-building rooftop positions
  const spots: [number, number, number][] = [
    [7, 5.9, -2],
    [0, 4.9, 0],
    [12, 4.6, -13],
  ];
  useFrame(({ clock }) => {
    if (mobile || !ref.current) return;
    const m = ref.current.material as THREE.MeshBasicMaterial;
    m.opacity = 0.45 + Math.sin(clock.elapsedTime * 2.4) * 0.35;
  });
  return (
    <group>
      {spots.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshBasicMaterial color="#ff4455" transparent opacity={0.6} toneMapped={false} />
        </mesh>
      ))}
      {/* single shared pulse halo (one draw, no light) */}
      <mesh ref={ref} position={[spots[0][0], spots[0][1], spots[0][2]]}>
        <sphereGeometry args={[0.14, 6, 6]} />
        <meshBasicMaterial color="#ff4455" transparent opacity={0.5} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function DistrictLife() {
  return (
    <group>
      <Cars />
      <Beacons />
    </group>
  );
}

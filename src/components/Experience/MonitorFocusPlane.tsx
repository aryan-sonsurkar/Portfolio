"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/lib/store";

// ── Texture cache: reuse across clicks, never recreate ──
const textureCache = new Map<string, THREE.CanvasTexture>();

// ── Easing ──
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

const FOCUS_DISTANCE = 1.0;
const VIEWPORT_FILL = 0.88;
const OPEN_SPEED = 3.5;
const CLOSE_SPEED = 5.0;

export default function MonitorFocusPlane() {
  const { activeMonitor } = useStore();
  const { camera, gl } = useThree();

  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  // Animation
  const animProgress = useRef(0);
  const targetProgress = useRef(0);

  // Floating
  const floatTime = useRef(0);

  // Zoom / pan
  const zoomLevel = useRef(1);
  const panOffset = useRef(new THREE.Vector2(0, 0));
  const isDragging = useRef(false);
  const dragStart = useRef(new THREE.Vector2(0, 0));
  const dragStartPan = useRef(new THREE.Vector2(0, 0));

  // 3D refs
  const groupRef = useRef<THREE.Group>(null);
  const planeMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const overlayMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const frameGlowRef = useRef<THREE.PointLight>(null);

  // ── Plane dimensions from FOV ──
  const { planeWidth, planeHeight } = useMemo(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const fovRad = THREE.MathUtils.degToRad(cam.fov);
    const visibleHeight = 2 * Math.tan(fovRad / 2) * FOCUS_DISTANCE;
    const visibleWidth = visibleHeight * cam.aspect;
    const targetHeight = visibleHeight * VIEWPORT_FILL;
    const imageAspect = 1920 / 1080;
    let targetWidth = targetHeight * imageAspect;
    const maxWidth = visibleWidth * 0.9;
    if (targetWidth > maxWidth) targetWidth = maxWidth;
    return { planeWidth: targetWidth, planeHeight: targetHeight };
  }, [camera]);

  // ── Load texture (cached) ──
  useEffect(() => {
    if (!activeMonitor) {
      targetProgress.current = 0;
      return;
    }

    const cached = textureCache.get(activeMonitor.image);
    if (cached) {
      setTexture(cached);
      targetProgress.current = 1;
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(activeMonitor.image);
        if (!res.ok) throw new Error(`${res.status}`);
        const svgText = await res.text();
        const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          if (cancelled) return;
          const canvas = document.createElement("canvas");
          canvas.width = 1920;
          canvas.height = 1080;
          canvas.getContext("2d")!.drawImage(img, 0, 0, 1920, 1080);
          URL.revokeObjectURL(url);

          const tex = new THREE.CanvasTexture(canvas);
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = false;
          tex.needsUpdate = true;

          textureCache.set(activeMonitor.image, tex);
          if (!cancelled) {
            setTexture(tex);
            targetProgress.current = 1;
          }
        };
        img.onerror = () => URL.revokeObjectURL(url);
        img.src = url;
      } catch (e) {
        console.error("[MonitorFocusPlane]", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeMonitor?.image]);

  // ── Reset zoom / pan on monitor change ──
  useEffect(() => {
    zoomLevel.current = 1;
    panOffset.current.set(0, 0);
    floatTime.current = 0;
  }, [activeMonitor?.id]);

  // ── Zoom (mouse wheel) ──
  useEffect(() => {
    if (!activeMonitor) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.12 : 0.12;
      zoomLevel.current = Math.max(1, Math.min(2, zoomLevel.current + delta));
    };
    gl.domElement.addEventListener("wheel", onWheel, { passive: false });
    return () => gl.domElement.removeEventListener("wheel", onWheel);
  }, [activeMonitor, gl.domElement]);

  // ── Pan (click-and-drag when zoomed) ──
  useEffect(() => {
    if (!activeMonitor) return;
    const onDown = (e: PointerEvent) => {
      if (zoomLevel.current <= 1) return;
      isDragging.current = true;
      dragStart.current.set(e.clientX, e.clientY);
      dragStartPan.current.copy(panOffset.current);
      gl.domElement.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = (e.clientX - dragStart.current.x) / window.innerWidth;
      const dy = (e.clientY - dragStart.current.y) / window.innerHeight;
      const max = (zoomLevel.current - 1) * 0.45;
      panOffset.current.set(
        Math.max(-max, Math.min(max, dragStartPan.current.x + dx)),
        Math.max(-max, Math.min(max, dragStartPan.current.y - dy))
      );
    };
    const onUp = (e: PointerEvent) => {
      isDragging.current = false;
      try {
        gl.domElement.releasePointerCapture(e.pointerId);
      } catch {}
    };
    gl.domElement.addEventListener("pointerdown", onDown);
    gl.domElement.addEventListener("pointermove", onMove);
    gl.domElement.addEventListener("pointerup", onUp);
    return () => {
      gl.domElement.removeEventListener("pointerdown", onDown);
      gl.domElement.removeEventListener("pointermove", onMove);
      gl.domElement.removeEventListener("pointerup", onUp);
    };
  }, [activeMonitor, gl.domElement]);

  // ── Animation + floating ──
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Animate progress toward target
    const speed =
      targetProgress.current > animProgress.current ? OPEN_SPEED : CLOSE_SPEED;
    animProgress.current +=
      (targetProgress.current - animProgress.current) *
      Math.min(1, delta * speed * 3);

    // Snap when close enough
    if (Math.abs(animProgress.current - targetProgress.current) < 0.005) {
      animProgress.current = targetProgress.current;
    }

    const t = easeOutCubic(animProgress.current);

    // Scale: 0.6 → 1.0, multiplied by zoom
    const baseScale = THREE.MathUtils.lerp(0.6, 1.0, t);
    groupRef.current.scale.setScalar(baseScale * zoomLevel.current);

    // Material opacity
    if (planeMatRef.current) planeMatRef.current.opacity = t;
    if (overlayMatRef.current) overlayMatRef.current.opacity = t * 0.55;

    // Floating effect (only when fully open)
    if (t > 0.99) {
      floatTime.current += delta;
      const ft = floatTime.current;
      groupRef.current.rotation.x = Math.sin(ft) * 0.003;
      groupRef.current.rotation.y = Math.sin(ft * 0.8) * 0.004;
    } else {
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.y = 0;
    }

    // Glow pulse
    if (glowRef.current) {
      glowRef.current.intensity = t * 1.5 + (t > 0.99 ? Math.sin(floatTime.current * 2) * 0.15 : 0);
    }
    if (frameGlowRef.current) {
      frameGlowRef.current.intensity = t * 0.8;
    }
  });

  // ── Position in front of camera every frame ──
  useFrame(() => {
    if (!groupRef.current) return;

    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    groupRef.current.position
      .copy(camera.position)
      .addScaledVector(fwd, FOCUS_DISTANCE);
    groupRef.current.quaternion.copy(camera.quaternion);

    // Apply pan offset when zoomed
    if (zoomLevel.current > 1) {
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
      const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
      groupRef.current.position.addScaledVector(
        right,
        panOffset.current.x * planeWidth * 0.5
      );
      groupRef.current.position.addScaledVector(
        up,
        panOffset.current.y * planeHeight * 0.5
      );
    }
  });

  // Don't render when fully closed
  if (animProgress.current <= 0 && targetProgress.current === 0) return null;

  return (
    <group ref={groupRef}>
      {/* Dark overlay — room visible behind */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial
          ref={overlayMatRef}
          color="#000000"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* OLED glow — blue/teal behind monitor */}
      <pointLight
        ref={glowRef}
        color="#38bdf8"
        intensity={0}
        distance={4}
        decay={2}
        position={[0, 0, -0.8]}
      />

      {/* Monitor frame glow */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[planeWidth + 0.12, planeHeight + 0.12]} />
        <meshBasicMaterial
          ref={frameGlowRef}
          color="#38bdf8"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* Monitor bezel */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[planeWidth + 0.06, planeHeight + 0.06]} />
        <meshBasicMaterial color="#0a0a14" transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* The image — same texture as room monitor */}
      <mesh>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <meshBasicMaterial
          ref={planeMatRef}
          map={texture}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

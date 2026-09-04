"use client";

import { useCallback, useRef, useState } from "react";
import { inputBus } from "@/lib/inputBus";

interface VirtualJoystickProps {
  onMove: (x: number, y: number) => void;
  onEnd: () => void;
}

const SIZE = 140;
const KNOB = 56;
const MAX_DIST = 52;

export default function VirtualJoystick({ onMove, onEnd }: VirtualJoystickProps) {
  const [active, setActive] = useState(false);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const [mag, setMag] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchId = useRef<number | null>(null);
  const center = useRef({ x: SIZE / 2, y: SIZE / 2 });

  const handleStart = useCallback((clientX: number, clientY: number, id?: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Fixed center joystick — more predictable on mobile than floating origin
    center.current = { x: rect.width / 2, y: rect.height / 2 };
    if (id !== undefined) touchId.current = id;
    setKnob({ x: 0, y: 0 });
    setMag(0);
    setActive(true);
    try { navigator.vibrate?.(10); } catch {}
  }, []);

  const handleMove = useCallback(
    (clientX: number, clientY: number, id?: number) => {
      if (!active || !containerRef.current) return;
      if (id !== undefined && touchId.current !== null && id !== touchId.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left - center.current.x;
      const y = clientY - rect.top - center.current.y;

      const dist = Math.sqrt(x * x + y * y);
      const clampedX = dist > MAX_DIST ? (x / dist) * MAX_DIST : x;
      const clampedY = dist > MAX_DIST ? (y / dist) * MAX_DIST : y;
      const m = Math.min(1, dist / MAX_DIST);

      setKnob({ x: clampedX, y: clampedY });
      setMag(m);
      // Slight speed boost at full tilt so mobile keeps up with desktop WASD
      const boost = m > 0.92 ? 1.35 : 1;
      inputBus.moveX = (clampedX / MAX_DIST) * boost;
      inputBus.moveY = (clampedY / MAX_DIST) * boost;
      onMove(inputBus.moveX, inputBus.moveY);
    },
    [active, onMove]
  );

  const handleEnd = useCallback((id?: number) => {
    if (id !== undefined && touchId.current !== null && id !== touchId.current) return;
    touchId.current = null;
    setActive(false);
    setKnob({ x: 0, y: 0 });
    setMag(0);
    inputBus.moveX = 0;
    inputBus.moveY = 0;
    onEnd();
  }, [onEnd]);

  return (
    <div
      ref={containerRef}
      className="fixed z-50 select-none"
      style={{
        width: SIZE,
        height: SIZE,
        left: 20,
        bottom: 96,
        touchAction: "none",
      }}
      onTouchStart={(e) => {
        const t = e.changedTouches[0];
        handleStart(t.clientX, t.clientY, t.identifier);
      }}
      onTouchMove={(e) => {
        e.preventDefault();
        const t = [...Array(e.changedTouches.length)].map((_, i) => e.changedTouches[i]).find((t) => t.identifier === touchId.current) ?? e.changedTouches[0];
        handleMove(t.clientX, t.clientY, t.identifier);
      }}
      onTouchEnd={(e) => {
        const t = e.changedTouches[0];
        handleEnd(t.identifier);
      }}
      onTouchCancel={(e) => {
        const t = e.changedTouches[0];
        handleEnd(t.identifier);
      }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => {
        if (active) handleMove(e.clientX, e.clientY);
      }}
      onMouseUp={() => handleEnd()}
      onMouseLeave={() => handleEnd()}
    >
      {/* Outer ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: active ? "rgba(56,189,248,0.08)" : "rgba(255,255,255,0.05)",
          border: `2px solid ${active ? "rgba(56,189,248,0.45)" : "rgba(255,255,255,0.18)"}`,
          boxShadow: active ? "0 0 24px rgba(56,189,248,0.25)" : "none",
          backdropFilter: "blur(6px)",
        }}
      />
      {/* Direction ticks */}
      {(["▲", "▼", "◀", "▶"] as const).map((s, i) => (
        <span
          key={s}
          style={{
            position: "absolute",
            color: "rgba(255,255,255,0.25)",
            fontSize: 10,
            left: i === 2 ? 8 : i === 3 ? undefined : "50%",
            right: i === 3 ? 8 : undefined,
            top: i === 0 ? 6 : i === 1 ? undefined : "50%",
            bottom: i === 1 ? 6 : undefined,
            transform: i < 2 ? "translateX(-50%)" : "translateY(-50%)",
          }}
        >
          {s}
        </span>
      ))}
      {/* Inner knob */}
      <div
        className="absolute rounded-full"
        style={{
          width: KNOB,
          height: KNOB,
          left: SIZE / 2 - KNOB / 2 + knob.x,
          top: SIZE / 2 - KNOB / 2 + knob.y,
          background: active
            ? mag > 0.92
              ? "rgba(255,215,0,0.45)"
              : "rgba(56,189,248,0.45)"
            : "rgba(255,255,255,0.12)",
          border: `2px solid ${active ? (mag > 0.92 ? "rgba(255,215,0,0.7)" : "rgba(56,189,248,0.7)") : "rgba(56,189,248,0.4)"}`,
          transition: active ? "none" : "all 0.15s ease-out",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          color: "rgba(255,255,255,0.6)",
        }}
      >
        {mag > 0.92 ? "⚡" : "●"}
      </div>
    </div>
  );
}

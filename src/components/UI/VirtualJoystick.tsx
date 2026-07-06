"use client";

import { useCallback, useRef, useState } from "react";
import { inputBus } from "@/lib/inputBus";

interface VirtualJoystickProps {
  onMove: (x: number, y: number) => void;
  onEnd: () => void;
}

export default function VirtualJoystick({ onMove, onEnd }: VirtualJoystickProps) {
  const [active, setActive] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setOrigin({ x, y });
    setPosition({ x: 0, y: 0 });
    setActive(true);
  }, []);

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!active || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left - origin.x;
      const y = clientY - rect.top - origin.y;

      const maxDist = 40;
      const dist = Math.sqrt(x * x + y * y);
      const clampedX = dist > maxDist ? (x / dist) * maxDist : x;
      const clampedY = dist > maxDist ? (y / dist) * maxDist : y;

      setPosition({ x: clampedX, y: clampedY });
      inputBus.moveX = clampedX / maxDist;
      inputBus.moveY = clampedY / maxDist;
      onMove(clampedX / maxDist, clampedY / maxDist);
    },
    [active, origin, onMove]
  );

  const handleEnd = useCallback(() => {
    setActive(false);
    setPosition({ x: 0, y: 0 });
    inputBus.moveX = 0;
    inputBus.moveY = 0;
    onEnd();
  }, [onEnd]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-8 left-8 z-50 select-none touch-none"
      style={{ width: 100, height: 100 }}
      onTouchStart={(e) => {
        const t = e.touches[0];
        handleStart(t.clientX, t.clientY);
      }}
      onTouchMove={(e) => {
        e.preventDefault();
        const t = e.touches[0];
        handleMove(t.clientX, t.clientY);
      }}
      onTouchEnd={handleEnd}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => {
        if (active) handleMove(e.clientX, e.clientY);
      }}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      {/* Outer ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "2px solid rgba(255,255,255,0.15)",
        }}
      />
      {/* Inner knob */}
      <div
        className="absolute rounded-full"
        style={{
          width: 40,
          height: 40,
          left: 30 + position.x,
          top: 30 + position.y,
          background: active
            ? "rgba(56,189,248,0.4)"
            : "rgba(255,255,255,0.1)",
          border: "2px solid rgba(56,189,248,0.5)",
          transition: active ? "none" : "all 0.15s ease-out",
        }}
      />
    </div>
  );
}

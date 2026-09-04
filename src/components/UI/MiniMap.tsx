"use client";

import { useState } from "react";
import { useStore, fpvState } from "@/lib/store";
import { BUILDINGS } from "@/components/Buildings/BuildingData";
import { audioManager } from "@/lib/audio";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/lib/useIsMobile";

const MAP_SIZE = 180;
const MOBILE_MAP_SIZE = 132;
const WORLD_MIN_X = -18;
const WORLD_MAX_X = 18;
const WORLD_MIN_Z = -20;
const WORLD_MAX_Z = 8;

function worldToMap(wx: number, wz: number, size: number): [number, number] {
  const x = ((wx - WORLD_MIN_X) / (WORLD_MAX_X - WORLD_MIN_X)) * size;
  const y = ((wz - WORLD_MIN_Z) / (WORLD_MAX_Z - WORLD_MIN_Z)) * size;
  return [x, y];
}

export default function MiniMap() {
  const { introComplete, interiorOpen, selectedBuilding, setTeleportOpen, visitedBuildings } = useStore();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (!introComplete || interiorOpen) return null;

  const size = isMobile ? MOBILE_MAP_SIZE : MAP_SIZE;
  const [px, py] = worldToMap(fpvState.position[0], fpvState.position[2], size);

  // Direction triangle
  const yaw = fpvState.yaw;
  const dirLen = 8;
  const dx = -Math.sin(yaw) * dirLen;
  const dy = -Math.cos(yaw) * dirLen;

  // Mobile: collapsed pill by default — tap to expand. Avoids covering the screen.
  if (isMobile) {
    return (
      <div className="absolute top-3 right-3 pointer-events-auto" style={{ zIndex: 40 }} data-ui="minimap">
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="rounded-full px-3 flex items-center gap-2"
            style={{ minHeight: 44, background: "rgba(4,6,18,0.85)", border: "1px solid rgba(56,189,248,0.3)", color: "#38bdf8", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, backdropFilter: "blur(8px)" }}
          >
            🗺 {visitedBuildings.length}/{BUILDINGS.length}
          </button>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative rounded-xl overflow-hidden" style={{ width: size + 24, background: "rgba(4,6,18,0.92)", border: "1px solid rgba(56,189,248,0.25)", backdropFilter: "blur(8px)" }}>
            <div className="px-3 py-2 flex items-center justify-between border-b" style={{ borderColor: "rgba(56,189,248,0.1)" }}>
              <span className="text-[8px] tracking-[0.2em] uppercase" style={{ color: "rgba(56,189,248,0.5)" }}>Map</span>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "rgba(56,189,248,0.6)", cursor: "pointer", fontSize: 14, minWidth: 32, minHeight: 32 }}>✕</button>
            </div>
            <div className="relative" style={{ width: size, height: size, margin: "8px 12px 12px" }}>
              <svg width={size} height={size} className="absolute inset-0" style={{ opacity: 0.15 }}>
                {Array.from({ length: 5 }, (_, i) => {
                  const pos = (i + 1) * (size / 5);
                  return (
                    <g key={i}>
                      <line x1={pos} y1={0} x2={pos} y2={size} stroke="#38bdf8" strokeWidth={0.5} />
                      <line x1={0} y1={pos} x2={size} y2={pos} stroke="#38bdf8" strokeWidth={0.5} />
                    </g>
                  );
                })}
              </svg>
              {BUILDINGS.map((b) => {
                const [bx, by] = worldToMap(b.position[0], b.position[2], size);
                const isVisited = visitedBuildings.includes(b.id);
                const s = Math.max(8, Math.min(12, b.scale[0] * 2.2));
                return (
                  <button
                    key={b.id}
                    onClick={() => { audioManager.playClickSound(); setOpen(false); setTeleportOpen(true); }}
                    className="absolute rounded-sm"
                    style={{ left: bx - s / 2, top: by - s / 2, width: s, height: s, minWidth: 12, minHeight: 12, background: isVisited ? "rgba(56,189,248,0.4)" : "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)" }}
                    title={b.name}
                  />
                );
              })}
              <svg width={size} height={size} className="absolute inset-0 pointer-events-none">
                <line x1={px} y1={py} x2={px + dx} y2={py + dy} stroke="#ffd700" strokeWidth={1.5} strokeLinecap="round" />
                <circle cx={px} cy={py} r={3} fill="#ffd700" />
              </svg>
            </div>
            <button onClick={() => { setOpen(false); setTeleportOpen(true); }} className="w-full py-2 text-center" style={{ background: "rgba(56,189,248,0.08)", border: "none", borderTop: "1px solid rgba(56,189,248,0.12)", color: "#38bdf8", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", minHeight: 44, cursor: "pointer" }}>⚡ TELEPORT</button>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="absolute top-4 right-4 pointer-events-auto"
      style={{ zIndex: 40 }}
    >
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          width: MAP_SIZE + 24,
          height: MAP_SIZE + 48,
          background: "rgba(4,6,18,0.85)",
          border: "1px solid rgba(56,189,248,0.2)",
          boxShadow: "0 0 30px rgba(56,189,248,0.08), inset 0 0 20px rgba(56,189,248,0.03)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Header */}
        <div className="px-3 py-1.5 flex items-center justify-between border-b" style={{ borderColor: "rgba(56,189,248,0.1)" }}>
          <span className="text-[8px] tracking-[0.2em] uppercase" style={{ color: "rgba(56,189,248,0.5)" }}>
            District Map
          </span>
          <span className="text-[8px]" style={{ color: "rgba(56,189,248,0.3)" }}>
            {visitedBuildings.length}/{BUILDINGS.length}
          </span>
        </div>

        {/* Map canvas */}
        <div className="relative" style={{ width: MAP_SIZE, height: MAP_SIZE, margin: "8px 12px 12px" }}>
          {/* Grid lines */}
          <svg
            width={MAP_SIZE}
            height={MAP_SIZE}
            className="absolute inset-0"
            style={{ opacity: 0.15 }}
          >
            {Array.from({ length: 7 }, (_, i) => {
              const pos = (i + 1) * (MAP_SIZE / 7);
              return (
                <g key={i}>
                  <line x1={pos} y1={0} x2={pos} y2={MAP_SIZE} stroke="#38bdf8" strokeWidth={0.5} />
                  <line x1={0} y1={pos} x2={MAP_SIZE} y2={pos} stroke="#38bdf8" strokeWidth={0.5} />
                </g>
              );
            })}
          </svg>

          {/* Buildings */}
          {BUILDINGS.map((b) => {
            const [bx, by] = worldToMap(b.position[0], b.position[2], MAP_SIZE);
            const isVisited = visitedBuildings.includes(b.id);
            const isCurrent = selectedBuilding === b.id;
            const s = Math.max(6, Math.min(12, b.scale[0] * 2.2));

            return (
              <button
                key={b.id}
                onClick={() => {
                  audioManager.playClickSound();
                  setTeleportOpen(true);
                }}
                className="absolute rounded-sm transition-all hover:scale-125 cursor-pointer"
                style={{
                  left: bx - s / 2,
                  top: by - s / 2,
                  width: s,
                  height: s,
                  background: isCurrent
                    ? "#38bdf8"
                    : isVisited
                      ? "rgba(56,189,248,0.4)"
                      : "rgba(56,189,248,0.15)",
                  border: `1px solid ${isCurrent ? "#38bdf8" : "rgba(56,189,248,0.3)"}`,
                  boxShadow: isCurrent ? "0 0 8px rgba(56,189,248,0.5)" : "none",
                }}
                title={b.name}
              />
            );
          })}

          {/* Player position + direction */}
          <svg
            width={MAP_SIZE}
            height={MAP_SIZE}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Direction line */}
            <line
              x1={px}
              y1={py}
              x2={px + dx}
              y2={py + dy}
              stroke="#ffd700"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            {/* Player dot */}
            <circle cx={px} cy={py} r={3} fill="#ffd700" />
            <circle cx={px} cy={py} r={5} fill="none" stroke="rgba(255,215,0,0.3)" strokeWidth={1} />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

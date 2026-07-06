"use client";

import { useStore, fpvState } from "@/lib/store";
import { BUILDINGS } from "@/components/Buildings/BuildingData";
import { audioManager } from "@/lib/audio";
import { motion } from "framer-motion";

const MAP_SIZE = 180;
const WORLD_MIN_X = -18;
const WORLD_MAX_X = 18;
const WORLD_MIN_Z = -20;
const WORLD_MAX_Z = 8;

function worldToMap(wx: number, wz: number): [number, number] {
  const x = ((wx - WORLD_MIN_X) / (WORLD_MAX_X - WORLD_MIN_X)) * MAP_SIZE;
  const y = ((wz - WORLD_MIN_Z) / (WORLD_MAX_Z - WORLD_MIN_Z)) * MAP_SIZE;
  return [x, y];
}

export default function MiniMap() {
  const { introComplete, interiorOpen, selectedBuilding, setTeleportOpen, visitedBuildings } = useStore();

  if (!introComplete || interiorOpen) return null;

  const [px, py] = worldToMap(fpvState.position[0], fpvState.position[2]);

  // Direction triangle
  const yaw = fpvState.yaw;
  const dirLen = 8;
  const dx = -Math.sin(yaw) * dirLen;
  const dy = -Math.cos(yaw) * dirLen;

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
            const [bx, by] = worldToMap(b.position[0], b.position[2]);
            const isVisited = visitedBuildings.includes(b.id);
            const isCurrent = selectedBuilding === b.id;
            const size = Math.max(6, Math.min(12, b.scale[0] * 2.2));

            return (
              <button
                key={b.id}
                onClick={() => {
                  audioManager.playClickSound();
                  setTeleportOpen(true);
                }}
                className="absolute rounded-sm transition-all hover:scale-125 cursor-pointer"
                style={{
                  left: bx - size / 2,
                  top: by - size / 2,
                  width: size,
                  height: size,
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

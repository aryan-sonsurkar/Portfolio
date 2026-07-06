"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { BUILDINGS } from "@/components/Buildings/BuildingData";

const BUILDING_ICONS: Record<string, string> = {
  "modcodes-hq": "⚡",
  "project-factory": "🏭",
  "achievement-tower": "🏆",
  "innovation-lab": "🔬",
  "developer-museum": "🏛️",
  "open-source-center": "🌐",
  "developer-apartment": "🏠",
  "football-arena": "⚽",
  "ironman-destiny-lab": "🤖",
  "future-observatory": "🔭",
};

export default function WristTeleportHUD() {
  const {
    teleportOpen,
    setTeleportOpen,
    teleportToBuilding,
    cameraMode,
    introComplete,
    selectedBuilding,
    interiorOpen,
  } = useStore();

  // T key to toggle teleport panel
  useEffect(() => {
    if (!introComplete) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "t" || e.key === "T") {
        if (cameraMode === "screen") return;
        setTeleportOpen(!teleportOpen);
      }
      if (e.key === "Escape" && teleportOpen) {
        setTeleportOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [teleportOpen, setTeleportOpen, cameraMode, introComplete]);

  if (!teleportOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setTeleportOpen(false)}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg"
      >
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(4,6,18,0.97) 0%, rgba(10,14,30,0.97) 100%)",
            borderColor: "rgba(56,189,248,0.2)",
            boxShadow: "0 0 60px rgba(56,189,248,0.1), inset 0 1px 0 rgba(56,189,248,0.1)",
          }}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(56,189,248,0.1)" }}>
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className="text-lg font-bold tracking-wider"
                  style={{ color: "#38bdf8", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  TELEPORT
                </h2>
                <p className="text-xs mt-0.5" style={{ color: "rgba(56,189,248,0.5)" }}>
                  Select a destination
                </p>
              </div>
              <button
                onClick={() => setTeleportOpen(false)}
                className="text-xs px-3 py-1 rounded-md border transition-colors hover:bg-white/5"
                style={{
                  color: "rgba(56,189,248,0.6)",
                  borderColor: "rgba(56,189,248,0.2)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                ESC
              </button>
            </div>
          </div>

          {/* Building list */}
          <div className="p-4 max-h-[60vh] overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(56,189,248,0.2) transparent" }}>
            <div className="grid grid-cols-2 gap-2">
              {BUILDINGS.map((building, i) => {
                const isHere = interiorOpen && selectedBuilding === building.id;
                return (
                  <motion.button
                    key={building.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => {
                      if (isHere) return;
                      teleportToBuilding(building.id);
                    }}
                    disabled={isHere}
                    className="flex items-center gap-3 p-3 rounded-lg border text-left transition-all"
                    style={{
                      background: isHere ? "rgba(56,189,248,0.1)" : "rgba(56,189,248,0.03)",
                      borderColor: isHere ? "rgba(56,189,248,0.4)" : "rgba(56,189,248,0.1)",
                      opacity: isHere ? 0.6 : 1,
                      cursor: isHere ? "default" : "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (!isHere) {
                        (e.currentTarget as HTMLElement).style.background = "rgba(56,189,248,0.08)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(56,189,248,0.3)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isHere) {
                        (e.currentTarget as HTMLElement).style.background = "rgba(56,189,248,0.03)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(56,189,248,0.1)";
                      }
                    }}
                  >
                    <span className="text-xl">{BUILDING_ICONS[building.id] || "📍"}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p
                          className="text-xs font-semibold truncate"
                          style={{ color: "#38bdf8", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {building.name}
                        </p>
                        {isHere && (
                          <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.2)", color: "#38bdf8" }}>
                            HERE
                          </span>
                        )}
                      </div>
                      <p
                        className="text-[10px] truncate mt-0.5"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        {building.subtitle}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t" style={{ borderColor: "rgba(56,189,248,0.1)" }}>
            <p className="text-center text-[10px]" style={{ color: "rgba(56,189,248,0.35)" }}>
              Press <span style={{ color: "#38bdf8" }}>T</span> or <span style={{ color: "#38bdf8" }}>ESC</span> to close
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

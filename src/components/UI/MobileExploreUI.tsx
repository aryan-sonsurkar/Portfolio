"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, fpvState } from "@/lib/store";
import { BUILDINGS } from "@/components/Buildings/BuildingData";
import { audioManager } from "@/lib/audio";
import { useIsMobile } from "@/lib/useIsMobile";

const ICONS: Record<string, string> = {
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
  "contact-kiosk": "✉️",
  "algorithm-dojo": "🥋",
  "hardware-foundry": "🔧",
  "the-vault": "🔐",
  "hackathon-war-room": "🔥",
  "the-roastery": "☕",
};

export default function MobileExploreUI() {
  const isMobile = useIsMobile();
  const { introComplete, interiorOpen, selectedBuilding, teleportToBuilding, enterBuilding, setExitPosition, visitedBuildings } = useStore();
  const [expanded, setExpanded] = useState(false);
  const [nearby, setNearby] = useState<string | null>(null);

  // Proximity check — show "Tap to enter" when within 4.5m of an entrance
  useEffect(() => {
    if (!isMobile || !introComplete || interiorOpen) {
      setNearby(null);
      return;
    }
    const id = window.setInterval(() => {
      const px = fpvState.position[0];
      const pz = fpvState.position[2];
      let best: string | null = null;
      let bestD = 4.5;
      for (const b of BUILDINGS) {
        const ez = b.position[2] + b.scale[2] / 2 + 0.6;
        const d = Math.hypot(px - b.position[0], pz - ez);
        if (d < bestD) {
          bestD = d;
          best = b.id;
        }
      }
      setNearby((prev) => (prev === best ? prev : best));
    }, 400);
    return () => window.clearInterval(id);
  }, [isMobile, introComplete, interiorOpen]);

  if (!isMobile || !introComplete) return null;

  const handleGo = (id: string) => {
    audioManager.playClickSound();
    if (interiorOpen) {
      teleportToBuilding(id);
    } else if (nearby === id) {
      setExitPosition([fpvState.position[0], fpvState.position[1], fpvState.position[2]], fpvState.yaw);
      enterBuilding(id);
    } else {
      teleportToBuilding(id);
    }
    setExpanded(false);
  };

  const nearbyBuilding = BUILDINGS.find((b) => b.id === nearby);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 pointer-events-none" data-ui="explore">
      {/* Nearby enter prompt */}
      <AnimatePresence>
        {nearbyBuilding && !interiorOpen && (
          <motion.button
            key={nearbyBuilding.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            onClick={() => handleGo(nearbyBuilding.id)}
            className="pointer-events-auto mx-auto mb-2 flex items-center gap-2 px-5 py-3 rounded-full"
            style={{
              background: "rgba(255,215,0,0.14)",
              border: "1px solid rgba(255,215,0,0.45)",
              color: "#ffd700",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              letterSpacing: 1,
              backdropFilter: "blur(10px)",
              boxShadow: "0 0 24px rgba(255,215,0,0.2)",
              minHeight: 48,
            }}
          >
            <span>{ICONS[nearbyBuilding.id] ?? "📍"}</span>
            Enter {nearbyBuilding.name} ›
          </motion.button>
        )}
      </AnimatePresence>

      {/* Explore bar */}
      <div className="pointer-events-auto mx-3 mb-3 rounded-2xl overflow-hidden" style={{ background: "rgba(4,6,18,0.88)", border: "1px solid rgba(56,189,248,0.2)", backdropFilter: "blur(12px)" }}>
        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-full flex items-center justify-between px-4"
          style={{ minHeight: 48, background: "none", border: "none", cursor: "pointer", color: "#38bdf8", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: 2 }}
        >
          <span>🗺 EXPLORE ({visitedBuildings.length}/{BUILDINGS.length})</span>
          <span style={{ opacity: 0.7 }}>{expanded ? "▾" : "▸"}</span>
        </button>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <div className="flex gap-2 overflow-x-auto px-3 pb-3 pt-1" style={{ scrollbarWidth: "none" }}>
                {BUILDINGS.map((b) => {
                  const visited = visitedBuildings.includes(b.id);
                  const here = interiorOpen && selectedBuilding === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => handleGo(b.id)}
                      disabled={here}
                      className="shrink-0 rounded-xl border text-left"
                      style={{
                        width: 132,
                        padding: "10px 12px",
                        background: here ? "rgba(56,189,248,0.12)" : visited ? "rgba(56,189,248,0.06)" : "rgba(255,255,255,0.02)",
                        borderColor: here ? "rgba(56,189,248,0.5)" : "rgba(56,189,248,0.15)",
                        opacity: here ? 0.6 : 1,
                        cursor: here ? "default" : "pointer",
                        minHeight: 76,
                      }}
                    >
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{ICONS[b.id] ?? "📍"}{here ? " •" : ""}</div>
                      <div style={{ color: "#e8f4ff", fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.name}</div>
                      <div style={{ color: visited ? "rgba(56,189,248,0.6)" : "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }}>{here ? "YOU ARE HERE" : visited ? "✓ visited · tap to fly" : "tap to fly"}</div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

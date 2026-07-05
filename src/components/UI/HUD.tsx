"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";

export default function HUD() {
  const { hoveredBuilding, introComplete, focusedBuilding, weatherActive, toggleWeather } =
    useStore();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        if (!focusedBuilding) toggleWeather();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [focusedBuilding, toggleWeather]);

  if (!introComplete) return null;

  return (
    <div className="fixed inset-0 z-30 pointer-events-none">
      {/* Top left — District label */}
      {!focusedBuilding && (
        <div className="absolute top-6 left-6">
          <p
            className="text-xs tracking-widest uppercase"
            style={{
              color: "rgba(255,215,0,0.4)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            MODCODES District
          </p>
          <p
            className="text-[10px] tracking-wider mt-1"
            style={{
              color: "rgba(255,255,255,0.15)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Click any building to explore · Press R for weather
          </p>
        </div>
      )}

      {/* Bottom center — Hovered building info */}
      <AnimatePresence>
        {hoveredBuilding && !focusedBuilding && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <p
              className="text-xs tracking-widest uppercase px-4 py-2 rounded-full border"
              style={{
                color: "#ffd700",
                borderColor: "rgba(255,215,0,0.2)",
                background: "rgba(10, 6, 18, 0.8)",
                backdropFilter: "blur(8px)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {hoveredBuilding}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom right — Version + Weather */}
      <div className="absolute bottom-6 right-6 flex items-center gap-3">
        {/* Weather indicator */}
        <AnimatePresence>
          {weatherActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="px-2.5 py-1 rounded-full text-[10px] tracking-wider"
              style={{
                color: "#7799bb",
                border: "1px solid rgba(119,153,187,0.2)",
                background: "rgba(119,153,187,0.06)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              ☁ Rain
            </motion.div>
          )}
        </AnimatePresence>

        <p
          className="text-[10px] tracking-wider"
          style={{
            color: "rgba(255,255,255,0.15)",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          v0.2.0 — District Expanded
        </p>
      </div>
    </div>
  );
}

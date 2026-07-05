"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";

export default function HUD() {
  const { hoveredBuilding, introComplete, focusedBuilding } = useStore();

  if (!introComplete || focusedBuilding) return null;

  return (
    <div className="fixed inset-0 z-30 pointer-events-none">
      {/* Top left — District label */}
      <div className="absolute top-6 left-6">
        <p
          className="text-xs tracking-widest uppercase"
          style={{ color: "rgba(255,215,0,0.4)", fontFamily: "'JetBrains Mono', monospace" }}
        >
          MODCODES District
        </p>
        <p
          className="text-[10px] tracking-wider mt-1"
          style={{ color: "rgba(255,255,255,0.15)", fontFamily: "'JetBrains Mono', monospace" }}
        >
          Click any building to explore
        </p>
      </div>

      {/* Bottom center — Hovered building info */}
      <AnimatePresence>
        {hoveredBuilding && (
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

      {/* Bottom right — Version */}
      <div className="absolute bottom-6 right-6">
        <p
          className="text-[10px] tracking-wider"
          style={{ color: "rgba(255,255,255,0.15)", fontFamily: "'JetBrains Mono', monospace" }}
        >
          v0.1.0 — District Seed
        </p>
      </div>
    </div>
  );
}

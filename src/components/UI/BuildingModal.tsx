"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { BUILDINGS } from "../Buildings/BuildingData";

export default function BuildingModal() {
  const { focusedBuilding, unfocusBuilding } = useStore();
  const building = BUILDINGS.find((b) => b.id === focusedBuilding);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") unfocusBuilding();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [unfocusBuilding]);

  return (
    <AnimatePresence>
      {building && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(5, 3, 10, 0.6)", backdropFilter: "blur(4px)" }}
            onClick={unfocusBuilding}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-x-4 bottom-4 top-20 z-50 mx-auto max-w-2xl overflow-hidden rounded-2xl border"
            style={{
              background: "rgba(12, 8, 20, 0.95)",
              borderColor: "rgba(255,215,0,0.12)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(255,215,0,0.05)",
            }}
          >
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Header */}
              <div className="p-6 pb-4 border-b" style={{ borderColor: "rgba(255,215,0,0.08)" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className="text-xs tracking-widest uppercase mb-1"
                      style={{ color: building.emissive || "#ffd700", fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {building.subtitle}
                    </p>
                    <h2
                      className="text-2xl font-light tracking-wide"
                      style={{ color: "#f0e6d8", fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {building.name}
                    </h2>
                  </div>
                  <button
                    onClick={unfocusBuilding}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border cursor-pointer transition-colors hover:border-amber-500/50"
                    style={{
                      borderColor: "rgba(255,255,255,0.1)",
                      color: "#888",
                      background: "rgba(255,255,255,0.03)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 space-y-5">
                {building.content.paragraphs.map((p, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    className="text-sm leading-relaxed"
                    style={{
                      color: "#b4b4c8",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {p}
                  </motion.p>
                ))}

                {/* Tags */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-2 pt-2"
                >
                  {building.content.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs tracking-wide"
                      style={{
                        background: "rgba(255,215,0,0.08)",
                        color: "#ffd700",
                        border: "1px solid rgba(255,215,0,0.15)",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>

                {/* Links */}
                {building.content.links && building.content.links.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-wrap gap-3 pt-4"
                  >
                    {building.content.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target={link.url !== "#" ? "_blank" : undefined}
                        rel={link.url !== "#" ? "noopener noreferrer" : undefined}
                        className="px-5 py-2.5 rounded-full text-xs tracking-widest uppercase border transition-all hover:border-amber-500/50"
                        style={{
                          color: "#ffd700",
                          borderColor: "rgba(255,215,0,0.2)",
                          background: "rgba(255,215,0,0.05)",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {link.icon === "rocket" ? "→ " : link.icon === "external" ? "↗ " : ""}
                        {link.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Footer hint */}
              <div className="p-4 border-t text-center" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                <p
                  className="text-xs tracking-wider"
                  style={{ color: "#444", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Press ESC or click outside to return to the district
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

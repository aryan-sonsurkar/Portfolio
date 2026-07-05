"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { BUILDINGS } from "../Buildings/BuildingData";

function TerminalLine({
  text,
  delay,
  color = "#b4b4c8",
}: {
  text: string;
  delay: number;
  color?: string;
}) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
      className="text-sm leading-relaxed"
      style={{ color, fontFamily: "'JetBrains Mono', monospace" }}
    >
      {text}
    </motion.p>
  );
}

function ScanLines() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
      }}
    />
  );
}

export default function BuildingModal() {
  const { focusedBuilding, unfocusBuilding } = useStore();
  const building = BUILDINGS.find((b) => b.id === focusedBuilding);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (building) {
      setShowContent(false);
      const t = setTimeout(() => setShowContent(true), 400);
      return () => clearTimeout(t);
    }
  }, [building]);

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
            style={{
              background: "rgba(5, 3, 10, 0.7)",
              backdropFilter: "blur(6px)",
            }}
            onClick={unfocusBuilding}
          />

          {/* Terminal Window */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-x-4 bottom-4 top-16 z-50 mx-auto max-w-3xl overflow-hidden rounded-xl border"
            style={{
              background: "rgba(6, 4, 12, 0.97)",
              borderColor: "rgba(255,215,0,0.1)",
              boxShadow:
                "0 0 40px rgba(255,215,0,0.04), 0 24px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,215,0,0.06)",
            }}
          >
            <ScanLines />

            {/* Terminal Title Bar */}
            <div
              className="flex items-center gap-3 px-4 py-2.5 border-b relative z-20"
              style={{
                borderColor: "rgba(255,215,0,0.08)",
                background: "rgba(255,215,0,0.03)",
              }}
            >
              <div className="flex gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: "#ff5f56" }}
                />
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: "#ffbd2e" }}
                />
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: "#27c93f" }}
                />
              </div>
              <p
                className="text-[10px] tracking-widest uppercase flex-1"
                style={{
                  color: "rgba(255,215,0,0.4)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {building.name} — ~/district/{building.id}
              </p>
              <button
                onClick={unfocusBuilding}
                className="text-xs px-2 py-0.5 rounded border cursor-pointer transition-colors hover:border-amber-500/50"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  color: "#666",
                  background: "transparent",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                ESC
              </button>
            </div>

            {/* Terminal Content */}
            <div className="p-6 overflow-y-auto relative z-20" style={{ maxHeight: "calc(100vh - 120px)" }}>
              {showContent && (
                <div className="space-y-4">
                  {/* Prompt line */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <span
                      className="text-xs"
                      style={{
                        color: "#22c55e",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      aryan@modcodes
                    </span>
                    <span
                      className="text-xs"
                      style={{
                        color: "#666",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      ~/${building.id}$
                    </span>
                    <span
                      className="text-xs"
                      style={{
                        color: "#ffd700",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      cat README.md
                    </span>
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-2 h-4"
                      style={{ background: "#ffd700" }}
                    />
                  </motion.div>

                  <div
                    className="h-px w-full"
                    style={{ background: "rgba(255,215,0,0.06)" }}
                  />

                  {/* Building header */}
                  <TerminalLine
                    text={`// ${building.content.subtitle}`}
                    delay={0.1}
                    color="#ffd700"
                  />
                  <TerminalLine
                    text={`// ${building.name}`}
                    delay={0.2}
                    color="#888"
                  />

                  <div className="h-2" />

                  {/* Paragraphs as terminal output */}
                  {building.content.paragraphs.map((p, i) => (
                    <TerminalLine
                      key={i}
                      text={p}
                      delay={0.3 + i * 0.12}
                    />
                  ))}

                  <div className="h-2" />

                  {/* Tags as terminal badges */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <p
                      className="text-[10px] tracking-widest uppercase mb-2"
                      style={{
                        color: "#555",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      technologies
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {building.content.tags.map((tag, i) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + i * 0.05 }}
                          className="px-2.5 py-1 rounded text-xs"
                          style={{
                            background: "rgba(255,215,0,0.06)",
                            color: "#ffd700",
                            border: "1px solid rgba(255,215,0,0.12)",
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Links as terminal commands */}
                  {building.content.links &&
                    building.content.links.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="pt-2"
                      >
                        <p
                          className="text-[10px] tracking-widest uppercase mb-2"
                          style={{
                            color: "#555",
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          links
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {building.content.links.map((link) => (
                            <a
                              key={link.label}
                              href={link.url}
                              target={
                                link.url !== "#" ? "_blank" : undefined
                              }
                              rel={
                                link.url !== "#"
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              className="px-4 py-2 rounded text-xs tracking-wide border transition-all hover:border-green-500/50 hover:text-green-400"
                              style={{
                                color: "#22c55e",
                                borderColor: "rgba(34,197,94,0.2)",
                                background: "rgba(34,197,94,0.04)",
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                            >
                              {link.icon === "rocket"
                                ? "$ run "
                                : link.icon === "external"
                                  ? "$ open "
                                  : "$ "}
                              {link.label}
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}

                  <div className="h-4" />

                  {/* Footer prompt */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="flex items-center gap-2"
                  >
                    <span
                      className="text-xs"
                      style={{
                        color: "#22c55e",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      aryan@modcodes
                    </span>
                    <span
                      className="text-xs"
                      style={{
                        color: "#666",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      ~/${building.id}$
                    </span>
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-2 h-4"
                      style={{ background: "#22c55e" }}
                    />
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

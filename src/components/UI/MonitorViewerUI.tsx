"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { monitorConfig } from "@/config/monitors";
import { BUILDINGS } from "@/components/Buildings/BuildingData";
import type { MonitorConfig } from "@/config/monitors";

// ── Building subtitles ──
const BUILDING_SUBTITLES: Record<string, string> = {
  "modcodes-hq": "Modcodes · AI Student Platform",
  "achievement-tower": "Certificates & Milestones",
  "developer-museum": "Journey & World Guide",
  "project-factory": "Shipped Work Archive",
  "innovation-lab": "Experimental Projects",
  "open-source-center": "GitHub Contributions",
  "developer-apartment": "Personal Workspace",
  "football-arena": "Football & Balance",
  "ironman-destiny-lab": "Hardware & Dreams",
  "future-observatory": "Vision & Roadmap",
  "contact-kiosk": "Connect & Convert",
  "algorithm-dojo": "DSA Training Log",
  "hardware-foundry": "ESP32 Workshop",
  "the-vault": "Seema Netra Lab",
  "hackathon-war-room": "SIH-2025 Mission Control",
  "the-roastery": "Fuel & Focus",
};

// ── Find which building a monitor belongs to ──
function findBuildingForMonitor(monitorId: string): string | null {
  for (const [buildingId, config] of Object.entries(monitorConfig)) {
    if (config.monitors.some((m) => m.id === monitorId)) {
      return buildingId;
    }
  }
  return null;
}

// ── Get ordered monitor list for a building ──
function getBuildingMonitors(buildingId: string): MonitorConfig[] {
  return monitorConfig[buildingId]?.monitors ?? [];
}

type LoadingPhase = "idle" | "connecting" | "connected";

export default function MonitorViewerUI() {
  const { activeMonitor, setActiveScreen } = useStore();
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>("idle");
  const [showUI, setShowUI] = useState(false);

  // ── Loading sequence ──
  useEffect(() => {
    if (!activeMonitor) {
      setLoadingPhase("idle");
      setShowUI(false);
      return;
    }

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    setLoadingPhase("connecting");
    setShowUI(false);

    timeouts.push(
      setTimeout(() => {
        setLoadingPhase("connected");
        timeouts.push(
          setTimeout(() => {
            setShowUI(true);
          }, 100)
        );
      }, 150)
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [activeMonitor?.id]);

  // ── Navigate to a different monitor ──
  const navigateMonitor = useCallback(
    (direction: "prev" | "next") => {
      if (!activeMonitor) return;
      const buildingId = findBuildingForMonitor(activeMonitor.id);
      if (!buildingId) return;

      const monitors = getBuildingMonitors(buildingId);
      const currentIndex = monitors.findIndex((m) => m.id === activeMonitor.id);
      if (currentIndex === -1) return;

      const nextIndex =
        direction === "next"
          ? (currentIndex + 1) % monitors.length
          : (currentIndex - 1 + monitors.length) % monitors.length;

      const nextMonitor = monitors[nextIndex];
      setActiveScreen(nextMonitor.id, nextMonitor);
    },
    [activeMonitor, setActiveScreen]
  );

  // ── Keyboard: arrow keys + ESC ──
  useEffect(() => {
    if (!activeMonitor) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") navigateMonitor("prev");
      else if (e.key === "ArrowRight") navigateMonitor("next");
      else if (e.key === "Escape") {
        // ESC is handled by CharacterController + MonitorFocusPlane
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeMonitor, navigateMonitor]);

  if (!activeMonitor) return null;

  const buildingId = findBuildingForMonitor(activeMonitor.id);
  const subtitle = buildingId ? BUILDING_SUBTITLES[buildingId] ?? "" : "";
  const monitors = buildingId ? getBuildingMonitors(buildingId) : [];
  const currentIndex = monitors.findIndex((m) => m.id === activeMonitor.id);
  const proofLinks = buildingId ? (BUILDINGS.find((b) => b.id === buildingId)?.content.links ?? []).filter((l) => l.url && l.url !== "#") : [];

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {/* ── Loading overlay ── */}
      <AnimatePresence>
        {activeMonitor && !showUI && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: 60 }}
          >
            <div className="text-center">
              <p
                className="text-xs tracking-[6px] uppercase mb-3"
                style={{ color: loadingPhase === "connected" ? "#22c55e" : "#ffd700" }}
              >
                {loadingPhase === "connecting" ? "CONNECTING..." : "CONNECTED"}
              </p>
              <div
                className="w-48 h-1 mx-auto rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{
                    width: loadingPhase === "connected" ? "100%" : "70%",
                  }}
                  transition={{ duration: loadingPhase === "connecting" ? 0.12 : 0.08 }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      loadingPhase === "connected"
                        ? "#22c55e"
                        : "linear-gradient(90deg, #ffd700, #ff8c00)",
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            key="header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-0 left-0 right-0 text-center pt-6 pb-4"
            style={{
              background:
                "linear-gradient(180deg, rgba(4,6,12,0.7) 0%, transparent 100%)",
            }}
          >
            <p
              className="text-[10px] tracking-[5px] uppercase mb-1"
              style={{ color: "rgba(56,189,248,0.6)" }}
            >
              {subtitle}
            </p>
            <p
              className="text-sm tracking-[4px] uppercase"
              style={{ color: "#ffd700" }}
            >
              {activeMonitor.label}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Info panel (progressive disclosure, data-driven) ── */}
      <AnimatePresence>
        {showUI && activeMonitor.info && (
          <motion.aside
            key="info"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute pointer-events-auto info-panel"
            style={{
              background: "rgba(4,6,12,0.88)",
              border: "1px solid rgba(255,215,0,0.16)",
              backdropFilter: "blur(12px)",
              borderRadius: "10px",
              padding: "14px 16px",
              maxWidth: 300,
            }}
          >
            <p
              className="text-[13px] font-bold mb-1"
              style={{ color: "#ffd700", fontFamily: "'JetBrains Mono', monospace" }}
            >
              {activeMonitor.info.title}
            </p>
            <p
              className="text-[12px] leading-relaxed mb-2"
              style={{ color: "rgba(255,255,255,0.72)" }}
            >
              {activeMonitor.info.summary}
            </p>
            {activeMonitor.info.stack && (
              <p className="text-[11px] leading-relaxed mb-2" style={{ color: "rgba(56,189,248,0.85)" }}>
                {activeMonitor.info.stack}
              </p>
            )}
            {activeMonitor.info.features && activeMonitor.info.features.length > 0 && (
              <ul className="mb-1">
                {activeMonitor.info.features.map((f) => (
                  <li
                    key={f}
                    className="text-[11px] leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    • {f}
                  </li>
                ))}
              </ul>
            )}
            {activeMonitor.info.link ? (
              <a
                href={activeMonitor.info.link}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: 44,
                  padding: "0 18px",
                  marginTop: 8,
                  color: "#0a0612",
                  background: "#ffd700",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {activeMonitor.info.linkLabel ?? "Open"} ↗
              </a>
            ) : activeMonitor.info.linkLabel ? (
              <p
                className="text-[11px] tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.4)", marginTop: 8 }}
              >
                {activeMonitor.info.linkLabel}
              </p>
            ) : null}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Footer ── */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            key="footer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-0 left-0 right-0 text-center pb-6 pt-4 pointer-events-auto"
            style={{
              background:
                "linear-gradient(0deg, rgba(4,6,12,0.7) 0%, transparent 100%)",
            }}
          >
            {/* Navigation */}
            <div className="flex items-center justify-center gap-8 mb-3">
              <button
                onClick={() => navigateMonitor("prev")}
                className="transition-colors hover:text-[#ffd700]"
                style={{
                  color: "rgba(255,255,255,0.3)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  minWidth: 64,
                  minHeight: 44,
                }}
              >
                ← Prev
              </button>

              <span
                className="text-[10px] tracking-[2px]"
                style={{ color: "rgba(255,215,0,0.5)" }}
              >
                {currentIndex + 1} / {monitors.length}
              </span>

              <button
                onClick={() => navigateMonitor("next")}
                className="transition-colors hover:text-[#ffd700]"
                style={{
                  color: "rgba(255,255,255,0.3)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  minWidth: 64,
                  minHeight: 44,
                }}
              >
                Next →
              </button>
            </div>

            {/* Proof links — real URLs from BuildingData */}
            {proofLinks.length > 0 && (
              <div className="flex items-center justify-center gap-2 mb-3 flex-wrap px-4">
                {proofLinks.slice(0, 3).map((l) => (
                  <a
                    key={l.label}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 rounded-full no-underline"
                    style={{
                      color: "#38bdf8",
                      border: "1px solid rgba(56,189,248,0.35)",
                      background: "rgba(56,189,248,0.08)",
                      fontSize: 11,
                      minHeight: 44,
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            )}

            {/* ESC hint */}
            <button
              onClick={() =>
                window.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "Escape" })
                )
              }
              className="text-[9px] tracking-[4px] uppercase transition-colors hover:text-[#ffd700]"
              style={{
                color: "rgba(255,255,255,0.2)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              [ ESC ] Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

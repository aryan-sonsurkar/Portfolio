"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { monitorConfig } from "@/config/monitors";
import type { MonitorConfig } from "@/config/monitors";

// ── Building subtitles ──
const BUILDING_SUBTITLES: Record<string, string> = {
  "modcodes-hq": "Infrastructure Dashboard",
  "achievement-tower": "Certificates & Milestones",
  "developer-museum": "Journey Timeline",
  "project-factory": "Production Dashboards",
  "innovation-lab": "Experimental Projects",
  "open-source-center": "GitHub Contributions",
  "developer-apartment": "Personal Workspace",
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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Loading sequence ──
  useEffect(() => {
    if (!activeMonitor) {
      setLoadingPhase("idle");
      setShowUI(false);
      return;
    }

    setLoadingPhase("connecting");
    setShowUI(false);

    timerRef.current = setTimeout(() => {
      setLoadingPhase("connected");
      timerRef.current = setTimeout(() => {
        setShowUI(true);
      }, 100);
    }, 150);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
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
                className="text-[10px] tracking-[3px] uppercase transition-colors hover:text-[#ffd700]"
                style={{
                  color: "rgba(255,255,255,0.3)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace",
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
                className="text-[10px] tracking-[3px] uppercase transition-colors hover:text-[#ffd700]"
                style={{
                  color: "rgba(255,255,255,0.3)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Next →
              </button>
            </div>

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

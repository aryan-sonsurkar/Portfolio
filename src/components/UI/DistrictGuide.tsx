"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { useIsMobile } from "@/lib/useIsMobile";
import { inputBus } from "@/lib/inputBus";

/**
 * First-run instruction overlay. Disappears on first real interaction
 * (move / look / teleport / enter) or after 14s. Never blocks input.
 */
export default function DistrictGuide() {
  const isMobile = useIsMobile();
  const { introComplete, interiorOpen, activeScreen, teleportOpen } = useStore();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!introComplete || dismissed) return;

    const dismiss = () => setDismissed(true);
    const onKey = (e: KeyboardEvent) => {
      if (["w", "a", "s", "d", "t", "W", "A", "S", "D", "T", "Escape", " "].includes(e.key)) dismiss();
    };
    const onTouch = () => {
      // Dismiss on look-drag (joystick writes inputBus, checked below)
      dismiss();
    };
    const checkMove = window.setInterval(() => {
      if (inputBus.moveX !== 0 || inputBus.moveY !== 0) dismiss();
    }, 300);
    const auto = window.setTimeout(dismiss, 14000);

    window.addEventListener("keydown", onKey);
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchmove", onTouch);
      window.clearInterval(checkMove);
      window.clearTimeout(auto);
    };
  }, [introComplete, dismissed]);

  // Also dismiss while teleport panel / interior / monitor takes over
  useEffect(() => {
    if (teleportOpen || interiorOpen || activeScreen) setDismissed(true);
  }, [teleportOpen, interiorOpen, activeScreen]);

  const show = introComplete && !dismissed;
  const lines = isMobile
    ? [
        ["Joystick", "Move"],
        ["Drag", "Look around"],
        ["Tap building", "Fly there / enter"],
        ["Explore", "Jump anywhere"],
      ]
    : [
        ["WASD / Arrows", "Move"],
        ["Mouse", "Look (click canvas first)"],
        ["Click building", "Enter"],
        ["T", "Teleport"],
        ["ESC", "Exit screen"],
      ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="fixed z-40 pointer-events-auto left-1/2 -translate-x-1/2"
          style={{ bottom: isMobile ? 210 : 88 }}
        >
          <div
            className="rounded-2xl px-5 py-4"
            style={{
              background: "rgba(4,6,18,0.9)",
              border: "1px solid rgba(255,215,0,0.25)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 0 32px rgba(255,215,0,0.12)",
              minWidth: 260,
              maxWidth: "calc(100vw - 32px)",
            }}
          >
            <p
              className="text-center text-[11px] tracking-[0.3em] uppercase mb-3"
              style={{ color: "#ffd700", fontFamily: "'JetBrains Mono', monospace" }}
            >
              Explore the district
            </p>
            <div className="space-y-1.5">
              {lines.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-6 text-[11px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <span style={{ color: "rgba(255,215,0,0.75)" }}>{k}</span>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>{v}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="w-full mt-3 rounded-lg text-[11px] tracking-[0.2em] uppercase"
              style={{
                minHeight: 44,
                background: "rgba(255,215,0,0.08)",
                border: "1px solid rgba(255,215,0,0.25)",
                color: "#ffd700",
                fontFamily: "'JetBrains Mono', monospace",
                cursor: "pointer",
              }}
            >
              Got it — explore ▸
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BUILDINGS } from "@/components/Buildings/BuildingData";
import { useStore } from "@/lib/store";
import { useIsMobile } from "@/lib/useIsMobile";

const CONFETTI = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 6.25 + ((i * i) % 11)) % 96,
  delay: (i % 8) * 0.35,
  size: 3 + (i % 3),
  gold: i % 3 !== 0,
}));

export default function PassportHUD({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const isMobile = useIsMobile();
  const visitedBuildings = useStore((s) => s.visitedBuildings);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const done = visitedBuildings.length;
  const total = BUILDINGS.length;
  const complete = done >= total;

  const share = () => {
    const visitedNames = BUILDINGS.filter((b) =>
      visitedBuildings.includes(b.id),
    )
      .map((b) => b.name)
      .join(", ");
    const text = complete
      ? `⚡ DISTRICT PASSPORT — COMPLETE!\nAll ${total} buildings explored in the MODCODES District at arssystem.vercel.app\n${visitedNames}`
      : `🏛 DISTRICT PASSPORT\nProgress: ${done}/${total} buildings in the MODCODES District at arssystem.vercel.app\nNext stop: ${
          BUILDINGS.find((b) => !visitedBuildings.includes(b.id))?.name ?? "anywhere"
        }`;
    navigator.clipboard
      ?.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      })
      .catch(() => {});
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          data-ui="passport"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className={`hud-panel relative flex flex-col ${
              isMobile ? "w-[94vw] max-h-[84vh]" : "w-[560px] max-h-[82vh]"
            }`}
            style={{
              padding: 24,
              borderColor: complete ? "rgba(255,215,0,0.45)" : "rgba(255,215,0,0.25)",
              boxShadow: complete
                ? "0 0 64px rgba(255,215,0,0.22), 0 24px 64px rgba(0,0,0,0.5)"
                : "0 0 48px rgba(255,215,0,0.08), 0 24px 64px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {complete && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[10px]">
                {CONFETTI.map((c, i) => (
                  <motion.span
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      left: `${c.left}%`,
                      bottom: -4,
                      width: c.size,
                      height: c.size,
                      background: c.gold ? "#ffd700" : "#fff3b0",
                      boxShadow: "0 0 6px rgba(255,215,0,0.8)",
                    }}
                    animate={{ y: [0, -360], opacity: [1, 1, 0] }}
                    transition={{
                      duration: 2.8,
                      delay: c.delay,
                      repeat: Infinity,
                      repeatDelay: 1.6,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>
            )}
            <p
              className="text-center"
              style={{
                fontSize: 10,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "rgba(255,215,0,0.7)",
              }}
            >
              MODCODES District Passport
            </p>
            <h3
              className="text-center mt-1"
              style={{ color: "#ffd700", fontSize: isMobile ? 20 : 24 }}
            >
              {complete ? "🏆 ALL BUILDINGS VISITED" : `${done} of ${total} STAMPS`}
            </h3>

            <div
              className="mt-3 h-[3px] w-full rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(done / total) * 100}%`,
                  background:
                    "linear-gradient(90deg, rgba(255,215,0,0.5), #ffd700)",
                }}
              />
            </div>

            <div
              className={`mt-4 grid gap-2 overflow-y-auto pr-1 ${
                isMobile ? "grid-cols-2" : "grid-cols-3"
              }`}
            >
              {BUILDINGS.map((b) => {
                const visited = visitedBuildings.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={`rounded-lg flex flex-col items-center justify-center text-center ${
                      visited ? "px-2 py-3" : "px-2 py-3"
                    }`}
                    style={
                      visited
                        ? {
                            border: "1px solid rgba(255,215,0,0.35)",
                            background: "rgba(255,215,0,0.06)",
                          }
                        : {
                            border: "1px dashed rgba(255,255,255,0.12)",
                            background: "rgba(255,255,255,0.02)",
                          }
                    }
                  >
                    <span
                      style={{ fontSize: isMobile ? 14 : 18, opacity: visited ? 1 : 0.35 }}
                    >
                      {STAMP_ICONS[b.id] ?? "🏢"}
                    </span>
                    <span
                      className="mt-1 leading-tight"
                      style={{
                        fontSize: 10,
                        color: visited ? "rgba(255,215,0,0.9)" : "rgba(255,255,255,0.35)",
                      }}
                    >
                      {visited ? b.name : "· · ·"}
                    </span>
                    {visited && (
                      <span
                        style={{
                          fontSize: 9,
                          color: "rgba(255,215,0,0.45)",
                          textTransform: "uppercase",
                          letterSpacing: "0.15em",
                        }}
                      >
                        ✓ stamped
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <p
              className="mt-3 text-center"
              style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}
            >
              {complete
                ? "You walked every street. The district is yours."
                : "Walk into every building to stamp the full passport."}
            </p>

            <div
              className="mt-4 flex gap-2"
              style={{ flexDirection: isMobile ? "column" : "row" }}
            >
              <button
                className="hud-kbtn flex-1 rounded-lg text-[11px] tracking-[0.2em] uppercase"
                style={{
                  minHeight: 44,
                  background: "rgba(255,215,0,0.08)",
                  border: "1px solid rgba(255,215,0,0.25)",
                  color: "#ffd700",
                }}
                onClick={share}
              >
                {copied ? "COPIED ✓" : "COPY PROGRESS"}
              </button>
              <button
                className="hud-kbtn flex-1 rounded-lg text-[11px] tracking-[0.2em] uppercase"
                style={{
                  minHeight: 44,
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: "rgba(255,255,255,0.55)",
                }}
                onClick={onClose}
              >
                KEEP EXPLORING
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const STAMP_ICONS: Record<string, string> = {
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

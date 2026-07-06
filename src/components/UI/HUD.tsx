"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { audioManager } from "@/lib/audio";
import { useIsMobile } from "@/lib/useIsMobile";

const BUILDING_LABELS: Record<string, string> = {
  "modcodes-hq": "MODCODES HQ — Flagship Product",
  "achievement-tower": "Achievement Tower — Evidence & Recognition",
  "developer-museum": "Developer Museum — Journey & Growth",
  "project-factory": "Project Factory — Shipped Work",
  "innovation-lab": "Innovation Lab — Future Builds",
  "open-source-center": "Open Source Center — Building in Public",
  "developer-apartment": "Developer Apartment — Personal Space",
  "football-arena": "Football Arena — Aryan's Happy Place",
  "ironman-destiny-lab": "Ironman Destiny Lab — Hardware & Dreams",
  "future-observatory": "Future Observatory — Vision & Roadmap",
};

const ACHIEVEMENT_DEFS: Record<string, { label: string; icon: string }> = {
  "first-step": { label: "First Step", icon: "🚶" },
  "explorer": { label: "District Explorer", icon: "🗺️" },
  "curator": { label: "Museum Curator", icon: "🏛️" },
  "engineer": { label: "Senior Engineer", icon: "⚙️" },
  "hacker": { label: "Blueprint Mode", icon: "🔧" },
};

export default function HUD() {
  const isMobile = useIsMobile();
  const {
    hoveredBuilding,
    introComplete,
    focusedBuilding,
    weatherActive,
    toggleWeather,
    interiorOpen,
    selectedBuilding,
    cameraMode,
    blueprintMode,
    setBlueprintMode,
    achievements,
    addAchievement,
    activeScreen,
    visitedBuildings,
    addVisitedBuilding,
  } = useStore();

  const [newAchievement, setNewAchievement] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(false);

  // Track visited buildings for achievements
  useEffect(() => {
    if (!selectedBuilding) return;
    addVisitedBuilding(selectedBuilding);
  }, [selectedBuilding, addVisitedBuilding]);

  // Check achievements after visitedBuildings updates
  useEffect(() => {
    if (visitedBuildings.length === 1 && !achievements.includes("first-step")) {
      addAchievement("first-step");
      triggerAchievement("first-step");
    }
    if (visitedBuildings.length >= 9 && !achievements.includes("explorer")) {
      addAchievement("explorer");
      triggerAchievement("explorer");
    }
  }, [visitedBuildings.length]);

  useEffect(() => {
    if (blueprintMode && !achievements.includes("hacker")) {
      addAchievement("hacker");
      triggerAchievement("hacker");
    }
  }, [blueprintMode]);

  const triggerAchievement = (id: string) => {
    setNewAchievement(id);
    audioManager.playAchievementUnlock();
    setTimeout(() => setNewAchievement(null), 4000);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        if (!focusedBuilding && !interiorOpen) toggleWeather();
      }
      // Blueprint mode: Ctrl+Shift+A
      if (e.ctrlKey && e.shiftKey && (e.key === "a" || e.key === "A")) {
        setBlueprintMode(!blueprintMode);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [focusedBuilding, interiorOpen, toggleWeather, blueprintMode, setBlueprintMode]);

  if (!introComplete) return null;

  const isFPV = cameraMode === "fpv";

  return (
    <div className="fixed inset-0 z-30 pointer-events-none" style={{ fontFamily: "'JetBrains Mono', monospace" }}>

      {/* ── FPV Crosshair ── */}
      <AnimatePresence>
        {isFPV && !interiorOpen && !activeScreen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div style={{ position: "relative", width: "20px", height: "20px" }}>
              <div style={{
                position: "absolute", left: "50%", top: "0", width: "1px", height: "7px",
                background: "rgba(255,215,0,0.55)", transform: "translateX(-50%)"
              }} />
              <div style={{
                position: "absolute", left: "50%", bottom: "0", width: "1px", height: "7px",
                background: "rgba(255,215,0,0.55)", transform: "translateX(-50%)"
              }} />
              <div style={{
                position: "absolute", top: "50%", left: "0", height: "1px", width: "7px",
                background: "rgba(255,215,0,0.55)", transform: "translateY(-50%)"
              }} />
              <div style={{
                position: "absolute", top: "50%", right: "0", height: "1px", width: "7px",
                background: "rgba(255,215,0,0.55)", transform: "translateY(-50%)"
              }} />
              <div style={{
                position: "absolute", left: "50%", top: "50%", width: "3px", height: "3px",
                borderRadius: "50%", background: "rgba(255,215,0,0.4)",
                transform: "translate(-50%,-50%)"
              }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top Left — District / Room label ── */}
      {!interiorOpen && (
        <div className="absolute top-6 left-6">
          <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,215,0,0.45)" }}>
            MODCODES District
          </p>
          <p className="text-[10px] tracking-wider mt-1" style={{ color: "rgba(255,255,255,0.18)" }}>
            {isMobile
              ? "Joystick to move · Drag to look · Tap building to enter"
              : isFPV
                ? "Click canvas → lock mouse · WASD move · R weather"
                : "Click a building to explore · Drag to orbit"}
          </p>
        </div>
      )}
      {interiorOpen && selectedBuilding && (
        <div className="absolute top-6 left-6">
          <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,215,0,0.5)" }}>
            {BUILDING_LABELS[selectedBuilding] ?? selectedBuilding}
          </p>
          <p className="text-[10px] tracking-wider mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
            Click a monitor to interact · Walk to the EXIT door to leave
          </p>
        </div>
      )}

      {/* ── Top Right — Controls legend + Blueprint badge ── */}
      <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
        {blueprintMode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-3 py-1 rounded text-[10px] tracking-widest uppercase"
            style={{
              color: "#00ff88",
              border: "1px solid rgba(0,255,136,0.25)",
              background: "rgba(0,255,136,0.06)",
            }}
          >
            ⬡ BLUEPRINT MODE
          </motion.div>
        )}
        <button
          className="pointer-events-auto text-[10px] tracking-wider opacity-30 hover:opacity-70 transition-opacity"
          style={{ color: "rgba(255,215,0,0.8)", background: "none", border: "none", cursor: "pointer" }}
          onClick={() => setShowControls((s) => !s)}
        >
          {showControls ? "HIDE CONTROLS" : "SHOW CONTROLS"}
        </button>
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="pointer-events-auto text-[10px] space-y-1 text-right"
              style={{
                background: "rgba(4,6,12,0.82)",
                border: "1px solid rgba(255,215,0,0.08)",
                backdropFilter: "blur(10px)",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              {[
                ...(isMobile
                  ? [
                      ["Joystick", "Move"],
                      ["Drag screen", "Look around"],
                      ["Tap building", "Enter"],
                      ["T", "Teleport panel"],
                    ]
                  : [
                      ["WASD / Arrow Keys", "Move"],
                      ["Mouse (click first)", "Look around"],
                      ["T", "Teleport panel"],
                    ]),
                ["R", "Toggle rain"],
                ...(!isMobile ? [["Ctrl+Shift+A", "Blueprint mode"]] : []),
                ["ESC", "Exit screen / modal"],
                ["Walk to exit door", "Leave building"],
              ].map(([key, action]) => (
                <div key={key} className="flex gap-4 justify-end">
                  <span style={{ color: "rgba(255,215,0,0.6)" }}>{key}</span>
                  <span>{action}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Achievement popup ── */}
      <AnimatePresence>
        {newAchievement && ACHIEVEMENT_DEFS[newAchievement] && (
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="absolute top-6 right-6 pointer-events-none"
            style={{ marginTop: "80px" }}
          >
            <div
              style={{
                background: "rgba(4,6,12,0.92)",
                border: "1px solid rgba(255,215,0,0.2)",
                backdropFilter: "blur(14px)",
                borderRadius: "10px",
                padding: "12px 18px",
                boxShadow: "0 0 30px rgba(255,215,0,0.08)",
              }}
            >
              <p style={{ color: "rgba(255,215,0,0.5)", fontSize: "9px", letterSpacing: "3px", marginBottom: "4px" }}>
                ACHIEVEMENT UNLOCKED
              </p>
              <p style={{ color: "#ffd700", fontSize: "13px" }}>
                {ACHIEVEMENT_DEFS[newAchievement].icon}{" "}
                {ACHIEVEMENT_DEFS[newAchievement].label}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Achievement badges (persistent row) ── */}
      {achievements.length > 0 && (
        <div className="absolute bottom-14 left-6 flex gap-2">
          {achievements.map((id) => (
            ACHIEVEMENT_DEFS[id] && (
              <motion.div
                key={id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                title={ACHIEVEMENT_DEFS[id].label}
                style={{
                  background: "rgba(255,215,0,0.08)",
                  border: "1px solid rgba(255,215,0,0.15)",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "14px",
                }}
              >
                {ACHIEVEMENT_DEFS[id].icon}
              </motion.div>
            )
          ))}
        </div>
      )}

      {/* ── Bottom center — Hovered building name ── */}
      <AnimatePresence>
        {hoveredBuilding && !focusedBuilding && !interiorOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <p
              className="text-xs tracking-widest uppercase px-5 py-2 rounded-full border"
              style={{
                color: "#ffd700",
                borderColor: "rgba(255,215,0,0.2)",
                background: "rgba(10,6,18,0.82)",
                backdropFilter: "blur(8px)",
              }}
            >
              {BUILDING_LABELS[hoveredBuilding] ?? hoveredBuilding}
            </p>
            <p className="text-center text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
              Click to enter
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Active Screen Exit hint ── */}
      <AnimatePresence>
        {activeScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto"
          >
            <button
              onClick={() => {
                // Dispatch ESC event so CharacterController handles position restore
                window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
              }}
              style={{
                color: "rgba(255,255,255,0.35)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              [ ESC ] Back to room
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom center — Teleport button ── */}
      {isFPV && !activeScreen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto"
        >
          <button
            onClick={() => useStore.getState().setTeleportOpen(true)}
            className="px-4 py-2 rounded-lg text-[11px] tracking-widest uppercase transition-all hover:scale-105"
            style={{
              color: "#38bdf8",
              border: "1px solid rgba(56,189,248,0.25)",
              background: "rgba(56,189,248,0.06)",
              fontFamily: "'JetBrains Mono', monospace",
              backdropFilter: "blur(8px)",
            }}
          >
            ⚡ Teleport <span style={{ opacity: 0.5, marginLeft: 6 }}>[ T ]</span>
          </button>
        </motion.div>
      )}

      {/* ── Bottom right — Version + Weather badge ── */}
      <div className="absolute bottom-6 right-6 flex items-center gap-3">
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
              }}
            >
              ☁ Rain Active
            </motion.div>
          )}
        </AnimatePresence>
        <p className="text-[10px] tracking-wider" style={{ color: "rgba(255,255,255,0.12)" }}>
          v0.3.0 — District Live
        </p>
      </div>
    </div>
  );
}

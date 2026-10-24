"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useStore } from "@/lib/store";
import { audioManager, speakAI } from "@/lib/audio";
import { isReducedMotion } from "@/lib/useIsMobile";

// Telemetry logs for OS boot feel
const BOOT_MILESTONES = [
  { threshold: 6, log: "INITIALIZING ARYAN_OS_KERNEL... [OK]" },
  { threshold: 18, log: "SYNCHRONIZING SYSTEM TIME NODES... [OK]" },
  { threshold: 30, log: "CONNECTING TO CITIZEN ARCHIVE DATABASE... [OK]" },
  { threshold: 44, log: "SECURITY PROTOCOLS LOADED (LEVEL 5 AUTH) [OK]" },
  { threshold: 56, log: "LOCATION FOUND: LAT: 19.0760° N, LON: 72.8777° E [MUMBAI]" },
  { threshold: 68, log: "ESTABLISHING SPACESHIP HUD TELEMETRY... [LINKED]" },
  { threshold: 80, log: "ATMOSPHERIC DESCENT PROFILE ACTIVE [OK]" },
  { threshold: 90, log: "BUILDER DISTRICT TARGET ACQUIRED." },
  { threshold: 96, log: "CONNECTION HANDSHAKE COMPLETE. INITIALIZING TRANSLATION STREAM..." },
  { threshold: 100, log: "ACCESS GRANTED · ENTERING MODCODES DISTRICT..." },
];

export default function LoadingScreen({ onViewPortfolio }: { onViewPortfolio?: () => void }) {
  const { completeLoading, completeIntro, setIntroProgress } = useStore();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"loading" | "entering">("loading");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef(false);

  const finishEntry = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIntroProgress(1);
    completeIntro();
    completeLoading();
    setPhase("entering");
    if (!isReducedMotion()) {
      speakAI(
        "Incoming encrypted signal. Builder District located. Objective: Explore the district and uncover the story of its architect. Welcome back, agent."
      );
    }
  };

  // Immediate 1-click startup: start audio and background loops immediately
  useEffect(() => {
    audioManager.playBootSequence();
    audioManager.startSpaceHum();

    const rainTimer = window.setTimeout(() => {
      audioManager.startRainSound();
    }, 2000);

    return () => window.clearTimeout(rainTimer);
  }, []);

  // Auto-scroll terminal log on new entries
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Terminal boot logs & progress runner
  useEffect(() => {
    if (phase !== "loading") return;

    if (reduceMotion || isReducedMotion()) {
      setProgress(100);
      setLogs(BOOT_MILESTONES.map((m) => m.log));
      const t = window.setTimeout(() => finishEntry(), 400);
      return () => window.clearTimeout(t);
    }

    let current = 0;
    const shown = new Set<string>();

    const interval = window.setInterval(() => {
      current += Math.random() * 8 + 4;

      const crossed = BOOT_MILESTONES.filter((m) => current >= m.threshold && !shown.has(m.log));
      if (crossed.length > 0) {
        crossed.forEach((m) => shown.add(m.log));
        setLogs((prev) => [...prev, ...crossed.map((m) => m.log).filter((l) => !prev.includes(l))]);
      }

      if (current >= 100) {
        current = 100;
        setProgress(100);
        window.clearInterval(interval);

        // Terminal done: brief pause to register 100%, then enter district directly
        window.setTimeout(() => {
          finishEntry();
        }, 320);
        return;
      }
      setProgress(current);
    }, 90);

    return () => window.clearInterval(interval);
  }, [phase, reduceMotion]);

  return (
    <AnimatePresence>
      {phase !== "entering" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none px-3"
          style={{ background: "#020306", color: "#f8fafc" }}
        >
          {/* Subtle star particle decoration */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_70%)] pointer-events-none" />

          {/* Terminal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-start w-full max-w-xl px-4 sm:px-8 py-5 sm:py-6 rounded-xl border relative z-10"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              background: "rgba(6,8,12,0.88)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              fontFamily: "'JetBrains Mono', monospace",
              boxShadow: "0 20px 50px rgba(0,0,0,0.7), 0 0 30px rgba(212,175,55,0.06)",
            }}
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between w-full mb-3 sm:mb-4 border-b border-white/10 pb-2 text-[10px] uppercase text-slate-400 tracking-wider">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-amber-500/90 font-medium">ARYAN_OS · BOOT SEQUENCE</span>
              </div>
              <span className="text-slate-500 hidden sm:inline">OS_VER 0.9.2</span>
            </div>

            {/* Scrolling Boot Logs */}
            <div
              ref={logContainerRef}
              className="w-full h-44 sm:h-52 overflow-y-auto space-y-1.5 scrollbar-none text-[10.5px] sm:text-[11px] text-slate-300 font-mono"
            >
              {logs.map((log, index) => (
                <div key={index} className="flex gap-2 items-start leading-relaxed">
                  <span className="text-amber-400/80 shrink-0 font-bold">&gt;</span>
                  <span className="break-words">{log}</span>
                </div>
              ))}
              {progress < 100 && (
                <div className="flex gap-1.5 items-center pt-1">
                  <span className="text-amber-400 animate-pulse">&gt;</span>
                  <span className="w-1.5 h-3 bg-amber-400/80 animate-pulse" />
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="w-full mt-4 sm:mt-5 space-y-2">
              <div className="h-[3px] w-full bg-white/10 relative rounded-full overflow-hidden">
                <motion.div
                  className="h-full absolute top-0 left-0 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-400 uppercase tracking-widest font-mono">
                <span>{progress >= 100 ? "ACCESS GRANTED · ENTERING DISTRICT" : "INITIALIZING DISTRICT TELEMETRY"}</span>
                <span className="text-amber-400 font-semibold">{Math.floor(progress)}%</span>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex items-center justify-between w-full mt-3 pt-2 border-t border-white/5">
              {onViewPortfolio ? (
                <button
                  onClick={onViewPortfolio}
                  className="hud-kbtn text-[10px] uppercase tracking-[0.2em] text-cyan-400/80 hover:text-cyan-300 transition-colors"
                  style={{
                    background: "none",
                    border: "none",
                    minHeight: 40,
                    cursor: "pointer",
                    padding: "0 4px",
                  }}
                >
                  ◂ Portfolio
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={finishEntry}
                className="hud-kbtn text-[10px] uppercase tracking-[0.2em] text-amber-400/90 hover:text-amber-300 transition-colors"
                style={{
                  background: "none",
                  border: "none",
                  minHeight: 40,
                  cursor: "pointer",
                  padding: "0 4px",
                }}
              >
                Skip to District →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { audioManager, speakAI } from "@/lib/audio";

const INTRO_DURATION_MS = 17000;
const SKIP_DELAY_MS = 4000;

export default function LoadingScreen() {
  const { completeLoading, completeIntro, setIntroProgress } = useStore();
  const [startedConnection, setStartedConnection] = useState(false);
  const [phase, setPhase] = useState<"connect" | "loading" | "intro" | "entering">("connect");
  const [progress, setProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Telemetry logs for OS boot feel
  const bootMilestones = [
    { threshold: 5, log: "INITIALIZING ARYAN_OS_KERNEL... [OK]" },
    { threshold: 15, log: "SYNCHRONIZING SYSTEM TIME NODES... [OK]" },
    { threshold: 25, log: "CONNECTING TO CITIZEN ARCHIVE DATABASE..." },
    { threshold: 38, log: "SECURITY PROTOCOLS LOADED (LEVEL 5 AUTH)" },
    { threshold: 48, log: "LOCATION FOUND: LAT: 19.0760° N, LON: 72.8777° E [MUMBAI]" },
    { threshold: 60, log: "ESTABLISHING SPACESHIP HUD TELEMETRY..." },
    { threshold: 72, log: "ATMOSPHERIC DESCENT PROFILE SHUTTLE ACTIVE" },
    { threshold: 85, log: "ESTABLISHED WIRELESS CONNECTION PROTOCOL: SECURE" },
    { threshold: 95, log: "BUILDER DISTRICT TARGET ACQUIRED." },
    { threshold: 100, log: "CONNECTION HANDSHAKE COMPLETE. INITIALIZING TRANSLATION STREAM..." }
  ];

  const handleStartConnection = () => {
    setStartedConnection(true);
    setPhase("loading");
    audioManager.playBootSequence();
    audioManager.startSpaceHum();

    // Start background loops
    setTimeout(() => {
      audioManager.startRainSound();
    }, 4000);
  };

  useEffect(() => {
    if (phase !== "loading") return;

    const interval = window.setInterval(() => {
      setProgress((p) => {
        const nextProgress = p + Math.random() * 6 + 1.5;
        
        // Find which logs to append
        bootMilestones.forEach(m => {
          if (nextProgress >= m.threshold && !logs.includes(m.log)) {
            setLogs(prev => [...prev, m.log]);
          }
        });

        if (nextProgress >= 100) {
          window.clearInterval(interval);
          window.setTimeout(() => {
            setPhase("intro");
            speakAI("Incoming encrypted signal. Builder District located. Construction status: Active. Objective: Explore the district and uncover the story of its architect. Welcome back, agent.");
          }, 800);
          return 100;
        }
        return nextProgress;
      });
    }, 100);

    return () => window.clearInterval(interval);
  }, [phase, logs]);

  useEffect(() => {
    if (phase !== "intro") return;

    setIntroProgress(0);
    const startedAt = performance.now();
    const tick = () => {
      const elapsed = performance.now() - startedAt;
      setIntroProgress(Math.min(elapsed / INTRO_DURATION_MS, 1));
    };

    const skipTimer = window.setTimeout(() => setShowSkip(true), SKIP_DELAY_MS);
    const completeTimer = window.setTimeout(() => {
      finishIntro();
    }, INTRO_DURATION_MS);
    const progressTimer = window.setInterval(tick, 50);

    return () => {
      window.clearTimeout(skipTimer);
      window.clearTimeout(completeTimer);
      window.clearInterval(progressTimer);
    };
  }, [phase, setIntroProgress]);

  const finishIntro = () => {
    setIntroProgress(1);
    completeIntro();
    completeLoading();
    setPhase("entering");
  };

  const handleSkip = () => {
    finishIntro();
  };

  return (
    <AnimatePresence>
      {phase !== "entering" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none"
          style={{ background: "#020306", color: "#f8fafc" }}
        >
          {/* Subtle star particle decoration */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06),transparent_70%)] pointer-events-none" />

          {phase === "connect" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center gap-6 max-w-md px-6 text-center"
            >
              <h1 className="text-sm font-light tracking-[0.4em] text-amber-500/80 uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                System Offline
              </h1>
              <p className="text-xs text-slate-500 tracking-widest leading-relaxed" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                SILENT TRANSMISSION FROM ORBIT SHUTTLE #0X42F <br />
                AWAITING AUTHENTICATION FROM COMMAND PORTAL.
              </p>
              <button
                onClick={handleStartConnection}
                className="mt-8 px-6 py-3 rounded border text-xs font-semibold cursor-pointer tracking-[0.25em] transition-all hover:bg-amber-500/10 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                style={{
                  borderColor: "rgba(212,175,55,0.3)",
                  color: "#f0e6d8",
                  background: "transparent",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                [ INITIALIZE TRANSLATION ]
              </button>
            </motion.div>
          )}

          {phase === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-start w-full max-w-xl px-8 py-6 rounded border"
              style={{
                borderColor: "rgba(255,255,255,0.05)",
                background: "rgba(6,8,12,0.65)",
                backdropFilter: "blur(8px)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <div className="flex items-center justify-between w-full mb-4 border-b border-white/5 pb-2 text-[10px] uppercase text-slate-500 tracking-wider">
                <span>SYSTEM DIAGNOSTIC LOG</span>
                <span>OS_VER 0.9.2</span>
              </div>

              {/* Scrolling Boot Logs */}
              <div className="w-full h-48 overflow-y-auto space-y-1.5 scrollbar-none text-[11px] text-slate-400">
                {logs.map((log, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <span className="text-amber-500/50">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
                {logs.length < 10 && (
                  <div className="flex gap-1.5 items-center">
                    <span className="text-amber-500 animate-pulse">&gt;</span>
                    <span className="w-1.5 h-3 bg-amber-500/80 animate-pulse" />
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full mt-6 space-y-2">
                <div className="h-[2px] w-full bg-white/5 relative">
                  <motion.div
                    className="h-full absolute top-0 left-0 bg-gradient-to-r from-amber-600 to-amber-400"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-600 uppercase tracking-widest">
                  <span>SYSTEM COMM SYNCING</span>
                  <span>{Math.floor(progress)}%</span>
                </div>
              </div>
            </motion.div>
          )}

          {phase === "intro" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="relative flex flex-col items-center justify-center px-8 text-center max-w-xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1.0, ease: "easeOut" }}
                className="relative z-10"
              >
                <span
                  className="mb-4 inline-block text-[10px] uppercase tracking-[0.5em] px-3 py-1 rounded border"
                  style={{
                    color: "rgba(255,215,0,0.65)",
                    borderColor: "rgba(255,215,0,0.2)",
                    background: "rgba(255,215,0,0.02)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  TRANSMISSION DECODED
                </span>
                <h1
                  className="mb-6 text-4xl font-light tracking-[0.3em]"
                  style={{
                    color: "#f0e6d8",
                    fontFamily: "'JetBrains Mono', monospace",
                    textShadow: "0 0 40px rgba(255,215,0,0.2)",
                  }}
                >
                  ARYAN OS
                </h1>
                <p
                  className="mx-auto max-w-md text-sm leading-relaxed tracking-[0.18em]"
                  style={{
                    color: "rgba(224, 232, 255, 0.7)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  A vessel crosses the void. Earth turns slowly below. <br />
                  The Builder District awaits your command.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-[9px] uppercase tracking-[0.25em] font-medium text-slate-500">
                  <span>ORBIT TRANSIT</span>
                  <span className="text-amber-500/45">·</span>
                  <span>MUMBAI BOUND</span>
                  <span className="text-amber-500/45">·</span>
                  <span>CITIZEN AUTHENTICATED</span>
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: showSkip ? 0.6 : 0 }}
                transition={{ duration: 0.4 }}
                onClick={handleSkip}
                className="absolute bottom-[-100px] cursor-pointer text-[10px] uppercase tracking-[0.3em] border-b border-transparent pb-1 hover:border-amber-400 hover:text-amber-400 transition-all"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "'JetBrains Mono', monospace",
                  background: "none",
                  border: "none",
                }}
              >
                Skip Descent
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

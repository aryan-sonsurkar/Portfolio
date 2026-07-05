"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";

export default function LoadingScreen() {
  const { loadingComplete, completeLoading, completeIntro } = useStore();
  const [phase, setPhase] = useState<"loading" | "intro" | "entering">(
    "loading"
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase("intro"), 400);
          return 100;
        }
        return p + Math.random() * 8 + 2;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const handleSkip = () => {
    completeIntro();
    completeLoading();
    setPhase("entering");
  };

  const handleEnter = () => {
    completeIntro();
    completeLoading();
    setPhase("entering");
  };

  return (
    <AnimatePresence>
      {phase !== "entering" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: "#0a0612" }}
        >
          {phase === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-8"
            >
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl font-light tracking-widest"
                style={{
                  color: "#f0e6d8",
                  fontFamily: "'JetBrains Mono', monospace",
                  textShadow: "0 0 40px rgba(255,215,0,0.3)",
                }}
              >
                MODCODES
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.6 }}
                className="text-sm tracking-widest uppercase"
                style={{
                  color: "#8888aa",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Loading district...
              </motion.p>

              {/* Progress bar */}
              <div className="w-64 relative">
                <div
                  className="h-px w-full"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                />
                <motion.div
                  className="h-px absolute top-0 left-0"
                  style={{
                    background:
                      "linear-gradient(90deg, #ffd700, #ff6b35)",
                  }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 1 }}
                className="text-xs"
                style={{
                  color: "#666",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {Math.floor(Math.min(progress, 100))}%
              </motion.p>
            </motion.div>
          )}

          {phase === "intro" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center gap-10"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="text-center"
              >
                <h1
                  className="text-5xl font-light tracking-widest mb-4"
                  style={{
                    color: "#f0e6d8",
                    fontFamily: "'JetBrains Mono', monospace",
                    textShadow: "0 0 60px rgba(255,215,0,0.4)",
                  }}
                >
                  ARYAN SONSURKAR
                </h1>
                <p
                  className="text-lg tracking-wider"
                  style={{
                    color: "#8888aa",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  Builder. Product Maker. District Architect.
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                onClick={handleEnter}
                className="group relative px-10 py-4 border cursor-pointer overflow-hidden"
                style={{
                  borderColor: "rgba(255,215,0,0.3)",
                  background: "rgba(255,215,0,0.05)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
                whileHover={{
                  borderColor: "rgba(255,215,0,0.6)",
                  boxShadow: "0 0 30px rgba(255,215,0,0.1)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 text-sm tracking-widest uppercase" style={{ color: "#ffd700" }}>
                  Enter the District
                </span>
              </motion.button>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 2.5 }}
                onClick={handleSkip}
                className="text-xs tracking-widest uppercase cursor-pointer hover:opacity-70 transition-opacity"
                style={{
                  color: "#555",
                  fontFamily: "'JetBrains Mono', monospace",
                  background: "none",
                  border: "none",
                }}
              >
                Skip Intro
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

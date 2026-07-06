"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";

const SLIDES = [
  {
    type: "intro" as const,
    name: "ARYAN SONSURKAR",
    tagline: "Developer · Builder · Creator",
    subtitle: "Welcome to my portfolio district",
  },
  {
    type: "stat" as const,
    icon: "⚡",
    title: "MODCODES",
    desc: "AI-powered student productivity platform",
    detail: "Python · FastAPI · Ollama · Local LLMs",
    color: "#ffd700",
  },
  {
    type: "stat" as const,
    icon: "🏭",
    title: "PROJECT FACTORY",
    desc: "Real products shipped to real clients",
    detail: "15+ projects · 10+ starred repos",
    color: "#4a90d9",
  },
  {
    type: "stat" as const,
    icon: "🏆",
    title: "ACHIEVEMENTS",
    desc: "Best Intern at Kaevron · SIH-2025 Winner",
    detail: "333 GitHub contributions · Client delivery",
    color: "#ffd700",
  },
  {
    type: "stat" as const,
    icon: "🔬",
    title: "INNOVATION",
    desc: "Custom AI IDE · Programming Language",
    detail: "Compiler Design · Language Theory",
    color: "#00ccff",
  },
  {
    type: "stat" as const,
    icon: "🤖",
    title: "IRONMAN LAB",
    desc: "Arc Reactor · Hardware Prototypes",
    detail: "Hardware meets software",
    color: "#ff6600",
  },
  {
    type: "stat" as const,
    icon: "⚽",
    title: "FOOTBALL ARENA",
    desc: "Ronaldo fan · CR7 is the GOAT",
    detail: "Balance between code and sport",
    color: "#00ff88",
  },
  {
    type: "outro" as const,
    name: "MODCODES DISTRICT",
    tagline: "10 buildings · Infinite stories",
    subtitle: "Click to explore · Press T to teleport",
  },
];

export default function PortfolioTrailer() {
  const { loadingComplete, introComplete, completeIntro } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [started, setStarted] = useState(false);
  const [exiting, setExiting] = useState(false);

  const skip = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      completeIntro();
    }, 600);
  }, [completeIntro]);

  const nextSlide = useCallback(() => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide((p) => p + 1);
    } else {
      skip();
    }
  }, [currentSlide, skip]);

  // Auto-advance slides
  useEffect(() => {
    if (!started || exiting) return;
    const timer = setTimeout(nextSlide, 3200);
    return () => clearTimeout(timer);
  }, [started, currentSlide, exiting, nextSlide]);

  // Keyboard controls
  useEffect(() => {
    if (!started) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        nextSlide();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [started, nextSlide]);

  if (!loadingComplete || introComplete) return null;
  if (exiting) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-[100]"
        style={{ background: "#040608", pointerEvents: "none" }}
      />
    );
  }

  if (!started) {
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer"
        style={{ background: "#040608" }}
        onClick={() => setStarted(true)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          {/* Glowing orb */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 60px rgba(56,189,248,0.3), 0 0 120px rgba(56,189,248,0.1)",
                "0 0 80px rgba(56,189,248,0.5), 0 0 160px rgba(56,189,248,0.2)",
                "0 0 60px rgba(56,189,248,0.3), 0 0 120px rgba(56,189,248,0.1)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 mx-auto mb-8 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(56,189,248,0.4) 0%, transparent 70%)",
              border: "2px solid rgba(56,189,248,0.3)",
            }}
          />

          <h1
            className="text-3xl md:text-5xl font-bold tracking-widest mb-4"
            style={{
              color: "#38bdf8",
              fontFamily: "'JetBrains Mono', monospace",
              textShadow: "0 0 40px rgba(56,189,248,0.4)",
            }}
          >
            MODCODES DISTRICT
          </h1>

          <p
            className="text-sm md:text-base tracking-wider mb-8"
            style={{ color: "rgba(56,189,248,0.5)" }}
          >
            Aryan Sonsurkar&apos;s Portfolio
          </p>

          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Click anywhere to begin
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const slide = SLIDES[currentSlide];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "#040608" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
          className="text-center px-6 max-w-xl"
        >
          {slide.type === "intro" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 12 }}
              >
                <h1
                  className="text-4xl md:text-6xl font-bold tracking-widest mb-4"
                  style={{
                    color: "#38bdf8",
                    fontFamily: "'JetBrains Mono', monospace",
                    textShadow: "0 0 60px rgba(56,189,248,0.5)",
                  }}
                >
                  {slide.name}
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-lg md:text-xl tracking-wider mb-3"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {slide.tagline}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="text-sm tracking-wider"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {slide.subtitle}
              </motion.p>
            </>
          )}

          {slide.type === "stat" && (
            <>
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", damping: 10 }}
                className="text-6xl md:text-7xl mb-6"
              >
                {slide.icon}
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-4xl font-bold tracking-wider mb-3"
                style={{
                  color: slide.color,
                  fontFamily: "'JetBrains Mono', monospace",
                  textShadow: `0 0 40px ${slide.color}44`,
                }}
              >
                {slide.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-base md:text-lg mb-2"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {slide.desc}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-xs md:text-sm tracking-wider"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {slide.detail}
              </motion.p>
            </>
          )}

          {slide.type === "outro" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 12 }}
              >
                <h1
                  className="text-3xl md:text-5xl font-bold tracking-widest mb-4"
                  style={{
                    color: "#38bdf8",
                    fontFamily: "'JetBrains Mono', monospace",
                    textShadow: "0 0 60px rgba(56,189,248,0.5)",
                  }}
                >
                  {slide.name}
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg tracking-wider mb-6"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {slide.tagline}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-sm tracking-wider mb-8"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {slide.subtitle}
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                onClick={skip}
                className="px-8 py-3 rounded-lg text-sm tracking-widest uppercase transition-all hover:scale-105"
                style={{
                  color: "#38bdf8",
                  border: "1px solid rgba(56,189,248,0.4)",
                  background: "rgba(56,189,248,0.08)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Enter the District
              </motion.button>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48">
        <div className="h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(56,189,248,0.1)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "rgba(56,189,248,0.4)" }}
            initial={{ width: "0%" }}
            animate={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-[9px] tracking-wider" style={{ color: "rgba(255,255,255,0.2)" }}>
            {currentSlide + 1} / {SLIDES.length}
          </p>
          <button
            onClick={skip}
            className="text-[9px] tracking-wider uppercase transition-colors hover:opacity-100"
            style={{ color: "rgba(255,255,255,0.25)", background: "none", border: "none", cursor: "pointer" }}
          >
            Skip ▸
          </button>
        </div>
      </div>

      {/* Click anywhere to advance */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={nextSlide}
        style={{ zIndex: -1 }}
      />
    </div>
  );
}

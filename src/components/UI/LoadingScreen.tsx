"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";

const INTRO_DURATION_MS = 16000;
const SKIP_DELAY_MS = 5000;

export default function LoadingScreen() {
  const { completeLoading, completeIntro, setIntroProgress } = useStore();
  const [phase, setPhase] = useState<"loading" | "intro" | "entering">(
    "loading"
  );
  const [progress, setProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          window.clearInterval(interval);
          window.setTimeout(() => setPhase("intro"), 400);
          return 100;
        }
        return p + Math.random() * 8 + 2;
      });
    }, 80);
    return () => window.clearInterval(interval);
  }, []);

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

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const startAmbientAudio = () => {
      if (typeof window === "undefined" || audioContextRef.current) return;

      const AudioContextCtor =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioContextCtor) return;

      const ctx = new AudioContextCtor();
      const master = ctx.createGain();
      master.gain.value = 0.018;
      master.connect(ctx.destination);

      const oscA = ctx.createOscillator();
      oscA.type = "sine";
      oscA.frequency.value = 110;

      const oscB = ctx.createOscillator();
      oscB.type = "triangle";
      oscB.frequency.value = 220;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 700;

      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.06;

      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 18;

      lfo.connect(lfoGain);
      lfoGain.connect(oscA.frequency);
      lfoGain.connect(oscB.frequency);

      oscA.connect(filter);
      oscB.connect(filter);
      filter.connect(master);

      oscA.start();
      oscB.start();
      lfo.start();

      const modulate = () => {
        const now = ctx.currentTime;
        master.gain.linearRampToValueAtTime(0.023, now + 0.4);
        master.gain.linearRampToValueAtTime(0.016, now + 1.2);
      };

      const loop = window.setInterval(modulate, 1800);
      audioContextRef.current = ctx;

      cleanup = () => {
        window.clearInterval(loop);
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setValueAtTime(0, ctx.currentTime);
        oscA.stop();
        oscB.stop();
        lfo.stop();
        ctx.close();
        audioContextRef.current = null;
      };
    };

    const onInteraction = () => {
      if (!audioContextRef.current) {
        startAmbientAudio();
      }
    };

    window.addEventListener("pointerdown", onInteraction, { once: true });
    window.addEventListener("keydown", onInteraction, { once: true });

    return () => {
      cleanup?.();
      window.removeEventListener("pointerdown", onInteraction);
      window.removeEventListener("keydown", onInteraction);
    };
  }, []);

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
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: "#04050d" }}
        >
          {phase === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-8"
            >
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
                Preparing arrival...
              </motion.p>

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
              className="relative flex flex-col items-center justify-center px-8 text-center"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.08),transparent_65%)]" />

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.9 }}
                className="relative z-10 max-w-2xl"
              >
                <p
                  className="mb-4 text-[11px] uppercase tracking-[0.4em]"
                  style={{
                    color: "rgba(255,215,0,0.55)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  Arriving from deep space
                </p>
                <h1
                  className="mb-4 text-5xl font-light tracking-[0.35em]"
                  style={{
                    color: "#f0e6d8",
                    fontFamily: "'JetBrains Mono', monospace",
                    textShadow: "0 0 60px rgba(255,215,0,0.28)",
                  }}
                >
                  ARYAN SONSURKAR
                </h1>
                <p
                  className="mx-auto max-w-xl text-lg leading-8 tracking-[0.2em]"
                  style={{
                    color: "rgba(224, 232, 255, 0.7)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  A vessel crosses the void. Earth turns slowly below. The district awakens as you approach.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[10px] uppercase tracking-[0.3em]">
                  {[
                    "Orbit",
                    "India",
                    "Mumbai",
                    "District",
                  ].map((label) => (
                    <span
                      key={label}
                      className="rounded-full border px-3 py-1"
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        borderColor: "rgba(255,215,0,0.18)",
                        background: "rgba(255,255,255,0.03)",
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: showSkip ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                onClick={handleSkip}
                className="absolute bottom-10 right-10 cursor-pointer text-xs uppercase tracking-[0.35em] transition-opacity hover:opacity-80"
                style={{
                  color: "rgba(255,255,255,0.4)",
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

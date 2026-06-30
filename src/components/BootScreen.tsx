"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

const BOOT_STEPS = [
  { text: "Initializing ARYAN OS Kernel...", sub: "Loading system core modules", duration: 900 },
  { text: "Loading Neural Interface...", sub: "Establishing visual framework", duration: 700 },
  { text: "Establishing AI Core...", sub: "Connecting neural networks", duration: 800 },
  { text: "Connecting to Neural Network...", sub: "Syncing with cloud AI", duration: 600 },
  { text: "Access Granted", sub: "ARYAN OS v2.0.0 — AI Core Active", duration: 500 },
]

export default function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((c) => !c), 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (step >= BOOT_STEPS.length) {
      const t1 = setTimeout(() => setFadeOut(true), 300)
      const t2 = setTimeout(onComplete, 1000)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
    const t = setTimeout(() => setStep((s) => s + 1), BOOT_STEPS[step].duration)
    return () => clearTimeout(t)
  }, [step, onComplete])

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05070A] w-screen min-h-screen"
          exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)", transition: { duration: 0.8, ease: "easeInOut" } }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#3B82F6]/[0.03] via-transparent to-[#00D4FF]/[0.03] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl font-bold tracking-tight text-[#3B82F6] glow-text">ARYAN OS</h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-3 text-xs text-[#475569] font-mono tracking-[0.2em] uppercase"
            >
              Artificial Intelligence Operating System
            </motion.p>
          </motion.div>

          <div className="w-80">
            <div className="h-[2px] w-full bg-[#0C1118] overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-gradient-to-r from-[#3B82F6] to-[#00D4FF] rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${Math.min(((step + 1) / BOOT_STEPS.length) * 100, 100)}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="mt-8 text-center h-16">
            {step < BOOT_STEPS.length && (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-mono text-base text-[#F5F7FA]">
                  {BOOT_STEPS[step].text}
                  <span className={`ml-0.5 text-[#3B82F6] ${showCursor ? "opacity-100" : "opacity-0"}`}>_</span>
                </p>
                <p className="mt-1.5 font-mono text-[11px] text-[#475569]">{BOOT_STEPS[step].sub}</p>
              </motion.div>
            )}
            {step >= BOOT_STEPS.length && (
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-lg font-semibold text-[#3B82F6] glow-text"
              >
                Launching Interface...
              </motion.p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 font-mono text-[10px] text-[#475569] tracking-widest"
          >
            {">"} SYSTEM BOOT SEQUENCE INITIATED
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const BOOT_STEPS = [
  { text: "Initializing ARYAN OS Kernel...", duration: 800 },
  { text: "Loading Neural Interface...", duration: 600 },
  { text: "Establishing AI Core...", duration: 700 },
  { text: "Connecting to Neural Network...", duration: 500 },
  { text: "ARYAN OS Ready.", duration: 400 },
]

export default function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (step >= BOOT_STEPS.length) {
      const t = setTimeout(onComplete, 400)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setStep((s) => s + 1), BOOT_STEPS[step].duration)
    return () => clearTimeout(t)
  }, [step, onComplete])

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((c) => !c), 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05070A]"
        exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
      >
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[#3B82F6] glow-text">ARYAN OS</h1>
            <p className="mt-2 text-xs text-[#475569] font-mono tracking-widest">v2.0.0 — AI CORE ACTIVE</p>
          </div>
        </motion.div>

        <div className="w-72">
          <div className="h-1 w-full bg-[#0C1118] overflow-hidden rounded-full">
            <motion.div
              className="h-full bg-[#3B82F6] rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((step + 1) / BOOT_STEPS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="mt-6 font-mono text-sm text-[#94A3B8] h-5">
          {step < BOOT_STEPS.length && (
            <span>
              {BOOT_STEPS[step].text}
              <span className={`ml-0.5 text-[#3B82F6] ${showCursor ? "opacity-100" : "opacity-0"}`}>_</span>
            </span>
          )}
          {step >= BOOT_STEPS.length && <span className="text-[#3B82F6]">Launching Interface...</span>}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

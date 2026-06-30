"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const bootSteps = [
  { text: "Initializing...", duration: 800 },
  { text: "Loading Neural Network...", duration: 1200 },
  { text: "Authenticating Visitor...", duration: 1000 },
  { text: "Loading Aryan OS...", duration: 1000 },
  { text: "Welcome.", duration: 600 },
]

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (currentStep >= bootSteps.length) {
      setTimeout(() => {
        setVisible(false)
        onComplete()
      }, 300)
      return
    }

    const step = bootSteps[currentStep]
    setProgress(0)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 8
        return next >= 100 ? 100 : next
      })
    }, step.duration / 20)

    const timeout = setTimeout(() => {
      clearInterval(progressInterval)
      setProgress(100)
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 200)
    }, step.duration)

    return () => {
      clearTimeout(timeout)
      clearInterval(progressInterval)
    }
  }, [currentStep, onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0b]"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
        >
          <div className="relative flex flex-col items-center gap-12 max-w-md w-full px-6">
            <motion.div
              className="relative w-20 h-20"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full border border-[rgba(96,165,250,0.2)]" />
              <div className="absolute inset-2 rounded-full border-t border-[rgba(96,165,250,0.5)]" />
              <div className="absolute inset-4 rounded-full border-r border-[rgba(96,165,250,0.3)]" />
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.1),transparent_70%)]" />
            </motion.div>

            <div className="flex flex-col items-center gap-3 w-full">
              <motion.p
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-[#a1a1aa] font-mono tracking-wide"
              >
                {bootSteps[currentStep]?.text || ""}
              </motion.p>

              <div className="w-full h-[2px] bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#60a5fa] rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>

            <p className="text-[11px] text-[#52525b] font-mono tracking-widest uppercase">
              ARYAN OS v1.0
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

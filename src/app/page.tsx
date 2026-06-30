"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import BootScreen from "@/components/BootScreen"
import Desktop from "@/components/Desktop"

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false)

  return (
    <AnimatePresence>
      {!bootComplete && <BootScreen onComplete={() => setBootComplete(true)} />}
      {bootComplete && <Desktop />}
    </AnimatePresence>
  )
}

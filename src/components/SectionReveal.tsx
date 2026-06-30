"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface SectionRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export default function SectionReveal({ children, className = "", delay = 0 }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

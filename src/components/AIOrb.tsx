"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface AIOrbProps {
  isListening?: boolean
  isPlaying?: boolean
  size?: "sm" | "md" | "lg"
}

export default function AIOrb({ isListening, isPlaying, size = "md" }: AIOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dims = size === "sm" ? 48 : size === "lg" ? 96 : 64

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let frame: number
    let angle = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      angle += 0.02

      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const radius = canvas.width * 0.35
      const pulse = Math.sin(angle * 0.5) * 0.05 + 1

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width * 0.5 * pulse)
      gradient.addColorStop(0, isListening ? "rgba(74, 222, 128, 0.3)" : isPlaying ? "rgba(96, 165, 250, 0.25)" : "rgba(96, 165, 250, 0.15)")
      gradient.addColorStop(0.5, isListening ? "rgba(74, 222, 128, 0.1)" : isPlaying ? "rgba(96, 165, 250, 0.08)" : "rgba(96, 165, 250, 0.05)")
      gradient.addColorStop(1, "transparent")

      ctx.beginPath()
      ctx.arc(cx, cy, canvas.width * 0.5 * pulse, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      for (let i = 0; i < 3; i++) {
        const rot = angle + (i * Math.PI * 2) / 3
        ctx.beginPath()
        ctx.ellipse(
          cx + Math.cos(rot) * radius * 0.3,
          cy + Math.sin(rot) * radius * 0.3,
          radius * 0.4,
          radius * 0.15,
          rot,
          0,
          Math.PI * 2
        )
        ctx.strokeStyle = isListening
          ? `rgba(74, 222, 128, ${0.15 + Math.sin(angle + i) * 0.1})`
          : `rgba(96, 165, 250, ${0.12 + Math.sin(angle + i) * 0.08})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      const dotCount = 8
      for (let i = 0; i < dotCount; i++) {
        const dotAngle = angle + (i * Math.PI * 2) / dotCount
        const x = cx + Math.cos(dotAngle) * radius * 0.8
        const y = cy + Math.sin(dotAngle) * radius * 0.8
        const dotSize = 1.5 + Math.sin(dotAngle * 2 + angle) * 0.5

        ctx.beginPath()
        ctx.arc(x, y, dotSize, 0, Math.PI * 2)
        ctx.fillStyle = isListening
          ? `rgba(74, 222, 128, ${0.3 + Math.sin(dotAngle + angle) * 0.2})`
          : `rgba(96, 165, 250, ${0.25 + Math.sin(dotAngle + angle) * 0.15})`
        ctx.fill()
      }

      frame = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frame)
  }, [isListening, isPlaying])

  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <canvas ref={canvasRef} width={dims * 2} height={dims * 2} className="w-full h-full" style={{ width: dims, height: dims }} />
      <div className={`absolute inset-0 rounded-full ${isListening ? "bg-[rgba(74,222,128,0.03)]" : isPlaying ? "bg-[rgba(96,165,250,0.03)]" : ""}`} />
    </motion.div>
  )
}

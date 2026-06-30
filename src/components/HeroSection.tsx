"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import AIOrb from "./AIOrb"

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let frame: number
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = []

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(96, 165, 250, ${p.opacity})`
        ctx.fill()
      })

      particles.forEach((a) => {
        particles.forEach((b) => {
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(96, 165, 250, ${0.06 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      frame = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    animate()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(96,165,250,0.08),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_50%_80%,rgba(167,139,250,0.05),transparent)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 5.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(96,165,250,0.1)] border border-[rgba(96,165,250,0.15)] mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                <span className="text-xs text-[#a1a1aa] font-medium">Available for opportunities</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 6.0 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4"
            >
              <span className="gradient-text">Aryan</span>
              <br />
              <span className="gradient-text">Sonsurkar</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 6.2 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6"
            >
              {["Founder", "Full-Stack Developer", "AI Engineer"].map((role) => (
                <span
                  key={role}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-[#a1a1aa]"
                >
                  {role}
                </span>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 6.4 }}
              className="text-lg text-[#71717a] max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Building web applications, AI-powered tools, automation systems, and
              real-world software products.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 6.6 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mt-8"
            >
              {["Portfolio Websites", "Business Websites", "Python Automation", "AI Apps"].map((s) => (
                <span key={s} className="text-xs text-[#52525b] font-mono">
                  /{s.replace(/\s+/g, "-").toLowerCase()}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 6.0 }}
            className="flex-shrink-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.15),transparent_70%)] rounded-full" />
              <div className="relative w-48 h-48 lg:w-64 lg:h-64 flex items-center justify-center">
                <AIOrb size="lg" />
                <div className="absolute inset-4 rounded-full border border-[rgba(96,165,250,0.08)]" />
                <div className="absolute inset-8 rounded-full border border-[rgba(96,165,250,0.05)]" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 7.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-[rgba(255,255,255,0.1)] flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-[#52525b]" />
        </motion.div>
      </motion.div>
    </section>
  )
}

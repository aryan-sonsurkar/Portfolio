"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { scrollToSection } from "@/lib/utils"

const navItems = [
  { id: "hero", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "timeline", label: "Timeline" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
]

export default function Navigation() {
  const [active, setActive] = useState("hero")
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      const sections = navItems.map((item) => document.getElementById(item.id))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i]
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 200) {
            setActive(navItems[i].id)
            break
          }
        }
      }
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? "bg-[rgba(10,10,11,0.8)] backdrop-blur-2xl" : "bg-transparent"
        }`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 5.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => scrollToSection("hero")} className="text-sm font-medium text-[#a1a1aa] hover:text-[#fafafa] transition-colors">
            Aryan OS
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active === item.id
                    ? "text-[#fafafa] bg-[rgba(255,255,255,0.06)]"
                    : "text-[#71717a] hover:text-[#a1a1aa]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[#a1a1aa] transition-all"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-px bg-current transition-all ${isOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block h-px bg-current transition-all ${isOpen ? "opacity-0" : ""}`} />
              <span className={`block h-px bg-current transition-all ${isOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </div>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-[rgba(10,10,11,0.95)] backdrop-blur-2xl flex items-center justify-center md:hidden"
          >
            <nav className="flex flex-col items-center gap-6">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    setIsOpen(false)
                    scrollToSection(item.id)
                  }}
                  className="text-2xl font-light text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

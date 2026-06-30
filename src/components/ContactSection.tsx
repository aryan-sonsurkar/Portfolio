"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import SectionReveal from "./SectionReveal"

export default function ContactSection() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  const copyEmail = () => {
    navigator.clipboard.writeText("aryansonsurkar87@gmail.com")
  }

  return (
    <section id="contact" className="relative py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_30%_at_50%_80%,rgba(96,165,250,0.03),transparent)]" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <SectionReveal>
          <div className="flex flex-col gap-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text">
              Get in Touch
            </h2>
            <p className="text-lg text-[#71717a] max-w-xl">
              Available for internships, freelance projects, and collaborations.
            </p>
          </div>
        </SectionReveal>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <SectionReveal delay={0.1}>
            <div className="glass rounded-2xl p-8">
              <h3 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-wider mb-6">
                Send a Message
              </h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-sm text-[#fafafa] placeholder-[#52525b] outline-none focus:border-[rgba(96,165,250,0.3)] focus:bg-[rgba(96,165,250,0.03)] transition-all"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-sm text-[#fafafa] placeholder-[#52525b] outline-none focus:border-[rgba(96,165,250,0.3)] focus:bg-[rgba(96,165,250,0.03)] transition-all"
                />
                <textarea
                  placeholder="Your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-sm text-[#fafafa] placeholder-[#52525b] outline-none focus:border-[rgba(96,165,250,0.3)] focus:bg-[rgba(96,165,250,0.03)] transition-all resize-none"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`w-full px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                    sent
                      ? "bg-[rgba(74,222,128,0.15)] text-[#4ade80] border border-[rgba(74,222,128,0.2)]"
                      : "bg-[rgba(96,165,250,0.1)] text-[#60a5fa] border border-[rgba(96,165,250,0.15)] hover:bg-[rgba(96,165,250,0.15)]"
                  }`}
                >
                  {sent ? "✓ Message Sent" : "Send Message"}
                </motion.button>
              </form>
            </div>
          </SectionReveal>

          <div className="flex flex-col gap-4">
            <SectionReveal delay={0.15}>
              <div className="glass rounded-2xl p-8">
                <h3 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-wider mb-4">
                  Contact
                </h3>
                <div className="flex flex-col gap-4">
                  <button onClick={copyEmail} className="group flex items-center justify-between p-3 rounded-xl hover:bg-[rgba(255,255,255,0.03)] transition-all">
                    <span className="text-sm text-[#a1a1aa] group-hover:text-[#fafafa] transition-colors">Email</span>
                    <span className="text-xs text-[#52525b] group-hover:text-[#71717a] transition-colors">aryansonsurkar87@gmail.com</span>
                  </button>
                  <div className="h-px bg-[rgba(255,255,255,0.04)]" />
                  <a href="https://github.com/aryan-sonsurkar" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-3 rounded-xl hover:bg-[rgba(255,255,255,0.03)] transition-all">
                    <span className="text-sm text-[#a1a1aa] group-hover:text-[#fafafa] transition-colors">GitHub</span>
                    <span className="text-xs text-[#52525b] group-hover:text-[#71717a] transition-colors">@aryan-sonsurkar</span>
                  </a>
                  <div className="h-px bg-[rgba(255,255,255,0.04)]" />
                  <a href="https://www.linkedin.com/in/aryan-sonsurkar/" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-3 rounded-xl hover:bg-[rgba(255,255,255,0.03)] transition-all">
                    <span className="text-sm text-[#a1a1aa] group-hover:text-[#fafafa] transition-colors">LinkedIn</span>
                    <span className="text-xs text-[#52525b] group-hover:text-[#71717a] transition-colors">/in/aryan-sonsurkar</span>
                  </a>
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.2}>
              <div className="glass rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
                  <span className="text-sm text-[#a1a1aa]">Usually responds within 24 hours</span>
                </div>
                <p className="text-xs text-[#52525b]">
                  Let's build something impactful together.
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  )
}

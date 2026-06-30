"use client"

import { motion } from "framer-motion"
import SectionReveal from "./SectionReveal"
import { timeline } from "@/data/timeline"

export default function TimelineSection() {
  return (
    <section id="timeline" className="relative py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_50%_50%,rgba(167,139,250,0.03),transparent)]" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <SectionReveal>
          <div className="flex flex-col gap-4 mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text">
              Developer Journey
            </h2>
            <p className="text-lg text-[#71717a]">
              From first line of code to shipping production products.
            </p>
          </div>
        </SectionReveal>

        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-[rgba(96,165,250,0.3)] via-[rgba(167,139,250,0.2)] to-transparent" />

          <div className="flex flex-col gap-12">
            {timeline.map((entry, i) => (
              <SectionReveal key={i} delay={i * 0.08}>
                <div className="flex gap-6 group">
                  <div className="relative flex-shrink-0">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="w-[38px] h-[38px] rounded-full bg-[#18181b] border border-[rgba(96,165,250,0.2)] flex items-center justify-center"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#60a5fa]" />
                    </motion.div>
                  </div>

                  <div className="flex-1 pt-1.5">
                    <div className="inline-flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono font-medium text-[#60a5fa] bg-[rgba(96,165,250,0.08)] px-2 py-0.5 rounded">
                        {entry.year}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#fafafa] mb-2 group-hover:text-[#60a5fa] transition-colors">
                      {entry.title}
                    </h3>
                    <p className="text-sm text-[#71717a] leading-relaxed max-w-lg">
                      {entry.description}
                    </p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

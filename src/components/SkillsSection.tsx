"use client"

import { motion } from "framer-motion"
import SectionReveal from "./SectionReveal"
import { skillGroups } from "@/data/skills"

export default function SkillsSection() {
  return (
    <section id="skills" className="relative py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_30%_at_50%_20%,rgba(96,165,250,0.03),transparent)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionReveal>
          <div className="flex flex-col gap-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text">
              Skills & Technologies
            </h2>
            <p className="text-lg text-[#71717a] max-w-xl">
              Tools and technologies I work with to build production-ready products.
            </p>
          </div>
        </SectionReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillGroups.map((group, i) => (
            <SectionReveal key={group.name} delay={i * 0.06}>
              <motion.div
                className="glass rounded-2xl p-6 hover:bg-[rgba(24,24,27,0.8)] transition-all duration-300 h-full"
                whileHover={{ y: -2 }}
              >
                <h3 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-wider mb-4">
                  {group.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-[#71717a] hover:text-[#a1a1aa] hover:border-[rgba(255,255,255,0.1)] transition-all"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import SectionReveal from "./SectionReveal"
import { projects } from "@/data/projects"
import type { Project } from "@/data/projects"

export default function KokanamProject() {
  const project = projects.find((p) => p.id === "kokanam") as Project

  return (
    <section id="kokanam" className="relative py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(96,165,250,0.03),transparent)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionReveal>
          <div className="flex flex-col gap-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(96,165,250,0.1)] border border-[rgba(96,165,250,0.15)] self-start mb-2">
              <span className="text-xs text-[#60a5fa] font-medium">Flagship Project</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight gradient-text-accent">
              {project.title}
            </h2>
            <p className="text-lg text-[#71717a] max-w-2xl">{project.tagline}</p>
          </div>
        </SectionReveal>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="flex flex-col gap-8">
            <SectionReveal delay={0.1}>
              <div className="glass rounded-2xl p-8">
                <h3 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-wider mb-4">Overview</h3>
                <p className="text-[#a1a1aa] leading-relaxed">{project.overview}</p>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.15}>
              <div className="glass rounded-2xl p-8">
                <h3 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-wider mb-4">Problem</h3>
                <p className="text-[#a1a1aa] leading-relaxed">{project.problem}</p>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.2}>
              <div className="glass rounded-2xl p-8">
                <h3 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-wider mb-4">Solution</h3>
                <p className="text-[#a1a1aa] leading-relaxed">{project.solution}</p>
              </div>
            </SectionReveal>
          </div>

          <div className="flex flex-col gap-8">
            <SectionReveal delay={0.1}>
              <div className="glass rounded-2xl p-8">
                <h3 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-wider mb-4">Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {project.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-[#a1a1aa]">
                      <div className="w-1 h-1 rounded-full bg-[#60a5fa]" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.15}>
              <div className="glass rounded-2xl p-8">
                <h3 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-wider mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((t) => (
                    <span key={t} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[rgba(96,165,250,0.08)] border border-[rgba(96,165,250,0.12)] text-[#60a5fa]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.2}>
              <div className="glass rounded-2xl p-8 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#71717a]">Role</span>
                  <span className="text-sm text-[#a1a1aa] font-medium">{project.role}</span>
                </div>
                <div className="h-px bg-[rgba(255,255,255,0.06)]" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#71717a]">Status</span>
                  <span className="text-sm text-[#4ade80] font-medium">{project.status}</span>
                </div>
                <div className="h-px bg-[rgba(255,255,255,0.06)]" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#71717a]">Timeline</span>
                  <span className="text-sm text-[#a1a1aa] font-medium">{project.timeline}</span>
                </div>
                <div className="h-px bg-[rgba(255,255,255,0.06)]" />
                <div>
                  <span className="text-sm text-[#71717a] block mb-2">Impact</span>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">{project.impact}</p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  )
}

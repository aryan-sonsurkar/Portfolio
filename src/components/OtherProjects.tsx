"use client"

import SectionReveal from "./SectionReveal"
import { projects } from "@/data/projects"
import type { Project } from "@/data/projects"

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <SectionReveal delay={index * 0.1}>
      <div className="glass rounded-2xl p-8 hover:bg-[rgba(24,24,27,0.8)] transition-all duration-300 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[rgba(96,165,250,0.08)] border border-[rgba(96,165,250,0.1)] mb-3">
              <span className="text-[10px] text-[#60a5fa] font-semibold uppercase tracking-wider">
                {project.type === "founder" ? "Founder Project" : project.type === "tool" ? "Tool" : "Flagship"}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-[#fafafa]">{project.title}</h3>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            project.status === "Beta"
              ? "bg-[rgba(96,165,250,0.1)] text-[#60a5fa]"
              : "bg-[rgba(74,222,128,0.1)] text-[#4ade80]"
          }`}>
            {project.status}
          </span>
        </div>

        <p className="text-sm text-[#71717a] leading-relaxed mb-6 flex-1">{project.overview}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.slice(0, 6).map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-[#52525b]">
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {project.link && (
            <a
              href={project.link}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-[rgba(96,165,250,0.1)] border border-[rgba(96,165,250,0.15)] text-[#60a5fa] hover:bg-[rgba(96,165,250,0.15)] transition-all"
            >
              {project.linkLabel}
              <span className="text-sm">→</span>
            </a>
          )}
        </div>
      </div>
    </SectionReveal>
  )
}

export default function OtherProjects() {
  const otherProjects = projects.filter((p) => p.id !== "kokanam")

  return (
    <section id="projects" className="relative py-24">
      <div className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <div className="flex flex-col gap-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text">
              Featured Projects
            </h2>
            <p className="text-lg text-[#71717a] max-w-xl">
              Products I've built from the ground up.
            </p>
          </div>
        </SectionReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {otherProjects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

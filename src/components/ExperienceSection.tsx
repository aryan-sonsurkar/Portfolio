"use client"

import SectionReveal from "./SectionReveal"

const experiences = [
  {
    title: "Best Performing Intern",
    company: "Kaevron Technologies",
    description:
      "Recognized as the top-performing intern for outstanding contributions to development projects, automation systems, and software solutions. Collaborated with clients on production e-commerce development using Next.js and Supabase. Built admin systems and marketplace architecture.",
    tags: ["Next.js", "Supabase", "PostgreSQL", "Client Collaboration", "E-commerce", "Admin Systems"],
  },
]

export default function ExperienceSection() {
  return (
    <section id="experience" className="relative py-32">
      <div className="max-w-4xl mx-auto px-6">
        <SectionReveal>
          <div className="flex flex-col gap-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text">
              Experience
            </h2>
            <p className="text-lg text-[#71717a] max-w-xl">
              Professional experience building production software.
            </p>
          </div>
        </SectionReveal>

        {experiences.map((exp, i) => (
          <SectionReveal key={i} delay={0.1}>
            <div className="gradient-border rounded-2xl p-8 bg-[#121214]">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[rgba(74,222,128,0.1)] border border-[rgba(74,222,128,0.15)] mb-3">
                    <span className="text-[10px] text-[#4ade80] font-semibold uppercase tracking-wider">Internship</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-[#fafafa]">{exp.title}</h3>
                  <p className="text-sm text-[#60a5fa] font-medium mt-1">{exp.company}</p>
                </div>
              </div>
              <p className="text-sm text-[#71717a] leading-relaxed mb-6 max-w-2xl">{exp.description}</p>
              <div className="flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-md text-xs bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-[#52525b]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </SectionReveal>
        ))}
      </div>
    </section>
  )
}

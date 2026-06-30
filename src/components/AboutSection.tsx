"use client"

import SectionReveal from "./SectionReveal"

export default function AboutSection() {
  return (
    <section id="about" className="relative py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_50%_50%,rgba(167,139,250,0.03),transparent)]" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <SectionReveal>
          <div className="flex flex-col gap-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text-accent">
              About Me
            </h2>
            <p className="text-lg text-[#71717a]">
              My story, in my own words.
            </p>
          </div>
        </SectionReveal>

        <div className="flex flex-col gap-6">
          <SectionReveal delay={0.1}>
            <div className="glass rounded-2xl p-8">
              <p className="text-base text-[#a1a1aa] leading-relaxed">
                I'm a second-year Diploma Computer Engineering student who started coding out of pure curiosity.
                What began as tinkering with Python scripts quickly turned into building real products that people use.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <div className="glass rounded-2xl p-8">
              <p className="text-base text-[#a1a1aa] leading-relaxed">
                I was selected as Best Performing Intern at Kaevron Technologies, where I worked on production
                e-commerce platforms, admin systems, and marketplace architecture. I've delivered client websites
                and am currently building Fixly, an AI-powered student productivity platform.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div className="glass rounded-2xl p-8">
              <p className="text-base text-[#a1a1aa] leading-relaxed">
                I believe in shipping real work over talking about concepts. Every project I build solves an
                actual problem. I'm focused on becoming a top-tier full-stack developer and AI engineer while
                building products that make a difference.
              </p>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}

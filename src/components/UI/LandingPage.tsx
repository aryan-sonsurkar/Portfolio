"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { audioManager } from "@/lib/audio";

const PROJECTS = [
  {
    title: "MODCODES",
    subtitle: "AI-Powered Student Platform",
    description: "Python, FastAPI, Ollama local LLMs, speech recognition. Currently in Beta.",
    tags: ["Python", "FastAPI", "Ollama", "SQLite"],
    color: "#ffd700",
    link: "https://github.com/aryan-sonsurkar",
  },
  {
    title: "Vishwanath Insurance",
    subtitle: "Client Delivery",
    description: "Production website with Google Sheets integration, responsive design, consultation workflow.",
    tags: ["Next.js", "Google Sheets", "Responsive"],
    color: "#22c55e",
    link: "https://vishwanath-malusare.vercel.app",
  },
  {
    title: "CodeShortsBot v2",
    subtitle: "Autonomous Content Pipeline",
    description: "Researches topics, generates scripts, creates assets, assembles videos. Zero human involvement.",
    tags: ["FFmpeg", "Playwright", "Ollama"],
    color: "#3b82f6",
    link: "https://github.com/aryan-sonsurkar",
  },
];

const SKILLS = [
  { category: "Languages", items: ["Python", "TypeScript", "JavaScript", "SQL"] },
  { category: "Frameworks", items: ["Next.js", "React", "FastAPI", "Tailwind CSS"] },
  { category: "Tools", items: ["Git", "Docker", "Ollama", "FFmpeg", "Playwright"] },
  { category: "Domains", items: ["AI/ML", "Web Dev", "Automation", "Open Source"] },
];

const LINKS = [
  { label: "GitHub", url: "https://github.com/aryan-sonsurkar", icon: "GH" },
  { label: "LinkedIn", url: "https://linkedin.com/in/aryan-sonsurkar", icon: "LI" },
  { label: "Email", url: "mailto:aryan@example.com", icon: "@" },
  { label: "Resume", url: "#", icon: "CV" },
];

export default function LandingPage({ onEnterDistrict }: { onEnterDistrict: () => void }) {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);

  const handleEnter = () => {
    audioManager.playEnterDistrict();
    onEnterDistrict();
  };

  return (
    <div
      className="min-h-screen overflow-y-auto"
      style={{
        background: "#0a0612",
        fontFamily: "'JetBrains Mono', monospace",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(56,189,248,0.2) transparent",
      }}
    >
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 30%, rgba(56,189,248,0.06) 0%, transparent 60%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          {/* Avatar ring */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 12 }}
            className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center"
            style={{
              border: "2px solid rgba(56,189,248,0.3)",
              background: "radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)",
              boxShadow: "0 0 40px rgba(56,189,248,0.1)",
            }}
          >
            <span className="text-3xl font-bold" style={{ color: "#38bdf8" }}>A</span>
          </motion.div>

          <h1
            className="text-4xl md:text-6xl font-bold tracking-widest mb-4"
            style={{
              color: "#f0e6d8",
              textShadow: "0 0 60px rgba(56,189,248,0.2)",
            }}
          >
            ARYAN SONSURKAR
          </h1>

          <p
            className="text-sm md:text-base tracking-[0.3em] mb-3"
            style={{ color: "rgba(56,189,248,0.7)" }}
          >
            DEVELOPER · BUILDER · CREATOR
          </p>

          <p
            className="text-xs tracking-wider max-w-md mx-auto mb-12"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Building AI-powered products, shipping real projects, and turning ideas into reality.
          </p>

          {/* Enter District button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleEnter}
            onMouseEnter={() => { audioManager.playHoverSound(); }}
            className="px-8 py-3 rounded-lg text-sm tracking-[0.2em] uppercase transition-all cursor-pointer"
            style={{
              color: "#38bdf8",
              border: "1px solid rgba(56,189,248,0.4)",
              background: "rgba(56,189,248,0.06)",
              boxShadow: "0 0 30px rgba(56,189,248,0.08)",
            }}
          >
            Enter the District
          </motion.button>

          <p
            className="mt-4 text-[10px] tracking-wider"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            3D interactive experience · Best on desktop
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 rounded-full"
              style={{ background: "rgba(255,255,255,0.4)" }}
            />
          </div>
        </motion.div>
      </section>

      {/* Projects */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-xs tracking-[0.4em] uppercase mb-12 text-center"
            style={{ color: "rgba(56,189,248,0.6)" }}
          >
            Featured Projects
          </h2>

          <div className="space-y-4">
            {PROJECTS.map((project, i) => (
              <motion.a
                key={project.title}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onMouseEnter={() => { setHoveredProject(i); audioManager.playHoverSound(); }}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => audioManager.playClickSound()}
                className="block p-6 rounded-xl border transition-all no-underline"
                style={{
                  background: hoveredProject === i ? "rgba(56,189,248,0.04)" : "rgba(255,255,255,0.01)",
                  borderColor: hoveredProject === i ? "rgba(56,189,248,0.25)" : "rgba(255,255,255,0.05)",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold" style={{ color: project.color }}>
                      {project.title}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {project.subtitle}
                    </p>
                  </div>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>↗</span>
                </div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded"
                      style={{
                        color: "rgba(56,189,248,0.6)",
                        background: "rgba(56,189,248,0.06)",
                        border: "1px solid rgba(56,189,248,0.1)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Skills */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-xs tracking-[0.4em] uppercase mb-12 text-center"
            style={{ color: "rgba(56,189,248,0.6)" }}
          >
            Skills &amp; Tools
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SKILLS.map((group, i) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-lg border"
                style={{
                  background: "rgba(255,255,255,0.01)",
                  borderColor: "rgba(255,255,255,0.05)",
                }}
              >
                <h3
                  className="text-[10px] tracking-[0.2em] uppercase mb-3"
                  style={{ color: "rgba(56,189,248,0.5)" }}
                >
                  {group.category}
                </h3>
                <div className="space-y-1.5">
                  {group.items.map((item) => (
                    <p key={item} className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {item}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          {[
            { value: "15+", label: "Projects" },
            { value: "333", label: "GitHub Contributions" },
            { value: "10+", label: "Starred Repos" },
            { value: "Best", label: "Intern @ Kaevron" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-2xl md:text-3xl font-bold" style={{ color: "#38bdf8" }}>
                {stat.value}
              </p>
              <p className="text-[10px] tracking-wider mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Links */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-xs tracking-[0.4em] uppercase mb-12 text-center"
            style={{ color: "rgba(56,189,248,0.6)" }}
          >
            Connect
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.url}
                target={link.url.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => { setHoveredLink(i); audioManager.playHoverSound(); }}
                onMouseLeave={() => setHoveredLink(null)}
                onClick={() => audioManager.playClickSound()}
                className="flex items-center gap-3 px-5 py-3 rounded-lg border transition-all no-underline"
                style={{
                  background: hoveredLink === i ? "rgba(56,189,248,0.06)" : "rgba(255,255,255,0.01)",
                  borderColor: hoveredLink === i ? "rgba(56,189,248,0.3)" : "rgba(255,255,255,0.08)",
                }}
              >
                <span
                  className="w-8 h-8 rounded flex items-center justify-center text-[10px] font-bold"
                  style={{
                    background: "rgba(56,189,248,0.1)",
                    color: "#38bdf8",
                  }}
                >
                  {link.icon}
                </span>
                <span className="text-xs tracking-wider" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {link.label}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        <p className="text-[10px] tracking-wider" style={{ color: "rgba(255,255,255,0.2)" }}>
          Built with Next.js, Three.js, React Three Fiber &amp; Zustand
        </p>
        <p className="text-[10px] tracking-wider mt-2" style={{ color: "rgba(255,255,255,0.15)" }}>
          &copy; 2026 Aryan Sonsurkar
        </p>
      </footer>
    </div>
  );
}

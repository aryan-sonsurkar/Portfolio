"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { audioManager } from "@/lib/audio";

// ── Monochrome engineering shell (reference aesthetic).
// Content below is strictly repo-truth: no invented stacks, metrics, or links.

const SANS = "'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif";
const MONO = "'JetBrains Mono', monospace";

const HAIRLINE = "rgba(255,255,255,0.09)";
const CARD_BG = "rgba(255,255,255,0.02)";
const INK = "#f5f5f5";
const SECONDARY = "rgba(255,255,255,0.6)";
const MUTED = "rgba(255,255,255,0.38)";
const FAINT = "rgba(255,255,255,0.25)";

const PROJECTS = [
  {
    title: "SEEMA NETRA",
    category: "AI VIDEO SURVEILLANCE PROTOTYPE",
    description:
      "Object tracking, boundary intrusion detection, loitering detection, evidence snapshots and incident logging.",
    tags: ["YOLOv8", "ByteTrack", "OpenCV", "FastAPI", "React/Vite", "SQLite"],
    meta: "Prototype",
    link: null as string | null,
    linkLabel: null as string | null,
    note: "Full demo on request",
  },
  {
    title: "MODCODES",
    category: "AI STUDENT PLATFORM",
    description:
      "Python, FastAPI, Ollama local LLMs, speech recognition. Currently in Beta.",
    tags: ["Python", "FastAPI", "Ollama", "SQLite"],
    meta: "Beta",
    link: "https://github.com/aryan-sonsurkar/mod-codes-ide",
    linkLabel: "Source",
    note: null as string | null,
  },
  {
    title: "FIXLY",
    category: "AI STUDENT WORKSPACE",
    description:
      "Assignments, AI assistance, focus sessions, notes, progress tracking, PDF analysis and screenshot OCR.",
    tags: ["Next.js", "React", "AI/LLM workflows"],
    meta: "Live",
    link: "https://fixly-student-assistant.vercel.app/",
    linkLabel: "Live site",
    note: null as string | null,
  },
  {
    title: "KOKANAM",
    category: "E-COMMERCE MARKETPLACE · KAEVRON INTERNSHIP",
    description:
      "Discover and purchase products from brands across the Konkan region. Product discovery, product pages, cart, customer accounts and seller onboarding.",
    tags: ["E-commerce", "Marketplace", "Kaevron Internship"],
    meta: "Live",
    link: "https://www.kokanam.in/",
    linkLabel: "Live site",
    note: null as string | null,
  },
  {
    title: "INTERACTIVE 3D PORTFOLIO",
    category: "REAL-TIME WEBGL EXPERIENCE",
    description:
      "16-building explorable district with first-person controls, teleport flyovers, interiors and procedural audio. Next.js, React Three Fiber, Zustand.",
    tags: ["Next.js", "Three.js", "React Three Fiber", "Zustand"],
    meta: "You are here",
    link: null as string | null,
    linkLabel: "Enter district",
    note: null as string | null,
    district: true,
  },
];

// Previously featured — kept so no shipped work is lost
const MORE_WORK = [
  {
    title: "Vishwanath Insurance",
    category: "CLIENT DELIVERY",
    description:
      "Production website with Google Sheets integration, responsive design, consultation workflow.",
    link: "https://vishwanath-malusare.vercel.app",
  },
  {
    title: "CodeShortsBot v2",
    category: "AUTONOMOUS CONTENT PIPELINE",
    description:
      "Researches topics, generates scripts, creates assets, assembles videos. Zero human involvement.",
    link: "https://github.com/aryan-sonsurkar",
  },
];

const SKILLS = [
  { category: "Languages", items: ["Python", "TypeScript", "JavaScript", "SQL"] },
  { category: "Frameworks", items: ["Next.js", "React", "FastAPI", "Tailwind CSS"] },
  { category: "Tools", items: ["Git", "Docker", "Ollama", "FFmpeg", "Playwright"] },
  { category: "Domains", items: ["AI/ML", "Web Dev", "Automation", "Open Source"] },
];

const EXPERIENCE = [
  {
    role: "Web Developer & AI Intern",
    org: "Kaevron Technologies",
    period: "May 2026 – Aug 2026",
    points: [
      "Best Performing Intern — building automation systems, delivering projects, demonstrating ownership.",
      "Built KOKANAM — regional e-commerce marketplace with product discovery, cart, accounts and seller onboarding.",
    ],
  },
  {
    role: "Team Lead",
    org: "SIH-2025 Hackathon",
    period: "2025",
    points: [
      "Special Recognition — led a first-year team with zero prior hackathon experience against senior competitors.",
    ],
  },
  {
    role: "Freelance Delivery",
    org: "Vishwanath Insurance",
    period: "Client project",
    points: [
      "Delivered and deployed a production website with consultation workflow.",
    ],
  },
];

const LINKS = [
  { label: "GitHub", url: "https://github.com/aryan-sonsurkar", tag: "CODE" },
  { label: "LinkedIn", url: "https://linkedin.com/in/aryan-sonsurkar", tag: "NETW" },
  { label: "Email", url: "mailto:aryansonsurkar87@gmail.com", tag: "MAIL" },
];

const NAV = [
  ["work", "Work"],
  ["experience", "Experience"],
  ["skills", "Skills"],
  ["contact", "Contact"],
] as const;

function SectionHead({ index, title, aside }: { index: string; title: string; aside: string }) {
  return (
    <div
      className="flex justify-between items-baseline pb-3 mb-8"
      style={{ borderBottom: `1px solid ${HAIRLINE}` }}
    >
      <div className="flex items-center gap-2 uppercase" style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.08em", color: INK }}>
        <span style={{ color: MUTED }}>{index}</span>
        <span style={{ color: MUTED }}>/</span>
        <span>{title}</span>
      </div>
      <span className="uppercase" style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>
        {aside}
      </span>
    </div>
  );
}

export default function LandingPage({ onEnterDistrict, anchor }: { onEnterDistrict: () => void; anchor?: string | null }) {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (anchor) {
      const t = window.setTimeout(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      }, 60);
      return () => window.clearTimeout(t);
    }
  }, [anchor, reduceMotion]);

  const handleEnter = () => {
    audioManager.playEnterDistrict();
    onEnterDistrict();
  };

  const scrollTo = (id: string) => {
    audioManager.playClickSound();
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <div
      className="min-h-screen overflow-y-auto"
      style={{
        background: "#0e0e0e",
        fontFamily: SANS,
        color: INK,
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.2) transparent",
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40"
        style={{ background: "rgba(14,14,14,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div className="h-14 max-w-6xl mx-auto px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })}
              className="uppercase cursor-pointer"
              style={{ background: "none", border: "none", fontFamily: MONO, fontSize: 12, letterSpacing: "0.04em", color: INK, minHeight: 48 }}
              aria-label="Back to top"
            >
              Aryan Rakesh Sonsurkar
            </button>
            <span className="w-1.5 h-1.5" style={{ background: FAINT }} title="Systems operational" />
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
              {NAV.map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(id);
                  }}
                  className="uppercase no-underline transition-colors hover:text-white"
                  style={{ fontFamily: MONO, fontSize: 12, padding: "14px 10px", color: SECONDARY }}
                >
                  {label}
                </a>
              ))}
            </nav>
            <button
              onClick={handleEnter}
              onMouseEnter={() => { audioManager.playHoverSound(); }}
              className="uppercase cursor-pointer"
              style={{
                fontFamily: MONO,
                fontSize: 11,
                padding: "10px 14px",
                minHeight: 44,
                color: INK,
                border: `1px solid ${HAIRLINE}`,
                background: CARD_BG,
                whiteSpace: "nowrap",
              }}
            >
              [ 3D District ]
            </button>
          </div>
        </div>
      </header>

      <main className="w-full">
        <div className="flex flex-col w-full">
          {/* Hero */}
          <section className="w-full max-w-5xl mx-auto px-6 pt-16 md:pt-24 pb-16">
            <div
              className="inline-flex items-center gap-2 uppercase mb-6"
              style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.08em", color: MUTED }}
            >
              <span className="inline-block w-1.5 h-1.5" style={{ background: INK }} />
              <span>[ SYS.LOC: Mumbai, IN // Status: open to internships ]</span>
            </div>

            <motion.h1
              initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="uppercase mb-4 text-4xl md:text-6xl"
              style={{ fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em", color: INK }}
            >
              Aryan Rakesh Sonsurkar
            </motion.h1>

            <motion.p
              initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="text-base md:text-lg mb-4"
              style={{ color: SECONDARY }}
            >
              Computer Engineering Student · Software Developer · AI &amp; Web Development
            </motion.p>

            <motion.p
              initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16 }}
              className="text-[15px] leading-relaxed max-w-2xl mb-10"
              style={{ color: MUTED }}
            >
              Building software, AI tools and interactive experiences — shipped to production, not just demoed.
            </motion.p>

            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24 }}
              className="flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => scrollTo("work")}
                onMouseEnter={() => { audioManager.playHoverSound(); }}
                className="inline-flex items-center justify-center uppercase cursor-pointer"
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  letterSpacing: "0.06em",
                  background: INK,
                  color: "#0e0e0e",
                  padding: "0 28px",
                  minHeight: 52,
                  fontWeight: 600,
                }}
              >
                [ View my work ]
              </button>
              <button
                onClick={handleEnter}
                onMouseEnter={() => { audioManager.playHoverSound(); }}
                className="inline-flex items-center justify-center gap-2 uppercase cursor-pointer transition-colors"
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  letterSpacing: "0.06em",
                  color: INK,
                  border: `1px solid ${HAIRLINE}`,
                  background: CARD_BG,
                  padding: "0 28px",
                  minHeight: 52,
                }}
              >
                <span>[ Enter 3D District ]</span>
                <span aria-hidden>→</span>
              </button>
            </motion.div>

            <div
              className="mt-14 pt-6 flex flex-wrap items-center justify-between gap-y-3"
              style={{ borderTop: `1px solid ${HAIRLINE}`, fontFamily: MONO, fontSize: 11, color: MUTED }}
            >
              <div className="flex items-center gap-4">
                <span>5 SELECTED UNITS</span>
                <span style={{ color: FAINT }}>/</span>
                <span>16-BUILDING 3D DISTRICT</span>
                <span style={{ color: FAINT }}>/</span>
                <span>KAEVRON INTERN · MAY–AUG 2026</span>
              </div>
              <span style={{ color: FAINT }}>SCROLL ↓</span>
            </div>
          </section>

          {/* 01 // Selected work */}
          <section id="work" className="w-full max-w-5xl mx-auto px-6 py-16 scroll-mt-16">
            <SectionHead index="01" title="Selected work" aside="5 units provisioned" />

            <div className="flex flex-col" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
              {PROJECTS.map((project, i) => (
                <motion.article
                  key={project.title}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.06, 0.3) }}
                  onMouseEnter={() => { setHoveredProject(i); }}
                  onMouseLeave={() => setHoveredProject(null)}
                  className="transition-colors duration-150 p-6"
                  style={{
                    borderBottom: `1px solid ${HAIRLINE}`,
                    background: hoveredProject === i ? "rgba(255,255,255,0.03)" : "transparent",
                  }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                        <h2 className="text-lg font-medium" style={{ letterSpacing: "-0.01em", color: INK }}>
                          {project.title}
                        </h2>
                        <span className="uppercase" style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>
                          {project.category}
                        </span>
                      </div>
                      <p className="text-[15px] leading-relaxed max-w-2xl mb-4" style={{ color: SECONDARY }}>
                        {project.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2" style={{ fontFamily: MONO, fontSize: 11 }}>
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5"
                            style={{ border: `1px solid ${HAIRLINE}`, background: CARD_BG, color: SECONDARY }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {"note" in project && project.note && (
                        <p className="mt-3 text-[13px]" style={{ color: MUTED }}>
                          {project.note}
                        </p>
                      )}
                    </div>
                    <div className="flex lg:flex-col lg:items-end justify-between gap-3 lg:pt-1 lg:text-right" style={{ fontFamily: MONO, fontSize: 11 }}>
                      <span className="uppercase" style={{ color: MUTED }}>{project.meta}</span>
                      {project.link ? (
                        <a
                          className="inline-flex items-center gap-1 underline underline-offset-4"
                          style={{ color: INK, minHeight: 44, textDecorationColor: FAINT }}
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => audioManager.playClickSound()}
                        >
                          <span>{project.linkLabel ?? "Open"} ↗</span>
                        </a>
                      ) : "district" in project && project.district ? (
                        <button
                          className="inline-flex items-center gap-1 underline underline-offset-4 cursor-pointer"
                          style={{ color: INK, background: "none", border: "none", minHeight: 44, textDecorationColor: FAINT, fontFamily: MONO, fontSize: 11 }}
                          onClick={handleEnter}
                        >
                          <span>Enter district ↗</span>
                        </button>
                      ) : (
                        <span style={{ color: FAINT }}>Demo on request</span>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            <h3 className="uppercase mt-12 mb-4" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.08em", color: MUTED }}>
              Also shipped
            </h3>
            <div className="grid sm:grid-cols-2 gap-px" style={{ background: HAIRLINE, border: `1px solid ${HAIRLINE}` }}>
              {MORE_WORK.map((project) => (
                <a
                  key={project.title}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-5 no-underline transition-colors hover:bg-white/[0.03]"
                  style={{ background: "#0e0e0e" }}
                  onClick={() => audioManager.playClickSound()}
                >
                  <p className="uppercase mb-1" style={{ fontFamily: MONO, fontSize: 10, color: MUTED }}>{project.category}</p>
                  <p className="text-[15px] font-medium mb-2" style={{ color: INK }}>{project.title} ↗</p>
                  <p className="text-sm leading-relaxed" style={{ color: SECONDARY }}>{project.description}</p>
                </a>
              ))}
            </div>
          </section>

          {/* 02 // Experience */}
          <section id="experience" className="w-full max-w-5xl mx-auto px-6 py-16 scroll-mt-16">
            <SectionHead index="02" title="Experience" aside="Applied industry roles" />

            <div className="p-6 md:p-8" style={{ border: `1px solid ${HAIRLINE}`, background: CARD_BG }}>
              {EXPERIENCE.map((job, j) => (
                <div key={`${job.org}-${job.role}`} className={j > 0 ? "mt-8 pt-8" : ""} style={j > 0 ? { borderTop: `1px solid ${HAIRLINE}` } : undefined}>
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-lg font-medium" style={{ color: INK }}>{job.role}</h3>
                      <p className="text-[15px]" style={{ color: SECONDARY }}>{job.org}</p>
                    </div>
                    <span className="uppercase shrink-0" style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>
                      {job.period}
                    </span>
                  </div>
                  <ul className="space-y-2 max-w-3xl">
                    {job.points.map((pt) => (
                      <li key={pt} className="text-[15px] leading-relaxed flex gap-3" style={{ color: SECONDARY }}>
                        <span aria-hidden style={{ color: FAINT }}>&gt;</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* 03 // Skills */}
          <section id="skills" className="w-full max-w-5xl mx-auto px-6 py-16 scroll-mt-16">
            <SectionHead index="03" title="Technical skills" aside="Stack & capabilities" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: HAIRLINE, border: `1px solid ${HAIRLINE}` }}>
              {SKILLS.map((group, gi) => (
                <div key={group.category} className="p-6 flex flex-col justify-between gap-8" style={{ background: "#0e0e0e" }}>
                  <div>
                    <p className="uppercase mb-4" style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>
                      {String(gi + 1).padStart(2, "0")} / {group.category}
                    </p>
                    <ul className="space-y-2" style={{ fontFamily: MONO, fontSize: 13 }}>
                      {group.items.map((item) => (
                        <li key={item} className="flex items-center gap-2" style={{ color: INK }}>
                          <span aria-hidden style={{ color: FAINT }}>&gt;</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px mt-px" style={{ background: HAIRLINE, border: `1px solid ${HAIRLINE}`, borderTop: "none" }}>
              {[
                ["15+", "Projects"],
                ["333", "GitHub contributions"],
                ["10+", "Starred repos"],
                ["Best", "Intern @ Kaevron"],
              ].map(([v, l]) => (
                <div key={l} className="p-6 text-center" style={{ background: "#0e0e0e" }}>
                  <p className="text-2xl font-semibold" style={{ color: INK }}>{v}</p>
                  <p className="uppercase mt-1" style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>{l}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 04 // Contact */}
          <section id="contact" className="w-full max-w-5xl mx-auto px-6 py-20 scroll-mt-16">
            <SectionHead index="04" title="Contact" aside="Protocol: open" />

            <div className="p-8 md:p-12" style={{ border: `1px solid ${HAIRLINE}`, background: "#0e0e0e" }}>
              <h2 className="text-2xl font-medium mb-3" style={{ letterSpacing: "-0.01em", color: INK }}>
                Let&apos;s build something.
              </h2>
              <p className="text-[15px] leading-relaxed max-w-2xl mb-10" style={{ color: SECONDARY }}>
                Available for engineering roles, technical internships, and applied AI collaboration.
              </p>
              <div className="flex flex-col" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
                {LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target={link.url.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="group py-4 flex items-center justify-between no-underline"
                    style={{ fontFamily: MONO, fontSize: 13, borderBottom: `1px solid ${HAIRLINE}`, color: INK, minHeight: 56 }}
                    onClick={() => audioManager.playClickSound()}
                  >
                    <span className="flex items-center gap-3">
                      <span style={{ fontSize: 11, color: MUTED }}>[ {link.tag} ]</span>
                      <span>
                        {link.label === "Email" ? "aryansonsurkar87@gmail.com" : link.url.replace("https://", "").replace("mailto:", "")}
                      </span>
                    </span>
                    <span aria-hidden style={{ color: MUTED }}>↗</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="w-full" style={{ background: "#0e0e0e", borderTop: `1px solid ${HAIRLINE}` }}>
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center md:text-left" style={{ fontFamily: MONO, fontSize: 11, color: SECONDARY }}>
            © 2026 Aryan Rakesh Sonsurkar · Computer Engineering · All systems operational
          </p>
          <div className="flex items-center gap-6">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="uppercase no-underline"
                style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <p className="text-center pb-6" style={{ fontFamily: MONO, fontSize: 10, color: FAINT }}>
          Built with Next.js, Three.js, React Three Fiber &amp; Zustand
        </p>
      </footer>
    </div>
  );
}

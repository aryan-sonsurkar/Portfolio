"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { audioManager } from "@/lib/audio";

// ── Landing: clean, minimal developer portfolio.
// Plain black + subtle navy surfaces. Sans throughout;
// JetBrains Mono only for project tech lines.
// Content is strictly repo-truth.

const SANS =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Inter, Roboto, 'Helvetica Neue', Arial, sans-serif";
const MONO = "'JetBrains Mono', monospace";

const PROJECTS = [
  {
    title: "Seema Netra",
    description:
      "Object tracking, boundary intrusion detection, loitering detection, evidence snapshots and incident logging.",
    tech: "YOLOv8 · ByteTrack · OpenCV · FastAPI · React/Vite · SQLite",
    link: null as string | null,
    linkLabel: "Full demo on request",
    featured: true,
  },
  {
    title: "Modcodes",
    description:
      "Python, FastAPI, Ollama local LLMs, speech recognition. Currently in Beta.",
    tech: "Python · FastAPI · Ollama · SQLite",
    link: "https://github.com/aryan-sonsurkar/mod-codes-ide",
    linkLabel: "GitHub",
    featured: false,
  },
  {
    title: "Fixly",
    description:
      "Assignments, AI assistance, focus sessions, notes, progress tracking, PDF analysis and screenshot OCR.",
    tech: "Next.js · React · AI/LLM workflows",
    link: "https://fixly-student-assistant.vercel.app/",
    linkLabel: "Live site",
    featured: false,
  },
  {
    title: "Kokanam",
    description:
      "Discover and purchase products from brands across the Konkan region. Product discovery, product pages, cart, customer accounts and seller onboarding.",
    tech: "E-commerce · Marketplace · Kaevron internship",
    link: "https://www.kokanam.in/",
    linkLabel: "Live site",
    featured: false,
  },
  {
    title: "Interactive 3D Portfolio",
    description:
      "16-building explorable district with first-person controls, teleport flyovers, interiors and procedural audio.",
    tech: "Next.js · Three.js · React Three Fiber · Zustand",
    link: null as string | null,
    linkLabel: "Enter 3D district",
    district: true,
    featured: false,
  },
];

const MORE_WORK = [
  {
    title: "Vishwanath Insurance",
    description: "Production website with consultation workflow.",
    link: "https://vishwanath-malusare.vercel.app",
  },
  {
    title: "CodeShortsBot v2",
    description: "Autonomous short-video content pipeline.",
    link: "https://github.com/aryan-sonsurkar",
  },
];

const SKILLS = [
  { group: "Languages", items: "Python, TypeScript, JavaScript, SQL" },
  { group: "Frameworks", items: "Next.js, React, FastAPI, Tailwind CSS" },
  { group: "AI / Computer Vision", items: "YOLOv8, OpenCV, ByteTrack, Ollama" },
  { group: "Tools", items: "Git, Docker, SQLite, FFmpeg, Playwright" },
];

const EXPERIENCE = [
  {
    role: "Web Developer & AI Intern",
    org: "Kaevron Technologies",
    period: "May 2026 — Aug 2026",
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
    points: ["Delivered and deployed a production website with consultation workflow."],
  },
];

const CONTACTS = [
  { label: "Email", value: "aryansonsurkar87@gmail.com", url: "mailto:aryansonsurkar87@gmail.com" },
  { label: "GitHub", value: "github.com/aryan-sonsurkar", url: "https://github.com/aryan-sonsurkar" },
  { label: "LinkedIn", value: "linkedin.com/in/aryan-sonsurkar", url: "https://linkedin.com/in/aryan-sonsurkar" },
];

const NAV = [
  ["work", "Work"],
  ["experience", "Experience"],
  ["skills", "Skills"],
  ["contact", "Contact"],
] as const;

export default function LandingPage({
  onEnterDistrict,
  anchor,
}: {
  onEnterDistrict: () => void;
  anchor?: string | null;
}) {
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  };

  const fade = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: "easeOut" as const },
        };

  const reveal = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-40px" },
          transition: { duration: 0.5, delay, ease: "easeOut" as const },
        };

  return (
    <div className="landing-simple min-h-screen">
      {/* Header */}
      <header className="simple-header">
        <div className="simple-wrap simple-bar">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })}
            className="simple-brand"
            aria-label="Back to top"
          >
            <span className="hidden sm:inline">Aryan Rakesh Sonsurkar</span>
            <span className="sm:hidden">Aryan</span>
          </button>
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
            {NAV.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(id);
                }}
                className="simple-nav"
              >
                {label}
              </a>
            ))}
            <button onClick={handleEnter} className="simple-district">
              3D District
            </button>
          </nav>
          <button
            className="md:hidden simple-menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Menu"
          >
            Menu
          </button>
        </div>
        {menuOpen && (
          <nav className="md:hidden simple-mobile-nav" aria-label="Mobile">
            {NAV.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(id);
                }}
                className="simple-mobile-link"
              >
                {label}
              </a>
            ))}
            <button onClick={handleEnter} className="simple-mobile-link simple-mobile-district">
              3D District →
            </button>
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="simple-wrap simple-hero">
        <motion.h1 {...fade(0)} className="simple-name">
          Aryan Rakesh Sonsurkar
        </motion.h1>
        <motion.p {...fade(0.08)} className="simple-role">
          Computer Engineering Student · Software Developer · AI &amp; Web Development
        </motion.p>
        <motion.p {...fade(0.14)} className="simple-intro">
          I build software, AI tools and interactive experiences.
        </motion.p>
        <motion.div {...fade(0.2)} className="simple-cta-row">
          <button onClick={() => scrollTo("work")} className="simple-btn-primary">
            View My Work
          </button>
          <button onClick={handleEnter} className="simple-btn-secondary">
            Enter 3D District
          </button>
        </motion.div>
      </section>

      {/* Work */}
      <section id="work" className="simple-wrap simple-section">
        <motion.h2 {...reveal()} className="simple-h2">
          Selected Work
        </motion.h2>
        <div className="simple-cards">
          {PROJECTS.map((p, i) => (
            <motion.article
              key={p.title}
              {...reveal(Math.min(i * 0.05, 0.15))}
              className={p.featured ? "simple-card simple-card-featured" : "simple-card"}
            >
              <h3 className="simple-card-title">{p.title}</h3>
              <p className="simple-card-desc">{p.description}</p>
              <p className="simple-card-tech">{p.tech}</p>
              <div className="simple-card-foot">
                {p.link ? (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="simple-link"
                    onClick={() => audioManager.playClickSound()}
                  >
                    {p.linkLabel} ↗
                  </a>
                ) : "district" in p && p.district ? (
                  <button className="simple-link" onClick={handleEnter}>
                    {p.linkLabel} →
                  </button>
                ) : (
                  <span className="simple-muted">{p.linkLabel}</span>
                )}
              </div>
            </motion.article>
          ))}
        </div>
        <div className="simple-more">
          {MORE_WORK.map((p) => (
            <a
              key={p.title}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="simple-more-item"
              onClick={() => audioManager.playClickSound()}
            >
              <span className="simple-more-title">{p.title} ↗</span>
              <span className="simple-more-desc">{p.description}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="simple-wrap simple-section">
        <motion.h2 {...reveal()} className="simple-h2">
          Experience
        </motion.h2>
        {EXPERIENCE.map((job, j) => (
          <motion.div
            key={`${job.org}-${job.role}`}
            {...reveal()}
            className={j > 0 ? "simple-job simple-job-next" : "simple-job"}
          >
            <div className="simple-job-head">
              <div>
                <h3 className="simple-job-role">{job.role}</h3>
                <p className="simple-job-org">{job.org}</p>
              </div>
              <p className="simple-job-period">{job.period}</p>
            </div>
            <ul className="simple-job-points">
              {job.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </section>

      {/* Skills */}
      <section id="skills" className="simple-wrap simple-section">
        <motion.h2 {...reveal()} className="simple-h2">
          Skills
        </motion.h2>
        <div className="simple-skills">
          {SKILLS.map((s) => (
            <motion.div key={s.group} {...reveal()} className="simple-skill">
              <h3 className="simple-skill-group">{s.group}</h3>
              <p className="simple-skill-items">{s.items}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="simple-wrap simple-section">
        <motion.h2 {...reveal()} className="simple-h2">
          Let&apos;s build something.
        </motion.h2>
        <motion.div {...reveal(0.05)} className="simple-contact-list">
          {CONTACTS.map((c) => (
            <a
              key={c.label}
              href={c.url}
              target={c.url.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="simple-contact"
              onClick={() => audioManager.playClickSound()}
            >
              <span className="simple-contact-label">{c.label}</span>
              <span className="simple-contact-value">{c.value}</span>
              <span aria-hidden className="simple-contact-arrow">
                ↗
              </span>
            </a>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="simple-footer">
        <div className="simple-wrap simple-footer-inner">
          <p>Aryan Rakesh Sonsurkar</p>
          <div className="simple-footer-links">
            {CONTACTS.map((c) => (
              <a
                key={c.label}
                href={c.url}
                target={c.url.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .landing-simple {
          font-family: ${SANS};
          background: #000;
          color: #fff;
        }
        .simple-wrap {
          max-width: 880px;
          margin: 0 auto;
          padding-left: 24px;
          padding-right: 24px;
        }
        .simple-header {
          position: sticky;
          top: 0;
          z-index: 40;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .simple-bar {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .simple-brand {
          background: none;
          border: none;
          cursor: pointer;
          font-family: ${SANS};
          font-weight: 650;
          font-size: 15px;
          color: #fff;
          min-height: 44px;
        }
        .simple-nav {
          font-size: 14px;
          color: #a8b2bd;
          text-decoration: none;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
        }
        .simple-nav:hover {
          color: #fff;
        }
        .simple-district {
          font-family: ${SANS};
          font-size: 13.5px;
          font-weight: 600;
          color: #fff;
          background: #0a1d33;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 8px;
          min-height: 40px;
          padding: 0 16px;
          cursor: pointer;
        }
        .simple-district:hover {
          background: #123a5a;
        }
        .simple-menu-btn {
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 8px;
          color: #fff;
          font-family: ${SANS};
          font-size: 14px;
          min-height: 44px;
          min-width: 76px;
          cursor: pointer;
        }
        .simple-mobile-nav {
          display: flex;
          flex-direction: column;
          padding: 8px 24px 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .simple-mobile-link {
          font-size: 15px;
          color: #e8edf2;
          text-decoration: none;
          background: none;
          border: none;
          text-align: left;
          font-family: ${SANS};
          min-height: 48px;
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 0;
        }
        .simple-mobile-district {
          color: #fff;
          font-weight: 600;
        }
        .simple-hero {
          padding-top: 96px;
          padding-bottom: 96px;
        }
        @media (min-width: 768px) {
          .simple-hero {
            padding-top: 140px;
            padding-bottom: 140px;
          }
        }
        .simple-name {
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.08;
          font-size: clamp(2.25rem, 6vw, 3.75rem);
          color: #fff;
        }
        .simple-role {
          margin-top: 16px;
          font-size: 16px;
          color: #a8b2bd;
          max-width: 36rem;
        }
        .simple-intro {
          margin-top: 12px;
          font-size: 16px;
          line-height: 1.6;
          color: #66717c;
          max-width: 34rem;
        }
        .simple-cta-row {
          margin-top: 32px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        @media (min-width: 640px) {
          .simple-cta-row {
            flex-direction: row;
          }
        }
        .simple-btn-primary,
        .simple-btn-secondary {
          font-family: ${SANS};
          font-size: 15px;
          font-weight: 600;
          min-height: 52px;
          padding: 0 28px;
          border-radius: 10px;
          cursor: pointer;
        }
        .simple-btn-primary {
          background: #fff;
          color: #000;
          border: 1px solid #fff;
        }
        .simple-btn-secondary {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .simple-btn-secondary:hover {
          border-color: rgba(255, 255, 255, 0.4);
        }
        .simple-section {
          padding-top: 64px;
          padding-bottom: 64px;
        }
        .simple-h2 {
          font-size: 24px;
          font-weight: 650;
          letter-spacing: -0.01em;
          color: #fff;
          margin-bottom: 28px;
        }
        .simple-cards {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        @media (min-width: 768px) {
          .simple-cards {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
          .simple-card-featured {
            grid-column: 1 / -1;
          }
        }
        .simple-card {
          background: #050812;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 24px;
          transition: transform 0.15s ease, border-color 0.15s ease;
        }
        .simple-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.18);
        }
        .simple-card-featured {
          background: #07101c;
        }
        .simple-card-title {
          font-size: 19px;
          font-weight: 650;
          color: #fff;
        }
        .simple-card-featured .simple-card-title {
          font-size: 23px;
        }
        .simple-card-desc {
          margin-top: 8px;
          font-size: 14.5px;
          line-height: 1.6;
          color: #a8b2bd;
        }
        .simple-card-tech {
          margin-top: 12px;
          font-family: ${MONO};
          font-size: 12px;
          line-height: 1.7;
          color: #66717c;
        }
        .simple-card-foot {
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }
        .simple-link {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          background: none;
          border: none;
          cursor: pointer;
          font-family: ${SANS};
          padding: 0;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
        }
        .simple-muted {
          font-size: 13.5px;
          color: #66717c;
        }
        .simple-more {
          margin-top: 16px;
          display: grid;
          gap: 12px;
        }
        @media (min-width: 640px) {
          .simple-more {
            grid-template-columns: 1fr 1fr;
          }
        }
        .simple-more-item {
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .simple-more-title {
          font-size: 14.5px;
          font-weight: 600;
          color: #e8edf2;
        }
        .simple-more-desc {
          font-size: 13.5px;
          color: #66717c;
        }
        .simple-job-next {
          margin-top: 36px;
          padding-top: 36px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }
        .simple-job-head {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        @media (min-width: 768px) {
          .simple-job-head {
            flex-direction: row;
            justify-content: space-between;
            align-items: baseline;
          }
        }
        .simple-job-role {
          font-size: 18px;
          font-weight: 650;
          color: #fff;
        }
        .simple-job-org {
          margin-top: 2px;
          font-size: 14.5px;
          color: #a8b2bd;
        }
        .simple-job-period {
          font-size: 13.5px;
          color: #66717c;
          white-space: nowrap;
        }
        .simple-job-points {
          margin-top: 12px;
          padding-left: 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-width: 44rem;
        }
        .simple-job-points li {
          font-size: 14.5px;
          line-height: 1.6;
          color: #a8b2bd;
        }
        .simple-skills {
          display: grid;
          gap: 24px;
        }
        @media (min-width: 768px) {
          .simple-skills {
            grid-template-columns: 1fr 1fr;
          }
        }
        .simple-skill-group {
          font-size: 13px;
          font-weight: 650;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #66717c;
          margin-bottom: 8px;
        }
        .simple-skill-items {
          font-size: 15px;
          line-height: 1.6;
          color: #e8edf2;
        }
        .simple-contact-list {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          max-width: 40rem;
        }
        .simple-contact {
          display: flex;
          align-items: center;
          gap: 16px;
          min-height: 60px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          text-decoration: none;
        }
        .simple-contact-label {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          min-width: 72px;
        }
        .simple-contact-value {
          font-size: 13.5px;
          color: #66717c;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
        }
        .simple-contact-arrow {
          color: #66717c;
        }
        .simple-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          margin-top: 32px;
        }
        .simple-footer-inner {
          padding-top: 28px;
          padding-bottom: 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
          font-size: 13.5px;
          color: #66717c;
        }
        @media (min-width: 768px) {
          .simple-footer-inner {
            flex-direction: row;
            justify-content: space-between;
          }
        }
        .simple-footer-links {
          display: flex;
          gap: 20px;
        }
        .simple-footer-links a {
          color: #66717c;
          text-decoration: none;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
        }
        .simple-footer-links a:hover {
          color: #fff;
        }
      `}</style>
    </div>
  );
}

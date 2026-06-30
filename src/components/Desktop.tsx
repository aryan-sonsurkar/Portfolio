"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Sidebar from "@/components/Sidebar"
import HUD from "@/components/HUD"
import Terminal from "@/components/Terminal"
import Window from "@/components/Window"
import AIOrb3D from "@/components/AIOrb3D"
import VoiceAgent from "@/components/VoiceAgent"
import { projects } from "@/data/projects"
import { timelineData, skillGroups, achievements } from "@/data/projects"
import { cn } from "@/lib/utils"
import type { WindowState, ProjectData, TimelineEntry, SkillGroup } from "@/types"

const DEFAULT_WINDOWS: WindowState[] = [
  { id: "fixly", title: "Fixly", isOpen: false, zIndex: 1, minimized: false },
  { id: "kokanam", title: "Kokanam Marketplace", isOpen: false, zIndex: 1, minimized: false },
  { id: "projectx", title: "Project X", isOpen: false, zIndex: 1, minimized: false },
  { id: "about", title: "About Aryan", isOpen: false, zIndex: 1, minimized: false },
  { id: "skills", title: "Skills", isOpen: false, zIndex: 1, minimized: false },
  { id: "timeline", title: "Timeline", isOpen: false, zIndex: 1, minimized: false },
  { id: "achievements", title: "Achievements", isOpen: false, zIndex: 1, minimized: false },
  { id: "contact", title: "Contact", isOpen: false, zIndex: 1, minimized: false },
]

export default function Desktop() {
  const [windows, setWindows] = useState<WindowState[]>(DEFAULT_WINDOWS)
  const [activeWindow, setActiveWindow] = useState<string | null>(null)
  const [bootComplete, setBootComplete] = useState(false)
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false })

  const getWindow = useCallback(
    (id: string) => windows.find((w) => w.id === id),
    [windows]
  )

  const openWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex), 0)
      return prev.map((w) => (w.id === id ? { ...w, isOpen: true, zIndex: maxZ + 1, minimized: false } : w))
    })
    setActiveWindow(id)
  }, [])

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w)))
    setActiveWindow((prev) => (prev === id ? null : prev))
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w)))
  }, [])

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex), 0)
      return prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1 } : w))
    })
    setActiveWindow(id)
  }, [])

  const executeCommand = useCallback(
    (command: string) => {
      const cmd = command.toLowerCase().trim()
      if (cmd === "help") {
        setToast({ message: "Commands: fixly, kokanam, projectx, about, skills, timeline, achievements, contact, resume, help", visible: true })
      } else if (cmd === "fixly" || cmd === "kokanam" || cmd === "projectx" || cmd === "about" || cmd === "skills" || cmd === "timeline" || cmd === "achievements" || cmd === "contact") {
        openWindow(cmd)
      } else if (cmd === "resume") {
        openWindow("about")
      } else {
        setToast({ message: `Unknown command: ${command}. Type 'help' for available commands.`, visible: true })
      }
      setTimeout(() => setToast({ message: "", visible: false }), 3000)
    },
    [openWindow]
  )

  return (
    <div className="fixed inset-0 bg-[#05070A] overflow-hidden">
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] glass px-4 py-2 rounded-lg text-sm text-[#94A3B8]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/[0.02] via-transparent to-[#00D4FF]/[0.02] pointer-events-none" />

      <div className="relative h-full flex">
        <Sidebar onOpen={openWindow} onCommand={executeCommand} />

        <main className="flex-1 flex flex-col relative">
          <div className="flex-1 relative">
            <AIOrb3D isActive />

            <div className="absolute inset-0 pointer-events-none">
              {windows
                .filter((w) => w.isOpen && !w.minimized)
                .map((w) => (
                  <Window
                    key={w.id}
                    id={w.id}
                    title={w.title}
                    zIndex={w.zIndex}
                    isActive={activeWindow === w.id}
                    onFocus={() => focusWindow(w.id)}
                    onClose={() => closeWindow(w.id)}
                    onMinimize={() => minimizeWindow(w.id)}
                  >
                    <WindowContent id={w.id} />
                  </Window>
                ))}
            </div>
          </div>

          <Terminal onCommand={executeCommand} />
        </main>

        <HUD />
      </div>

      <VoiceAgent />
    </div>
  )
}

function WindowContent({ id }: { id: string }) {
  const project = projects.find((p) => p.id === id)

  if (project) {
    return <ProjectWindowContent project={project} />
  }

  switch (id) {
    case "about":
      return <AboutContent />
    case "skills":
      return <SkillsContent />
    case "timeline":
      return <TimelineContent />
    case "achievements":
      return <AchievementsContent />
    case "contact":
      return <ContactContent />
    default:
      return <div className="p-4 text-[#94A3B8]">Content not found.</div>
  }
}

function ProjectWindowContent({ project }: { project: ProjectData }) {
  return (
    <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{project.icon}</span>
            <h2 className="text-xl font-semibold text-[#F5F7FA]">{project.title}</h2>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">
              {project.status}
            </span>
            <span className="text-xs text-[#475569]">{project.timeline}</span>
          </div>
        </div>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 hover:bg-[#3B82F6]/20 transition-colors"
          >
            {project.linkLabel || "Visit"}
          </a>
        )}
      </div>

      <p className="text-sm text-[#94A3B8] leading-relaxed">{project.overview}</p>

      {project.problem && (
        <div>
          <h3 className="text-xs font-semibold text-[#3B82F6] uppercase tracking-wider mb-2">Problem</h3>
          <p className="text-sm text-[#94A3B8]">{project.problem}</p>
        </div>
      )}

      {project.solution && (
        <div>
          <h3 className="text-xs font-semibold text-[#3B82F6] uppercase tracking-wider mb-2">Solution</h3>
          <p className="text-sm text-[#94A3B8]">{project.solution}</p>
        </div>
      )}

      <div>
        <h3 className="text-xs font-semibold text-[#3B82F6] uppercase tracking-wider mb-2">Features</h3>
        <div className="flex flex-wrap gap-2">
          {project.features.map((f) => (
            <span key={f} className="px-2.5 py-1 text-xs rounded-md bg-[#0C1118] border border-[#3B82F6]/10 text-[#94A3B8]">
              {f}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-[#3B82F6] uppercase tracking-wider mb-2">Tech Stack</h3>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((t) => (
            <span key={t} className="px-2.5 py-1 text-xs rounded-md bg-[#3B82F6]/5 border border-[#3B82F6]/15 text-[#3B82F6]">
              {t}
            </span>
          ))}
        </div>
      </div>

      {project.challenges && (
        <div>
          <h3 className="text-xs font-semibold text-[#3B82F6] uppercase tracking-wider mb-2">Challenges</h3>
          <ul className="list-disc list-inside text-sm text-[#94A3B8] space-y-1">
            {project.challenges.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {project.outcome && (
        <div className="border-t border-[#3B82F6]/10 pt-4">
          <h3 className="text-xs font-semibold text-[#3B82F6] uppercase tracking-wider mb-2">Outcome</h3>
          <p className="text-sm text-[#94A3B8]">{project.outcome}</p>
        </div>
      )}
    </div>
  )
}

function AboutContent() {
  return (
    <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#F5F7FA] mb-1">Aryan Sonsurkar</h2>
        <p className="text-sm text-[#3B82F6]">AI Engineer & Founder of Fixly</p>
      </div>
      <p className="text-sm text-[#94A3B8] leading-relaxed">
        AI Engineer and Full-Stack Developer specializing in building AI-powered products, automation systems, and
        production web applications. Founder of Fixly, an AI-powered student productivity platform. Best Performing
        Intern at Kaevron Technologies. Delivered production marketplace for real clients.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-[#0C1118] border border-[#3B82F6]/10">
          <p className="text-xs text-[#475569]">Role</p>
          <p className="text-sm text-[#F5F7FA]">AI Engineer</p>
        </div>
        <div className="p-3 rounded-lg bg-[#0C1118] border border-[#3B82F6]/10">
          <p className="text-xs text-[#475569]">Location</p>
          <p className="text-sm text-[#F5F7FA]">India</p>
        </div>
        <div className="p-3 rounded-lg bg-[#0C1118] border border-[#3B82F6]/10">
          <p className="text-xs text-[#475569]">Focus</p>
          <p className="text-sm text-[#F5F7FA]">AI, Web, Product</p>
        </div>
        <div className="p-3 rounded-lg bg-[#0C1118] border border-[#3B82F6]/10">
          <p className="text-xs text-[#475569]">Email</p>
          <p className="text-sm text-[#F5F7FA]">sonsurkararyan@gmail.com</p>
        </div>
      </div>
      <div className="flex gap-3">
        <a href="https://github.com/Aryansonsurkar" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs rounded-lg bg-[#0C1118] border border-[#3B82F6]/20 text-[#94A3B8] hover:border-[#3B82F6]/40 transition-colors">
          GitHub
        </a>
        <a href="https://linkedin.com/in/aryansonsurkar" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs rounded-lg bg-[#0C1118] border border-[#3B82F6]/20 text-[#94A3B8] hover:border-[#3B82F6]/40 transition-colors">
          LinkedIn
        </a>
      </div>
    </div>
  )
}

function SkillsContent() {
  return (
    <div className="p-6 overflow-y-auto max-h-[70vh] space-y-5">
      {skillGroups.map((group) => (
        <div key={group.name}>
          <h3 className="text-xs font-semibold text-[#3B82F6] uppercase tracking-wider mb-2">{group.name}</h3>
          <div className="flex flex-wrap gap-2">
            {group.skills.map((skill) => (
              <span key={skill} className="px-2.5 py-1 text-xs rounded-md bg-[#0C1118] border border-[#3B82F6]/10 text-[#94A3B8]">
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function TimelineContent() {
  return (
    <div className="p-6 overflow-y-auto max-h-[70vh] space-y-0">
      {timelineData.map((entry) => (
        <div key={entry.title} className="relative pl-6 pb-6 border-l border-[#3B82F6]/20 last:border-0">
          <div className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-[#3B82F6]" />
          <p className="text-xs text-[#475569]">{entry.year}</p>
          <p className="text-sm text-[#F5F7FA] font-medium">{entry.title}</p>
          <p className="text-xs text-[#94A3B8]">{entry.description}</p>
        </div>
      ))}
    </div>
  )
}

function AchievementsContent() {
  return (
    <div className="p-6 overflow-y-auto max-h-[70vh] space-y-3">
      {achievements.map((a) => (
        <div key={a.title} className="flex items-center gap-3 p-3 rounded-lg bg-[#0C1118] border border-[#3B82F6]/10">
          <span className="text-lg">{a.icon}</span>
          <div>
            <p className="text-sm text-[#F5F7FA]">{a.title}</p>
            <p className="text-xs text-[#475569]">{a.org} · {a.year}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function ContactContent() {
  return (
    <div className="p-6 overflow-y-auto max-h-[70vh] space-y-4">
      <p className="text-sm text-[#94A3B8]">Let&apos;s connect. Reach out for collaborations, opportunities, or just to say hi.</p>
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0C1118] border border-[#3B82F6]/10">
          <span className="text-[#3B82F6]">📧</span>
          <span className="text-sm text-[#94A3B8]">sonsurkararyan@gmail.com</span>
        </div>
        <a href="https://github.com/Aryansonsurkar" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-[#0C1118] border border-[#3B82F6]/10 hover:border-[#3B82F6]/30 transition-colors">
          <span className="text-[#3B82F6]">💻</span>
          <span className="text-sm text-[#94A3B8]">github.com/Aryansonsurkar</span>
        </a>
        <a href="https://linkedin.com/in/aryansonsurkar" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-[#0C1118] border border-[#3B82F6]/10 hover:border-[#3B82F6]/30 transition-colors">
          <span className="text-[#3B82F6]">🔗</span>
          <span className="text-sm text-[#94A3B8]">linkedin.com/in/aryansonsurkar</span>
        </a>
      </div>
    </div>
  )
}

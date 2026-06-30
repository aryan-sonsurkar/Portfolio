export interface SkillGroup {
  name: string
  skills: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    name: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "HTML/CSS", "JavaScript"],
  },
  {
    name: "Backend",
    skills: ["Python", "FastAPI", "Node.js", "REST APIs", "PostgreSQL", "Supabase"],
  },
  {
    name: "AI & Automation",
    skills: ["Ollama", "Local LLMs", "Playwright", "Speech Recognition", "TTS", "Automation Pipelines"],
  },
  {
    name: "Databases",
    skills: ["PostgreSQL", "SQLite", "Supabase", "Google Sheets API"],
  },
  {
    name: "Cloud & DevOps",
    skills: ["Vercel", "Git", "GitHub", "CI/CD", "CLI Tools"],
  },
  {
    name: "Design & Tools",
    skills: ["FFmpeg", "Figma", "Shadcn UI", "GSAP", "Three.js"],
  },
]

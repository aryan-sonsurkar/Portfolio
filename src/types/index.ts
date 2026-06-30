export interface ProjectData {
  id: string
  title: string
  type: "startup" | "client" | "research" | "tool"
  status: "Live" | "Beta" | "Testing" | "Research" | "Coming Soon"
  icon: string
  overview: string
  problem?: string
  solution?: string
  features: string[]
  techStack: string[]
  role: string
  outcome?: string
  link?: string
  linkLabel?: string
  timeline?: string
  challenges?: string[]
  gallery?: string[]
}

export interface StartupData {
  id: string
  name: string
  status: "Testing" | "Research" | "Development"
  mission: string
  description: string
  users?: string
  coverage?: string
  timeline?: string
  fundingGoal?: string
  futureVision?: string
}

export interface TimelineEntry {
  year: string
  title: string
  description: string
  icon: string
}

export interface SkillGroup {
  name: string
  skills: string[]
  icon: string
}

export interface WindowState {
  id: string
  title: string
  isOpen: boolean
  zIndex: number
  minimized: boolean
  icon?: string
}

export interface TerminalCommand {
  command: string
  description: string
  action: string
}

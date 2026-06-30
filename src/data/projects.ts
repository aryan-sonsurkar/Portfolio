export interface Project {
  id: string
  title: string
  tagline: string
  type: "flagship" | "founder" | "tool"
  status: string
  overview: string
  problem?: string
  solution?: string
  features: string[]
  techStack: string[]
  role: string
  impact?: string
  timeline?: string
  link?: string
  linkLabel?: string
}

export const projects: Project[] = [
  {
    id: "kokanam",
    title: "Kokanam Marketplace",
    tagline: "A full-featured e-commerce marketplace platform",
    type: "flagship",
    status: "Production",
    overview:
      "A comprehensive e-commerce marketplace built for a real client. Features include product management, admin panel, customer portal, search, coupons, reviews, order management, and Shiprocket integration readiness.",
    problem:
      "The client needed a scalable, modern marketplace platform to sell products online with full administrative control, customer management, and seamless order fulfillment.",
    solution:
      "Built a complete marketplace ecosystem with Next.js frontend, Supabase backend, and integrated tools for search, reviews, coupons, orders, and shipping.",
    features: [
      "Admin Dashboard",
      "Marketplace Browse",
      "Customer Portal",
      "Search & Filters",
      "Coupons & Discounts",
      "Reviews & Ratings",
      "Order Management",
      "Shiprocket Integration Ready",
    ],
    techStack: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Tailwind CSS",
      "Stripe",
      "Shiprocket API",
      "Vercel",
    ],
    role: "Full-Stack Developer",
    impact: "Successfully delivered and deployed a production marketplace serving real customers.",
    timeline: "2025 - Present",
    link: "#",
    linkLabel: "View Case Study",
  },
  {
    id: "fixly",
    title: "Fixly",
    tagline: "AI-powered student productivity platform",
    type: "founder",
    status: "Beta",
    overview:
      "Fixly is an AI-powered student productivity companion that helps students manage assignments, deadlines, planning, AI assistance, voice interaction, and productivity tracking. Currently in active Beta development.",
    features: [
      "AI Assignment Assistant",
      "Deadline Management",
      "Voice Interaction",
      "Productivity Analytics",
      "OCR Scanning",
      "Local + Cloud AI",
    ],
    techStack: ["Python", "FastAPI", "Ollama", "SQLite", "Speech Recognition", "TTS", "Next.js"],
    role: "Founder & Developer",
    impact: "Building the next-generation student productivity platform with AI at its core.",
    timeline: "2025 - Present",
    link: "#",
    linkLabel: "Learn More",
  },
  {
    id: "draco",
    title: "Draco CLI",
    tagline: "Modern AI-powered command-line assistant",
    type: "tool",
    status: "Active Development",
    overview:
      "A modern AI-powered CLI assistant that helps developers automate workflows, debug code, and manage projects through natural language commands and intelligent automation.",
    features: [
      "Natural Language Commands",
      "Code Automation",
      "Project Scaffolding",
      "AI Debug Assistant",
      "Custom Workflows",
      "Plugin System",
    ],
    techStack: ["Python", "Click", "Ollama", "OpenAI API", "SQLite", "Rich"],
    role: "Creator & Developer",
    timeline: "2025 - Present",
  },
]

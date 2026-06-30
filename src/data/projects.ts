import type { ProjectData, StartupData, TimelineEntry, SkillGroup } from "@/types"

export const projects: ProjectData[] = [
  {
    id: "fixly",
    title: "Fixly",
    type: "startup",
    status: "Testing",
    icon: "⚡",
    overview:
      "AI-powered student productivity platform that helps students manage assignments, deadlines, planning, AI assistance, voice interaction, and productivity tracking. Currently in testing phase with active users.",
    problem:
      "Students struggle to manage multiple assignments, deadlines, and academic tasks across different platforms. Existing tools are either too complex or don't leverage AI for personalized assistance.",
    solution:
      "Fixly combines AI-powered OCR, voice interaction, and intelligent task management into one seamless platform. It scans portals and inboxes, extracts deadlines, generates drafts using LLMs, and provides a clean review interface.",
    features: [
      "AI Assignment Detection",
      "Deadline Management",
      "Voice Interaction",
      "Productivity Analytics",
      "OCR Scanning",
      "Local + Cloud AI (Ollama, Gemini, OpenAI)",
      "Draft Generation",
      "Review & Refine Editor",
    ],
    techStack: ["Python", "FastAPI", "Next.js", "Ollama", "SQLite", "Speech Recognition", "TTS", "Gemini API"],
    role: "Founder & Full-Stack Developer",
    outcome: "Beta platform with active test users. Continuously improving AI accuracy and user experience.",
    timeline: "2026 - Present",
    challenges: [
      "Integrating multiple AI providers seamlessly",
      "OCR accuracy across different document formats",
      "Building a responsive voice interaction system",
    ],
  },
  {
    id: "kokanam",
    title: "Kokanam Marketplace",
    type: "client",
    status: "Live",
    icon: "🏪",
    overview:
      "A complete production e-commerce marketplace platform built for a real client. Includes admin panel, customer portal, product management, search, coupons, reviews, order management, and Shiprocket integration readiness.",
    problem:
      "The client needed a scalable, modern marketplace to sell products online with full administrative control, customer management, and seamless order fulfillment.",
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
      "Payment Ready",
      "Authentication",
      "Responsive Design",
    ],
    techStack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS", "Shiprocket API", "Vercel"],
    role: "Full-Stack Developer",
    outcome: "Successfully delivered a production marketplace serving real customers. Complete with admin panel, customer portal, and order management.",
    timeline: "2026",
    challenges: [
      "Complex database schema for marketplace data",
      "Real-time inventory management",
      "Integration readiness with third-party shipping APIs",
    ],
  },
  {
    id: "projectx",
    title: "Project X",
    type: "research",
    status: "Research",
    icon: "🔮",
    overview:
      "An ambitious AI-powered career guidance platform designed to help students across India discover and pursue the right career paths through personalized AI mentoring, skill analysis, and industry insights.",
    features: [
      "AI Career Mentoring",
      "Skill Gap Analysis",
      "Industry Insights",
      "Personalized Roadmaps",
      "Job Market Intelligence",
    ],
    techStack: ["Next.js", "Python", "FastAPI", "Supabase", "AI/ML", "PostgreSQL"],
    role: "Founder & AI Engineer",
    outcome: "Currently in research phase. Exploring AI-powered career guidance for Indian students.",
    timeline: "2026",
  },
]

export const startups: StartupData[] = [
  {
    id: "fixly-startup",
    name: "Fixly",
    status: "Testing",
    mission: "Student Productivity Platform",
    description: "AI-powered companion helping students manage assignments, deadlines, and productivity with intelligent assistance.",
    users: "Active test users",
    timeline: "2026 - Present",
    fundingGoal: "Seeking early seed",
    futureVision: "Become the default productivity platform for students across India, leveraging AI to reduce academic stress and improve outcomes.",
  },
  {
    id: "projectx-startup",
    name: "Project X",
    status: "Research",
    mission: "Career Guidance AI",
    description: "AI-powered career guidance platform helping students discover and pursue the right career paths through personalized mentoring.",
    coverage: "India (Initial)",
    timeline: "2026 - Research Phase",
    fundingGoal: "Pre-seed",
    futureVision: "Democratize career guidance for every student in India using AI. Bridge the gap between education and industry.",
  },
]

export const timelineData: TimelineEntry[] = [
  { year: "2024", title: "Started Programming", description: "Began building web applications and automation systems.", icon: "🚀" },
  { year: "2025", title: "Joined College", description: "Started at Vidyalankar Polytechnic, diving deep into tech and entrepreneurship.", icon: "🎓" },
  { year: "2025", title: "First Project", description: "Built and shipped first complete web application.", icon: "💻" },
  { year: "2026", title: "Kaevron Internship", description: "Selected as Best Performing Intern at Kaevron Technologies.", icon: "🏆" },
  { year: "2026", title: "EDP Marketing Head", description: "Marketing Head for Entrepreneurship Development Program at Vidyalankar Polytechnic.", icon: "📢" },
  { year: "2026", title: "Kokanam Delivery", description: "Delivered production marketplace for real client.", icon: "🏪" },
  { year: "2026", title: "Founded Fixly", description: "Launched AI-powered student productivity platform.", icon: "⚡" },
  { year: "2026", title: "SHI-2025 Hackathon", description: "Special Recognition Award at SHI Hackathon.", icon: "🏅" },
  { year: "2026", title: "Started Project X", description: "Researching AI-powered career guidance platform.", icon: "🔮" },
  { year: "2026+", title: "Future Vision", description: "Building the next generation of AI-powered products.", icon: "🌟" },
]

export const skillGroups: SkillGroup[] = [
  { name: "Frontend", skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP"], icon: "🎨" },
  { name: "Backend", skills: ["Python", "FastAPI", "Node.js", "REST APIs", "PostgreSQL", "Supabase"], icon: "⚙️" },
  { name: "AI & ML", skills: ["Ollama", "LLMs", "Speech Recognition", "TTS", "Prompt Engineering", "AI Agents"], icon: "🧠" },
  { name: "Databases", skills: ["PostgreSQL", "SQLite", "Supabase", "Firebase", "Redis"], icon: "🗄️" },
  { name: "Cloud & DevOps", skills: ["Vercel", "Git", "GitHub", "CI/CD", "Linux", "CLI Tools"], icon: "☁️" },
  { name: "Design & 3D", skills: ["Figma", "Three.js", "React Three Fiber", "Tailwind", "Shadcn UI"], icon: "🎯" },
]

export const achievements = [
  { title: "Best Performing Intern", org: "Kaevron Technologies", year: "2026", icon: "🏆" },
  { title: "Founder of Fixly", org: "Startup", year: "2026", icon: "⚡" },
  { title: "EDP Marketing Head", org: "Vidyalankar Polytechnic", year: "2026", icon: "📢" },
  { title: "SHI-2025 Hackathon", org: "Special Recognition Award", year: "2026", icon: "🏅" },
  { title: "Client Projects", org: "Production Deployments", year: "2026", icon: "💼" },
  { title: "Open Source", org: "AI Tools & Automation", year: "2026", icon: "🌐" },
]

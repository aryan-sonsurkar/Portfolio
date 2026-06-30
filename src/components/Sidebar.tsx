"use client"

import { motion } from "framer-motion"
import { Terminal, User, Briefcase, Code2, Trophy, Mail, Clock, Zap, HelpCircle } from "lucide-react"

const NAV_ITEMS = [
  { id: "about", label: "About", icon: User },
  { id: "fixly", label: "Fixly", icon: Zap },
  { id: "kokanam", label: "Kokanam", icon: Briefcase },
  { id: "projectx", label: "Project X", icon: Code2 },
  { id: "skills", label: "Skills", icon: Terminal },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "contact", label: "Contact", icon: Mail },
]

export default function Sidebar({
  onOpen,
  onCommand,
}: {
  onOpen: (id: string) => void
  onCommand: (cmd: string) => void
}) {
  return (
    <aside className="w-[280px] flex-shrink-0 flex flex-col border-r border-[#3B82F6]/10 bg-[#0C1118]/20">
      <nav className="flex-1 py-4 space-y-0.5 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <motion.button
              key={item.id}
              onClick={() => onOpen(item.id)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[#94A3B8] hover:text-[#F5F7FA] hover:bg-[#3B82F6]/10 transition-all group"
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Icon className="w-4 h-4 text-[#475569] group-hover:text-[#3B82F6] transition-colors" />
              {item.label}
            </motion.button>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[#3B82F6]/10">
        <motion.button
          onClick={() => onCommand("help")}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[#475569] hover:text-[#94A3B8] hover:bg-[#0C1118] transition-colors"
          whileHover={{ x: 3 }}
        >
          <HelpCircle className="w-4 h-4" />
          Help
        </motion.button>
      </div>
    </aside>
  )
}

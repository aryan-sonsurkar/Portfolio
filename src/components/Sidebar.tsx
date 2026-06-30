"use client"

import { motion } from "framer-motion"
import { Terminal, User, Briefcase, Code2, Trophy, Mail, Clock, Zap, LayoutDashboard } from "lucide-react"

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
    <aside className="w-56 flex-shrink-0 flex flex-col border-r border-[#3B82F6]/10 bg-[#0C1118]/30">
      <div className="px-4 pt-4 pb-3 border-b border-[#3B82F6]/10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center border border-[#3B82F6]/20">
            <span className="text-[10px] text-[#3B82F6] font-bold">A</span>
          </div>
          <div>
            <p className="text-xs font-medium text-[#F5F7FA] leading-tight">ARYAN OS</p>
            <p className="text-[9px] text-[#475569]">AI Core Active</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-2 space-y-0.5 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <motion.button
              key={item.id}
              onClick={() => onOpen(item.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#94A3B8] hover:text-[#F5F7FA] hover:bg-[#3B82F6]/10 transition-colors group"
              whileHover={{ x: 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Icon className="w-3.5 h-3.5 text-[#475569] group-hover:text-[#3B82F6] transition-colors" />
              {item.label}
            </motion.button>
          )
        })}
      </nav>

      <div className="px-3 py-3 border-t border-[#3B82F6]/10">
        <motion.button
          onClick={() => onCommand("help")}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#475569] hover:text-[#94A3B8] hover:bg-[#0C1118] transition-colors"
          whileHover={{ x: 2 }}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Help
        </motion.button>
      </div>
    </aside>
  )
}

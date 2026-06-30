"use client"

import { useSystemTime } from "@/hooks/useSystemTime"
import { motion } from "framer-motion"
import { Cpu, HardDrive, Wifi, Activity, Users, Globe } from "lucide-react"

function Widget({ icon: Icon, label, value, color = "#3B82F6" }: { icon: any; label: string; value: string; color?: string }) {
  return (
    <div className="glass px-3 py-2 rounded-lg border border-[#3B82F6]/10">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3 h-3" style={{ color }} />
        <span className="hud-text text-[#475569] uppercase">{label}</span>
      </div>
      <p className="text-xs font-mono text-[#94A3B8]">{value}</p>
    </div>
  )
}

function MiniBar({ value, color = "#3B82F6" }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 w-full bg-[#0C1118] rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  )
}

export default function HUD() {
  const { time, date, uptime } = useSystemTime()

  const cpu = 23 + Math.floor(Math.random() * 15)
  const mem = 34 + Math.floor(Math.random() * 10)

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col border-l border-[#3B82F6]/10 bg-[#0C1118]/30 p-3 gap-2">
      <div className="text-center py-2 border-b border-[#3B82F6]/10">
        <p className="text-lg font-mono font-semibold text-[#F5F7FA] tracking-wider">{time}</p>
        <p className="text-[10px] text-[#475569] font-mono">{date}</p>
      </div>

      <div className="space-y-2">
        <Widget icon={Activity} label="AI Status" value="Online · Neural Active" color="#3B82F6" />
        <Widget icon={Cpu} label="CPU" value={`${cpu}%`} color="#00D4FF" />
        <MiniBar value={cpu} color="#00D4FF" />
        <Widget icon={HardDrive} label="Memory" value={`${mem}%`} color="#3B82F6" />
        <MiniBar value={mem} />
        <Widget icon={Wifi} label="Network" value="Stable · 42ms" color="#22C55E" />
        <Widget icon={Users} label="Visitors" value="127 Online" color="#A855F7" />
        <Widget icon={Globe} label="Uptime" value={`${Math.floor(uptime / 60)}m ${uptime % 60}s`} color="#F59E0B" />
      </div>

      <div className="mt-auto pt-2 border-t border-[#3B82F6]/10 text-center">
        <p className="text-[9px] text-[#475569] font-mono">ARYAN OS v2.0.0</p>
        <p className="text-[9px] text-[#475569] font-mono mt-0.5">© 2025 Aryan Sonsurkar</p>
      </div>
    </aside>
  )
}

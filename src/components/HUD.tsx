"use client"

import { useSystemTime } from "@/hooks/useSystemTime"
import { motion } from "framer-motion"
import { Cpu, HardDrive, Wifi, Activity, Users, Globe } from "lucide-react"

function Widget({ icon: Icon, label, value, color = "#3B82F6" }: { icon: any; label: string; value: string; color?: string }) {
  return (
    <div className="glass px-3.5 py-2.5 rounded-lg border border-[#3B82F6]/10">
      <div className="flex items-center gap-2.5 mb-1">
        <Icon className="w-3.5 h-3.5" style={{ color }} />
        <span className="text-[10px] font-mono text-[#475569] uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xs font-mono text-[#94A3B8]">{value}</p>
    </div>
  )
}

function MiniBar({ value, color = "#3B82F6" }: { value: number; color?: string }) {
  return (
    <div className="h-1 w-full bg-[#0C1118] rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </div>
  )
}

export default function HUD() {
  const { time, date, uptime } = useSystemTime()
  const cpu = 23 + Math.floor(Math.random() * 15)
  const mem = 34 + Math.floor(Math.random() * 10)

  return (
    <aside className="w-[320px] flex-shrink-0 flex flex-col border-l border-[#3B82F6]/10 bg-[#0C1118]/20 p-4 gap-2.5">
      <div className="text-center py-3 border-b border-[#3B82F6]/10 mb-1">
        <p className="text-xl font-mono font-semibold text-[#F5F7FA] tracking-wider">{time}</p>
        <p className="text-[11px] text-[#475569] font-mono mt-0.5">{date}</p>
      </div>

      <div className="space-y-2.5">
        <Widget icon={Activity} label="AI Status" value="Online · Neural Active" color="#3B82F6" />
        <div>
          <Widget icon={Cpu} label="CPU" value={`${cpu}% Load`} color="#00D4FF" />
          <div className="mt-1.5 px-0.5">
            <MiniBar value={cpu} color="#00D4FF" />
          </div>
        </div>
        <div>
          <Widget icon={HardDrive} label="Memory" value={`${mem}% Used`} color="#3B82F6" />
          <div className="mt-1.5 px-0.5">
            <MiniBar value={mem} />
          </div>
        </div>
        <Widget icon={Wifi} label="Network" value="Stable · 42ms" color="#22C55E" />
        <Widget icon={Users} label="Visitors" value="127 Online" color="#A855F7" />
        <Widget icon={Globe} label="Uptime" value={`${Math.floor(uptime / 60)}m ${uptime % 60}s`} color="#F59E0B" />
      </div>

      <div className="mt-auto pt-3 border-t border-[#3B82F6]/10 text-center">
        <p className="text-[10px] text-[#475569] font-mono">ARYAN OS v2.0.0</p>
        <p className="text-[10px] text-[#475569] font-mono mt-0.5">© 2025 Aryan Sonsurkar</p>
      </div>
    </aside>
  )
}

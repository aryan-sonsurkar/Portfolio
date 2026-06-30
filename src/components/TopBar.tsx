"use client"

import { Clock, Wifi, Battery, Volume2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function TopBar({ openWindow }: { openWindow: (id: string) => void }) {
  const [time, setTime] = useState("")

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }))
    tick()
    const interval = setInterval(tick, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="h-10 flex-shrink-0 flex items-center justify-between px-4 border-b border-[#3B82F6]/10 bg-[#0C1118]/40 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#3B82F6]/10 flex items-center justify-center border border-[#3B82F6]/20">
            <span className="text-[8px] text-[#3B82F6] font-bold">A</span>
          </div>
          <span className="text-[11px] font-medium text-[#F5F7FA] tracking-wide">ARYAN OS</span>
        </div>
        <div className="h-3 w-px bg-[#3B82F6]/10" />
        <button onClick={() => openWindow("about")} className="text-[11px] text-[#94A3B8] hover:text-[#F5F7FA] transition-colors">About</button>
        <button onClick={() => openWindow("fixly")} className="text-[11px] text-[#94A3B8] hover:text-[#F5F7FA] transition-colors">Fixly</button>
        <button onClick={() => openWindow("kokanam")} className="text-[11px] text-[#94A3B8] hover:text-[#F5F7FA] transition-colors">Kokanam</button>
        <button onClick={() => openWindow("projectx")} className="text-[11px] text-[#94A3B8] hover:text-[#F5F7FA] transition-colors">Project X</button>
      </div>

      <div className="flex items-center gap-3 text-[#475569]">
        <Wifi className="w-3.5 h-3.5" />
        <Volume2 className="w-3.5 h-3.5" />
        <Battery className="w-3.5 h-3.5" />
        <span className="text-[11px] font-mono text-[#94A3B8]">{time}</span>
      </div>
    </header>
  )
}

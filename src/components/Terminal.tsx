"use client"

import { useState, useRef, useEffect } from "react"
import { Terminal as TerminalIcon } from "lucide-react"

const HISTORY_LIMIT = 100

export default function Terminal({ onCommand }: { onCommand: (cmd: string) => void }) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>(["> ARYAN OS Terminal Ready. Type 'help' for commands."])
  const [focus, setFocus] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !focus && inputRef.current) {
        e.preventDefault()
        inputRef.current.focus()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [focus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cmd = input.trim()
    if (!cmd) return
    setHistory((prev) => {
      const updated = [...prev, `> ${cmd}`]
      return updated.length > HISTORY_LIMIT ? updated.slice(-HISTORY_LIMIT) : updated
    })
    onCommand(cmd)
    setInput("")
  }

  return (
    <div
      className="flex-shrink-0 border-t border-[#3B82F6]/10 bg-[#0C1118]/90 backdrop-blur-xl cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 px-5 py-1.5 border-b border-[#3B82F6]/8">
        <TerminalIcon className="w-3.5 h-3.5 text-[#3B82F6]" />
        <span className="text-[10px] text-[#475569] font-mono tracking-wider uppercase">Terminal — Press / to focus</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
          <span className="text-[9px] text-[#475569] font-mono">CONNECTED</span>
        </div>
      </div>
      <div className="px-5 py-1.5 max-h-14 overflow-y-auto">
        {history.slice(-3).map((line, i) => (
          <p key={i} className="text-[11px] font-mono text-[#94A3B8] leading-5">{line}</p>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="px-5 pb-2.5 flex items-center gap-2">
        <span className="text-[#3B82F6] text-xs font-mono shrink-0">{">"}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-[#F5F7FA] placeholder-[#475569]"
          placeholder="Type a command..."
          spellCheck={false}
          autoComplete="off"
        />
      </form>
    </div>
  )
}

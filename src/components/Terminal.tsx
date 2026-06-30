"use client"

import { useState, useRef, useEffect } from "react"
import { Terminal as TerminalIcon } from "lucide-react"

const HISTORY_LIMIT = 50

export default function Terminal({ onCommand }: { onCommand: (cmd: string) => void }) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>(["> ARYAN OS Terminal Ready. Type 'help' for commands."])
  const [focus, setFocus] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !focus && inputRef.current) {
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
      className="flex-shrink-0 border-t border-[#3B82F6]/10 bg-[#0C1118]/80 backdrop-blur-xl"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 px-4 py-1.5 border-b border-[#3B82F6]/10">
        <TerminalIcon className="w-3 h-3 text-[#3B82F6]" />
        <span className="text-[10px] text-[#475569] font-mono">COMMAND TERMINAL — Press / to focus</span>
      </div>
      <div className="px-4 py-1 max-h-16 overflow-y-auto">
        {history.slice(-3).map((line, i) => (
          <p key={i} className="text-[11px] font-mono text-[#94A3B8] leading-5">
            {line}
          </p>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="px-4 pb-2 flex items-center gap-2">
        <span className="text-[#3B82F6] text-xs font-mono">{">"}</span>
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

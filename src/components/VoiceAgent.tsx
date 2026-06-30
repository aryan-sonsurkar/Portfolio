"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis"
import { useSpeechRecognition, COMMANDS } from "@/hooks/useSpeechRecognition"
import AIOrb from "./AIOrb"
import { scrollToSection } from "@/lib/utils"

interface VoiceAgentProps {
  onReady?: () => void
}

export default function VoiceAgent({ onReady }: VoiceAgentProps) {
  const { isPlaying, isMuted, hasGreeted, playGreeting, pause, resume, stop, toggleMute, replay } = useSpeechSynthesis()
  const { isListening, isSupported, startListening, stopListening, processCommand } = useSpeechRecognition()
  const [isExpanded, setIsExpanded] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    if (onReady) onReady()
    const timer = setTimeout(() => playGreeting(), 1500)
    return () => clearTimeout(timer)
  }, [playGreeting, onReady])

  const handleVoiceCommand = useCallback(
    (text: string) => {
      const command = processCommand(text)
      if (command) {
        setResponse(command.response)
        setTimeout(() => scrollToSection(command.sectionId), 300)
        const synth = window.speechSynthesis
        if (synth && !isMuted) {
          synth.cancel()
          const utterance = new SpeechSynthesisUtterance(command.response)
          utterance.rate = 0.9
          synth.speak(utterance)
        }
      } else {
        setResponse("Sorry, I didn't understand that. Try saying 'help' for available commands.")
      }
      setTimeout(() => setResponse(null), 5000)
    },
    [processCommand, isMuted]
  )

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
      setShowSuggestions(false)
    }
  }, [isListening, startListening, stopListening])

  useEffect(() => {
    if (!isListening) {
      const lastTranscript = (window as any).__lastTranscript
      if (lastTranscript) {
        handleVoiceCommand(lastTranscript)
        ;(window as any).__lastTranscript = null
      }
    }
  }, [isListening, handleVoiceCommand])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="glass rounded-2xl px-5 py-3 max-w-xs text-sm text-[#a1a1aa] leading-relaxed"
          >
            {response}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="glass rounded-2xl p-4 flex flex-col gap-2 min-w-[200px]"
          >
            {isSupported && (
              <button
                onClick={toggleListening}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                  isListening
                    ? "bg-[rgba(74,222,128,0.15)] text-[#4ade80]"
                    : "hover:bg-[rgba(255,255,255,0.05)] text-[#a1a1aa]"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isListening ? "bg-[#4ade80] animate-pulse" : "bg-[#52525b]"}`} />
                {isListening ? "Listening..." : "Voice Commands"}
              </button>
            )}

            {!isSupported && (
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm hover:bg-[rgba(255,255,255,0.05)] text-[#a1a1aa] transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-[#52525b]" />
                Tap to Ask
              </button>
            )}

            {showSuggestions && (
              <div className="flex flex-col gap-1.5 mt-1">
                {Object.keys(COMMANDS).slice(0, 5).map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => handleVoiceCommand(cmd)}
                    className="text-xs text-[#71717a] hover:text-[#a1a1aa] px-3 py-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.03)] transition-all text-left"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            )}

            <div className="h-px bg-[rgba(255,255,255,0.06)] my-1" />

            <div className="flex items-center justify-around">
              <button onClick={isPlaying ? pause : resume} className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[#71717a] hover:text-[#a1a1aa] transition-all text-xs">
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button onClick={replay} className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[#71717a] hover:text-[#a1a1aa] transition-all text-xs">
                ↻
              </button>
              <button onClick={toggleMute} className={`p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-all text-xs ${isMuted ? "text-[#ef4444]" : "text-[#71717a] hover:text-[#a1a1aa]"}`}>
                {isMuted ? "✕" : "♪"}
              </button>
              <button onClick={stop} className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[#71717a] hover:text-[#a1a1aa] transition-all text-xs">
                ■
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`relative rounded-full p-3 transition-all duration-300 ${
          isListening
            ? "bg-[rgba(74,222,128,0.2)] shadow-[0_0_30px_rgba(74,222,128,0.15)]"
            : isPlaying
            ? "bg-[rgba(96,165,250,0.15)] shadow-[0_0_30px_rgba(96,165,250,0.1)]"
            : "glass hover:bg-[rgba(24,24,27,0.8)]"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AIOrb isListening={isListening} isPlaying={isPlaying} size="sm" />
        {isListening && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#4ade80]"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.button>
    </div>
  )
}

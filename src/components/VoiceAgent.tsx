"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Play, Pause, SkipBack, Volume2, VolumeX } from "lucide-react"
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis"
import { useSpeechRecognition, VOICE_COMMANDS } from "@/hooks/useSpeechRecognition"

const SUGGESTIONS = [
  "Tell me about Aryan",
  "Show Fixly",
  "Show Kokanam",
  "Show Skills",
  "Show Timeline",
]

export default function VoiceAgent() {
  const { isPlaying, isMuted, playGreeting, speak, pause, resume, stop, toggleMute, replay } = useSpeechSynthesis()
  const { isListening, transcript, isSupported, startListening, stopListening } = useSpeechRecognition()
  const [expanded, setExpanded] = useState(false)
  const [waveform, setWaveform] = useState<number[]>(Array(20).fill(2))

  useEffect(() => {
    if (!isSupported) return
    const timer = setTimeout(() => playGreeting(), 2000)
    return () => clearTimeout(timer)
  }, [isSupported, playGreeting])

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setWaveform(Array.from({ length: 20 }, () => Math.random() * 18 + 2))
      }, 80)
      return () => clearInterval(interval)
    } else {
      setWaveform(Array(20).fill(2))
    }
  }, [isListening])

  useEffect(() => {
    if (!transcript) return
    const matched = Object.entries(VOICE_COMMANDS).find(([key]) =>
      transcript.includes(key.toLowerCase())
    )
    if (matched) {
      const [, { response }] = matched
      speak(response)
    }
  }, [transcript, speak])

  const toggleListening = useCallback(() => {
    if (isListening) stopListening()
    else startListening()
  }, [isListening, startListening, stopListening])

  return (
    <div className="fixed bottom-6 right-6 z-[150] flex flex-col items-end gap-3">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="glass rounded-2xl p-4 w-72 border border-[#3B82F6]/15"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${isListening ? "bg-red-500 animate-ping" : isPlaying ? "bg-[#3B82F6]" : "bg-[#475569]"}`} />
              <span className="text-xs font-mono text-[#94A3B8]">
                {isListening ? "Listening..." : isPlaying ? "Speaking..." : "AI Idle"}
              </span>
            </div>

            <div className="flex items-center justify-center h-10 mb-3 gap-0.5">
              {waveform.map((h, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-[#3B82F6]/60 rounded-full"
                  animate={{ height: h }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mb-3">
              <button
                onClick={replay}
                className="p-2 rounded-lg hover:bg-[#3B82F6]/10 text-[#94A3B8] hover:text-[#3B82F6] transition-colors"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={isPlaying ? pause : resume}
                className="p-2 rounded-lg hover:bg-[#3B82F6]/10 text-[#94A3B8] hover:text-[#3B82F6] transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleMute}
                className="p-2 rounded-lg hover:bg-[#3B82F6]/10 text-[#94A3B8] hover:text-[#3B82F6] transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {isSupported ? (
              <button
                onClick={toggleListening}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium transition-all ${
                  isListening
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 hover:bg-[#3B82F6]/20"
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                {isListening ? "Stop Listening" : "Start Voice"}
              </button>
            ) : (
              <div className="text-center">
                <p className="text-[10px] text-[#475569] mb-2">Voice not supported. Try these:</p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => speak(s.toLowerCase().replace(/[^a-z ]/g, ""))}
                      className="px-2 py-1 text-[10px] rounded-md bg-[#0C1118] border border-[#3B82F6]/10 text-[#94A3B8] hover:border-[#3B82F6]/30 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setExpanded((e) => !e)}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
          expanded
            ? "bg-[#3B82F6] text-white shadow-[#3B82F6]/30"
            : "glass text-[#94A3B8] hover:text-[#3B82F6] border border-[#3B82F6]/20"
        }`}
      >
        {expanded ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </button>
    </div>
  )
}

"use client"

import { useState, useCallback, useRef } from "react"

const GREETING =
  "Welcome. Identity recognized. Aryan Sonsurkar. AI Engineer. Founder of Fixly. Welcome to ARYAN OS. I am your AI interface. You can ask me about Aryan's projects, experience, skills, or use the sidebar to navigate. Say help for available commands."

export function useSpeechSynthesis() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [hasGreeted, setHasGreeted] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const speak = useCallback((text: string) => {
    if (isMuted || typeof window === "undefined" || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.85
    utterance.pitch = 0.9
    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)
    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [isMuted])

  const playGreeting = useCallback(() => {
    if (hasGreeted) return
    setHasGreeted(true)
    speak(GREETING)
  }, [hasGreeted, speak])

  const pause = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.pause()
      setIsPlaying(false)
    }
  }, [])

  const resume = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.resume()
      setIsPlaying(true)
    }
  }, [])

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    }
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      if (!prev) {
        window.speechSynthesis.cancel()
        setIsPlaying(false)
      }
      return !prev
    })
  }, [])

  const replay = useCallback(() => {
    speak(GREETING)
  }, [speak])

  return { isPlaying, isMuted, hasGreeted, playGreeting, speak, pause, resume, stop, toggleMute, replay }
}

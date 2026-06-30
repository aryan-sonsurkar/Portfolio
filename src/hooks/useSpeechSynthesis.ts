"use client"

import { useState, useCallback, useRef } from "react"

const GREETING =
  "Hello. Welcome to Aryan OS. I'm your AI guide. I'll introduce you to Aryan Sonsurkar. Aryan is a full-stack developer and founder of Fixly. He builds web applications, AI-powered tools, automation systems, and real-world software products. He was selected as Best Performing Intern at Kaevron Technologies and has delivered production client websites including the Kokanam Marketplace. You can navigate using the menu, or use voice commands by clicking the microphone button. Say help to see available commands."

export function useSpeechSynthesis() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [hasGreeted, setHasGreeted] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const speak = useCallback(
    (text: string) => {
      if (isMuted || typeof window === "undefined" || !window.speechSynthesis) return
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => setIsPlaying(false)
      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [isMuted]
  )

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

  return {
    isPlaying,
    isMuted,
    hasGreeted,
    playGreeting,
    speak,
    pause,
    resume,
    stop,
    toggleMute,
    replay,
  }
}

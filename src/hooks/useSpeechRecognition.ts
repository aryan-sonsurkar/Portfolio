"use client"

import { useState, useCallback, useRef } from "react"

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: ((event: any) => void) | null
  onerror: ((event: any) => void) | null
  onend: (() => void) | null
}

export const VOICE_COMMANDS: Record<string, { response: string; windowId?: string }> = {
  "tell me about aryan": { response: "Aryan Sonsurkar is an AI Engineer, Founder of Fixly, and Full-Stack Developer. He builds AI-powered products, automation systems, and production web applications.", windowId: "about" },
  "show fixly": { response: "Opening Fixly project. AI-powered student productivity platform.", windowId: "fixly" },
  "show kokanam": { response: "Opening Kokanam Marketplace. Production e-commerce platform.", windowId: "kokanam" },
  "show project x": { response: "Opening Project X. AI career guidance platform in research phase.", windowId: "projectx" },
  "show resume": { response: "Opening resume details.", windowId: "about" },
  "show skills": { response: "Opening skills panel. Aryan works with Next.js, Python, AI, and cloud technologies.", windowId: "skills" },
  "show experience": { response: "Best Performing Intern at Kaevron Technologies. Founder of Fixly. Delivered Kokanam Marketplace.", windowId: "experience" },
  "open contact": { response: "Opening contact panel. You can reach Aryan via email, LinkedIn, or GitHub.", windowId: "contact" },
  "show timeline": { response: "Aryan's journey started in 2024. From first project to founding Fixly and building AI products.", windowId: "timeline" },
  "show achievements": { response: "Best Performing Intern, SHI Hackathon Award, Founder of Fixly, Marketing Head at EDP Committee.", windowId: "achievements" },
  help: { response: "You can ask: tell me about aryan, show fixly, show kokanam, show project x, show skills, show experience, open contact, show timeline, show achievements." },
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const isSupported = typeof window !== "undefined" && (!!window.SpeechRecognition || !!window.webkitSpeechRecognition)

  const startListening = useCallback(() => {
    if (!isSupported) return
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = "en-US"
    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1]
      setTranscript(result.item(0).transcript.toLowerCase())
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [isSupported])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  return { isListening, transcript, isSupported, startListening, stopListening }
}

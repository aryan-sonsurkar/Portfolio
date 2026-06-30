"use client"

import { useState, useCallback, useRef } from "react"

interface SpeechRecognitionHook {
  isListening: boolean
  transcript: string
  isSupported: boolean
  startListening: () => void
  stopListening: () => void
}

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
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

export const COMMANDS: Record<string, string[]> = {
  "who is aryan": ["hero", "Aryan Sonsurkar is a full-stack developer and founder of Fixly. He builds web applications, AI tools, and automation systems."],
  "tell me about kokanam": ["kokanam", "Kokanam Marketplace is his flagship client project. A full e-commerce marketplace with admin panel, customer portal, and production deployment."],
  "what is fixly": ["fixly", "Fixly is an AI-powered student productivity platform he founded. It helps students manage assignments, deadlines, and productivity with AI assistance."],
  "what is draco": ["draco", "Draco CLI is a modern AI-powered command-line assistant for developers."],
  "show me projects": ["projects", "His featured projects include Kokanam Marketplace, Fixly, and Draco CLI."],
  "show experience": ["experience", "Aryan was Best Performing Intern at Kaevron Technologies and has delivered multiple production client projects."],
  "show skills": ["skills", "Aryan's skills span frontend, backend, AI and automation, databases, cloud, and design tools."],
  "show timeline": ["timeline", "His journey started in 2024 and includes college, internship at Kaevron, Fixly beta, and Kokanam delivery."],
  "contact aryan": ["contact", "You can reach Aryan via email, LinkedIn, or GitHub. He usually responds within 24 hours."],
  "help": ["hero", "You can ask me about Aryan, his projects, experience, skills, or contact information. Try saying 'tell me about kokanam' or 'show me projects'."],
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const isSupported =
    typeof window !== "undefined" &&
    (!!window.SpeechRecognition || !!window.webkitSpeechRecognition)

  const startListening = useCallback(() => {
    if (!isSupported) return

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1]
      const text = result.item(0).transcript.toLowerCase()
      setTranscript(text)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

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

  const processCommand = useCallback(
    (transcript: string): { sectionId: string; response: string } | null => {
      const lower = transcript.toLowerCase().trim()

      for (const [phrase, [sectionId, response]] of Object.entries(COMMANDS)) {
        if (lower.includes(phrase)) {
          return { sectionId, response }
        }
      }

      return null
    },
    []
  )

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    processCommand,
  }
}

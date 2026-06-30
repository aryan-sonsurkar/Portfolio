"use client"

import { useState, useCallback } from "react"
import LoadingScreen from "@/components/LoadingScreen"
import Navigation from "@/components/Navigation"
import VoiceAgent from "@/components/VoiceAgent"
import HeroSection from "@/components/HeroSection"
import KokanamProject from "@/components/KokanamProject"
import OtherProjects from "@/components/OtherProjects"
import TimelineSection from "@/components/TimelineSection"
import SkillsSection from "@/components/SkillsSection"
import ExperienceSection from "@/components/ExperienceSection"
import AboutSection from "@/components/AboutSection"
import ContactSection from "@/components/ContactSection"

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [agentReady, setAgentReady] = useState(false)

  const handleLoadingComplete = useCallback(() => {
    setLoadingComplete(true)
  }, [])

  const handleAgentReady = useCallback(() => {
    setAgentReady(true)
  }, [])

  return (
    <>
      {!loadingComplete && <LoadingScreen onComplete={handleLoadingComplete} />}

      <div className={`transition-opacity duration-700 ${loadingComplete ? "opacity-100" : "opacity-0"}`}>
        <Navigation />
        <main>
          <HeroSection />
          <KokanamProject />
          <OtherProjects />
          <TimelineSection />
          <SkillsSection />
          <ExperienceSection />
          <AboutSection />
          <ContactSection />
        </main>
        <footer className="py-8 text-center">
          <p className="text-xs text-[#52525b] font-mono">ARYAN OS v1.0 &copy; {new Date().getFullYear()}</p>
        </footer>
        <VoiceAgent onReady={handleAgentReady} />
      </div>
    </>
  )
}

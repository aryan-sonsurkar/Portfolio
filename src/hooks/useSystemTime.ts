"use client"

import { useState, useEffect } from "react"

export function useSystemTime() {
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")
  const [uptime, setUptime] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }))
      setDate(now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }))
      setUptime(Math.floor((Date.now() - start) / 1000))
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  return { time, date, uptime }
}

"use client";

import { useEffect, useState } from "react";
import { audioManager } from "@/lib/audio";

export default function MuteButton({ variant = "landing" }: { variant?: "landing" | "hud" }) {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(audioManager.getMuted());
  }, []);

  const handleToggle = () => {
    setMuted(audioManager.toggleMute());
  };

  if (variant === "hud") {
    return (
      <button
        className="hud-kbtn pointer-events-auto text-[10px] tracking-wider opacity-40 hover:opacity-90"
        style={{
          color: "rgba(255,215,0,0.85)",
          background: "none",
          border: "none",
          minHeight: 44,
          padding: "0 4px",
        }}
        onClick={handleToggle}
        aria-pressed={muted}
        aria-label={muted ? "Unmute sound" : "Mute sound"}
      >
        {muted ? "SOUND OFF" : "SOUND ON"}
      </button>
    );
  }

  return (
    <button
      className="simple-sound"
      onClick={handleToggle}
      aria-pressed={muted}
      aria-label={muted ? "Unmute sound" : "Mute sound"}
    >
      {muted ? "Sound off" : "Sound on"}
    </button>
  );
}

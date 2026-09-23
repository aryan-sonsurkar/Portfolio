"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/UI/LoadingScreen";
import HUD from "@/components/UI/HUD";
import MonitorViewerUI from "@/components/UI/MonitorViewerUI";
import WristTeleportHUD from "@/components/UI/WristTeleportHUD";
import PortfolioTrailer from "@/components/UI/PortfolioTrailer";
import MiniMap from "@/components/UI/MiniMap";
import VirtualJoystick from "@/components/UI/VirtualJoystick";
import MobileExploreUI from "@/components/UI/MobileExploreUI";
import DistrictGuide from "@/components/UI/DistrictGuide";
import { useIsMobile } from "@/lib/useIsMobile";
import { useStore } from "@/lib/store";

const Scene = dynamic(() => import("@/components/Experience/Scene"), {
  ssr: false,
});

export default function District({ onExitToPortfolio }: { onExitToPortfolio: (anchor?: string) => void }) {
  const isMobile = useIsMobile();
  const { cameraMode, selectedBuilding, activeScreen, interiorOpen } = useStore();

  useEffect(() => {
    document.body.classList.add("district-mode");
    return () => document.body.classList.remove("district-mode");
  }, []);

  const showJoystick =
    isMobile && cameraMode === "fpv" && !selectedBuilding && !activeScreen && !interiorOpen;

  return (
    <main className="w-screen h-screen overflow-hidden">
      <Scene />
      <LoadingScreen onViewPortfolio={() => onExitToPortfolio("work")} />
      <PortfolioTrailer />
      <HUD />
      <MiniMap />
      <MonitorViewerUI />
      <WristTeleportHUD />
      <MobileExploreUI />
      <DistrictGuide />
      {/* Recruiter escape hatch — always visible, thumb-friendly */}
      <button
        onClick={() => onExitToPortfolio("work")}
        aria-label="Back to portfolio"
        className="fixed z-50 rounded-full px-4"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          top: isMobile ? 60 : 12,
          minHeight: 44,
          background: "rgba(4,6,18,0.85)",
          border: "1px solid rgba(255,215,0,0.35)",
          color: "#ffd700",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: 2,
          backdropFilter: "blur(8px)",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        ◂ VIEW PORTFOLIO
      </button>
      {showJoystick && (
        <VirtualJoystick
          onMove={() => {}}
          onEnd={() => {}}
        />
      )}
    </main>
  );
}

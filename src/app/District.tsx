"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/UI/LoadingScreen";
import HUD from "@/components/UI/HUD";
import MonitorViewerUI from "@/components/UI/MonitorViewerUI";
import WristTeleportHUD from "@/components/UI/WristTeleportHUD";
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
  const { cameraMode, activeScreen } = useStore();

  useEffect(() => {
    document.body.classList.add("district-mode");
    return () => document.body.classList.remove("district-mode");
  }, []);

  // Joystick active in FPV mode whenever full-screen monitor viewer is not open
  const showJoystick = isMobile && cameraMode === "fpv" && !activeScreen;

  return (
    <main className="w-screen h-screen overflow-hidden relative">
      <Scene />
      <LoadingScreen onViewPortfolio={() => onExitToPortfolio("work")} />
      <HUD />
      <MiniMap />
      <MonitorViewerUI />
      <WristTeleportHUD />
      <MobileExploreUI />
      <DistrictGuide />
      {/* Portfolio escape hatch — visible, thumb-friendly on mobile, no layout overlap */}
      <button
        onClick={() => onExitToPortfolio("work")}
        aria-label="Back to portfolio"
        className="fixed z-50 rounded-full px-3.5 py-1.5 transition-transform active:scale-95"
        style={{
          left: isMobile ? 12 : "50%",
          transform: isMobile ? "none" : "translateX(-50%)",
          top: isMobile ? 54 : 12,
          minHeight: isMobile ? 36 : 44,
          background: "rgba(4,6,18,0.88)",
          border: "1px solid rgba(255,215,0,0.4)",
          color: "#ffd700",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: isMobile ? 10 : 11,
          letterSpacing: isMobile ? 1.5 : 2,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          cursor: "pointer",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 18px rgba(0,0,0,0.5)",
        }}
      >
        ◂ PORTFOLIO
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

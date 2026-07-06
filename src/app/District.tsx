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
import { useIsMobile } from "@/lib/useIsMobile";
import { useStore } from "@/lib/store";

const Scene = dynamic(() => import("@/components/Experience/Scene"), {
  ssr: false,
});

export default function District() {
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
      <LoadingScreen />
      <PortfolioTrailer />
      <HUD />
      <MiniMap />
      <MonitorViewerUI />
      <WristTeleportHUD />
      {showJoystick && (
        <VirtualJoystick
          onMove={() => {}}
          onEnd={() => {}}
        />
      )}
    </main>
  );
}

"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/UI/LoadingScreen";
import HUD from "@/components/UI/HUD";
import MonitorViewerUI from "@/components/UI/MonitorViewerUI";
import WristTeleportHUD from "@/components/UI/WristTeleportHUD";
import PortfolioTrailer from "@/components/UI/PortfolioTrailer";

const Scene = dynamic(() => import("@/components/Experience/Scene"), {
  ssr: false,
});

export default function District() {
  useEffect(() => {
    document.body.classList.add("district-mode");
    return () => document.body.classList.remove("district-mode");
  }, []);

  return (
    <main className="w-screen h-screen overflow-hidden">
      <Scene />
      <LoadingScreen />
      <PortfolioTrailer />
      <HUD />
      <MonitorViewerUI />
      <WristTeleportHUD />
    </main>
  );
}

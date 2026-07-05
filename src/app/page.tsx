"use client";

import dynamic from "next/dynamic";
import LoadingScreen from "@/components/UI/LoadingScreen";
import BuildingModal from "@/components/UI/BuildingModal";
import HUD from "@/components/UI/HUD";

const Scene = dynamic(() => import("@/components/Experience/Scene"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hidden">
      <Scene />
      <LoadingScreen />
      <HUD />
      <BuildingModal />
    </main>
  );
}

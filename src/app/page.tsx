"use client";

import dynamic from "next/dynamic";
import LoadingScreen from "@/components/UI/LoadingScreen";
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
    </main>
  );
}
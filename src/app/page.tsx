"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import LandingPage from "@/components/UI/LandingPage";

const District = dynamic(() => import("./District"), { ssr: false });

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [anchor, setAnchor] = useState<string | null>(null);

  const exitToPortfolio = useCallback((target?: string) => {
    setAnchor(target ?? "work");
    setEntered(false);
  }, []);

  if (!entered) {
    return (
      <MotionConfig reducedMotion="user">
        <LandingPage
          onEnterDistrict={() => {
            setAnchor(null);
            setEntered(true);
          }}
          anchor={anchor}
        />
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <District onExitToPortfolio={exitToPortfolio} />
    </MotionConfig>
  );
}

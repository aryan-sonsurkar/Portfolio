"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import LandingPage from "@/components/UI/LandingPage";

const District = dynamic(() => import("./District"), { ssr: false });

export default function Home() {
  const [entered, setEntered] = useState(false);

  if (!entered) {
    return <LandingPage onEnterDistrict={() => setEntered(true)} />;
  }

  return <District />;
}

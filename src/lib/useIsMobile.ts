"use client";

import { useEffect, useState } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(isMobileDevice());
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

/** Shared mobile detection — width, touch, UA. Single source of truth. */
export function isMobileDevice() {
  if (typeof window === "undefined") return false;
  const smallScreen = window.innerWidth < 768;
  const touch =
    "ontouchstart" in window || (navigator.maxTouchPoints ?? 0) > 0;
  const mobileUA =
    /android|iphone|ipad|ipod|mobile|tablet/i.test(navigator.userAgent || "");
  // Treat as mobile if small screen + (touch or mobile UA), or any mobile UA on touch device
  return (smallScreen && touch) || (mobileUA && touch) || smallScreen;
}

/** Low-power / low-memory device check for aggressive quality cuts. */
export function isLowPowerDevice() {
  if (typeof window === "undefined") return false;
  try {
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      hardwareConcurrency?: number;
    };
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) return true;
    if (
      typeof nav.hardwareConcurrency === "number" &&
      nav.hardwareConcurrency <= 4
    )
      return true;
  } catch {
    /* ignore */
  }
  return false;
}

/** Hook returning quality tier for 3D scene scaling. */
export function useMobileQuality() {
  const isMobile = useIsMobile();
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    setIsLowPower(isLowPowerDevice());
  }, []);

  return { isMobile, isLowPower, lowQuality: isMobile || isLowPower };
}

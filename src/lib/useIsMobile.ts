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

/** Synchronous reduced-motion check (safe for event handlers / effects). */
export function isReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function")
    return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Reactive reduced-motion hook for components. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function")
      return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Effective perf flag: explicit override wins, otherwise device detection.
 * Reads localStorage so non-reactive 3D code stays correct across remounts.
 * Scene remounts the Canvas on qualityMode change (key={qualityMode}).
 */
export function getEffectiveLowQuality() {
  if (typeof window !== "undefined") {
    try {
      const saved = window.localStorage?.getItem("district-quality");
      if (saved === "high") return false;
      if (saved === "performance") return true;
    } catch {
      /* ignore */
    }
  }
  return isMobileDevice() || isLowPowerDevice();
}

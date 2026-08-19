"use client";

import * as THREE from "three";

// Shared bounded cache for monitor SVGs — prevents duplicate fetches and
// caps GPU memory (evicted textures are disposed).
const CACHE_LIMIT = 24;
const textureCache = new Map<string, THREE.CanvasTexture>();

export function getCachedMonitorTexture(src: string): THREE.CanvasTexture | null {
  const tex = textureCache.get(src);
  if (tex) {
    // Refresh recency so the most-recently-used entry survives eviction
    textureCache.delete(src);
    textureCache.set(src, tex);
  }
  return tex ?? null;
}

export function cacheMonitorTexture(src: string, tex: THREE.CanvasTexture): void {
  if (textureCache.has(src)) textureCache.delete(src);
  textureCache.set(src, tex);

  while (textureCache.size > CACHE_LIMIT) {
    const oldestKey = textureCache.keys().next().value as string;
    const oldest = textureCache.get(oldestKey);
    if (oldest) oldest.dispose();
    textureCache.delete(oldestKey);
  }
}

export async function loadMonitorTexture(
  src: string
): Promise<THREE.CanvasTexture> {
  const cached = getCachedMonitorTexture(src);
  if (cached) return cached;

  const res = await fetch(src);
  if (!res.ok) throw new Error(`Monitor SVG fetch failed: ${res.status}`);
  const svgText = await res.text();
  const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.crossOrigin = "anonymous";
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error(`SVG render failed: ${src}`));
      el.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    canvas.getContext("2d")!.drawImage(img, 0, 0, 1920, 1080);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    tex.needsUpdate = true;

    cacheMonitorTexture(src, tex);
    return tex;
  } finally {
    URL.revokeObjectURL(url);
  }
}
import { create } from "zustand";
import type { MonitorConfig } from "@/config/monitors";
import { BUILDINGS } from "../components/Buildings/BuildingData";

const readIdList = (key: string): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage?.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === "string").slice(0, 64);
  } catch {
    return [];
  }
};

const writeIdList = (key: string, list: string[]) => {
  try {
    window.localStorage?.setItem(key, JSON.stringify(list));
  } catch {
    /* private mode */
  }
};

export type CameraMode = "orbit" | "focused" | "intro" | "fpv" | "screen";
export type TimeOfDay = "morning" | "golden" | "night" | "late";
export type QualityMode = "auto" | "performance" | "high";

interface AppState {
  cameraMode: CameraMode;
  focusedBuilding: string | null;
  selectedBuilding: string | null;
  interiorOpen: boolean;
  introComplete: boolean;
  loadingComplete: boolean;
  introProgress: number;
  hoveredBuilding: string | null;
  weatherActive: boolean;
  blueprintMode: boolean;
  achievements: string[];
  activeScreen: string | null;
  activeMonitor: MonitorConfig | null;
  activeRoom: string | null;
  timeOfDay: TimeOfDay;
  exitPosition: [number, number, number];
  exitRotation: number;
  preFocusPosition: [number, number, number] | null;
  preFocusRotation: number | null;
  teleportOpen: boolean;
  nearbyNpc: string | null;
  dialogNpc: string | null;
  talkedNpcs: string[];
  visitedBuildings: string[];
  flyoverActive: boolean;
  flyoverTarget: [number, number, number] | null;
  qualityMode: QualityMode;

  setCameraMode: (mode: CameraMode) => void;
  focusBuilding: (id: string) => void;
  unfocusBuilding: () => void;
  enterBuilding: (id: string) => void;
  leaveBuilding: () => void;
  completeIntro: () => void;
  completeLoading: () => void;
  setIntroProgress: (progress: number) => void;
  setHoveredBuilding: (id: string | null) => void;
  toggleWeather: () => void;
  setBlueprintMode: (active: boolean) => void;
  addAchievement: (id: string) => void;
  addVisitedBuilding: (id: string) => void;
  setActiveScreen: (id: string | null, monitor?: MonitorConfig | null) => void;
  setActiveRoom: (id: string | null) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  setExitPosition: (pos: [number, number, number], rot: number) => void;
  setPreFocusPosition: (pos: [number, number, number], rot: number) => void;
  setTeleportOpen: (open: boolean) => void;
  setNearbyNpc: (id: string | null) => void;
  openNpcDialog: (id: string) => void;
  closeNpcDialog: () => void;
  markNpcTalked: (id: string) => void;
  setFlyover: (active: boolean, target?: [number, number, number]) => void;
  teleportToBuilding: (buildingId: string) => void;
  setQualityMode: (mode: QualityMode) => void;
}

export const useStore = create<AppState>((set) => ({
  cameraMode: "intro",
  focusedBuilding: null,
  selectedBuilding: null,
  interiorOpen: false,
  introComplete: false,
  loadingComplete: false,
  introProgress: 0,
  hoveredBuilding: null,
  weatherActive: false,
  blueprintMode: false,
  activeScreen: null,
  activeMonitor: null,
  activeRoom: null,
  timeOfDay: "golden",
  exitPosition: [0, 1.6, 6],
  exitRotation: 0,
  preFocusPosition: null,
  preFocusRotation: null,
  teleportOpen: false,
  nearbyNpc: null,
  dialogNpc: null,
  talkedNpcs: readIdList("district-npcs"),
  visitedBuildings: readIdList("district-visited"),
  flyoverActive: false,
  flyoverTarget: null,
  qualityMode: (typeof window !== "undefined" && (window.localStorage?.getItem("district-quality") as QualityMode | null)) || "auto",
  achievements: readIdList("district-achievements"),

  setCameraMode: (mode) => set({ cameraMode: mode }),

  focusBuilding: (id) =>
    set({ focusedBuilding: id, cameraMode: "focused" }),

  unfocusBuilding: () =>
    set({ focusedBuilding: null, cameraMode: "orbit" }),

  enterBuilding: (id) =>
    set((s) => ({
      selectedBuilding: id,
      interiorOpen: true,
      cameraMode: "fpv",
      activeRoom: "lobby",
      activeScreen: null,
    })),

  leaveBuilding: () =>
    set({
      selectedBuilding: null,
      interiorOpen: false,
      cameraMode: "fpv",
      activeRoom: null,
      activeScreen: null,
      focusedBuilding: null,
    }),

  completeIntro: () =>
    set({ introComplete: true, cameraMode: "fpv" }),

  completeLoading: () => set({ loadingComplete: true }),

  setIntroProgress: (progress) => set({ introProgress: progress }),

  setHoveredBuilding: (id) => set({ hoveredBuilding: id }),

  toggleWeather: () => set((s) => ({ weatherActive: !s.weatherActive })),

  setBlueprintMode: (active) => set({ blueprintMode: active }),

  addAchievement: (id) => set((s) => {
    if (s.achievements.includes(id)) return s;
    const next = [...s.achievements, id];
    writeIdList("district-achievements", next);
    return { achievements: next };
  }),

  addVisitedBuilding: (id) => set((s) => {
    if (s.visitedBuildings.includes(id)) return s;
    const next = [...s.visitedBuildings, id];
    writeIdList("district-visited", next);
    return { visitedBuildings: next };
  }),

  setActiveScreen: (id, monitor) => set((s) => {
    if (id) {
      return { activeScreen: id, activeMonitor: monitor ?? null, cameraMode: "screen" as CameraMode };
    } else {
      return { activeScreen: null, activeMonitor: null, cameraMode: "fpv" as CameraMode, preFocusPosition: null, preFocusRotation: null };
    }
  }),

  setActiveRoom: (id) => set({ activeRoom: id }),

  setTimeOfDay: (time) => set({ timeOfDay: time }),

  setExitPosition: (pos, rot) => set({ exitPosition: pos, exitRotation: rot }),
  setPreFocusPosition: (pos, rot) => set({ preFocusPosition: pos, preFocusRotation: rot }),

  setTeleportOpen: (open) => set({ teleportOpen: open }),
  setNearbyNpc: (id) => set((s) => (s.nearbyNpc === id ? s : { nearbyNpc: id })),
  openNpcDialog: (id) => set({ nearbyNpc: id, dialogNpc: id }),
  closeNpcDialog: () => set({ dialogNpc: null }),
  markNpcTalked: (id) => set((s) => {
    if (s.talkedNpcs.includes(id)) return s;
    const next = [...s.talkedNpcs, id];
    writeIdList("district-npcs", next);
    return { talkedNpcs: next };
  }),
  setQualityMode: (mode) => {
    try {
      window.localStorage?.setItem("district-quality", mode);
    } catch {
      /* private mode */
    }
    return set({ qualityMode: mode });
  },
  setFlyover: (active, target) => set({ flyoverActive: active, flyoverTarget: target ?? null }),

  teleportToBuilding: (buildingId) => {
    const building = BUILDINGS.find((b) => b.id === buildingId);
    if (!building) return;

    const exitPos: [number, number, number] = [
      building.position[0],
      1.6,
      building.position[2] + building.scale[2] / 2 + 4.0,
    ];

    set({
      teleportOpen: false,
      exitPosition: exitPos,
      exitRotation: 0,
      selectedBuilding: null,
      interiorOpen: false,
      activeRoom: null,
      activeScreen: null,
      focusedBuilding: null,
      flyoverActive: true,
      flyoverTarget: exitPos,
    });
  },
}));

// Module-level FPV state for non-reactive access between CharacterController and ImageMonitor
// This avoids triggering re-renders when the FPV position updates
export const fpvState = {
  position: [0, 1.6, 6] as [number, number, number],
  yaw: Math.PI,
};

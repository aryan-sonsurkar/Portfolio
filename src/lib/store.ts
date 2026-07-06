import { create } from "zustand";
import type { MonitorConfig } from "@/config/monitors";
import { BUILDINGS } from "../components/Buildings/BuildingData";

export type CameraMode = "orbit" | "focused" | "intro" | "fpv" | "screen";
export type TimeOfDay = "morning" | "golden" | "night" | "late";

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
  setActiveScreen: (id: string | null, monitor?: MonitorConfig | null) => void;
  setActiveRoom: (id: string | null) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  setExitPosition: (pos: [number, number, number], rot: number) => void;
  setPreFocusPosition: (pos: [number, number, number], rot: number) => void;
  setTeleportOpen: (open: boolean) => void;
  teleportToBuilding: (buildingId: string) => void;
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
  achievements: [],
  activeScreen: null,
  activeMonitor: null,
  activeRoom: null,
  timeOfDay: "golden",
  exitPosition: [0, 1.6, 6],
  exitRotation: 0,
  preFocusPosition: null,
  preFocusRotation: null,
  teleportOpen: false,

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
    return { achievements: [...s.achievements, id] };
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
      cameraMode: "fpv",
    });
  },
}));

// Module-level FPV state for non-reactive access between CharacterController and ImageMonitor
// This avoids triggering re-renders when the FPV position updates
export const fpvState = {
  position: [0, 1.6, 6] as [number, number, number],
  yaw: Math.PI,
};

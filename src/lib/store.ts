import { create } from "zustand";

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
  activeRoom: string | null;
  timeOfDay: TimeOfDay;
  exitPosition: [number, number, number];
  exitRotation: number;

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
  setActiveScreen: (id: string | null) => void;
  setActiveRoom: (id: string | null) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  setExitPosition: (pos: [number, number, number], rot: number) => void;
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
  activeRoom: null,
  timeOfDay: "golden",
  exitPosition: [0, 1.6, 6],
  exitRotation: 0,

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

  setActiveScreen: (id) => set((s) => ({
    activeScreen: id,
    cameraMode: id ? "screen" : "fpv",
  })),

  setActiveRoom: (id) => set({ activeRoom: id }),

  setTimeOfDay: (time) => set({ timeOfDay: time }),

  setExitPosition: (pos, rot) => set({ exitPosition: pos, exitRotation: rot }),
}));

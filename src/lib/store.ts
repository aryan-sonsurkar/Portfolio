import { create } from "zustand";

export type CameraMode = "orbit" | "focused" | "intro";

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

  setCameraMode: (mode) => set({ cameraMode: mode }),

  focusBuilding: (id) =>
    set({ focusedBuilding: id, cameraMode: "focused" }),

  unfocusBuilding: () =>
    set({ focusedBuilding: null, cameraMode: "orbit" }),

  enterBuilding: (id) =>
    set({ selectedBuilding: id, interiorOpen: true, cameraMode: "focused" }),

  leaveBuilding: () =>
    set({ selectedBuilding: null, interiorOpen: false, cameraMode: "orbit" }),

  completeIntro: () =>
    set({ introComplete: true, cameraMode: "orbit" }),

  completeLoading: () => set({ loadingComplete: true }),

  setIntroProgress: (progress) => set({ introProgress: progress }),

  setHoveredBuilding: (id) => set({ hoveredBuilding: id }),

  toggleWeather: () => set((s) => ({ weatherActive: !s.weatherActive })),
}));

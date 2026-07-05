import { create } from "zustand";

export type CameraMode = "orbit" | "focused" | "intro";

interface AppState {
  cameraMode: CameraMode;
  focusedBuilding: string | null;
  introComplete: boolean;
  loadingComplete: boolean;
  hoveredBuilding: string | null;

  setCameraMode: (mode: CameraMode) => void;
  focusBuilding: (id: string) => void;
  unfocusBuilding: () => void;
  completeIntro: () => void;
  completeLoading: () => void;
  setHoveredBuilding: (id: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  cameraMode: "intro",
  focusedBuilding: null,
  introComplete: false,
  loadingComplete: false,
  hoveredBuilding: null,

  setCameraMode: (mode) => set({ cameraMode: mode }),

  focusBuilding: (id) =>
    set({ focusedBuilding: id, cameraMode: "focused" }),

  unfocusBuilding: () =>
    set({ focusedBuilding: null, cameraMode: "orbit" }),

  completeIntro: () =>
    set({ introComplete: true, cameraMode: "orbit" }),

  completeLoading: () => set({ loadingComplete: true }),

  setHoveredBuilding: (id) => set({ hoveredBuilding: id }),
}));

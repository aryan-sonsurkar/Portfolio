export interface BuildingContent {
  title: string;
  subtitle: string;
  paragraphs: string[];
  tags: string[];
  links?: { label: string; url: string; icon?: string }[];
  images?: string[];
}

export interface BuildingConfig {
  id: string;
  name: string;
  subtitle: string;
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  emissive?: string;
  roofColor?: string;
  windowPattern?: "grid" | "stripe" | "dots";
  content: BuildingContent;
}

export interface CityConfig {
  buildings: BuildingConfig[];
  groundColor: string;
  skyColors: { top: string; bottom: string; horizon: string };
  ambientLight: number;
  directionalLightIntensity: number;
}

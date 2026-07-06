export type MonitorAssetType = "image" | "video" | "html" | "iframe" | "component";

export interface MonitorConfig {
  id: string;
  image: string;
  label: string;
  position: [number, number, number];
  rotation?: number;
  width: number;
  height: number;
  emissiveColor: string;
  assetType?: MonitorAssetType;
}

export interface BuildingMonitors {
  room: { floorColor: string; ambientColor: string; ambientIntensity: number };
  ceilingLights: { color: string; x: number; z: number }[];
  monitors: MonitorConfig[];
  desks?: {
    position: [number, number, number];
    size: [number, number, number];
  }[];
  walls?: {
    position: [number, number, number];
    size: [number, number, number];
  }[];
  serverRacks?: [number, number, number][];
}

export const monitorConfig: Record<string, BuildingMonitors> = {
  "modcodes-hq": {
    room: { floorColor: "#12101a", ambientColor: "#b4c6e7", ambientIntensity: 0.5 },
    ceilingLights: [
      { color: "#ffd700", x: -3, z: -1 },
      { color: "#ffd700", x: 3, z: -1 },
      { color: "#3b82f6", x: 0, z: 1 },
    ],
    desks: [
      { position: [-2, 0, -1.2], size: [1.8, 0.07, 0.8] },
      { position: [0, 0, 0], size: [2.2, 0.07, 0.9] },
      { position: [2.5, 0, -1], size: [1.6, 0.07, 0.8] },
    ],
    walls: [
      { position: [0, 2.3, -3], size: [10, 4.8, 0.15] },
      { position: [0, 2.3, 3], size: [10, 4.8, 0.15] },
      { position: [-5, 2.3, 0], size: [0.15, 4.8, 6.2] },
      { position: [5, 2.3, 0], size: [0.15, 4.8, 6.2] },
      { position: [0, 4.75, 0], size: [10.2, 0.15, 6.2] },
      { position: [0, 0, 0], size: [10, 0.12, 6] },
    ],
    serverRacks: [[-4.2, 1.3, -1.8]],
    monitors: [
      {
        id: "modcodes-dash",
        image: "/monitors/hq/github-dashboard.svg",
        label: "MODCODES PRODUCTION",
        position: [-2, 0.8, -1.45],
        width: 1.1,
        height: 0.65,
        emissiveColor: "#ffd700",
      },
      {
        id: "github-repos",
        image: "/monitors/hq/architecture.svg",
        label: "REPOSITORIES",
        position: [-1.5, 0.8, -1.0],
        rotation: -0.2,
        width: 0.8,
        height: 0.5,
        emissiveColor: "#3b82f6",
      },
      {
        id: "modcodes-arch",
        image: "/monitors/hq/architecture.svg",
        label: "SYSTEM ARCHITECTURE",
        position: [0, 0.8, -0.3],
        width: 1.4,
        height: 0.8,
        emissiveColor: "#22c55e",
      },
      {
        id: "sprint-board",
        image: "/monitors/hq/sprint-board.svg",
        label: "SPRINT BOARD",
        position: [0.6, 0.8, 0.15],
        rotation: -0.15,
        width: 0.7,
        height: 0.5,
        emissiveColor: "#f59e0b",
      },
      {
        id: "deploy-dash",
        image: "/monitors/hq/deployment.svg",
        label: "DEPLOYMENT STATUS",
        position: [2.5, 0.8, -1.25],
        width: 1.0,
        height: 0.6,
        emissiveColor: "#22c55e",
      },
      {
        id: "roadmap-wall",
        image: "/monitors/hq/roadmap.svg",
        label: "MODCODES ROADMAP",
        position: [0, 2.4, -2.9],
        width: 3.0,
        height: 1.6,
        emissiveColor: "#3b82f6",
      },
      {
        id: "api-arch",
        image: "/monitors/hq/database-schema.svg",
        label: "API ENDPOINTS",
        position: [-4.9, 2.2, -0.5],
        rotation: Math.PI / 2,
        width: 1.2,
        height: 0.8,
        emissiveColor: "#ec4899",
      },
      {
        id: "db-schema",
        image: "/monitors/hq/database-schema.svg",
        label: "DATABASE SCHEMA",
        position: [4.9, 2.2, -0.5],
        rotation: -Math.PI / 2,
        width: 1.2,
        height: 0.8,
        emissiveColor: "#8b5cf6",
      },
    ],
  },

  "achievement-tower": {
    room: { floorColor: "#0e0a18", ambientColor: "#ffe4b5", ambientIntensity: 0.5 },
    ceilingLights: [
      { color: "#f59e0b", x: -2, z: -1 },
      { color: "#f59e0b", x: 2, z: -1 },
    ],
    desks: [
      { position: [0, 0, -1.5], size: [1.6, 0.07, 0.7] },
    ],
    walls: [
      { position: [0, 2.3, -3], size: [10, 4.8, 0.15] },
      { position: [0, 2.3, 3], size: [10, 4.8, 0.15] },
      { position: [-5, 2.3, 0], size: [0.15, 4.8, 6.2] },
      { position: [5, 2.3, 0], size: [0.15, 4.8, 6.2] },
      { position: [0, 4.75, 0], size: [10.2, 0.15, 6.2] },
      { position: [0, 0, 0], size: [10, 0.12, 6] },
    ],
    monitors: [
      {
        id: "achievements-log",
        image: "/monitors/achievements/internship-certificate.svg",
        label: "ACHIEVEMENT LOG",
        position: [0, 0.8, -1.7],
        width: 1.0,
        height: 0.6,
        emissiveColor: "#f59e0b",
      },
      {
        id: "milestones",
        image: "/monitors/achievements/github-stats.svg",
        label: "MILESTONES",
        position: [0.5, 0.8, -1.3],
        rotation: -0.15,
        width: 0.7,
        height: 0.5,
        emissiveColor: "#22c55e",
      },
      {
        id: "linkedin",
        image: "/monitors/achievements/linkedin-growth.svg",
        label: "LINKEDIN MILESTONES",
        position: [2, 2.4, -2.9],
        width: 1.8,
        height: 1.0,
        emissiveColor: "#0077b5",
      },
      {
        id: "github-milestones",
        image: "/monitors/achievements/github-stats.svg",
        label: "GITHUB STATS",
        position: [4.9, 2.2, -1.5],
        rotation: -Math.PI / 2,
        width: 1.0,
        height: 0.7,
        emissiveColor: "#3b82f6",
      },
      {
        id: "leetcode",
        image: "/monitors/achievements/leetcode.svg",
        label: "LEETCODE",
        position: [-4.9, 2.2, 1],
        rotation: Math.PI / 2,
        width: 1.0,
        height: 0.7,
        emissiveColor: "#f59e0b",
      },
      {
        id: "edp-committee",
        image: "/monitors/achievements/edp-committee.svg",
        label: "EDP COMMITTEE",
        position: [0, 0.8, -0.5],
        rotation: 0.15,
        width: 0.9,
        height: 0.6,
        emissiveColor: "#ffd700",
      },
    ],
  },

  "developer-museum": {
    room: { floorColor: "#0d1210", ambientColor: "#ffe0b2", ambientIntensity: 0.5 },
    ceilingLights: [
      { color: "#ff6b35", x: -2, z: -1 },
      { color: "#22c55e", x: 2, z: -1 },
    ],
    desks: [
      { position: [-2, 0, -1], size: [1.6, 0.07, 0.7] },
    ],
    walls: [
      { position: [0, 2.3, -3], size: [10, 4.8, 0.15] },
      { position: [0, 2.3, 3], size: [10, 4.8, 0.15] },
      { position: [-5, 2.3, 0], size: [0.15, 4.8, 6.2] },
      { position: [5, 2.3, 0], size: [0.15, 4.8, 6.2] },
      { position: [0, 4.75, 0], size: [10.2, 0.15, 6.2] },
      { position: [0, 0, 0], size: [10, 0.12, 6] },
    ],
    monitors: [
      {
        id: "journey",
        image: "/monitors/museum/journey.svg",
        label: "JOURNEY TIMELINE",
        position: [-2, 0.8, -1.2],
        width: 1.0,
        height: 0.6,
        emissiveColor: "#ff6b35",
      },
      {
        id: "first-laptop",
        image: "/monitors/museum/first-laptop.svg",
        label: "FIRST LAPTOP",
        position: [2.5, 1.1, -0.8],
        width: 0.5,
        height: 0.35,
        emissiveColor: "#22c55e",
      },
      {
        id: "full-journey",
        image: "/monitors/museum/timeline.svg",
        label: "THE JOURNEY",
        position: [0, 2.2, -2.9],
        width: 3.5,
        height: 1.8,
        emissiveColor: "#ff6b35",
      },
      {
        id: "clients",
        image: "/monitors/museum/journey.svg",
        label: "CLIENT DELIVERIES",
        position: [-4.9, 2.2, -1],
        rotation: Math.PI / 2,
        width: 1.0,
        height: 0.8,
        emissiveColor: "#22c55e",
      },
      {
        id: "growth",
        image: "/monitors/museum/journey.svg",
        label: "GROWTH",
        position: [4.9, 2.2, -1],
        rotation: -Math.PI / 2,
        width: 1.0,
        height: 0.8,
        emissiveColor: "#3b82f6",
      },
    ],
  },

  "project-factory": {
    room: { floorColor: "#0f1218", ambientColor: "#b4c6e7", ambientIntensity: 0.45 },
    ceilingLights: [
      { color: "#ef4444", x: -2, z: -1 },
      { color: "#3b82f6", x: 2, z: -1 },
    ],
    desks: [
      { position: [-2, 0, -1], size: [1.6, 0.07, 0.7] },
      { position: [2, 0, -1], size: [1.6, 0.07, 0.7] },
    ],
    walls: [
      { position: [0, 2.3, -3], size: [10, 4.8, 0.15] },
      { position: [0, 2.3, 3], size: [10, 4.8, 0.15] },
      { position: [-5, 2.3, 0], size: [0.15, 4.8, 6.2] },
      { position: [5, 2.3, 0], size: [0.15, 4.8, 6.2] },
      { position: [0, 4.75, 0], size: [10.2, 0.15, 6.2] },
      { position: [0, 0, 0], size: [10, 0.12, 6] },
    ],
    serverRacks: [[-4.2, 1.3, -1.8], [4.2, 1.3, -1.8]],
    monitors: [
      {
        id: "vishwanath",
        image: "/monitors/projects/modcodes.svg",
        label: "VISHWANATH INSURANCE",
        position: [-2, 0.8, -1.2],
        width: 1.0,
        height: 0.6,
        emissiveColor: "#22c55e",
      },
      {
        id: "codeshorts",
        image: "/monitors/projects/codeshortsbot.svg",
        label: "CODESHORTS BOT v2",
        position: [2, 0.8, -1.2],
        width: 1.0,
        height: 0.6,
        emissiveColor: "#3b82f6",
      },
      {
        id: "shipped",
        image: "/monitors/projects/modcodes.svg",
        label: "SHIPPED PRODUCTS",
        position: [0, 2.4, -2.9],
        width: 3.0,
        height: 1.5,
        emissiveColor: "#22c55e",
      },
    ],
  },

  "innovation-lab": {
    room: { floorColor: "#050d18", ambientColor: "#bfdbfe", ambientIntensity: 0.45 },
    ceilingLights: [
      { color: "#38bdf8", x: -2, z: -1 },
      { color: "#7c3aed", x: 2, z: -1 },
    ],
    desks: [
      { position: [-2, 0, -1], size: [1.6, 0.07, 0.7] },
      { position: [2, 0, -1], size: [1.6, 0.07, 0.7] },
    ],
    walls: [
      { position: [0, 2.3, -3], size: [10, 4.8, 0.15] },
      { position: [0, 2.3, 3], size: [10, 4.8, 0.15] },
      { position: [-5, 2.3, 0], size: [0.15, 4.8, 6.2] },
      { position: [5, 2.3, 0], size: [0.15, 4.8, 6.2] },
      { position: [0, 4.75, 0], size: [10.2, 0.15, 6.2] },
      { position: [0, 0, 0], size: [10, 0.12, 6] },
    ],
    serverRacks: [[-4.2, 1.3, -1.8], [4.2, 1.3, -1.8]],
    monitors: [
      {
        id: "ai-lab",
        image: "/monitors/innovation/ai-lab.svg",
        label: "AI/ML EXPERIMENTS",
        position: [-2, 0.8, -1.2],
        width: 1.0,
        height: 0.6,
        emissiveColor: "#38bdf8",
      },
      {
        id: "compiler",
        image: "/monitors/innovation/compiler.svg",
        label: "CUSTOM LANG / IDE",
        position: [2, 0.8, -1.2],
        width: 1.0,
        height: 0.6,
        emissiveColor: "#7c3aed",
      },
      {
        id: "research",
        image: "/monitors/innovation/roadmap.svg",
        label: "RESEARCH AGENDA",
        position: [0, 2.4, -2.9],
        width: 3.0,
        height: 1.5,
        emissiveColor: "#38bdf8",
      },
    ],
  },

  "open-source-center": {
    room: { floorColor: "#051208", ambientColor: "#bbf7d0", ambientIntensity: 0.45 },
    ceilingLights: [
      { color: "#22c55e", x: -2, z: -1 },
      { color: "#22c55e", x: 2, z: -1 },
    ],
    desks: [
      { position: [0, 0, -1], size: [1.6, 0.07, 0.7] },
    ],
    walls: [
      { position: [0, 2.3, -3], size: [10, 4.8, 0.15] },
      { position: [0, 2.3, 3], size: [10, 4.8, 0.15] },
      { position: [-5, 2.3, 0], size: [0.15, 4.8, 6.2] },
      { position: [5, 2.3, 0], size: [0.15, 4.8, 6.2] },
      { position: [0, 4.75, 0], size: [10.2, 0.15, 6.2] },
      { position: [0, 0, 0], size: [10, 0.12, 6] },
    ],
    serverRacks: [[-3.8, 1.3, -1.8], [3.8, 1.3, -1.8]],
    monitors: [
      {
        id: "contributions",
        image: "/monitors/opensource/repositories.svg",
        label: "OPEN SOURCE BOARD",
        position: [0, 0.8, -1.2],
        width: 1.0,
        height: 0.6,
        emissiveColor: "#22c55e",
      },
      {
        id: "repos",
        image: "/monitors/opensource/contribution-graph.svg",
        label: "REPOSITORIES",
        position: [0, 2.4, -2.9],
        width: 3.0,
        height: 1.5,
        emissiveColor: "#22c55e",
      },
    ],
  },

  "developer-apartment": {
    room: { floorColor: "#181218", ambientColor: "#ffe4b5", ambientIntensity: 0.5 },
    ceilingLights: [
      { color: "#ff8c42", x: -2, z: -1 },
      { color: "#3b82f6", x: 2, z: 1 },
      { color: "#ffd166", x: 0, z: -2 },
      { color: "#ff8c42", x: -3, z: 1 },
    ],
    desks: [
      { position: [-1.5, 0, -0.8], size: [2.0, 0.06, 0.9] },
    ],
    walls: [
      { position: [0, 2.3, -3], size: [10, 4.8, 0.15] },
      { position: [0, 2.3, 3], size: [10, 4.8, 0.15] },
      { position: [-5, 2.3, 0], size: [0.15, 4.8, 6.2] },
      { position: [5, 2.3, 0], size: [0.15, 4.8, 6.2] },
      { position: [0, 4.75, 0], size: [10.2, 0.15, 6.2] },
      { position: [0, 0, 0], size: [10, 0.12, 6] },
    ],
    monitors: [
      {
        id: "vscode",
        image: "/monitors/apartment/vscode.svg",
        label: "VS CODE EDITOR",
        position: [-1.8, 0.8, -1.05],
        width: 1.1,
        height: 0.65,
        emissiveColor: "#007acc",
      },
      {
        id: "spotify",
        image: "/monitors/apartment/spotify.svg",
        label: "NOW PLAYING",
        position: [-1.0, 0.8, -0.65],
        rotation: -0.2,
        width: 0.6,
        height: 0.45,
        emissiveColor: "#1db954",
      },
      {
        id: "whiteboard",
        image: "/monitors/apartment/ideas-board.svg",
        label: "IDEAS & NOTES",
        position: [0, 2.4, -2.9],
        width: 3.0,
        height: 1.6,
        emissiveColor: "#f5f5f5",
      },
      {
        id: "github-graph",
        image: "/monitors/apartment/vscode.svg",
        label: "CONTRIBUTION GRAPH",
        position: [-4.9, 2.2, -1],
        rotation: Math.PI / 2,
        width: 1.2,
        height: 0.8,
        emissiveColor: "#22c55e",
      },
    ],
  },

  "football-arena": {
    room: { floorColor: "#0a2a0a", ambientColor: "#88ff88", ambientIntensity: 0.5 },
    ceilingLights: [
      { color: "#00ff88", x: -2, z: -1 },
      { color: "#00ff88", x: 2, z: -1 },
    ],
    desks: [
      { position: [-2, 0, -1], size: [1.2, 0.06, 0.6] },
      { position: [2, 0, -1], size: [1.2, 0.06, 0.6] },
    ],
    walls: [
      { position: [0, 2.3, -3], size: [10, 4.8, 0.15] },
      { position: [0, 2.3, 3], size: [10, 4.8, 0.15] },
      { position: [-5, 2.3, 0], size: [0.15, 4.8, 6.2] },
      { position: [5, 2.3, 0], size: [0.15, 4.8, 6.2] },
      { position: [0, 4.75, 0], size: [10.2, 0.15, 6.2] },
      { position: [0, 0, 0], size: [10, 0.12, 6] },
    ],
    monitors: [
      {
        id: "ronaldo-jersey",
        image: "/monitors/football/ronaldo-jersey.svg",
        label: "CR7 JERSEY",
        position: [-2, 1.0, -1.2],
        width: 1.0,
        height: 0.8,
        emissiveColor: "#ffd700",
      },
      {
        id: "trophy-collection",
        image: "/monitors/football/trophy-collection.svg",
        label: "TROPHY COLLECTION",
        position: [2, 1.0, -1.2],
        width: 1.0,
        height: 0.8,
        emissiveColor: "#ffd700",
      },
      {
        id: "football-moments",
        image: "/monitors/football/football-moments.svg",
        label: "FOOTBALL MOMENTS",
        position: [0, 2.4, -2.9],
        width: 3.0,
        height: 1.5,
        emissiveColor: "#00ff88",
      },
      {
        id: "why-football",
        image: "/monitors/football/why-football.svg",
        label: "WHY FOOTBALL?",
        position: [-4.9, 2.2, -1],
        rotation: Math.PI / 2,
        width: 1.0,
        height: 0.8,
        emissiveColor: "#00ff88",
      },
    ],
  },

  "ironman-destiny-lab": {
    room: { floorColor: "#0d0808", ambientColor: "#ff8844", ambientIntensity: 0.5 },
    ceilingLights: [
      { color: "#ff6600", x: -2, z: -1 },
      { color: "#ff4400", x: 2, z: -1 },
    ],
    desks: [
      { position: [-2, 0, -1], size: [1.8, 0.07, 0.8] },
      { position: [2, 0, -1], size: [1.8, 0.07, 0.8] },
    ],
    walls: [
      { position: [0, 2.3, -3], size: [10, 4.8, 0.15] },
      { position: [0, 2.3, 3], size: [10, 4.8, 0.15] },
      { position: [-5, 2.3, 0], size: [0.15, 4.8, 6.2] },
      { position: [5, 2.3, 0], size: [0.15, 4.8, 6.2] },
      { position: [0, 4.75, 0], size: [10.2, 0.15, 6.2] },
      { position: [0, 0, 0], size: [10, 0.12, 6] },
    ],
    serverRacks: [[-4.2, 1.3, -1.8]],
    monitors: [
      {
        id: "arc-reactor",
        image: "/monitors/ironman/arc-reactor.svg",
        label: "ARC REACTOR BLUEPRINT",
        position: [-2, 0.8, -1.2],
        width: 1.0,
        height: 0.6,
        emissiveColor: "#00aaff",
      },
      {
        id: "ironman-glove",
        image: "/monitors/ironman/ironman-glove.svg",
        label: "IRON MAN GLOVE",
        position: [2, 0.8, -1.2],
        width: 1.0,
        height: 0.6,
        emissiveColor: "#ff4400",
      },
      {
        id: "workshop-schematics",
        image: "/monitors/ironman/workshop-schematics.svg",
        label: "WORKSHOP SCHEMATICS",
        position: [0, 2.4, -2.9],
        width: 3.0,
        height: 1.5,
        emissiveColor: "#ff6600",
      },
      {
        id: "prototype-gallery",
        image: "/monitors/ironman/prototype-gallery.svg",
        label: "PROTOTYPE GALLERY",
        position: [-4.9, 2.2, -1],
        rotation: Math.PI / 2,
        width: 1.0,
        height: 0.8,
        emissiveColor: "#ff8800",
      },
    ],
  },

  "future-observatory": {
    room: { floorColor: "#050a14", ambientColor: "#88ccff", ambientIntensity: 0.5 },
    ceilingLights: [
      { color: "#00aaff", x: -2, z: -1 },
      { color: "#0066ff", x: 2, z: -1 },
    ],
    desks: [
      { position: [0, 0, -1], size: [2.0, 0.07, 0.8] },
    ],
    walls: [
      { position: [0, 2.3, -3], size: [10, 4.8, 0.15] },
      { position: [0, 2.3, 3], size: [10, 4.8, 0.15] },
      { position: [-5, 2.3, 0], size: [0.15, 4.8, 6.2] },
      { position: [5, 2.3, 0], size: [0.15, 4.8, 6.2] },
      { position: [0, 4.75, 0], size: [10.2, 0.15, 6.2] },
      { position: [0, 0, 0], size: [10, 0.12, 6] },
    ],
    monitors: [
      {
        id: "vision-board",
        image: "/monitors/observatory/vision-board.svg",
        label: "VISION BOARD",
        position: [0, 0.8, -1.2],
        width: 1.2,
        height: 0.7,
        emissiveColor: "#00aaff",
      },
      {
        id: "roadmap-2026",
        image: "/monitors/observatory/roadmap-2026.svg",
        label: "2026 ROADMAP",
        position: [0, 2.4, -2.9],
        width: 3.0,
        height: 1.5,
        emissiveColor: "#0066ff",
      },
      {
        id: "skills-evolution",
        image: "/monitors/observatory/skills-evolution.svg",
        label: "SKILLS EVOLUTION",
        position: [-4.9, 2.2, -1],
        rotation: Math.PI / 2,
        width: 1.0,
        height: 0.8,
        emissiveColor: "#00ccff",
      },
      {
        id: "career-goals",
        image: "/monitors/observatory/career-goals.svg",
        label: "CAREER GOALS",
        position: [4.9, 2.2, -1],
        rotation: -Math.PI / 2,
        width: 1.0,
        height: 0.8,
        emissiveColor: "#0088ff",
      },
    ],
  },
  "contact-kiosk": {
    room: { floorColor: "#1a0a2a", ambientColor: "#a855f7", ambientIntensity: 0.5 },
    ceilingLights: [
      { color: "#a855f7", x: 0, z: 0 },
    ],
    monitors: [
      {
        id: "contact-links",
        image: "/monitors/contact/contact-links.svg",
        label: "CONTACT LINKS",
        position: [0, 2.2, -2.9],
        width: 2.0,
        height: 1.2,
        emissiveColor: "#a855f7",
      },
      {
        id: "resume-preview",
        image: "/monitors/contact/resume-preview.svg",
        label: "RESUME PREVIEW",
        position: [-1.9, 1.8, 0],
        rotation: Math.PI / 2,
        width: 1.0,
        height: 0.8,
        emissiveColor: "#c084fc",
      },
    ],
  },
};

export interface NpcLine {
  text: string;
}

export interface NpcDef {
  id: string;
  name: string;
  role: string;
  color: string;
  accent: string;
  position: [number, number, number];
  rotation: number;
  lines: NpcLine[];
}

export const NPCS: NpcDef[] = [
  {
    id: "vikram",
    name: "Vikram",
    role: "MODCODES HQ Security",
    color: "#1e3a5f",
    accent: "#38bdf8",
    position: [3.6, 0, 3.4],
    rotation: -0.7,
    lines: [
      { text: "Evening. I watch this building while the boss is out shipping." },
      {
        text: "MODCODES is not a side project — it's a real product. Assignments, AI assistance, local LLMs that don't leak your data. Students use the Beta right now.",
      },
      {
        text: "He built it because he was tired of missed deadlines and disorganized planning himself. Now it guards students instead of me guarding floors.",
      },
      {
        text: "Go inside, the monitors tell the story better than I do. Just don't touch my coffee.",
      },
    ],
  },
  {
    id: "rafiq",
    name: "Rafiq",
    role: "Roastery Chaiwala",
    color: "#7a4a2b",
    accent: "#f59e0b",
    position: [-14.2, 0, -2.4],
    rotation: 1.0,
    lines: [
      { text: "One cutting chai? He takes his with two sugar sachets and a side of git commits." },
      {
        text: "I watched him code in this roastery a hundred days straight. Build in public, he says. So now I announce his compiles like train departures.",
      },
      {
        text: "Months ago he couldn't tell you what a merge conflict was. Then he built git-system from scratch — just to understand it properly.",
      },
      {
        text: "And one LeetCode problem every single week. One. But religiously. Discipline machine, this one.",
      },
    ],
  },
  {
    id: "rohan",
    name: "Rohan",
    role: "CR7 Superfan",
    color: "#8f1d1d",
    accent: "#ef4444",
    position: [10.6, 0, -0.7],
    rotation: -1.57,
    lines: [
      { text: "You see that stadium? Best seat in the district. Look up — the jumbotron plays real match footage." },
      {
        text: "CR7 IS THE GOAT. He framed it on four booths and a stadium banner. That's not decoration, that is belief.",
      },
      {
        text: "Talent without hard work is nothing — it's written on the arena wall. And he actually lives it: ships code AND shows up here.",
      },
      { text: "Now if you'll excuse me, kickoff. SIUUU!" },
    ],
  },
  {
    id: "meghna",
    name: "Meghna",
    role: "Fixly Alumna",
    color: "#134e4a",
    accent: "#22d3ee",
    position: [-8.6, 0, 1.8],
    rotation: 0.6,
    lines: [
      {
        text: "Fixly got me through semesters — assignments, AI assistance, focus sessions, notes, even PDF analysis with screenshot OCR.",
      },
      {
        text: "It's live right now. Not a pitch deck. I still open it every week.",
      },
      {
        text: "Next up he's building Fixly Desktop — Tauri app, FastAPI backend, local-first AI. And ArsPDF: thirty free PDF tools where your files never leave the browser.",
      },
      {
        text: "No paywalls. No accounts. I keep telling him to charge money. He keeps shipping free.",
      },
    ],
  },
  {
    id: "iyer",
    name: "Prof. Iyer",
    role: "Retired Professor",
    color: "#556b2f",
    accent: "#a3e635",
    position: [6.6, 0, -4.9],
    rotation: 0,
    lines: [
      { text: "Ah, a student I recognise — Vidyalankar Polytechnic, Computer Engineering diploma. A good year for the department." },
      {
        text: "Before that, MSCIT — government certification, finished January 2026. First row of the museum next door, if you care to look.",
      },
      {
        text: "What I respect most: he learned Python by building — thirty small tools with his own hands, then OpenCV, then real products. Not copy-paste. Brick by brick.",
      },
      {
        text: "The museum honours his journey honestly. Even the messy chapters. Rare quality, that.",
      },
    ],
  },
  {
    id: "kavya",
    name: "Det. Kavya",
    role: "Night Detective",
    color: "#3b1d5e",
    accent: "#a855f7",
    position: [2.8, 0, -15.2],
    rotation: 0.2,
    lines: [
      { text: "Shh. You're standing in front of the Vault. The surveillance work in there is sealed." },
      {
        text: "Seema Netra. His computer-vision prototype — object tracking, boundary intrusion, loitering detection, evidence snapshots. Full demo by request only.",
      },
      {
        text: "There's a plaque inside. Most visitors walk straight past it. Some of us… collect what's hidden behind it.",
      },
      {
        text: "And if you get explorer status and talk to everyone in this district — we'll know. We always know.",
      },
    ],
  },
];

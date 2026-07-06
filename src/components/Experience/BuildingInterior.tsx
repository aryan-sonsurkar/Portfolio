"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { BUILDINGS } from "../Buildings/BuildingData";

interface BuildingInteriorProps {
  buildingId: string;
}

/** Shared room shell — walls, floor, ceiling */
function RoomShell({ floorColor = "#1a1020" }: { floorColor?: string }) {
  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, 2.3, -3]} receiveShadow>
        <boxGeometry args={[10, 4.8, 0.15]} />
        <meshStandardMaterial color="#0f1218" roughness={0.95} metalness={0.05} />
      </mesh>
      {/* Front wall (behind camera — subtle) */}
      <mesh position={[0, 2.3, 3]} receiveShadow>
        <boxGeometry args={[10, 4.8, 0.15]} />
        <meshStandardMaterial color="#0f1218" roughness={0.95} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-5, 2.3, 0]} receiveShadow>
        <boxGeometry args={[0.15, 4.8, 6.2]} />
        <meshStandardMaterial color="#0d1016" roughness={0.95} />
      </mesh>
      {/* Right wall */}
      <mesh position={[5, 2.3, 0]} receiveShadow>
        <boxGeometry args={[0.15, 4.8, 6.2]} />
        <meshStandardMaterial color="#0d1016" roughness={0.95} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, 4.75, 0]} receiveShadow>
        <boxGeometry args={[10.2, 0.15, 6.2]} />
        <meshStandardMaterial color="#080c12" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Floor */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[10, 0.12, 6]} />
        <meshStandardMaterial color={floorColor} roughness={0.92} metalness={0.04} />
      </mesh>
      {/* Baseboard trim */}
      <mesh position={[0, 0.08, -2.9]}>
        <boxGeometry args={[9.8, 0.16, 0.06]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-4.9, 0.08, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[6, 0.16, 0.06]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[4.9, 0.08, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[6, 0.16, 0.06]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.18} />
      </mesh>
    </group>
  );
}

/** Ceiling light strip */
function CeilingLight({ color = "#ffd700", x = 0, z = 0 }: { color?: string; x?: number; z?: number }) {
  return (
    <group position={[x, 4.6, z]}>
      <mesh>
        <boxGeometry args={[1.6, 0.06, 0.18]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
      </mesh>
      <pointLight color={color} intensity={6} distance={7} decay={2} />
    </group>
  );
}

/** Desk with monitor */
function Desk({
  position,
  rotation = 0,
  monitorColor = "#0f2040",
  monitorLabel,
  monitorContent,
}: {
  position: [number, number, number];
  rotation?: number;
  monitorColor?: string;
  monitorLabel?: string;
  monitorContent?: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const { setActiveScreen } = useStore();

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Desk surface */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[1.8, 0.07, 0.8]} />
        <meshStandardMaterial color="#1c1c24" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Desk legs */}
      {([-0.8, 0.8] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 0.36, 0]} castShadow>
          <boxGeometry args={[0.07, 0.72, 0.72]} />
          <meshStandardMaterial color="#111118" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {/* Monitor stand */}
      <mesh position={[0, 0.9, -0.2]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.3, 8]} />
        <meshStandardMaterial color="#222230" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Monitor screen */}
      <mesh
        position={[0, 1.3, -0.22]}
        onPointerEnter={() => { document.body.style.cursor = "pointer"; setHovered(true); }}
        onPointerLeave={() => { document.body.style.cursor = "default"; setHovered(false); }}
        onClick={() => monitorLabel && setActiveScreen(monitorLabel)}
      >
        <boxGeometry args={[1.1, 0.65, 0.04]} />
        <meshStandardMaterial
          color={monitorColor}
          emissive={monitorColor}
          emissiveIntensity={hovered ? 0.6 : 0.35}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>
      {/* Monitor bezel */}
      <mesh position={[0, 1.3, -0.2]}>
        <boxGeometry args={[1.15, 0.7, 0.03]} />
        <meshStandardMaterial color="#111118" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Html monitor overlay */}
      {monitorContent && (
        <Html
          transform
          occlude
          position={[0, 1.3, -0.19]}
          style={{ width: "340px", height: "200px", pointerEvents: "none" }}
          scale={0.017}
        >
          {monitorContent}
        </Html>
      )}
      {/* Chair */}
      <mesh position={[0, 0.5, 0.6]} castShadow>
        <boxGeometry args={[0.7, 0.06, 0.7]} />
        <meshStandardMaterial color="#1a1a22" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.82, 0.95]} castShadow>
        <boxGeometry args={[0.7, 0.65, 0.06]} />
        <meshStandardMaterial color="#1a1a22" roughness={0.7} />
      </mesh>
    </group>
  );
}

/** Bookshelf / server rack */
function ServerRack({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.5, 2.6, 0.4]} />
        <meshStandardMaterial color="#0d0f14" metalness={0.7} roughness={0.3} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[0, -1.1 + i * 0.42, 0.19]}>
          <boxGeometry args={[0.42, 0.08, 0.06]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? "#22c55e" : i % 3 === 1 ? "#3b82f6" : "#f59e0b"}
            emissive={i % 3 === 0 ? "#22c55e" : i % 3 === 1 ? "#3b82f6" : "#f59e0b"}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
      {/* Blinking LED */}
      <pointLight position={[0, 0, 0.25]} color="#22c55e" intensity={0.6} distance={1.2} />
    </group>
  );
}

/** Whiteboard / wall screen */
function WallPanel({
  position,
  rotation = 0,
  color,
  label,
  content,
}: {
  position: [number, number, number];
  rotation?: number;
  color: string;
  label: string;
  content?: React.ReactNode;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[3.2, 1.8, 0.06]} />
        <meshStandardMaterial color="#0d0f14" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Screen surface */}
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[3.0, 1.65, 0.02]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} roughness={0.1} />
      </mesh>
      {/* Html overlay */}
      {content && (
        <Html
          transform
          occlude
          position={[0, 0, 0.07]}
          style={{ width: "600px", height: "330px", pointerEvents: "none" }}
          scale={0.005}
        >
          {content}
        </Html>
      )}
      <pointLight color={color} intensity={2} distance={4} position={[0, 0, 0.5]} />
    </group>
  );
}

// ─── MONITOR HTML CONTENT ────────────────────────────────────────────

const ModcodesMonitor = () => (
  <div style={{
    width: "100%", height: "100%", background: "#050a14", color: "#22c55e",
    fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", padding: "12px",
    overflow: "hidden", borderRadius: "4px",
  }}>
    <div style={{ color: "#ffd700", marginBottom: "6px", fontSize: "10px", letterSpacing: "2px" }}>
      MODCODES / PROD SERVER
    </div>
    <div>$ python main.py --mode=production</div>
    <div style={{ color: "#64748b", marginTop: "4px" }}>Initializing FastAPI server...</div>
    <div style={{ color: "#22c55e" }}>✓ SQLite DB connected (856 records)</div>
    <div style={{ color: "#22c55e" }}>✓ Ollama LLM: gemma3:4b loaded</div>
    <div style={{ color: "#22c55e" }}>✓ Speech recognition: ACTIVE</div>
    <div style={{ color: "#3b82f6", marginTop: "4px" }}>→ Server running at http://localhost:8000</div>
    <div style={{ marginTop: "8px", color: "#f59e0b" }}>Active users: 12 | Sessions: 47</div>
    <div style={{ color: "#64748b" }}>Uptime: 3d 14h 22m ░░░░░░░░░░ 99.2%</div>
  </div>
);

const GithubMonitor = () => (
  <div style={{
    width: "100%", height: "100%", background: "#0d1117", color: "#c9d1d9",
    fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", padding: "10px",
    overflow: "hidden", borderRadius: "4px",
  }}>
    <div style={{ color: "#ffd700", marginBottom: "6px", letterSpacing: "2px" }}>ARYAN-SONSURKAR / REPOS</div>
    {["modcodes", "codeshorts-bot", "portfolio", "fixly-ai", "vishwanath-co"].map((repo, i) => (
      <div key={i} style={{ display: "flex", justifyContent: "space-between", margin: "3px 0", color: "#58a6ff" }}>
        <span>▸ {repo}</span>
        <span style={{ color: "#30a14e" }}>{"★".repeat(Math.ceil(Math.random() * 4 + 1))}</span>
      </div>
    ))}
    <div style={{ marginTop: "8px", color: "#3fb950" }}>
      {"█".repeat(14)}{"░".repeat(6)} Contribution streak: 23d
    </div>
  </div>
);

const AchievementsMonitor = () => (
  <div style={{
    width: "100%", height: "100%", background: "#0a0a14", color: "#ffd700",
    fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", padding: "12px",
    overflow: "hidden", borderRadius: "4px",
  }}>
    <div style={{ marginBottom: "8px", letterSpacing: "2px", color: "#f59e0b" }}>ACHIEVEMENT LOG</div>
    {[
      "🏆 Best Intern — Kaevron Technologies",
      "🎖  SIH-2025 Special Recognition",
      "🚀 Client Delivery — Vishwanath Co.",
      "⭐ First-year team leader, 0→1",
      "🔥 23-day commit streak active",
    ].map((item, i) => (
      <div key={i} style={{ margin: "4px 0", color: i === 0 ? "#ffd700" : "#b4b4c8" }}>{item}</div>
    ))}
  </div>
);

const AILabMonitor = () => (
  <div style={{
    width: "100%", height: "100%", background: "#020c18", color: "#38bdf8",
    fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", padding: "10px",
    overflow: "hidden", borderRadius: "4px",
  }}>
    <div style={{ color: "#38bdf8", marginBottom: "6px", letterSpacing: "2px" }}>AI / ML EXPERIMENTS</div>
    {[
      { name: "Custom LLM Finetune", status: "TRAINING", color: "#f59e0b" },
      { name: "OCR Pipeline v3", status: "RUNNING", color: "#22c55e" },
      { name: "Voice Synthesis", status: "TESTING", color: "#3b82f6" },
      { name: "Own IDE (Compiler)", status: "PLANNED", color: "#64748b" },
    ].map((exp, i) => (
      <div key={i} style={{ display: "flex", justifyContent: "space-between", margin: "4px 0" }}>
        <span style={{ color: "#e2e8f0" }}>▸ {exp.name}</span>
        <span style={{ color: exp.color }}>[{exp.status}]</span>
      </div>
    ))}
    <div style={{ marginTop: "8px", color: "#38bdf8" }}>GPU Usage: 72% ████████░░</div>
  </div>
);

const MuseumWallContent = () => (
  <div style={{
    width: "100%", height: "100%", background: "#080a10", color: "#e2e8f0",
    fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", padding: "12px",
    overflow: "hidden",
  }}>
    <div style={{ color: "#f59e0b", marginBottom: "8px", letterSpacing: "2px" }}>JOURNEY TIMELINE</div>
    {[
      { year: "2023", event: "First line of code. Python. Never stopped." },
      { year: "2024", event: "Intern @ Kaevron. Built real systems." },
      { year: "2024", event: "SIH-2025. Led team. Won recognition." },
      { year: "2025", event: "MODCODES v1.0 Beta launched." },
      { year: "2025", event: "Client delivery: Vishwanath Co." },
    ].map((entry, i) => (
      <div key={i} style={{ display: "flex", gap: "12px", margin: "3px 0" }}>
        <span style={{ color: "#ffd700", minWidth: "36px" }}>{entry.year}</span>
        <span style={{ color: i === 4 ? "#22c55e" : "#94a3b8" }}>{entry.event}</span>
      </div>
    ))}
  </div>
);

const OpenSourceWall = () => (
  <div style={{
    width: "100%", height: "100%", background: "#051a0a", color: "#22c55e",
    fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", padding: "12px",
    overflow: "hidden",
  }}>
    <div style={{ color: "#22c55e", marginBottom: "8px", letterSpacing: "2px" }}>OPEN SOURCE BOARD</div>
    <div style={{ color: "#4ade80" }}>github.com/aryan-sonsurkar</div>
    <div style={{ marginTop: "8px" }}>
      {Array.from({ length: 7 }, (_, row) => (
        <div key={row} style={{ display: "flex", gap: "3px", marginBottom: "3px" }}>
          {Array.from({ length: 26 }, (_, col) => (
            <div key={col} style={{
              width: "8px", height: "8px", borderRadius: "2px",
              background: Math.random() > 0.4 ? `rgba(34,197,94,${0.2 + Math.random() * 0.8})` : "#0d1f10",
            }} />
          ))}
        </div>
      ))}
    </div>
    <div style={{ marginTop: "6px", color: "#16a34a" }}>2024 contributions: 847 commits</div>
  </div>
);

// ─── BUILDING-SPECIFIC ROOM CONTENT ──────────────────────────────────

function ModcodesHQ() {
  return (
    <>
      <RoomShell floorColor="#12101a" />
      <CeilingLight color="#ffd700" x={-2} z={-1} />
      <CeilingLight color="#ffd700" x={2} z={-1} />
      <CeilingLight color="#3b82f6" x={0} z={1} />

      {/* Main dev desk with live server monitor */}
      <Desk
        position={[-1.2, 0, -0.8]}
        monitorColor="#0f2040"
        monitorLabel="modcodes-hq"
        monitorContent={<ModcodesMonitor />}
      />
      {/* GitHub desk */}
      <Desk
        position={[1.8, 0, -0.8]}
        rotation={0.15}
        monitorColor="#0d1117"
        monitorLabel="modcodes-github"
        monitorContent={<GithubMonitor />}
      />
      {/* Server rack cluster */}
      <ServerRack position={[-4.1, 1.3, -1.5]} />
      <ServerRack position={[-3.4, 1.3, -1.5]} />
      {/* Wall panel — project roadmap */}
      <WallPanel
        position={[0, 2.5, -2.9]}
        color="#2563eb"
        label="MODCODES ROADMAP"
        content={
          <div style={{
            width: "100%", height: "100%", background: "#030810", color: "#93c5fd",
            fontFamily: "monospace", fontSize: "14px", padding: "18px",
          }}>
            <div style={{ color: "#60a5fa", marginBottom: "10px", fontSize: "16px", letterSpacing: "3px" }}>
              MODCODES ROADMAP
            </div>
            {["v1.0 Beta — LIVE", "v1.1 Web Interface", "v1.2 Mobile App", "v2.0 Multi-user", "v3.0 SaaS Platform"].map((item, i) => (
              <div key={i} style={{ margin: "5px 0", color: i === 0 ? "#22c55e" : i <= 1 ? "#f59e0b" : "#475569" }}>
                {i === 0 ? "✓" : i === 1 ? "→" : "○"} {item}
              </div>
            ))}
          </div>
        }
      />
      <ambientLight intensity={0.25} color="#b4c6e7" />
      <pointLight position={[0, 3.5, 1.5]} intensity={6} color="#ffd166" />
      <pointLight position={[-3, 2.5, -2]} intensity={4} color="#3b82f6" />
    </>
  );
}

function AchievementTower() {
  return (
    <>
      <RoomShell floorColor="#0e0a18" />
      <CeilingLight color="#f59e0b" x={-1.5} z={-0.5} />
      <CeilingLight color="#f59e0b" x={1.5} z={-0.5} />

      {/* Achievement display desk */}
      <Desk
        position={[0, 0, -0.5]}
        monitorColor="#1a0a00"
        monitorLabel="achievement-tower"
        monitorContent={<AchievementsMonitor />}
      />

      {/* Trophy shelf */}
      <mesh position={[-3.5, 1.6, -2.7]} castShadow>
        <boxGeometry args={[2.4, 0.06, 0.35]} />
        <meshStandardMaterial color="#1c1620" roughness={0.6} />
      </mesh>
      {/* Trophies */}
      {[[-4.3, 1.9, -2.7], [-3.5, 1.9, -2.7], [-2.8, 2.05, -2.7]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <cylinderGeometry args={[0.06, 0.09, 0.4, 8]} />
            <meshStandardMaterial color="#b8860b" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.32, 0]}>
            <coneGeometry args={[0.12, 0.22, 8]} />
            <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.6} metalness={0.8} />
          </mesh>
          <pointLight position={[0, 0.4, 0]} color="#ffd700" intensity={0.8} distance={1.5} />
        </group>
      ))}
      {/* Certificate wall panels */}
      <WallPanel
        position={[2.5, 2.5, -2.9]}
        color="#f59e0b"
        label="ACHIEVEMENTS"
        content={<AchievementsMonitor />}
      />
      <ambientLight intensity={0.3} color="#ffe4b5" />
      <pointLight position={[0, 3.5, 0]} intensity={8} color="#f59e0b" />
    </>
  );
}

function DeveloperMuseum() {
  return (
    <>
      <RoomShell floorColor="#0d1210" />
      <CeilingLight color="#ff6b35" x={-1} z={-0.5} />
      <CeilingLight color="#22c55e" x={2} z={-0.5} />

      {/* Timeline terminal */}
      <Desk
        position={[-1.5, 0, -0.8]}
        monitorColor="#0a1200"
        monitorLabel="developer-museum"
        monitorContent={<MuseumWallContent />}
      />
      {/* Side stand */}
      <mesh position={[2.8, 0.6, -1.5]} castShadow>
        <boxGeometry args={[0.8, 1.2, 0.8]} />
        <meshStandardMaterial color="#1a1a22" roughness={0.6} />
      </mesh>
      <mesh position={[2.8, 1.2, -1.5]}>
        <boxGeometry args={[0.7, 0.04, 0.7]} />
        <meshStandardMaterial color="#2a2a32" roughness={0.4} />
      </mesh>
      {/* Wall timeline */}
      <WallPanel
        position={[0, 2.6, -2.9]}
        color="#ff6b35"
        label="JOURNEY"
        content={<MuseumWallContent />}
      />
      <ambientLight intensity={0.25} color="#ffe0b2" />
      <pointLight position={[0, 3.5, 0]} intensity={6} color="#ff6b35" />
      <pointLight position={[2, 2.5, -2]} intensity={3} color="#22c55e" />
    </>
  );
}

function ProjectFactory() {
  return (
    <>
      <RoomShell floorColor="#0f1218" />
      <CeilingLight color="#ef4444" x={-2} z={-0.5} />
      <CeilingLight color="#3b82f6" x={2} z={-0.5} />

      {/* Project build stations */}
      <Desk
        position={[-2, 0, -0.8]}
        monitorColor="#200010"
        monitorLabel="project-factory-1"
        monitorContent={
          <div style={{
            width: "100%", height: "100%", background: "#0a0010", color: "#ef4444",
            fontFamily: "monospace", fontSize: "10px", padding: "10px",
          }}>
            <div style={{ color: "#f87171", marginBottom: "6px", letterSpacing: "2px" }}>VISHWANATH CO. PROJECT</div>
            <div style={{ color: "#94a3b8" }}>$ next build --prod</div>
            <div style={{ color: "#22c55e" }}>✓ Built in 4.2s</div>
            <div style={{ color: "#22c55e" }}>✓ Deployed to Vercel</div>
            <div style={{ color: "#3b82f6" }}>→ Live: vishwanath-malusare.vercel.app</div>
            <div style={{ marginTop: "6px", color: "#f59e0b" }}>Client satisfaction: ★★★★★</div>
          </div>
        }
      />
      <Desk
        position={[2, 0, -0.8]}
        monitorColor="#001020"
        monitorLabel="project-factory-2"
        monitorContent={
          <div style={{
            width: "100%", height: "100%", background: "#001020", color: "#3b82f6",
            fontFamily: "monospace", fontSize: "10px", padding: "10px",
          }}>
            <div style={{ color: "#60a5fa", marginBottom: "6px", letterSpacing: "2px" }}>CODESHORTS BOT v2</div>
            <div style={{ color: "#94a3b8" }}>Pipeline: AUTONOMOUS</div>
            <div style={{ color: "#22c55e" }}>✓ Research: Playwright agent</div>
            <div style={{ color: "#22c55e" }}>✓ Script: Ollama LLM</div>
            <div style={{ color: "#22c55e" }}>✓ Video: FFmpeg assembled</div>
            <div style={{ color: "#f59e0b" }}>→ Queue: 7 videos pending</div>
            <div style={{ color: "#64748b" }}>Human involvement: 0%</div>
          </div>
        }
      />

      {/* Server rack */}
      <ServerRack position={[4.1, 1.3, -2]} />

      {/* Wall display */}
      <WallPanel
        position={[0, 2.5, -2.9]}
        color="#ef4444"
        label="SHIPPED"
        content={
          <div style={{
            width: "100%", height: "100%", background: "#0a0005", color: "#fca5a5",
            fontFamily: "monospace", fontSize: "13px", padding: "18px",
          }}>
            <div style={{ color: "#ef4444", marginBottom: "10px", letterSpacing: "3px" }}>SHIPPED PRODUCTS</div>
            {[
              "Vishwanath Insurance ↗ LIVE",
              "CodeShortsBot v2 ↗ RUNNING",
              "MODCODES Beta ↗ ACTIVE",
              "ARS System Portfolio ↗ LIVE",
            ].map((item, i) => (
              <div key={i} style={{ margin: "5px 0", color: i < 3 ? "#22c55e" : "#60a5fa" }}>✓ {item}</div>
            ))}
          </div>
        }
      />
      <ambientLight intensity={0.2} color="#b4c6e7" />
      <pointLight position={[-2, 3.5, 0]} intensity={6} color="#ef4444" />
      <pointLight position={[2, 3.5, 0]} intensity={6} color="#3b82f6" />
    </>
  );
}

function InnovationLab() {
  return (
    <>
      <RoomShell floorColor="#050d18" />
      <CeilingLight color="#38bdf8" x={-2} z={-1} />
      <CeilingLight color="#7c3aed" x={2} z={-1} />

      <Desk
        position={[-1.5, 0, -0.8]}
        monitorColor="#020c18"
        monitorLabel="innovation-lab"
        monitorContent={<AILabMonitor />}
      />
      <Desk
        position={[2, 0, -0.8]}
        rotation={-0.1}
        monitorColor="#0a0020"
        monitorLabel="innovation-lang"
        monitorContent={
          <div style={{
            width: "100%", height: "100%", background: "#05001a", color: "#a78bfa",
            fontFamily: "monospace", fontSize: "10px", padding: "10px",
          }}>
            <div style={{ color: "#c4b5fd", marginBottom: "6px", letterSpacing: "2px" }}>CUSTOM LANG / IDE</div>
            <div style={{ color: "#64748b" }}>compiler stage: lexer ✓</div>
            <div style={{ color: "#64748b" }}>                 parser ✓</div>
            <div style={{ color: "#f59e0b" }}>                 codegen →</div>
            <div style={{ color: "#475569" }}>                 optimizer ○</div>
            <div style={{ marginTop: "8px", color: "#7c3aed" }}>Status: ACTIVE RESEARCH</div>
          </div>
        }
      />

      {/* Neural network visualization on wall */}
      <WallPanel
        position={[0, 2.5, -2.9]}
        color="#38bdf8"
        label="AI LAB"
        content={<AILabMonitor />}
      />

      <ambientLight intensity={0.2} color="#bfdbfe" />
      <pointLight position={[-2, 3.5, -1]} intensity={7} color="#38bdf8" />
      <pointLight position={[2, 3.5, -1]} intensity={5} color="#7c3aed" />
    </>
  );
}

function OpenSourceCenter() {
  return (
    <>
      <RoomShell floorColor="#051208" />
      <CeilingLight color="#22c55e" x={-1.5} z={-0.5} />
      <CeilingLight color="#22c55e" x={1.5} z={-0.5} />

      <Desk
        position={[0, 0, -0.6]}
        monitorColor="#051208"
        monitorLabel="open-source-center"
        monitorContent={<OpenSourceWall />}
      />

      {/* Contribution heatmap wall */}
      <WallPanel
        position={[0, 2.8, -2.9]}
        color="#22c55e"
        label="REPOS"
        content={<OpenSourceWall />}
      />

      <ServerRack position={[3.8, 1.3, -1.8]} />
      <ServerRack position={[4.3, 1.3, -1.8]} />

      <ambientLight intensity={0.22} color="#bbf7d0" />
      <pointLight position={[0, 3.5, 0]} intensity={7} color="#22c55e" />
    </>
  );
}

function DeveloperApartment() {
  const [diaryOpen, setDiaryOpen] = useState(false);

  return (
    <>
      <RoomShell floorColor="#181218" />
      {/* Warm desk lamp glow */}
      <pointLight position={[0, 3.5, 1.5]} intensity={6} color="#ff8c42" />
      <pointLight position={[-1.5, 1.2, 0.5]} intensity={6} color="#ffd166" decay={2} />
      <pointLight position={[1.5, 0.8, -1.5]} intensity={4} color="#3b82f6" decay={2} />

      {/* Main desk — the centerpiece */}
      <group position={[-0.5, 0, 0]}>
        {/* Desk top */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[2.0, 0.06, 0.9]} />
          <meshStandardMaterial color="#1c1814" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Monitor */}
        <mesh position={[0, 1.25, -0.2]} castShadow>
          <boxGeometry args={[1.2, 0.72, 0.04]} />
          <meshStandardMaterial color="#0f172a" emissive="#0f172a" emissiveIntensity={0.5} roughness={0.1} metalness={0.3} />
        </mesh>
        <mesh position={[0, 1.25, -0.18]}>
          <boxGeometry args={[1.25, 0.77, 0.03]} />
          <meshStandardMaterial color="#111118" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Mechanical keyboard */}
        <mesh position={[0, 0.82, 0.3]} castShadow>
          <boxGeometry args={[0.9, 0.04, 0.28]} />
          <meshStandardMaterial color="#1a1a24" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Keycap rows */}
        {Array.from({ length: 4 }, (_, row) =>
          Array.from({ length: 10 }, (_, col) => (
            <mesh key={`key-${row}-${col}`} position={[-0.36 + col * 0.08, 0.84, 0.38 - row * 0.07]} castShadow>
              <boxGeometry args={[0.06, 0.03, 0.055]} />
              <meshStandardMaterial color={row === 0 || col === 0 ? "#2a2a3a" : "#222230"} roughness={0.5} />
            </mesh>
          ))
        )}
        {/* Coffee mug */}
        <group position={[0.85, 0.8, 0.3]} castShadow>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.04, 0.035, 0.16, 10]} />
            <meshStandardMaterial color="#3a2a1a" roughness={0.7} />
          </mesh>
          {/* Steam */}
          <mesh position={[-0.01, 0.2, 0]}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshBasicMaterial color="#eee" transparent opacity={0.15} />
          </mesh>
          <mesh position={[0.02, 0.25, -0.01]}>
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshBasicMaterial color="#eee" transparent opacity={0.1} />
          </mesh>
        </group>
        {/* Notebook */}
        <mesh position={[-0.75, 0.78, 0.25]} castShadow>
          <boxGeometry args={[0.32, 0.02, 0.22]} />
          <meshStandardMaterial color="#f0e6d8" roughness={0.6} />
        </mesh>
        {/* Pen */}
        <mesh position={[-0.65, 0.79, 0.35]} castShadow rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.01, 0.01, 0.2, 6]} />
          <meshStandardMaterial color="#1a1a3a" metalness={0.5} />
        </mesh>
      </group>

      {/* Laptop on side table */}
      <group position={[2.2, 0.65, -0.8]}>
        <mesh position={[0, 0.03, 0]} castShadow>
          <boxGeometry args={[0.5, 0.02, 0.35]} />
          <meshStandardMaterial color="#111" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.12, 0.12]} castShadow>
          <boxGeometry args={[0.48, 0.18, 0.02]} />
          <meshStandardMaterial color="#0a0a14" roughness={0.3} />
        </mesh>
        {/* Table */}
        <mesh position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.55, 0.55, 0.5]} />
          <meshStandardMaterial color="#141018" roughness={0.6} />
        </mesh>
      </group>

      {/* Anime poster — left wall */}
      <group position={[-4.85, 2.2, -1.5]} rotation={[0, 0, 0]}>
        <mesh>
          <planeGeometry args={[0.7, 1.0]} />
          <meshBasicMaterial>
            <canvasTexture
              attach="map"
              args={[(() => {
                const c = document.createElement("canvas");
                c.width = 140; c.height = 200;
                const ctx = c.getContext("2d");
                if (ctx) {
                  ctx.fillStyle = "#1a0a2e";
                  ctx.fillRect(0, 0, 140, 200);
                  const g = ctx.createLinearGradient(70, 0, 70, 200);
                  g.addColorStop(0, "#ff6b35");
                  g.addColorStop(0.5, "#7c3aed"); 
                  g.addColorStop(1, "#38bdf8");
                  ctx.fillStyle = g;
                  ctx.fillRect(15, 20, 110, 150);
                  ctx.strokeStyle = "#ffffff30";
                  ctx.lineWidth = 0.5;
                  ctx.strokeRect(15, 20, 110, 150);
                  ctx.fillStyle = "#ffffff";
                  ctx.font = "bold 18px sans-serif";
                  ctx.fillText("BUILD", 35, 130);
                  ctx.font = "10px sans-serif";
                  ctx.fillStyle = "#ffffff60";
                  ctx.fillText("The world", 38, 150);
                  ctx.fillText("is waiting.", 35, 165);
                }
                return c;
              })()]}
            />
          </meshBasicMaterial>
        </mesh>
      </group>

      {/* Spotify wall — right wall */}
      <group position={[4.85, 2.0, -1.0]} rotation={[0, 0, 0]}>
        <mesh>
          <planeGeometry args={[1.2, 0.9]} />
          <meshBasicMaterial color="#1a1a2e" />
        </mesh>
        {/* "Now Playing" bar */}
        <mesh position={[0, -0.55, 0.01]}>
          <planeGeometry args={[1.0, 0.15]} />
          <meshBasicMaterial color="#22c55e" transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Bookshelf — back left */}
      <group position={[-3.5, 1.6, -2.85]}>
        <mesh castShadow>
          <boxGeometry args={[1.6, 3.0, 0.25]} />
          <meshStandardMaterial color="#18141a" roughness={0.7} />
        </mesh>
        {Array.from({ length: 4 }, (_, shelf) =>
          Array.from({ length: 4 }, (_, book) => (
            <mesh key={`book-${shelf}-${book}`} position={[-0.55 + book * 0.32, -1.0 + shelf * 0.6, 0.1]} castShadow>
              <boxGeometry args={[0.06, 0.45 + Math.random() * 0.2, 0.08]} />
              <meshStandardMaterial
                color={["#7c3aed", "#3b82f6", "#22c55e", "#ef4444", "#f59e0b", "#ec4899"][(shelf + book * 2) % 6]}
                roughness={0.6}
              />
            </mesh>
          ))
        )}
      </group>

      {/* GitHub contribution graph — wall panel */}
      <group position={[0.5, 2.2, -2.95]}>
        <mesh>
          <planeGeometry args={[2.0, 0.8]} />
          <meshBasicMaterial color="#0d1117" />
        </mesh>
        {/* Contribution dots */}
        {Array.from({ length: 7 }, (_, row) =>
          Array.from({ length: 12 }, (_, col) => (
            <mesh key={`gh-${row}-${col}`} position={[-0.75 + col * 0.13, 0.25 - row * 0.1, 0.01]}>
              <planeGeometry args={[0.08, 0.08]} />
              <meshBasicMaterial
                color={["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"][Math.floor(Math.random() * 5)]}
                transparent
                opacity={0.9}
              />
            </mesh>
          ))
        )}
      </group>

      {/* Diary */}
      <group position={[-2.2, 0.7, 1.8]} rotation={[0, -0.3, 0]}>
        <mesh onClick={() => setDiaryOpen(!diaryOpen)} castShadow>
          <boxGeometry args={[0.35, 0.04, 0.25]} />
          <meshStandardMaterial color="#f5f0e0" roughness={0.7} />
        </mesh>
      </group>

      {/* Window with rain effect — back right */}
      <group position={[3.0, 2.0, -2.7]}>
        <mesh>
          <planeGeometry args={[1.2, 1.4]} />
          <meshBasicMaterial color="#0a0a2a" />
        </mesh>
        {/* Rain streaks */}
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={`rain-${i}`} position={[-0.45 + i * 0.18, 0, 0.01]}>
            <planeGeometry args={[0.01, 0.8]} />
            <meshBasicMaterial color="#7799bb" transparent opacity={0.3} />
          </mesh>
        ))}
      </group>

      {/* Sticky note on wall */}
      <group position={[-2.5, 1.8, -2.7]}>
        <mesh>
          <planeGeometry args={[0.35, 0.25]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.85} />
        </mesh>
      </group>

      <ambientLight intensity={0.2} color="#ffe4b5" />
    </>
  );
}

/** Shared exit door */
function ExitDoor({ onLeave }: { onLeave: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <group position={[3.6, 0, 2.55]}>
      <mesh
        position={[0, 1.1, 0]}
        castShadow
        onPointerEnter={() => { document.body.style.cursor = "pointer"; setHovered(true); }}
        onPointerLeave={() => { document.body.style.cursor = "default"; setHovered(false); }}
        onClick={onLeave}
      >
        <boxGeometry args={[1.0, 2.2, 0.1]} />
        <meshStandardMaterial
          color="#111827"
          emissive="#ffd166"
          emissiveIntensity={hovered ? 0.7 : 0.25}
        />
      </mesh>
      {/* Exit label */}
      <Html
        transform
        occlude
        position={[0, 2.5, 0]}
        style={{ width: "120px", textAlign: "center", pointerEvents: "none" }}
        scale={0.025}
      >
        <div style={{
          color: "#ffd700", fontFamily: "monospace", fontSize: "11px",
          letterSpacing: "3px", textTransform: "uppercase", opacity: hovered ? 1 : 0.5,
          transition: "opacity 0.2s",
        }}>
          [ EXIT ]
        </div>
      </Html>
      <pointLight color="#ffd166" intensity={hovered ? 3 : 1.2} distance={3} position={[0, 1.5, 0.3]} />
    </group>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────

export default function BuildingInterior({ buildingId }: BuildingInteriorProps) {
  const { leaveBuilding, setExitPosition } = useStore();

  // Save exit position so player spawns outside on leave
  useEffect(() => {
    const building = BUILDINGS.find((b) => b.id === buildingId);
    if (building) {
      const exitPos: [number, number, number] = [
        building.position[0],
        1.6,
        building.position[2] + building.scale[2] / 2 + 1.2,
      ];
      setExitPosition(exitPos, Math.PI);
    }
  }, [buildingId, setExitPosition]);

  const renderRoom = () => {
    switch (buildingId) {
      case "modcodes-hq":        return <ModcodesHQ />;
      case "achievement-tower":  return <AchievementTower />;
      case "developer-museum":   return <DeveloperMuseum />;
      case "project-factory":    return <ProjectFactory />;
      case "innovation-lab":     return <InnovationLab />;
      case "open-source-center": return <OpenSourceCenter />;
      case "developer-apartment": return <DeveloperApartment />;
      default:                   return <RoomShell />;
    }
  };

  return (
    <group>
      <color attach="background" args={["#040608"]} />
      {renderRoom()}
      <ExitDoor onLeave={leaveBuilding} />
    </group>
  );
}

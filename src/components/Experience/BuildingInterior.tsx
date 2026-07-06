"use client";

import { useEffect, useMemo, useState } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { BUILDINGS } from "../Buildings/BuildingData";

interface BuildingInteriorProps {
  buildingId: string;
}

function RoomShell({ floorColor = "#1a1020" }: { floorColor?: string }) {
  return (
    <group>
      <mesh position={[0, 2.3, -3]} receiveShadow>
        <boxGeometry args={[10, 4.8, 0.15]} />
        <meshStandardMaterial color="#0f1218" roughness={0.95} metalness={0.05} />
      </mesh>
      <mesh position={[0, 2.3, 3]} receiveShadow>
        <boxGeometry args={[10, 4.8, 0.15]} />
        <meshStandardMaterial color="#0f1218" roughness={0.95} />
      </mesh>
      <mesh position={[-5, 2.3, 0]} receiveShadow>
        <boxGeometry args={[0.15, 4.8, 6.2]} />
        <meshStandardMaterial color="#0d1016" roughness={0.95} />
      </mesh>
      <mesh position={[5, 2.3, 0]} receiveShadow>
        <boxGeometry args={[0.15, 4.8, 6.2]} />
        <meshStandardMaterial color="#0d1016" roughness={0.95} />
      </mesh>
      <mesh position={[0, 4.75, 0]} receiveShadow>
        <boxGeometry args={[10.2, 0.15, 6.2]} />
        <meshStandardMaterial color="#080c12" roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[10, 0.12, 6]} />
        <meshStandardMaterial color={floorColor} roughness={0.92} metalness={0.04} />
      </mesh>
    </group>
  );
}

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

function InteractiveScreen({
  position,
  rotation = 0,
  width = 1.2,
  height = 0.7,
  content,
  label,
  emissiveColor = "#3b82f6",
}: {
  position: [number, number, number];
  rotation?: number;
  width?: number;
  height?: number;
  content: React.ReactNode;
  label: string;
  emissiveColor?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const { setActiveScreen, addAchievement } = useStore();

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh
        position={[0, height / 2 + 0.02, 0]}
        onPointerEnter={() => { document.body.style.cursor = "pointer"; setHovered(true); }}
        onPointerLeave={() => { document.body.style.cursor = "default"; setHovered(false); }}
        onClick={() => { setActiveScreen(label); addAchievement(label); }}
      >
        <boxGeometry args={[width + 0.06, height + 0.06, 0.04]} />
        <meshStandardMaterial color="#111118" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, height / 2 + 0.02, 0.03]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={emissiveColor} transparent opacity={hovered ? 0.95 : 0.85} />
      </mesh>
      <Html transform occlude position={[0, height / 2 + 0.02, 0.04]} scale={0.016} style={{ width: `${width * 100}px`, height: `${height * 100}px`, pointerEvents: "none" }}>
        {content}
      </Html>
      <pointLight color={emissiveColor} intensity={hovered ? 3 : 1.5} distance={4} position={[0, height / 2, 0.5]} />
    </group>
  );
}

function CertificateFrame({
  position,
  title,
  subtitle,
  color,
}: {
  position: [number, number, number];
  title: string;
  subtitle: string;
  color: string;
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.8, 0.6, 0.04]} />
        <meshStandardMaterial color="#1a1a24" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.025]}>
        <planeGeometry args={[0.7, 0.5]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
      <Html transform occlude position={[0, 0, 0.03]} scale={0.012} style={{ width: "140px", height: "100px", pointerEvents: "none" }}>
        <div style={{ background: "#0a0a14", color: "#ffd700", fontFamily: "monospace", fontSize: "8px", padding: "8px", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <div style={{ fontWeight: "bold", fontSize: "9px", marginBottom: "4px" }}>{title}</div>
          <div style={{ color: "#94a3b8", fontSize: "7px" }}>{subtitle}</div>
        </div>
      </Html>
      <pointLight color={color} intensity={0.8} distance={2} position={[0, 0, 0.3]} />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODCODES HQ — Flagship Product
// ═══════════════════════════════════════════════════════════════

function ModcodesHQ() {
  return (
    <>
      <RoomShell floorColor="#12101a" />
      <CeilingLight color="#ffd700" x={-3} z={-1} />
      <CeilingLight color="#ffd700" x={3} z={-1} />
      <CeilingLight color="#3b82f6" x={0} z={1} />

      {/* Dev workstation — left side */}
      <group position={[-2, 0, -1.2]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[1.8, 0.07, 0.8]} />
          <meshStandardMaterial color="#1c1c24" roughness={0.5} metalness={0.3} />
        </mesh>
        <InteractiveScreen position={[0, 0.8, -0.25]} content={<ModcodesDashboard />} label="modcodes-dash" width={1.1} height={0.65} emissiveColor="#ffd700" />
        <InteractiveScreen position={[0.5, 0.8, 0.2]} content={<GithubRepos />} label="github-repos" width={0.8} height={0.5} emissiveColor="#3b82f6" rotation={-0.2} />
      </group>

      {/* Main monitor — center */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[2.2, 0.07, 0.9]} />
          <meshStandardMaterial color="#1c1c24" roughness={0.5} metalness={0.3} />
        </mesh>
        <InteractiveScreen position={[0, 0.8, -0.3]} content={<ModcodesArchitecture />} label="modcodes-arch" width={1.4} height={0.8} emissiveColor="#22c55e" />
        <InteractiveScreen position={[0.6, 0.8, 0.15]} content={<SprintBoard />} label="sprint-board" width={0.7} height={0.5} emissiveColor="#f59e0b" rotation={-0.15} />
      </group>

      {/* Right side — deployment */}
      <group position={[2.5, 0, -1]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[1.6, 0.07, 0.8]} />
          <meshStandardMaterial color="#1c1c24" roughness={0.5} metalness={0.3} />
        </mesh>
        <InteractiveScreen position={[0, 0.8, -0.25]} content={<DeploymentDashboard />} label="deploy-dash" width={1.0} height={0.6} emissiveColor="#22c55e" />
      </group>

      {/* Roadmap wall — back wall */}
      <InteractiveScreen position={[0, 2.4, -2.9]} content={<RoadmapWall />} label="roadmap-wall" width={3.0} height={1.6} emissiveColor="#3b82f6" />

      {/* API Architecture — left wall */}
      <InteractiveScreen position={[-4.9, 2.2, -0.5]} content={<APIArchitecture />} label="api-arch" width={1.2} height={0.8} emissiveColor="#ec4899" rotation={Math.PI / 2} />

      {/* DB Schema — right wall */}
      <InteractiveScreen position={[4.9, 2.2, -0.5]} content={<DBSchema />} label="db-schema" width={1.2} height={0.8} emissiveColor="#8b5cf6" rotation={-Math.PI / 2} />

      {/* Server rack */}
      <ServerRack position={[-4.2, 1.3, -1.8]} />

      <ambientLight intensity={0.25} color="#b4c6e7" />
      <pointLight position={[0, 3.5, 1.5]} intensity={6} color="#ffd166" />
    </>
  );
}

function ModcodesDashboard() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#050a14", color: "#22c55e", fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", padding: "10px", overflow: "hidden", borderRadius: "3px" }}>
      <div style={{ color: "#ffd700", marginBottom: "6px", fontSize: "10px", letterSpacing: "2px" }}>MODCODES PRODUCTION</div>
      <div>$ python main.py --mode=production</div>
      <div style={{ color: "#64748b", marginTop: "4px" }}>FastAPI server initializing...</div>
      <div style={{ color: "#22c55e" }}>✓ SQLite connected (856 records)</div>
      <div style={{ color: "#22c55e" }}>✓ Ollama LLM: gemma3:4b loaded</div>
      <div style={{ color: "#22c55e" }}>✓ Speech recognition: ACTIVE</div>
      <div style={{ color: "#3b82f6", marginTop: "4px" }}>→ http://localhost:8000</div>
      <div style={{ marginTop: "6px", color: "#f59e0b" }}>Active users: 12 | Sessions: 47</div>
      <div style={{ color: "#64748b" }}>Uptime: 3d 14h 22m | 99.2%</div>
    </div>
  );
}

function GithubRepos() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0d1117", color: "#c9d1d9", fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", padding: "8px", overflow: "hidden", borderRadius: "3px" }}>
      <div style={{ color: "#ffd700", marginBottom: "4px", letterSpacing: "2px" }}>REPOSITORIES</div>
      {["modcodes", "codeshorts-bot", "fixly-ai", "vishwanath-co"].map((r, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", margin: "3px 0", color: "#58a6ff" }}>
          <span>▸ {r}</span>
          <span style={{ color: "#3fb950" }}>{"★".repeat(i + 1)}</span>
        </div>
      ))}
      <div style={{ marginTop: "6px", color: "#3fb950" }}>{"█".repeat(10)}{"░".repeat(4)} streak: 23d</div>
    </div>
  );
}

function ModcodesArchitecture() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0a1628", color: "#e2e8f0", fontFamily: "monospace", fontSize: "9px", padding: "10px", overflow: "hidden", borderRadius: "3px" }}>
      <div style={{ color: "#22c55e", marginBottom: "6px", fontSize: "10px", letterSpacing: "2px" }}>SYSTEM ARCHITECTURE</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px", fontSize: "8px" }}>
        <div style={{ border: "1px solid #334155", padding: "4px", borderRadius: "3px", textAlign: "center" }}>Frontend<br/><span style={{ color: "#3b82f6" }}>React + Framer</span></div>
        <div style={{ border: "1px solid #334155", padding: "4px", borderRadius: "3px", textAlign: "center" }}>Backend<br/><span style={{ color: "#22c55e" }}>FastAPI + Py</span></div>
        <div style={{ border: "1px solid #334155", padding: "4px", borderRadius: "3px", textAlign: "center" }}>Database<br/><span style={{ color: "#f59e0b" }}>SQLite</span></div>
      </div>
      <div style={{ marginTop: "6px", border: "1px solid #334155", padding: "4px", borderRadius: "3px", textAlign: "center", fontSize: "8px" }}>Ollama LLM + Speech Recognition</div>
      <div style={{ marginTop: "4px", color: "#64748b", textAlign: "center" }}>→ API Gateway → REST Endpoints</div>
    </div>
  );
}

function SprintBoard() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#1a1420", color: "#e2e8f0", fontFamily: "monospace", fontSize: "8px", padding: "8px", overflow: "hidden", borderRadius: "3px" }}>
      <div style={{ color: "#f59e0b", marginBottom: "4px", letterSpacing: "2px" }}>SPRINT BOARD</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "3px" }}>
        <div><div style={{ color: "#22c55e", marginBottom: "2px" }}>TODO</div><div style={{ border: "1px solid #334155", padding: "3px", borderRadius: "2px", marginBottom: "2px" }}>Voice TTS</div><div style={{ border: "1px solid #334155", padding: "3px", borderRadius: "2px" }}>Mobile App</div></div>
        <div><div style={{ color: "#3b82f6", marginBottom: "2px" }}>DOING</div><div style={{ border: "1px solid #3b82f6", padding: "3px", borderRadius: "2px", marginBottom: "2px" }}>Web Dashboard</div><div style={{ border: "1px solid #334155", padding: "3px", borderRadius: "2px" }}>LLM Fine-tune</div></div>
        <div><div style={{ color: "#a855f7", marginBottom: "2px" }}>DONE</div><div style={{ border: "1px solid #a855f7", padding: "3px", borderRadius: "2px", marginBottom: "2px" }}>Core API</div><div style={{ border: "1px solid #a855f7", padding: "3px", borderRadius: "2px" }}>Speech Input</div></div>
      </div>
    </div>
  );
}

function DeploymentDashboard() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#041a0a", color: "#22c55e", fontFamily: "monospace", fontSize: "9px", padding: "10px", overflow: "hidden", borderRadius: "3px" }}>
      <div style={{ color: "#22c55e", marginBottom: "6px", letterSpacing: "2px" }}>DEPLOYMENT STATUS</div>
      <div style={{ display: "flex", justifyContent: "space-between", margin: "3px 0" }}><span>Production</span><span style={{ color: "#22c55e" }}>● LIVE</span></div>
      <div style={{ display: "flex", justifyContent: "space-between", margin: "3px 0" }}><span>Uptime</span><span style={{ color: "#22c55e" }}>99.2%</span></div>
      <div style={{ display: "flex", justifyContent: "space-between", margin: "3px 0" }}><span>Last deploy</span><span>2h ago</span></div>
      <div style={{ marginTop: "6px", color: "#64748b" }}>Docker containers: 4/4 running</div>
      <div style={{ color: "#22c55e" }}>✓ API ✓ DB ✓ Frontend ✓ Worker</div>
    </div>
  );
}

function RoadmapWall() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#030810", color: "#93c5fd", fontFamily: "monospace", fontSize: "11px", padding: "16px", overflow: "hidden" }}>
      <div style={{ color: "#60a5fa", marginBottom: "10px", fontSize: "14px", letterSpacing: "3px" }}>MODCODES ROADMAP</div>
      {[
        { v: "v1.0 Beta", status: "LIVE", color: "#22c55e" },
        { v: "v1.1 Web Interface", status: "IN PROGRESS", color: "#f59e0b" },
        { v: "v1.2 Mobile App", status: "PLANNED", color: "#64748b" },
        { v: "v2.0 Multi-user", status: "PLANNED", color: "#475569" },
        { v: "v3.0 SaaS Platform", status: "DREAM", color: "#334155" },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", margin: "6px 0", padding: "4px 0", borderBottom: "1px solid #1e293b" }}>
          <span style={{ color: item.color }}>{item.v}</span>
          <span style={{ color: item.color, fontSize: "9px" }}>[{item.status}]</span>
        </div>
      ))}
    </div>
  );
}

function APIArchitecture() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#1a0a1a", color: "#e2e8f0", fontFamily: "monospace", fontSize: "8px", padding: "8px", overflow: "hidden" }}>
      <div style={{ color: "#ec4899", marginBottom: "6px", letterSpacing: "2px" }}>API ENDPOINTS</div>
      {["POST /api/v1/tasks", "GET  /api/v1/schedule", "POST /api/v1/speech", "GET  /api/v1/analytics", "POST /api/v1/llm/chat"].map((ep, i) => (
        <div key={i} style={{ margin: "3px 0", color: i < 2 ? "#22c55e" : i < 4 ? "#3b82f6" : "#f59e0b" }}>{ep}</div>
      ))}
      <div style={{ marginTop: "6px", color: "#64748b" }}>Rate limit: 1000 req/min</div>
    </div>
  );
}

function DBSchema() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0d0a1a", color: "#e2e8f0", fontFamily: "monospace", fontSize: "8px", padding: "8px", overflow: "hidden" }}>
      <div style={{ color: "#8b5cf6", marginBottom: "6px", letterSpacing: "2px" }}>DATABASE SCHEMA</div>
      {["users (id, name, email)", "tasks (id, title, due, user_id)", "schedule (id, date, blocks)", "analytics (id, metric, value)", "speech (id, audio, transcript)"].map((table, i) => (
        <div key={i} style={{ margin: "3px 0", padding: "3px", border: "1px solid #334155", borderRadius: "2px", color: "#8b5cf6" }}>{table}</div>
      ))}
      <div style={{ marginTop: "6px", color: "#64748b" }}>SQLite | 856 records | 12 tables</div>
    </div>
  );
}

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
      <pointLight position={[0, 0, 0.25]} color="#22c55e" intensity={0.6} distance={1.2} />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════
// ACHIEVEMENT TOWER — Evidence & Recognition
// ═══════════════════════════════════════════════════════════════

function AchievementTower() {
  return (
    <>
      <RoomShell floorColor="#0e0a18" />
      <CeilingLight color="#f59e0b" x={-2} z={-1} />
      <CeilingLight color="#f59e0b" x={2} z={-1} />

      {/* Main desk with monitor */}
      <group position={[0, 0, -1.5]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[1.6, 0.07, 0.7]} />
          <meshStandardMaterial color="#1c1c24" roughness={0.5} metalness={0.3} />
        </mesh>
        <InteractiveScreen position={[0, 0.8, -0.2]} content={<AchievementsLog />} label="achievements-log" width={1.0} height={0.6} emissiveColor="#f59e0b" />
        <InteractiveScreen position={[0.5, 0.8, 0.2]} content={<MilestonesTracker />} label="milestones" width={0.7} height={0.5} emissiveColor="#22c55e" rotation={-0.15} />
      </group>

      {/* Certificate wall — left side */}
      <CertificateFrame position={[-4.85, 2.2, -2]} title="Best Intern" subtitle="Kaevron Technologies 2024" color="#ffd700" />
      <CertificateFrame position={[-4.85, 2.2, -0.8]} title="SIH-2025" subtitle="Special Recognition" color="#f59e0b" />
      <CertificateFrame position={[-4.85, 2.2, 0.4]} title="Client Delivery" subtitle="Vishwanath Insurance" color="#3b82f6" />

      {/* Trophy shelf — right side */}
      <mesh position={[4.5, 1.8, -1]} castShadow>
        <boxGeometry args={[2.0, 0.06, 0.35]} />
        <meshStandardMaterial color="#1c1620" roughness={0.6} />
      </mesh>
      {[[-4.2, 2.05, -1], [-3.8, 2.05, -1], [-3.4, 2.15, -1]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.08, 0.35, 8]} />
            <meshStandardMaterial color="#b8860b" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <coneGeometry args={[0.1, 0.18, 8]} />
            <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.6} metalness={0.8} />
          </mesh>
          <pointLight position={[0, 0.35, 0]} color="#ffd700" intensity={0.8} distance={1.5} />
        </group>
      ))}

      {/* LinkedIn milestones — back wall */}
      <InteractiveScreen position={[2, 2.4, -2.9]} content={<LinkedInMilestones />} label="linkedin" width={1.8} height={1.0} emissiveColor="#0077b5" />

      {/* GitHub milestones — right wall */}
      <InteractiveScreen position={[4.9, 2.2, -1.5]} content={<GitHubMilestones />} label="github-milestones" width={1.0} height={0.7} emissiveColor="#3b82f6" rotation={-Math.PI / 2} />

      {/* LeetCode — left wall */}
      <InteractiveScreen position={[-4.9, 2.2, 1]} content={<LeetCodeStats />} label="leetcode" width={1.0} height={0.7} emissiveColor="#f59e0b" rotation={Math.PI / 2} />

      <ambientLight intensity={0.3} color="#ffe4b5" />
      <pointLight position={[0, 3.5, 0]} intensity={8} color="#f59e0b" />
    </>
  );
}

function AchievementsLog() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0a0a14", color: "#ffd700", fontFamily: "monospace", fontSize: "9px", padding: "10px", overflow: "hidden", borderRadius: "3px" }}>
      <div style={{ marginBottom: "6px", letterSpacing: "2px", color: "#f59e0b" }}>ACHIEVEMENT LOG</div>
      {[
        { icon: "🏆", text: "Best Intern — Kaevron Technologies", color: "#ffd700" },
        { icon: "🎖️", text: "SIH-2025 Special Recognition", color: "#f59e0b" },
        { icon: "🚀", text: "Client Delivery — Vishwanath Co.", color: "#22c55e" },
        { icon: "⭐", text: "First-year team leader, 0→1", color: "#3b82f6" },
        { icon: "🔥", text: "23-day commit streak active", color: "#ef4444" },
      ].map((item, i) => (
        <div key={i} style={{ margin: "5px 0", color: item.color }}>{item.icon} {item.text}</div>
      ))}
    </div>
  );
}

function MilestonesTracker() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0a1a0a", color: "#22c55e", fontFamily: "monospace", fontSize: "9px", padding: "8px", overflow: "hidden", borderRadius: "3px" }}>
      <div style={{ marginBottom: "4px", letterSpacing: "2px" }}>MILESTONES</div>
      <div>✓ 100+ GitHub commits</div>
      <div>✓ 5 shipped projects</div>
      <div>✓ 1 client delivered</div>
      <div>✓ 1 hackathon recognized</div>
      <div>✓ 1 intern badge earned</div>
      <div style={{ marginTop: "6px", color: "#64748b" }}>Next: 1000 commits → 10 projects</div>
    </div>
  );
}

function LinkedInMilestones() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0a0e18", color: "#e2e8f0", fontFamily: "monospace", fontSize: "10px", padding: "12px", overflow: "hidden" }}>
      <div style={{ color: "#0077b5", marginBottom: "8px", fontSize: "11px", letterSpacing: "2px" }}>LINKEDIN MILESTONES</div>
      <div style={{ color: "#ffd700", marginBottom: "6px" }}>Best Performing Intern — Kaevron Technologies</div>
      <div style={{ color: "#94a3b8", margin: "3px 0" }}>SIH-2025 — Team Leader Recognition</div>
      <div style={{ color: "#94a3b8", margin: "3px 0" }}>Diploma in Computer Science</div>
      <div style={{ color: "#94a3b8", margin: "3px 0" }}>Building MODCODES — AI Productivity Platform</div>
      <div style={{ marginTop: "8px", color: "#3b82f6" }}>Connection endorsements: Python, FastAPI, React</div>
    </div>
  );
}

function GitHubMilestones() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0d1117", color: "#c9d1d9", fontFamily: "monospace", fontSize: "8px", padding: "8px", overflow: "hidden" }}>
      <div style={{ color: "#ffd700", marginBottom: "4px", letterSpacing: "2px" }}>GITHUB STATS</div>
      <div>Repositories: 12+</div>
      <div>Contributions: 847+</div>
      <div>Stars earned: 24+</div>
      <div>Pull requests: 18+</div>
      <div style={{ marginTop: "4px" }}>{"█".repeat(14)}{"░".repeat(6)}</div>
      <div style={{ color: "#3fb950" }}>Streak: 23 days active</div>
    </div>
  );
}

function LeetCodeStats() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#1a1400", color: "#f59e0b", fontFamily: "monospace", fontSize: "8px", padding: "8px", overflow: "hidden" }}>
      <div style={{ marginBottom: "4px", letterSpacing: "2px" }}>LEETCODE</div>
      <div style={{ color: "#22c55e" }}>Easy: 42 solved</div>
      <div style={{ color: "#f59e0b" }}>Medium: 28 solved</div>
      <div style={{ color: "#ef4444" }}>Hard: 8 solved</div>
      <div style={{ marginTop: "4px" }}>Total: 78 problems</div>
      <div style={{ color: "#64748b" }}>Rating: Top 15%</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DEVELOPER MUSEUM — Journey & Growth
// ═══════════════════════════════════════════════════════════════

function DeveloperMuseum() {
  return (
    <>
      <RoomShell floorColor="#0d1210" />
      <CeilingLight color="#ff6b35" x={-2} z={-1} />
      <CeilingLight color="#22c55e" x={2} z={-1} />

      {/* Main desk with journey terminal */}
      <group position={[-2, 0, -1]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[1.6, 0.07, 0.7]} />
          <meshStandardMaterial color="#1c1c24" roughness={0.5} metalness={0.3} />
        </mesh>
        <InteractiveScreen position={[0, 0.8, -0.2]} content={<JourneyTimeline />} label="journey" width={1.0} height={0.6} emissiveColor="#ff6b35" />
      </group>

      {/* First laptop display — right side */}
      <group position={[2.5, 0.6, -1]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.3, 0.2, 0.4]} />
          <meshStandardMaterial color="#2a2a3a" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.25, 0.15]} castShadow rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.3, 0.2, 0.02]} />
          <meshStandardMaterial color="#111" roughness={0.3} />
        </mesh>
        <InteractiveScreen position={[0, 0.5, 0.2]} content={<FirstLaptopScreen />} label="first-laptop" width={0.5} height={0.35} emissiveColor="#22c55e" />
      </group>

      {/* Timeline wall — back wall */}
      <InteractiveScreen position={[0, 2.2, -2.9]} content={<FullJourneyWall />} label="full-journey" width={3.5} height={1.8} emissiveColor="#ff6b35" />

      {/* Client delivery wall — left wall */}
      <InteractiveScreen position={[-4.9, 2.2, -1]} content={<ClientDeliveries />} label="clients" width={1.0} height={0.8} emissiveColor="#22c55e" rotation={Math.PI / 2} />

      {/* Growth wall — right wall */}
      <InteractiveScreen position={[4.9, 2.2, -1]} content={<GrowthWall />} label="growth" width={1.0} height={0.8} emissiveColor="#3b82f6" rotation={-Math.PI / 2} />

      <ambientLight intensity={0.25} color="#ffe0b2" />
      <pointLight position={[0, 3.5, 0]} intensity={6} color="#ff6b35" />
    </>
  );
}

function JourneyTimeline() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0a0e08", color: "#e2e8f0", fontFamily: "monospace", fontSize: "9px", padding: "10px", overflow: "hidden", borderRadius: "3px" }}>
      <div style={{ color: "#ff6b35", marginBottom: "6px", fontSize: "10px", letterSpacing: "2px" }}>JOURNEY TIMELINE</div>
      {[
        { year: "2023", event: "First line of code. Python. Never stopped.", color: "#22c55e" },
        { year: "2023", event: "Built first project: Calculator CLI", color: "#94a3b8" },
        { year: "2024", event: "Intern @ Kaevron Technologies", color: "#ffd700" },
        { year: "2024", event: "SIH-2025 — Led team, won recognition", color: "#f59e0b" },
        { year: "2025", event: "MODCODES v1.0 Beta launched", color: "#3b82f6" },
        { year: "2025", event: "Client delivery: Vishwanath Co.", color: "#22c55e" },
        { year: "2025", event: "Best Performing Intern", color: "#ffd700" },
      ].map((entry, i) => (
        <div key={i} style={{ display: "flex", gap: "10px", margin: "4px 0", padding: "2px 0", borderBottom: "1px solid #1e293b" }}>
          <span style={{ color: "#ff6b35", minWidth: "36px" }}>{entry.year}</span>
          <span style={{ color: entry.color }}>{entry.event}</span>
        </div>
      ))}
    </div>
  );
}

function FirstLaptopScreen() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0a1a0a", color: "#22c55e", fontFamily: "monospace", fontSize: "7px", padding: "6px", overflow: "hidden" }}>
      <div style={{ color: "#ffd700", marginBottom: "3px" }}>FIRST LAPTOP</div>
      <div>2023 — The beginning</div>
      <div>First program: Hello World</div>
      <div>Language: Python</div>
    </div>
  );
}

function FullJourneyWall() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0a0808", color: "#e2e8f0", fontFamily: "monospace", fontSize: "11px", padding: "16px", overflow: "hidden" }}>
      <div style={{ color: "#ff6b35", marginBottom: "10px", fontSize: "13px", letterSpacing: "3px" }}>THE JOURNEY</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        <div style={{ border: "1px solid #334155", padding: "6px", borderRadius: "4px" }}>
          <div style={{ color: "#22c55e", fontWeight: "bold", marginBottom: "4px" }}>2023</div>
          <div style={{ color: "#94a3b8", fontSize: "9px" }}>First line of code</div>
          <div style={{ color: "#94a3b8", fontSize: "9px" }}>Python — Never stopped</div>
          <div style={{ color: "#94a3b8", fontSize: "9px" }}>Calculator CLI project</div>
        </div>
        <div style={{ border: "1px solid #334155", padding: "6px", borderRadius: "4px" }}>
          <div style={{ color: "#ffd700", fontWeight: "bold", marginBottom: "4px" }}>2024</div>
          <div style={{ color: "#94a3b8", fontSize: "9px" }}>Intern @ Kaevron</div>
          <div style={{ color: "#94a3b8", fontSize: "9px" }}>SIH-2025 Recognition</div>
          <div style={{ color: "#94a3b8", fontSize: "9px" }}>Led first-year team</div>
        </div>
        <div style={{ border: "1px solid #334155", padding: "6px", borderRadius: "4px" }}>
          <div style={{ color: "#3b82f6", fontWeight: "bold", marginBottom: "4px" }}>2025</div>
          <div style={{ color: "#94a3b8", fontSize: "9px" }}>MODCODES Beta</div>
          <div style={{ color: "#94a3b8", fontSize: "9px" }}>Client: Vishwanath Co.</div>
          <div style={{ color: "#94a3b8", fontSize: "9px" }}>Best Performing Intern</div>
        </div>
      </div>
      <div style={{ marginTop: "8px", color: "#64748b", fontSize: "9px" }}>Every failure was a lesson. Every success was earned.</div>
    </div>
  );
}

function ClientDeliveries() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#041a0a", color: "#22c55e", fontFamily: "monospace", fontSize: "8px", padding: "8px", overflow: "hidden" }}>
      <div style={{ marginBottom: "4px", letterSpacing: "2px" }}>CLIENT DELIVERIES</div>
      <div style={{ margin: "4px 0", padding: "4px", border: "1px solid #22c55e", borderRadius: "2px" }}>Vishwanath Insurance</div>
      <div style={{ margin: "4px 0", padding: "4px", border: "1px solid #3b82f6", borderRadius: "2px" }}>CodeShortsBot v2</div>
      <div style={{ marginTop: "6px", color: "#64748b" }}>Status: DELIVERED</div>
      <div style={{ color: "#22c55e" }}>Client satisfaction: ★★★★★</div>
    </div>
  );
}

function GrowthWall() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#060a1a", color: "#e2e8f0", fontFamily: "monospace", fontSize: "8px", padding: "8px", overflow: "hidden" }}>
      <div style={{ color: "#3b82f6", marginBottom: "4px", letterSpacing: "2px" }}>GROWTH</div>
      <div style={{ color: "#22c55e" }}>Skills acquired: 12+</div>
      <div style={{ color: "#3b82f6" }}>Projects completed: 5+</div>
      <div style={{ color: "#f59e0b" }}>Problems solved: 78+</div>
      <div style={{ color: "#8b5cf6" }}>Commits: 847+</div>
      <div style={{ marginTop: "4px", color: "#64748b" }}>Still growing. Still building.</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROJECT FACTORY — Shipped Work
// ═══════════════════════════════════════════════════════════════

function ProjectFactory() {
  return (
    <>
      <RoomShell floorColor="#0f1218" />
      <CeilingLight color="#ef4444" x={-2} z={-1} />
      <CeilingLight color="#3b82f6" x={2} z={-1} />

      {/* Vishwanath project desk */}
      <group position={[-2, 0, -1]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[1.6, 0.07, 0.7]} />
          <meshStandardMaterial color="#1c1c24" roughness={0.5} metalness={0.3} />
        </mesh>
        <InteractiveScreen position={[0, 0.8, -0.2]} content={<VishwanathProject />} label="vishwanath" width={1.0} height={0.6} emissiveColor="#22c55e" />
      </group>

      {/* CodeShortsBot desk */}
      <group position={[2, 0, -1]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[1.6, 0.07, 0.7]} />
          <meshStandardMaterial color="#1c1c24" roughness={0.5} metalness={0.3} />
        </mesh>
        <InteractiveScreen position={[0, 0.8, -0.2]} content={<CodeShortsBot />} label="codeshorts" width={1.0} height={0.6} emissiveColor="#3b82f6" />
      </group>

      {/* Shipped products wall */}
      <InteractiveScreen position={[0, 2.4, -2.9]} content={<ShippedProducts />} label="shipped" width={3.0} height={1.5} emissiveColor="#22c55e" />

      <ServerRack position={[-4.2, 1.3, -1.8]} />
      <ServerRack position={[4.2, 1.3, -1.8]} />

      <ambientLight intensity={0.2} color="#b4c6e7" />
      <pointLight position={[-2, 3.5, 0]} intensity={6} color="#ef4444" />
      <pointLight position={[2, 3.5, 0]} intensity={6} color="#3b82f6" />
    </>
  );
}

function VishwanathProject() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0a0010", color: "#e2e8f0", fontFamily: "monospace", fontSize: "9px", padding: "10px", overflow: "hidden", borderRadius: "3px" }}>
      <div style={{ color: "#22c55e", marginBottom: "6px", letterSpacing: "2px" }}>VISHWANATH INSURANCE</div>
      <div style={{ color: "#64748b" }}>$ next build --prod</div>
      <div style={{ color: "#22c55e" }}>✓ Built in 4.2s</div>
      <div style={{ color: "#22c55e" }}>✓ Deployed to Vercel</div>
      <div style={{ color: "#3b82f6" }}>→ vishwanath-malusare.vercel.app</div>
      <div style={{ marginTop: "6px", color: "#f59e0b" }}>Features: Google Sheets, Responsive, Consultation</div>
      <div style={{ color: "#22c55e" }}>Client: Delivered & Deployed</div>
    </div>
  );
}

function CodeShortsBot() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#001020", color: "#3b82f6", fontFamily: "monospace", fontSize: "9px", padding: "10px", overflow: "hidden", borderRadius: "3px" }}>
      <div style={{ color: "#60a5fa", marginBottom: "6px", letterSpacing: "2px" }}>CODESHORTS BOT v2</div>
      <div style={{ color: "#64748b" }}>Pipeline: AUTONOMOUS</div>
      <div style={{ color: "#22c55e" }}>✓ Research: Playwright agent</div>
      <div style={{ color: "#22c55e" }}>✓ Script: Ollama LLM</div>
      <div style={{ color: "#22c55e" }}>✓ Video: FFmpeg assembled</div>
      <div style={{ color: "#f59e0b" }}>→ Queue: 7 videos pending</div>
      <div style={{ marginTop: "6px", color: "#64748b" }}>Human involvement: 0%</div>
    </div>
  );
}

function ShippedProducts() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0a0005", color: "#fca5a5", fontFamily: "monospace", fontSize: "11px", padding: "16px", overflow: "hidden" }}>
      <div style={{ color: "#ef4444", marginBottom: "10px", letterSpacing: "3px" }}>SHIPPED PRODUCTS</div>
      {[
        { name: "Vishwanath Insurance", status: "LIVE", color: "#22c55e" },
        { name: "CodeShortsBot v2", status: "RUNNING", color: "#3b82f6" },
        { name: "MODCODES Beta", status: "ACTIVE", color: "#f59e0b" },
        { name: "ARS System Portfolio", status: "LIVE", color: "#22c55e" },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", margin: "6px 0", padding: "4px 0", borderBottom: "1px solid #1e293b" }}>
          <span style={{ color: "#e2e8f0" }}>{item.name}</span>
          <span style={{ color: item.color, fontSize: "9px" }}>[{item.status}]</span>
        </div>
      ))}
      <div style={{ marginTop: "10px", color: "#64748b", fontSize: "9px" }}>Not demos. Products that exist in the real world.</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// INNOVATION LAB — Future Builds
// ═══════════════════════════════════════════════════════════════

function InnovationLab() {
  return (
    <>
      <RoomShell floorColor="#050d18" />
      <CeilingLight color="#38bdf8" x={-2} z={-1} />
      <CeilingLight color="#7c3aed" x={2} z={-1} />

      {/* AI/ML research desk */}
      <group position={[-2, 0, -1]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[1.6, 0.07, 0.7]} />
          <meshStandardMaterial color="#1c1c24" roughness={0.5} metalness={0.3} />
        </mesh>
        <InteractiveScreen position={[0, 0.8, -0.2]} content={<AILabDashboard />} label="ai-lab" width={1.0} height={0.6} emissiveColor="#38bdf8" />
      </group>

      {/* Compiler/Language desk */}
      <group position={[2, 0, -1]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[1.6, 0.07, 0.7]} />
          <meshStandardMaterial color="#1c1c24" roughness={0.5} metalness={0.3} />
        </mesh>
        <InteractiveScreen position={[0, 0.8, -0.2]} content={<CompilerProgress />} label="compiler" width={1.0} height={0.6} emissiveColor="#7c3aed" />
      </group>

      {/* Research wall */}
      <InteractiveScreen position={[0, 2.4, -2.9]} content={<ResearchWall />} label="research" width={3.0} height={1.5} emissiveColor="#38bdf8" />

      <ServerRack position={[-4.2, 1.3, -1.8]} />
      <ServerRack position={[4.2, 1.3, -1.8]} />

      <ambientLight intensity={0.2} color="#bfdbfe" />
      <pointLight position={[-2, 3.5, -1]} intensity={7} color="#38bdf8" />
      <pointLight position={[2, 3.5, -1]} intensity={5} color="#7c3aed" />
    </>
  );
}

function AILabDashboard() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#020c18", color: "#38bdf8", fontFamily: "monospace", fontSize: "9px", padding: "10px", overflow: "hidden", borderRadius: "3px" }}>
      <div style={{ color: "#38bdf8", marginBottom: "6px", letterSpacing: "2px" }}>AI/ML EXPERIMENTS</div>
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
      <div style={{ marginTop: "6px", color: "#38bdf8" }}>GPU Usage: 72% ████████░░</div>
    </div>
  );
}

function CompilerProgress() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#05001a", color: "#a78bfa", fontFamily: "monospace", fontSize: "9px", padding: "10px", overflow: "hidden", borderRadius: "3px" }}>
      <div style={{ color: "#c4b5fd", marginBottom: "6px", letterSpacing: "2px" }}>CUSTOM LANG / IDE</div>
      <div style={{ color: "#64748b" }}>compiler stage: lexer ✓</div>
      <div style={{ color: "#64748b" }}>                 parser ✓</div>
      <div style={{ color: "#f59e0b" }}>                 codegen →</div>
      <div style={{ color: "#475569" }}>                 optimizer ○</div>
      <div style={{ marginTop: "8px", color: "#7c3aed" }}>Status: ACTIVE RESEARCH</div>
      <div style={{ color: "#64748b", marginTop: "4px" }}>Goal: A language for teaching</div>
    </div>
  );
}

function ResearchWall() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#020818", color: "#e2e8f0", fontFamily: "monospace", fontSize: "11px", padding: "16px", overflow: "hidden" }}>
      <div style={{ color: "#38bdf8", marginBottom: "10px", fontSize: "13px", letterSpacing: "3px" }}>RESEARCH AGENDA</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <div style={{ border: "1px solid #334155", padding: "6px", borderRadius: "4px" }}>
          <div style={{ color: "#38bdf8", fontWeight: "bold", marginBottom: "4px" }}>AI IDE</div>
          <div style={{ color: "#94a3b8", fontSize: "9px" }}>Plugin-based architecture</div>
          <div style={{ color: "#94a3b8", fontSize: "9px" }}>Local-first, AI-native</div>
        </div>
        <div style={{ border: "1px solid #334155", padding: "6px", borderRadius: "4px" }}>
          <div style={{ color: "#7c3aed", fontWeight: "bold", marginBottom: "4px" }}>LANGUAGE</div>
          <div style={{ color: "#94a3b8", fontSize: "9px" }}>Teaching-focused design</div>
          <div style={{ color: "#94a3b8", fontSize: "9px" }}>Rapid prototyping</div>
        </div>
      </div>
      <div style={{ marginTop: "8px", color: "#64748b", fontSize: "9px" }}>These are not just ideas. They are active projects.</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// OPEN SOURCE CENTER — Community & Contribution
// ═══════════════════════════════════════════════════════════════

function OpenSourceCenter() {
  return (
    <>
      <RoomShell floorColor="#051208" />
      <CeilingLight color="#22c55e" x={-2} z={-1} />
      <CeilingLight color="#22c55e" x={2} z={-1} />

      {/* Main contribution desk */}
      <group position={[0, 0, -1]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[1.6, 0.07, 0.7]} />
          <meshStandardMaterial color="#1c1c24" roughness={0.5} metalness={0.3} />
        </mesh>
        <InteractiveScreen position={[0, 0.8, -0.2]} content={<ContributionBoard />} label="contributions" width={1.0} height={0.6} emissiveColor="#22c55e" />
      </group>

      {/* Repository wall */}
      <InteractiveScreen position={[0, 2.4, -2.9]} content={<RepositoryWall />} label="repos" width={3.0} height={1.5} emissiveColor="#22c55e" />

      <ServerRack position={[-3.8, 1.3, -1.8]} />
      <ServerRack position={[3.8, 1.3, -1.8]} />

      <ambientLight intensity={0.22} color="#bbf7d0" />
      <pointLight position={[0, 3.5, 0]} intensity={7} color="#22c55e" />
    </>
  );
}

function ContributionBoard() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#051a0a", color: "#22c55e", fontFamily: "monospace", fontSize: "9px", padding: "10px", overflow: "hidden", borderRadius: "3px" }}>
      <div style={{ marginBottom: "6px", letterSpacing: "2px" }}>OPEN SOURCE BOARD</div>
      <div style={{ color: "#4ade80" }}>github.com/aryan-sonsurkar</div>
      <div style={{ marginTop: "8px" }}>
        {Array.from({ length: 5 }, (_, row) => (
          <div key={row} style={{ display: "flex", gap: "2px", marginBottom: "2px" }}>
            {Array.from({ length: 20 }, (_, col) => (
              <div key={col} style={{ width: "6px", height: "6px", borderRadius: "1px", background: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"][Math.floor(Math.random() * 5)] }} />
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "6px", color: "#16a34a" }}>2024 contributions: 847 commits</div>
    </div>
  );
}

function RepositoryWall() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#040a08", color: "#22c55e", fontFamily: "monospace", fontSize: "11px", padding: "16px", overflow: "hidden" }}>
      <div style={{ marginBottom: "10px", fontSize: "13px", letterSpacing: "3px" }}>REPOSITORIES</div>
      {[
        { name: "modcodes", desc: "AI productivity platform", lang: "Python" },
        { name: "codeshorts-bot", desc: "Autonomous content pipeline", lang: "Python" },
        { name: "portfolio", desc: "Interactive 3D district", lang: "TypeScript" },
        { name: "fixly-ai", desc: "AI-powered fix suggestions", lang: "Python" },
        { name: "vishwanath-co", desc: "Client insurance website", lang: "Next.js" },
      ].map((repo, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", margin: "6px 0", padding: "4px 0", borderBottom: "1px solid #1e293b" }}>
          <div>
            <div style={{ color: "#58a6ff" }}>▸ {repo.name}</div>
            <div style={{ color: "#64748b", fontSize: "9px" }}>{repo.desc}</div>
          </div>
          <div style={{ color: "#64748b", fontSize: "9px" }}>{repo.lang}</div>
        </div>
      ))}
      <div style={{ marginTop: "8px", color: "#64748b", fontSize: "9px" }}>Building in public. Every repo tells a story.</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DEVELOPER APARTMENT — Personal Space
// ═══════════════════════════════════════════════════════════════

function DeveloperApartment() {
  return (
    <>
      <RoomShell floorColor="#181218" />
      <CeilingLight color="#ff8c42" x={-2} z={-1} />
      <CeilingLight color="#3b82f6" x={2} z={1} />

      {/* Main desk — the heart of the apartment */}
      <group position={[-1.5, 0, -0.8]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[2.0, 0.06, 0.9]} />
          <meshStandardMaterial color="#1c1814" roughness={0.4} metalness={0.2} />
        </mesh>
        <InteractiveScreen position={[-0.3, 0.8, -0.25]} content={<VSCodeScreen />} label="vscode" width={1.1} height={0.65} emissiveColor="#007acc" />
        <InteractiveScreen position={[0.5, 0.8, 0.15]} content={<SpotifyScreen />} label="spotify" width={0.6} height={0.45} emissiveColor="#1db954" rotation={-0.2} />

        {/* Coffee mug */}
        <group position={[0.85, 0.82, 0.3]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.035, 0.14, 10]} />
            <meshStandardMaterial color="#3a2a1a" roughness={0.7} />
          </mesh>
        </group>

        {/* Notebook */}
        <mesh position={[-0.85, 0.78, 0.3]} castShadow>
          <boxGeometry args={[0.32, 0.02, 0.22]} />
          <meshStandardMaterial color="#f0e6d8" roughness={0.6} />
        </mesh>
      </group>

      {/* Whiteboard — back wall */}
      <InteractiveScreen position={[0, 2.4, -2.9]} content={<WhiteboardIdeas />} label="whiteboard" width={3.0} height={1.6} emissiveColor="#f5f5f5" />

      {/* GitHub graph — left wall */}
      <InteractiveScreen position={[-4.9, 2.2, -1]} content={<GitHubGraph />} label="github-graph" width={1.2} height={0.8} emissiveColor="#22c55e" rotation={Math.PI / 2} />

      {/* Bookshelf */}
      <group position={[3.5, 1.6, -2.5]}>
        <mesh castShadow>
          <boxGeometry args={[1.4, 3.0, 0.25]} />
          <meshStandardMaterial color="#18141a" roughness={0.7} />
        </mesh>
        {Array.from({ length: 4 }, (_, shelf) =>
          Array.from({ length: 3 }, (_, book) => (
            <mesh key={`book-${shelf}-${book}`} position={[-0.4 + book * 0.35, -1.0 + shelf * 0.6, 0.1]} castShadow>
              <boxGeometry args={[0.06, 0.42, 0.08]} />
              <meshStandardMaterial color={["#7c3aed", "#3b82f6", "#22c55e", "#ef4444", "#f59e0b", "#ec4899"][(shelf + book) % 6]} roughness={0.6} />
            </mesh>
          ))
        )}
      </group>

      {/* Sticky note — back wall */}
      <group position={[-2.5, 1.8, -2.85]}>
        <mesh>
          <planeGeometry args={[0.4, 0.3]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.85} />
        </mesh>
      </group>

      {/* Window with rain */}
      <group position={[3.0, 2.0, -2.85]}>
        <mesh>
          <planeGeometry args={[1.2, 1.4]} />
          <meshBasicMaterial color="#0a0a2a" />
        </mesh>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={`rain-${i}`} position={[-0.4 + i * 0.16, 0, 0.01]}>
            <planeGeometry args={[0.01, 0.7]} />
            <meshBasicMaterial color="#7799bb" transparent opacity={0.3} />
          </mesh>
        ))}
      </group>

      <ambientLight intensity={0.2} color="#ffe4b5" />
      <pointLight position={[-1, 1.2, 0]} intensity={5} color="#ffd166" />
      <pointLight position={[1.5, 0.8, -1]} intensity={4} color="#3b82f6" />
    </>
  );
}

function VSCodeScreen() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#1e1e1e", color: "#d4d4d4", fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", padding: "8px", overflow: "hidden", borderRadius: "3px" }}>
      <div style={{ color: "#569cd6", marginBottom: "4px" }}>// modcodes/main.py</div>
      <div><span style={{ color: "#c586c0" }}>from</span> <span style={{ color: "#ce9178" }}>fastapi</span> <span style={{ color: "#c586c0" }}>import</span> <span style={{ color: "#dcdcaa" }}>FastAPI</span></div>
      <div><span style={{ color: "#c586c0" }}>from</span> <span style={{ color: "#ce9178" }}>models</span> <span style={{ color: "#c586c0" }}>import</span> <span style={{ color: "#dcdcaa" }}>Task, User</span></div>
      <div style={{ marginTop: "4px", color: "#dcdcaa" }}>app = <span style={{ color: "#4ec9b0" }}>FastAPI</span>()</div>
      <div style={{ marginTop: "4px", color: "#569cd6" }}>@app.get("/api/v1/tasks")</div>
      <div><span style={{ color: "#c586c0" }}>async def</span> <span style={{ color: "#dcdcaa" }}>get_tasks</span>(<span style={{ color: "#9cdcfe" }}>user_id</span>):</div>
      <div style={{ color: "#6a9955" }}>  # Fetch from SQLite</div>
      <div>  <span style={{ color: "#c586c0" }}>return</span> {"{ \"status\": \"ok\" }"}</div>
    </div>
  );
}

function SpotifyScreen() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#121212", color: "#b3b3b3", fontFamily: "sans-serif", fontSize: "8px", padding: "8px", overflow: "hidden", borderRadius: "3px" }}>
      <div style={{ color: "#1db954", marginBottom: "4px", fontSize: "9px" }}>♫ NOW PLAYING</div>
      <div style={{ color: "#fff", fontWeight: "bold" }}>lofi hip hop beats</div>
      <div style={{ color: "#b3b3b3", fontSize: "7px" }}>Chillhop Music</div>
      <div style={{ marginTop: "6px", height: "2px", background: "#535353", borderRadius: "1px" }}>
        <div style={{ width: "65%", height: "100%", background: "#1db954", borderRadius: "1px" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px", fontSize: "6px" }}>
        <span>2:34</span><span>3:58</span>
      </div>
    </div>
  );
}

function WhiteboardIdeas() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#f5f5f0", color: "#1a1a2e", fontFamily: "monospace", fontSize: "11px", padding: "16px", overflow: "hidden" }}>
      <div style={{ marginBottom: "8px", fontSize: "13px", fontWeight: "bold", color: "#ef4444" }}>IDEAS & NOTES</div>
      <div style={{ margin: "6px 0", padding: "4px", border: "2px solid #3b82f6", borderRadius: "4px" }}>→ Build own IDE (plugin-based)</div>
      <div style={{ margin: "6px 0", padding: "4px", border: "2px solid #22c55e", borderRadius: "4px" }}>→ Create teaching language</div>
      <div style={{ margin: "6px 0", padding: "4px", border: "2px solid #f59e0b", borderRadius: "4px" }}>→ Open source MODCODES core</div>
      <div style={{ margin: "6px 0", padding: "4px", border: "2px solid #8b5cf6", borderRadius: "4px" }}>→ Start a startup?</div>
      <div style={{ marginTop: "10px", color: "#64748b", fontSize: "9px" }}>The future is being designed right here.</div>
    </div>
  );
}

function GitHubGraph() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0d1117", color: "#c9d1d9", fontFamily: "monospace", fontSize: "8px", padding: "8px", overflow: "hidden" }}>
      <div style={{ color: "#ffd700", marginBottom: "4px", letterSpacing: "2px" }}>CONTRIBUTION GRAPH</div>
      <div>
        {Array.from({ length: 7 }, (_, row) => (
          <div key={row} style={{ display: "flex", gap: "2px", marginBottom: "1px" }}>
            {Array.from({ length: 24 }, (_, col) => (
              <div key={col} style={{ width: "5px", height: "5px", borderRadius: "1px", background: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"][Math.floor(Math.random() * 5)] }} />
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "4px", color: "#3fb950" }}>847 contributions in 2024</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXIT DOOR & MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

function ExitDoor({ onLeave }: { onLeave: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <group position={[3.6, 0, 2.7]}>
      <mesh
        position={[0, 1.1, 0]}
        castShadow
        onPointerEnter={() => { document.body.style.cursor = "pointer"; setHovered(true); }}
        onPointerLeave={() => { document.body.style.cursor = "default"; setHovered(false); }}
        onClick={onLeave}
      >
        <boxGeometry args={[1.0, 2.2, 0.1]} />
        <meshStandardMaterial color="#111827" emissive="#ffd166" emissiveIntensity={hovered ? 0.7 : 0.25} />
      </mesh>
      <Html transform occlude position={[0, 2.5, 0]} style={{ width: "120px", textAlign: "center", pointerEvents: "none" }} scale={0.025}>
        <div style={{ color: "#ffd700", fontFamily: "monospace", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", opacity: hovered ? 1 : 0.5, transition: "opacity 0.2s" }}>
          [ EXIT ]
        </div>
      </Html>
      <pointLight color="#ffd166" intensity={hovered ? 3 : 1.2} distance={3} position={[0, 1.5, 0.3]} />
    </group>
  );
}

export default function BuildingInterior({ buildingId }: BuildingInteriorProps) {
  const { leaveBuilding, setExitPosition } = useStore();

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

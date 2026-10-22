"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NPCS } from "@/config/npcDialogs";
import { useStore } from "@/lib/store";
import { useIsMobile } from "@/lib/useIsMobile";
import { audioManager } from "@/lib/audio";

export default function NPCDialog() {
  const isMobile = useIsMobile();
  const {
    introComplete,
    interiorOpen,
    teleportOpen,
    cameraMode,
    nearbyNpc,
    dialogNpc,
    openNpcDialog,
    closeNpcDialog,
  } = useStore();

  const npc = useMemo(() => NPCS.find((n) => n.id === dialogNpc) ?? null, [dialogNpc]);
  const nearby = useMemo(() => NPCS.find((n) => n.id === nearbyNpc) ?? null, [nearbyNpc]);
  const [page, setPage] = useState(0);
  const [typed, setTyped] = useState("");
  const typingRef = useRef(false);

  useEffect(() => {
    setPage(0);
    setTyped("");
  }, [dialogNpc]);

  const line = npc?.lines[page]?.text ?? "";

  useEffect(() => {
    if (!dialogNpc) return;
    typingRef.current = true;
    setTyped("");
    let i = 0;
    const id = window.setInterval(() => {
      if (!typingRef.current) {
        window.clearInterval(id);
        return;
      }
      i += 1;
      if (i >= line.length) {
        setTyped(line);
        typingRef.current = false;
        window.clearInterval(id);
        return;
      }
      setTyped(line.slice(0, i));
    }, 14);
    return () => window.clearInterval(id);
  }, [dialogNpc, page, line]);

  const next = () => {
    if (!npc) return;
    if (typingRef.current) {
      typingRef.current = false;
      setTyped(line);
      return;
    }
    if (page + 1 < npc.lines.length) {
      audioManager.playClickSound();
      setPage((p) => p + 1);
    } else {
      audioManager.playClickSound();
      closeNpcDialog();
    }
  };

  useEffect(() => {
    if (!introComplete) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "e" || e.key === "E") {
        if (dialogNpc) {
          e.preventDefault();
          next();
          return;
        }
        if (
          nearbyNpc &&
          !interiorOpen &&
          !teleportOpen &&
          cameraMode !== "screen"
        ) {
          e.preventDefault();
          openNpcDialog(nearbyNpc);
        }
      }
      if (e.key === "Escape" && dialogNpc) closeNpcDialog();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introComplete, nearbyNpc, dialogNpc, interiorOpen, teleportOpen, cameraMode, line]);

  if (!introComplete || cameraMode === "screen") return null;

  const showHint = nearby && !dialogNpc && !interiorOpen && !teleportOpen;

  return (
    <>
      <AnimatePresence>
        {showHint && !isMobile && (
          <motion.div
            key={`hint-${nearby.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="fixed z-40 pointer-events-none left-1/2 -translate-x-1/2 hud-chip px-4 py-2"
            style={{
              bottom: isMobile ? 200 : 150,
              fontSize: 11,
              letterSpacing: "0.18em",
              color: "rgba(255,215,0,0.9)",
              border: "1px solid rgba(255,215,0,0.3)",
              background: "rgba(4,6,18,0.7)",
              whiteSpace: "nowrap",
            }}
          >
            💬 [ E ] — TALK TO {nearby.name.toUpperCase()}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {npc && (
          <motion.div
            key={`dlg-${npc.id}`}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 26 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="fixed z-40 pointer-events-auto hud-panel flex flex-col"
            style={{
              left: "50%",
              transform: "translateX(-50%)",
              bottom: isMobile ? 14 : 68,
              width: isMobile ? "calc(100vw - 20px)" : "min(680px, calc(100vw - 48px))",
              padding: isMobile ? "14px 14px 12px" : "16px 18px 13px",
              borderColor: `${npc.accent}55`,
              boxShadow: `0 0 36px ${npc.accent}22, 0 18px 48px rgba(0,0,0,0.55)`,
              fontFamily: "'JetBrains Mono', monospace",
            }}
            data-ui="npc-dialog"
          >
            <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
              <div className="flex items-center gap-2.5">
                <span
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: 30,
                    height: 30,
                    background: npc.color,
                    border: `1.5px solid ${npc.accent}`,
                    fontSize: 14,
                  }}
                >
                  {[npc.name[0], npc.name[npc.name.length - 1]].join("")}
                </span>
                <div className="flex flex-col">
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{npc.name}</span>
                  <span style={{ color: npc.accent, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    {npc.role}
                  </span>
                </div>
              </div>
              <button
                className="hud-kbtn rounded-md"
                style={{
                  width: 30,
                  height: 30,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 13,
                }}
                onClick={closeNpcDialog}
                aria-label="Close conversation"
              >
                ✕
              </button>
            </div>
            <p
              onClick={next}
              style={{
                color: "rgba(255,255,255,0.92)",
                fontSize: isMobile ? 12.5 : 14,
                lineHeight: 1.55,
                minHeight: isMobile ? 58 : 66,
                cursor: "pointer",
              }}
            >
              “{typed}
              {typed.length < line.length && <span style={{ opacity: 0.55 }}>▌</span>}
              {typed.length >= line.length && "”"}
            </p>
            <div className="flex items-center justify-between" style={{ marginTop: 6 }}>
              <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 10, letterSpacing: "0.14em" }}>
                {page + 1}/{npc.lines.length}
                {!isMobile ? " · E — next · ESC — leave" : ""}
              </span>
              <button
                className="hud-kbtn rounded-md"
                style={{
                  minHeight: 40,
                  padding: "0 16px",
                  background: `${npc.accent}1f`,
                  border: `1px solid ${npc.accent}66`,
                  color: npc.accent,
                  fontSize: 11,
                  letterSpacing: "0.16em",
                }}
                onClick={next}
              >
                {page + 1 < npc.lines.length ? "NEXT ▸" : "LEAVE"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

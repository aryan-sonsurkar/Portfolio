"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useStore, fpvState } from "@/lib/store";
import { BUILDINGS } from "../Buildings/BuildingData";
import { audioManager } from "@/lib/audio";
import { inputBus } from "@/lib/inputBus";

// Scratch objects — reused every frame to avoid GC churn
const scratchPos = new THREE.Vector3();
const scratchFront = new THREE.Vector3();
const scratchRight = new THREE.Vector3();
const scratchLook = new THREE.Vector3();
const scratchDist = new THREE.Vector2();
const scratchYAxis = new THREE.Vector3(0, 1, 0);
const scratchXAxis = new THREE.Vector3(1, 0, 0);

export default function CharacterController() {
  const { camera, gl } = useThree();
  const { cameraMode, selectedBuilding, enterBuilding, leaveBuilding, activeScreen, blueprintMode, exitPosition, exitRotation, setExitPosition, setActiveScreen, teleportOpen, flyoverActive, flyoverTarget, setFlyover } = useStore();

  const keys = useRef({ w: false, a: false, s: false, d: false });
  const positionRef = useRef(new THREE.Vector3(0, 1.6, 6));
  const flyoverRef = useRef({ progress: 0, start: new THREE.Vector3(), mid: new THREE.Vector3(), end: new THREE.Vector3() });
  const rotationRef = useRef({ yaw: Math.PI, pitch: 0 });
  const isPointerLocked = useRef(false);
  const enteringRef = useRef(false);
  const leavingRef = useRef(false);
  const transitionRef = useRef(0);
  const returningFromScreenRef = useRef(false);

  const lastFootstepTime = useRef(0);
  const footstepInterval = 0.42;

  // ESC handler for screen focus mode
  useEffect(() => {
    if (!activeScreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        returningFromScreenRef.current = true;
        positionRef.current.set(fpvState.position[0], fpvState.position[1], fpvState.position[2]);
        rotationRef.current.yaw = fpvState.yaw;
        rotationRef.current.pitch = 0;
        audioManager.playMonitorClose();
        setActiveScreen(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeScreen, setActiveScreen]);

  // FPV keyboard + mouse controls
  useEffect(() => {
    if (cameraMode !== "fpv") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeScreen) return;
      if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") keys.current.w = true;
      if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") keys.current.a = true;
      if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") keys.current.s = true;
      if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") keys.current.d = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") keys.current.w = false;
      if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") keys.current.a = false;
      if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") keys.current.s = false;
      if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") keys.current.d = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerLocked.current || activeScreen) return;
      const speed = 0.0022;
      rotationRef.current.yaw -= e.movementX * speed;
      rotationRef.current.pitch -= e.movementY * speed;
      rotationRef.current.pitch = Math.max(
        -Math.PI / 2.3,
        Math.min(Math.PI / 2.3, rotationRef.current.pitch)
      );
    };

    const lockChange = () => {
      const locked = document.pointerLockElement === gl.domElement;
      isPointerLocked.current = locked;
      // Always restore cursor when pointer lock exits
      if (!locked) {
        document.body.style.cursor = "default";
      }
    };

    const handleCanvasClick = () => {
      if (cameraMode === "fpv" && !activeScreen) {
        gl.domElement.requestPointerLock();
      }
    };

    // Mobile touch look
    let touchStartX = 0;
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (activeScreen) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (activeScreen) return;
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      rotationRef.current.yaw -= dx * 0.004;
      rotationRef.current.pitch -= dy * 0.004;
      rotationRef.current.pitch = Math.max(
        -Math.PI / 2.3,
        Math.min(Math.PI / 2.3, rotationRef.current.pitch)
      );
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("pointerlockchange", lockChange);
    gl.domElement.addEventListener("click", handleCanvasClick);
    gl.domElement.addEventListener("touchstart", handleTouchStart, { passive: true });
    gl.domElement.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("pointerlockchange", lockChange);
      gl.domElement.removeEventListener("click", handleCanvasClick);
      gl.domElement.removeEventListener("touchstart", handleTouchStart);
      gl.domElement.removeEventListener("touchmove", handleTouchMove);
      try { document.exitPointerLock(); } catch (e) {}
    };
  }, [cameraMode, gl.domElement, selectedBuilding, activeScreen]);

  // Exit pointer lock when teleport opens so HTML clicks work
  useEffect(() => {
    if (teleportOpen) {
      try { document.exitPointerLock(); } catch (e) {}
      keys.current = { w: false, a: false, s: false, d: false };
    }
  }, [teleportOpen]);

  // Spawn position on enter/leave transitions
  useEffect(() => {
    if (cameraMode !== "fpv") return;

    // If returning from screen focus, position was already restored by ESC handler
    if (returningFromScreenRef.current) {
      returningFromScreenRef.current = false;
      camera.position.copy(positionRef.current);
      return;
    }

    if (selectedBuilding) {
      positionRef.current.set(0, 1.6, 1.5);
      rotationRef.current.yaw = 0;
      rotationRef.current.pitch = 0;
    } else {
      positionRef.current.set(exitPosition[0], exitPosition[1], exitPosition[2]);
      rotationRef.current.yaw = exitRotation;
      rotationRef.current.pitch = 0;
    }

    transitionRef.current = 1.0;
    camera.position.copy(positionRef.current);
  }, [selectedBuilding, exitPosition, exitRotation, camera, cameraMode]);

  // Flyover animation when teleporting
  useEffect(() => {
    if (!flyoverActive || !flyoverTarget) return;

    audioManager.playTeleportWhoosh();

    const startPos = camera.position.clone();
    const endPos = new THREE.Vector3(flyoverTarget[0], flyoverTarget[1], flyoverTarget[2]);
    const midPos = new THREE.Vector3(
      (startPos.x + endPos.x) / 2,
      Math.max(startPos.y, endPos.y) + 8,
      (startPos.z + endPos.z) / 2
    );

    flyoverRef.current = { progress: 0, start: startPos, mid: midPos, end: endPos };
    try { document.exitPointerLock(); } catch (e) {}
  }, [flyoverActive, flyoverTarget, camera]);

  const checkCollision = (newPos: THREE.Vector3) => {
    if (selectedBuilding) {
      const boundaryX = 4.6;
      const boundaryZ = 2.8;
      
      if (Math.abs(newPos.x) > boundaryX) newPos.x = Math.sign(newPos.x) * boundaryX;
      if (newPos.z > boundaryZ) newPos.z = boundaryZ;
      if (newPos.z < -boundaryZ) newPos.z = -boundaryZ;

      const distToExit = scratchDist.set(newPos.x - 3.6, newPos.z - 2.7).length();
      if (distToExit < 1.2 && !leavingRef.current) {
        leavingRef.current = true;
        enteringRef.current = true;
        const building = BUILDINGS.find((b) => b.id === selectedBuilding);
        if (building) {
          const exitPos: [number, number, number] = [
            building.position[0],
            1.6,
            building.position[2] + building.scale[2] / 2 + 4.0,
          ];
          setExitPosition(exitPos, 0);
        }
        audioManager.stopAmbience();
        audioManager.startRainSound();
        leaveBuilding();
        setTimeout(() => { leavingRef.current = false; }, 800);
        setTimeout(() => { enteringRef.current = false; }, 800);
      }
      return;
    }

    const playerRadius = 0.55;
    if (newPos.x < -18) newPos.x = -18;
    if (newPos.x > 18) newPos.x = 18;
    if (newPos.z < -20) newPos.z = -20;
    if (newPos.z > 8) newPos.z = 8;

    BUILDINGS.forEach((b) => {
      const [bx, , bz] = b.position;
      const [bw, , bd] = b.scale;

      const minX = bx - bw / 2 - playerRadius;
      const maxX = bx + bw / 2 + playerRadius;
      const minZ = bz - bd / 2 - playerRadius;
      const maxZ = bz + bd / 2 + playerRadius;

      if (newPos.x > minX && newPos.x < maxX && newPos.z > minZ && newPos.z < maxZ) {
        const leftPen = newPos.x - minX;
        const rightPen = maxX - newPos.x;
        const backPen = newPos.z - minZ;
        const frontPen = maxZ - newPos.z;
        const minPen = Math.min(leftPen, rightPen, backPen, frontPen);
        if (minPen === leftPen) newPos.x = minX;
        else if (minPen === rightPen) newPos.x = maxX;
        else if (minPen === backPen) newPos.z = minZ;
        else if (minPen === frontPen) newPos.z = maxZ;
      }

      const entranceZOffset = bd / 2 + 0.6;
      const distToEntrance = scratchDist.set(newPos.x - bx, newPos.z - (bz + entranceZOffset)).length();
      if (distToEntrance < 1.0 && !enteringRef.current) {
        enteringRef.current = true;
        const currentPos: [number, number, number] = [
          positionRef.current.x,
          positionRef.current.y,
          positionRef.current.z,
        ];
        setExitPosition(currentPos, rotationRef.current.yaw);
        audioManager.stopRainSound();
        const ambienceMap: Record<string, "industrial" | "lab" | "outdoor" | "office" | "apartment"> = {
          "modcodes-hq": "office",
          "project-factory": "industrial",
          "achievement-tower": "office",
          "developer-museum": "lab",
          "open-source-center": "office",
          "innovation-lab": "lab",
          "developer-apartment": "apartment",
          "football-arena": "outdoor",
          "ironman-destiny-lab": "industrial",
          "future-observatory": "lab",
          "contact-kiosk": "office",
          "algorithm-dojo": "office",
          "hardware-foundry": "industrial",
          "the-vault": "office",
          "hackathon-war-room": "office",
          "the-roastery": "apartment",
        };
        audioManager.startAmbience(ambienceMap[b.id] || "office");
        enterBuilding(b.id);
        setTimeout(() => { enteringRef.current = false; }, 400);
      }
    });
  };

  useFrame((state, delta) => {
    if (cameraMode !== "fpv" || activeScreen) return;

    // Flyover animation — 1.2s cinematic pan
    if (flyoverActive && flyoverTarget) {
      const f = flyoverRef.current;
      f.progress = Math.min(1, f.progress + delta * 0.83);
      const t = f.progress;
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      // Quadratic bezier
      const oneMinusT = 1 - ease;
      const x = oneMinusT * oneMinusT * f.start.x + 2 * oneMinusT * ease * f.mid.x + ease * ease * f.end.x;
      const y = oneMinusT * oneMinusT * f.start.y + 2 * oneMinusT * ease * f.mid.y + ease * ease * f.end.y;
      const z = oneMinusT * oneMinusT * f.start.z + 2 * oneMinusT * ease * f.mid.z + ease * ease * f.end.z;

      camera.position.set(x, y, z);

      const lookAhead = Math.min(1, t + 0.1);
      const lA = 1 - lookAhead;
      const lx = lA * lA * f.start.x + 2 * lA * lookAhead * f.mid.x + lookAhead * lookAhead * f.end.x;
      const lz = lA * lA * f.start.z + 2 * lA * lookAhead * f.mid.z + lookAhead * lookAhead * f.end.z;
      camera.lookAt(lx, f.end.y, lz);

      if (f.progress >= 1) {
        positionRef.current.set(f.end.x, f.end.y, f.end.z);
        fpvState.position[0] = f.end.x;
        fpvState.position[1] = f.end.y;
        fpvState.position[2] = f.end.z;
        fpvState.yaw = 0;
        rotationRef.current.yaw = 0;
        rotationRef.current.pitch = 0;
        setFlyover(false);
      }
      return;
    }

    // Smooth transition after enter/leave
    if (transitionRef.current > 0) {
      transitionRef.current = Math.max(0, transitionRef.current - delta * 4);
    }

    const speed = 3.6 * delta;
    const newPos = scratchPos.copy(positionRef.current);

    const front = scratchFront
      .set(0, 0, -1)
      .applyAxisAngle(scratchYAxis, rotationRef.current.yaw);
    const right = scratchRight
      .set(1, 0, 0)
      .applyAxisAngle(scratchYAxis, rotationRef.current.yaw);

    let isMoving = false;

    if (transitionRef.current > 0) {
      // Disable movement during transition
    } else {
      if (keys.current.w) { newPos.addScaledVector(front, speed); isMoving = true; }
      if (keys.current.s) { newPos.addScaledVector(front, -speed); isMoving = true; }
      if (keys.current.a) { newPos.addScaledVector(right, -speed); isMoving = true; }
      if (keys.current.d) { newPos.addScaledVector(right, speed); isMoving = true; }

      // Mobile joystick input
      if (inputBus.moveX !== 0 || inputBus.moveY !== 0) {
        newPos.addScaledVector(front, -inputBus.moveY * speed);
        newPos.addScaledVector(right, inputBus.moveX * speed);
        isMoving = true;
      }
    }

    checkCollision(newPos);
    positionRef.current.copy(newPos);

    // Update module-level fpv state for non-reactive access
    fpvState.position[0] = positionRef.current.x;
    fpvState.position[1] = positionRef.current.y;
    fpvState.position[2] = positionRef.current.z;
    fpvState.yaw = rotationRef.current.yaw;

    // Smooth camera position
    camera.position.lerp(positionRef.current, delta * 12);

    const lookTarget = scratchLook
      .set(0, 0, -1)
      .applyAxisAngle(scratchXAxis, rotationRef.current.pitch)
      .applyAxisAngle(scratchYAxis, rotationRef.current.yaw)
      .add(camera.position);

    camera.lookAt(lookTarget);

    if (isMoving && state.clock.getElapsedTime() - lastFootstepTime.current > footstepInterval) {
      audioManager.playFootstep(selectedBuilding ? "wood" : "concrete");
      lastFootstepTime.current = state.clock.getElapsedTime();
    }

    if (isMoving && !selectedBuilding) {
      const store = useStore.getState();
      if (!store.achievements.includes("explorer")) {
        useStore.getState().addAchievement("explorer");
        audioManager.playAchievementUnlock();
      }
    }
  });

  if (!blueprintMode) return null;

  return (
    <group position={positionRef.current}>
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 1.8, 8]} />
        <meshBasicMaterial color="#00ff00" wireframe />
      </mesh>
    </group>
  );
}

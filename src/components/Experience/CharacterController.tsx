"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useStore, fpvState } from "@/lib/store";
import { BUILDINGS } from "../Buildings/BuildingData";
import { audioManager } from "@/lib/audio";

export default function CharacterController() {
  const { camera, gl } = useThree();
  const { cameraMode, selectedBuilding, enterBuilding, leaveBuilding, activeScreen, blueprintMode, exitPosition, exitRotation, setExitPosition, setActiveScreen, teleportOpen } = useStore();

  const keys = useRef({ w: false, a: false, s: false, d: false });
  const positionRef = useRef(new THREE.Vector3(0, 1.6, 6));
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
      isPointerLocked.current = document.pointerLockElement === gl.domElement;
    };

    const handleCanvasClick = () => {
      if (cameraMode === "fpv" && !activeScreen) {
        gl.domElement.requestPointerLock();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("pointerlockchange", lockChange);
    gl.domElement.addEventListener("click", handleCanvasClick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("pointerlockchange", lockChange);
      gl.domElement.removeEventListener("click", handleCanvasClick);
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

  const checkCollision = (newPos: THREE.Vector3) => {
    if (selectedBuilding) {
      const boundaryX = 4.6;
      const boundaryZ = 2.8;
      
      if (Math.abs(newPos.x) > boundaryX) newPos.x = Math.sign(newPos.x) * boundaryX;
      if (newPos.z > boundaryZ) newPos.z = boundaryZ;
      if (newPos.z < -boundaryZ) newPos.z = -boundaryZ;

      const distToExit = new THREE.Vector2(newPos.x - 3.6, newPos.z - 2.7).length();
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
      const distToEntrance = new THREE.Vector2(newPos.x - bx, newPos.z - (bz + entranceZOffset)).length();
      if (distToEntrance < 1.0 && !enteringRef.current) {
        enteringRef.current = true;
        const currentPos: [number, number, number] = [
          positionRef.current.x,
          positionRef.current.y,
          positionRef.current.z,
        ];
        setExitPosition(currentPos, rotationRef.current.yaw);
        enterBuilding(b.id);
        setTimeout(() => { enteringRef.current = false; }, 400);
      }
    });
  };

  useFrame((state, delta) => {
    if (cameraMode !== "fpv" || activeScreen) return;

    // Smooth transition after enter/leave
    if (transitionRef.current > 0) {
      transitionRef.current = Math.max(0, transitionRef.current - delta * 4);
    }

    const speed = 3.6 * delta;
    const newPos = positionRef.current.clone();

    const front = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationRef.current.yaw);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationRef.current.yaw);

    let isMoving = false;

    if (transitionRef.current > 0) {
      // Disable movement during transition
    } else {
      if (keys.current.w) { newPos.addScaledVector(front, speed); isMoving = true; }
      if (keys.current.s) { newPos.addScaledVector(front, -speed); isMoving = true; }
      if (keys.current.a) { newPos.addScaledVector(right, -speed); isMoving = true; }
      if (keys.current.d) { newPos.addScaledVector(right, speed); isMoving = true; }
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

    const lookTarget = new THREE.Vector3(0, 0, -1)
      .applyAxisAngle(new THREE.Vector3(1, 0, 0), rotationRef.current.pitch)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationRef.current.yaw)
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

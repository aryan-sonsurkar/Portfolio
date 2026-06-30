"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, PerspectiveCamera, Line } from "@react-three/drei"
import * as THREE from "three"

function OrbCore({ isActive }: { isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t * 0.12) * 0.08
      meshRef.current.rotation.y += 0.002
    }
    if (materialRef.current) {
      const pulse = isActive ? 0.65 + Math.sin(t * 0.7) * 0.15 : 0.3
      materialRef.current.uniforms.uIntensity.value = pulse
    }
  })

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 0.5 },
      uColor: { value: new THREE.Color("#3B82F6") },
    }),
    []
  )

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2.5, 5]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uIntensity;
          uniform vec3 uColor;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            float glow = 0.3 + uIntensity * 0.7;
            float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
            vec3 color = uColor * glow;
            color += vec3(0.0, 0.83, 1.0) * rim * 0.35;
            gl_FragColor = vec4(color, 0.9);
          }
        `}
        transparent
        wireframe={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function OrbitalRing({ radius, speed, color, offset = 0 }: { radius: number; speed: number; color: string; offset?: number }) {
  const ref = useRef<THREE.Group>(null!)
  const points = useMemo(() => {
    const pts: [number, number, number][] = []
    const segments = 64
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      pts.push([Math.cos(theta) * radius, 0, Math.sin(theta) * radius])
    }
    return pts
  }, [radius])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.15 + offset) * 0.25
      ref.current.rotation.z = Math.cos(clock.getElapsedTime() * 0.12 + offset) * 0.15
      ref.current.rotation.y += speed * 0.004
    }
  })

  return (
    <group ref={ref}>
      <Line points={points} color={color} opacity={0.12} transparent lineWidth={1} />
    </group>
  )
}

function OrbitingParticles({ count = 60 }: { count?: number }) {
  const ref = useRef<THREE.Group>(null!)

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const radius = 3 + Math.random() * 2.5
      const height = (Math.random() - 0.5) * 3
      const speed = 0.15 + Math.random() * 0.25
      return { angle, radius, height, speed, size: 1 + Math.random() * 2 }
    })
  }, [count])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.children.forEach((child, i) => {
      if (i < particles.length) {
        const p = particles[i]
        const a = p.angle + t * p.speed
        child.position.x = Math.cos(a) * p.radius
        child.position.z = Math.sin(a) * p.radius
        child.position.y = Math.sin(t * 0.4 + i * 0.2) * 0.5 + p.height
      }
    })
  })

  return (
    <group ref={ref}>
      {particles.map((p, i) => (
        <mesh key={i}>
          <sphereGeometry args={[p.size * 0.018, 6, 6]} />
          <meshBasicMaterial color="#3B82F6" transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  )
}

export default function AIOrb3D({ isActive = true }: { isActive?: boolean }) {
  return (
    <Canvas
      className="w-full h-full pointer-events-none"
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
      <ambientLight intensity={0.4} />
      <Float speed={0.4} rotationIntensity={0.04} floatIntensity={0.2}>
        <OrbCore isActive={isActive} />
        <OrbitalRing radius={3.2} speed={0.25} color="#3B82F6" />
        <OrbitalRing radius={3.8} speed={-0.15} color="#00D4FF" offset={1} />
        <OrbitalRing radius={4.4} speed={0.1} color="#3B82F6" offset={2} />
        <OrbitingParticles count={70} />
      </Float>
    </Canvas>
  )
}

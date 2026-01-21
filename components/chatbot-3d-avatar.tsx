"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useFBX } from "@react-three/drei"
import * as THREE from "three"
import gsap from "gsap"

interface Chatbot3DAvatarProps {
  modelPath: string
  isOpen?: boolean
  mood?: "happy" | "thinking" | "excited"
}

// 3D Model Component with GSAP Animations and Dance Effects
function Model3D({ modelPath, isOpen, mood }: { modelPath: string; isOpen?: boolean; mood?: "happy" | "thinking" | "excited" }) {
  const [loadError, setLoadError] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  const modelRef = useRef<THREE.Group>(null)
  const animationRefs = useRef<gsap.core.Tween[]>([])
  const errorLoggedRef = useRef(false)

  // useFBX hook must be called unconditionally (React hook rule)
  // It returns the loaded FBX model or throws if there's an error
  // Errors are caught by Suspense boundary above, but we'll handle gracefully
  const fbx = useFBX(modelPath)
  
  // Use ref to store cloned model to prevent re-cloning on every render
  const clonedModelRef = useRef<THREE.Group | null>(null)
  const [modelReady, setModelReady] = useState(false)

  // Store scale value in ref to prevent dependency issues
  const scaleRef = useRef<number>(1)

  // Clone model in useEffect to prevent render-time cloning
  useEffect(() => {
    // Check if model is loaded and valid
    if (fbx && !loadError && !clonedModelRef.current) {
      try {
        // Verify fbx is a valid THREE.Group
        if (fbx instanceof THREE.Group && fbx.children && fbx.children.length > 0) {
          clonedModelRef.current = fbx.clone()
          setModelLoaded(true)
          setModelReady(true)
        } else {
          throw new Error("FBX model is not a valid THREE.Group or is empty")
        }
      } catch (error) {
        if (!errorLoggedRef.current) {
          errorLoggedRef.current = true
          const errorMsg = error instanceof Error ? error.message : String(error)
          console.error("Error cloning FBX model:", errorMsg)
        }
        setLoadError(true)
        setModelReady(false)
      }
    }
    
    // If fbx is null/undefined, check after a short delay (it might still be loading)
    if (!fbx && typeof window !== "undefined" && !loadError && !modelLoaded) {
      const timeout = setTimeout(() => {
        if (!fbx && !modelLoaded && !errorLoggedRef.current) {
          errorLoggedRef.current = true
          console.warn("FBX model may not have loaded - file path:", modelPath)
          // Don't set error here as it might still be loading via Suspense
        }
      }, 5000) // Wait 5 seconds before warning
      
      return () => clearTimeout(timeout)
    }
  }, [fbx, loadError, modelPath, modelLoaded])

  useEffect(() => {
    if (!modelRef.current || !clonedModelRef.current || loadError || !modelReady) return

    const model = modelRef.current

    // Initial setup - Better scale for visibility
    model.scale.set(1, 1, 1) // Start with normal scale
    model.position.set(0, 0, 0)
    model.rotation.set(0, 0, 0)

    // Calculate bounding box to auto-scale
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 2 / maxDim // Scale to fit in 2 unit space
    scaleRef.current = scale
    model.scale.set(scale, scale, scale)

    // DANCE ANIMATION - Continuous dance movements
    const danceAnim1 = gsap.to(model.position, {
      y: 0.8,
      x: 0.3,
      duration: 1.5,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    })

    const danceAnim2 = gsap.to(model.rotation, {
      z: 0.3,
      x: 0.2,
      duration: 1.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    })

    // Continuous rotation (dance spin)
    const rotationAnim = gsap.to(model.rotation, {
      y: Math.PI * 2,
      duration: 6,
      ease: "none",
      repeat: -1,
    })

    // Bounce animation (dance bounce)
    const bounceAnim = gsap.to(model.scale, {
      x: scale * 1.1,
      y: scale * 1.1,
      z: scale * 1.1,
      duration: 0.8,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
    })

    animationRefs.current = [danceAnim1, danceAnim2, rotationAnim, bounceAnim]

    // Mood-based animations
    if (mood === "excited") {
      const excitedAnim = gsap.to(model.scale, {
        x: scale * 1.3,
        y: scale * 1.3,
        z: scale * 1.3,
        duration: 0.4,
        yoyo: true,
        repeat: 5,
        ease: "power2.inOut",
      })
      animationRefs.current.push(excitedAnim)
    } else if (mood === "thinking") {
      const thinkingAnim = gsap.to(model.rotation, {
        x: 0.4,
        duration: 1,
        yoyo: true,
        repeat: 3,
        ease: "power1.inOut",
      })
      animationRefs.current.push(thinkingAnim)
    }

    // When chatbot opens, add entrance animation
    if (isOpen) {
      gsap.fromTo(
        model.scale,
        { x: 0, y: 0, z: 0 },
        {
          x: scale,
          y: scale,
          z: scale,
          duration: 0.8,
          ease: "back.out(1.7)",
        }
      )
    }

    return () => {
      animationRefs.current.forEach(anim => anim.kill())
      animationRefs.current = []
    }
  }, [isOpen, mood, loadError, modelReady]) // Use modelReady instead of clonedModel

  // Smooth rotation with useFrame (dance effect)
  useFrame((state, delta) => {
    if (modelRef.current) {
      // Continuous dance rotation
      modelRef.current.rotation.y += delta * 0.5
      // Subtle wobble for dance effect
      modelRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  if (loadError || !clonedModelRef.current || !modelReady) {
    return null
  }

  return (
    <primitive
      ref={modelRef}
      object={clonedModelRef.current}
      dispose={null}
    />
  )
}

// Loading fallback - Better visible placeholder
function LoadingFallback() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#ff69b4" transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

// Main Component
export function Chatbot3DAvatar({ modelPath, isOpen = false, mood = "happy" }: Chatbot3DAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Client-side only mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true)
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current || !isMounted) return

    // Container animations with GSAP
    const container = containerRef.current

    // Pulse glow effect
    gsap.to(container, {
      boxShadow: "0 0 30px rgba(236, 72, 153, 0.6)",
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut",
    })

    return () => {
      gsap.killTweensOf(container)
    }
  }, [isMounted])

  // Don't render until mounted (prevents SSR issues)
  if (!isMounted) {
    return (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
        <div className="text-2xl animate-pulse">🎁</div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 relative"
      style={{
        boxShadow: "0 0 20px rgba(236, 72, 153, 0.4)",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 65 }}
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: "high-performance",
          preserveDrawingBuffer: true
        }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
        dpr={[1, 2]}
        frameloop="always"
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Enhanced Lighting for better visibility */}
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <directionalLight position={[-5, 5, -5]} intensity={0.8} />
          <pointLight position={[0, 0, 5]} intensity={1} color="#ff69b4" />
          <pointLight position={[-3, -3, -3]} intensity={0.6} color="#ff1493" />
          <spotLight position={[0, 5, 0]} intensity={1} angle={0.5} penumbra={0.5} />

          {/* 3D Model */}
          <Model3D modelPath={modelPath} isOpen={isOpen} mood={mood} />

          {/* Optional: OrbitControls for interaction (disabled for fixed view) */}
          {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
        </Suspense>
      </Canvas>
    </div>
  )
}


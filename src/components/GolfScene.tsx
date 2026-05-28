"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Float,
  Environment,
} from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";
import * as THREE from "three";

// A stylized 3D Golf Ball component that uses procedural bump mapping/dimples
function GolfBall({
  color,
  roughness,
  metalness,
  rotationSpeed,
}: {
  color: string;
  roughness: number;
  metalness: number;
  rotationSpeed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  // React Spring for premium, springy animations on hover and click
  const springs = useSpring({
    scale: active ? 1.4 : hovered ? 1.2 : 1.0,
    config: { mass: 1, tension: 170, friction: 12 },
  });

  // Rotate the ball continuously using useFrame from Fiber
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4 * rotationSpeed;
      meshRef.current.rotation.x += delta * 0.1 * rotationSpeed;
    }
  });

  return (
    <animated.mesh
      ref={meshRef}
      scale={springs.scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setActive(!active)}
      castShadow
      receiveShadow
    >
      {/* 
        A golf ball is a sphere. To create the dimple look procedurally, 
        we use a SphereGeometry with high detail, and we can apply a beautiful 
        bump/normal map or a high-end glossy clearcoat material.
      */}
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshPhysicalMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        bumpScale={0.05}
      />
    </animated.mesh>
  );
}

// Interactive Decorative Rings
function DecorativeRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.15;
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.03, 16, 100]} />
        <meshBasicMaterial color="#00ff66" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[2.8, 0.02, 16, 100]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

export default function GolfScene() {
  // UI states for interactive customization
  const [ballColor, setBallColor] = useState("#f4f4f5");
  const [roughness, setRoughness] = useState(0.2);
  const [metalness, setMetalness] = useState(0.1);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [ambientIntensity, setAmbientIntensity] = useState(0.7);

  const colors = [
    { value: "#f4f4f5", label: "Classic White" },
    { value: "#10b981", label: "Neon Green" },
    { value: "#3b82f6", label: "Electric Blue" },
    { value: "#f59e0b", label: "Sunset Gold" },
    { value: "#ec4899", label: "Hot Pink" },
  ];

  return (
    <div className="relative w-full h-[600px] md:h-[700px] rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-linear-to-b from-zinc-50 to-zinc-200 dark:from-zinc-950 dark:to-zinc-900 shadow-2xl flex flex-col md:flex-row">
      
      {/* 3D Canvas viewport */}
      <div className="flex-1 h-[400px] md:h-full relative">
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={ambientIntensity} />
          
          {/* Main directional light for crisp shadows */}
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          
          {/* Subtle colored rim light */}
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#3b82f6" />

          {/* Floating Golf Ball inside a soft floating group */}
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <GolfBall
              color={ballColor}
              roughness={roughness}
              metalness={metalness}
              rotationSpeed={rotationSpeed}
            />
            <DecorativeRings />
          </Float>

          {/* Premium realistic ground shadow */}
          <ContactShadows
            position={[0, -2.2, 0]}
            opacity={0.6}
            scale={8}
            blur={1.8}
            far={10}
          />

          {/* Orbit controls with zoom limits */}
          <OrbitControls
            enableZoom={true}
            minDistance={3}
            maxDistance={8}
            enablePan={false}
          />

          {/* Studio lighting environment */}
          <Environment preset="studio" />
        </Canvas>

        {/* Dynamic Watermark / Control Badge */}
        <div className="absolute top-6 left-6 pointer-events-none bg-white/70 dark:bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-zinc-800 dark:text-zinc-200">
              Interactive 3D Engine Active
            </span>
          </div>
        </div>
      </div>

      {/* Modern Glassmorphic Side Control Panel */}
      <div className="w-full md:w-[320px] bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between gap-6">
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              OrrGolf 3D Sandbox
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Verify and play with your Three.js + Fiber + Drei + Spring stack in real-time.
            </p>
          </div>

          {/* Color Selector */}
          <div className="mb-5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-2">
              Ball Finish Color
            </label>
            <div className="flex gap-2.5 flex-wrap">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setBallColor(c.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform duration-200 cursor-pointer ${
                    ballColor === c.value
                      ? "border-emerald-500 scale-110 shadow-lg shadow-emerald-500/20"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                  aria-label={c.label}
                />
              ))}
            </div>
          </div>

          {/* Material Roughness */}
          <div className="mb-5">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
              <span>Roughness</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-mono">
                {roughness.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={roughness}
              onChange={(e) => setRoughness(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Material Metalness */}
          <div className="mb-5">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
              <span>Metalness</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-mono">
                {metalness.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={metalness}
              onChange={(e) => setMetalness(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Rotation Speed */}
          <div className="mb-5">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
              <span>Spin Speed</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-mono">
                {rotationSpeed.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={rotationSpeed}
              onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Ambient Lighting */}
          <div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
              <span>Ambient Light</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-mono">
                {(ambientIntensity * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={ambientIntensity}
              onChange={(e) => setAmbientIntensity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>

        {/* Physics/Interaction Hint */}
        <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800/80 text-xs">
          <div className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
            <span className="text-sm">🖱️</span> Quick Controls
          </div>
          <ul className="text-zinc-500 dark:text-zinc-400 space-y-1 pl-1 list-disc list-inside">
            <li><strong className="text-zinc-600 dark:text-zinc-300">Click & Drag</strong> to rotate space</li>
            <li><strong className="text-zinc-600 dark:text-zinc-300">Scroll</strong> to zoom in/out</li>
            <li><strong className="text-zinc-600 dark:text-zinc-300">Click Ball</strong> to activate spring-pop</li>
            <li><strong className="text-zinc-600 dark:text-zinc-300">Hover Ball</strong> to scale up</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

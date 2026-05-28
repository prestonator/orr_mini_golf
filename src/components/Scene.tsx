"use client";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import StageObject from "./StageObject";

// Define your 26 stages here
const STAGES = [
  { id: 1, path: "/models/stage-1.glb" }, // Empty plot of land
  { id: 2, path: "/models/stage-2.glb" }, // First building
  { id: 3, path: "/models/stage-3.glb" }, // Trees / Second building
  // ... fill in up to 26
];

export default function Scene() {
  const [currentStage, setCurrentStage] = useState(1);

  return (
    <div className="relative w-full h-screen">
      {/* UI Overlay */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 flex gap-4 bg-white/80 p-4 rounded-lg shadow-lg">
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          onClick={() => setCurrentStage(prev => Math.max(1, prev - 1))}
          disabled={currentStage === 1}
        >
          Previous Stage
        </button>
        <span className="flex items-center font-bold text-black">
          Stage: {currentStage} / 26
        </span>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          onClick={() => setCurrentStage(prev => Math.min(STAGES.length, prev + 1))}
          disabled={currentStage === STAGES.length}
        >
          Next Stage
        </button>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [20, 20, 20], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
        
        {/* Nice realistic lighting/reflections */}
        <Environment preset="city" />
        
        {/* Allows the user to rotate around the land */}
        <OrbitControls target={[0, 0, 0]} maxPolarAngle={Math.PI / 2.1} />

        {/* Iterate over stages. If the current stage is >= the object's stage, render it */}
        {STAGES.map((stage) => {
          if (currentStage >= stage.id) {
            return (
              <StageObject 
                key={stage.id} 
                modelPath={stage.path} 
                // Stage 1 (land) shouldn't drop from the sky, it should just be there
                dropHeight={stage.id === 1 ? 0 : 50} 
              />
            );
          }
          return null;
        })}
      </Canvas>
    </div>
  );
}
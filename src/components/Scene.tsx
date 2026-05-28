"use client";
import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import StageObject from "./StageObject";

// Define your stages here based on the models in the directory
export const STAGES = [
  { id: 1, path: "/models/stage-1.glb" }, // Empty plot of land
  { id: 2, path: "/models/stage-2.glb" }, // First building
  { id: 3, path: "/models/stage-3.glb" }, // Trees / Second building
];

// Preload all models so there's no lag when transitioning
STAGES.forEach((stage) => {
  useGLTF.preload(stage.path);
});

export default function Scene() {
  const [currentStage, setCurrentStage] = useState(1);

  return (
    <div className="relative w-full h-screen">
      {/* UI Overlay */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 flex gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 items-center">
        <button 
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white font-semibold rounded-xl disabled:bg-gray-300 disabled:active:scale-100 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
          onClick={() => setCurrentStage(prev => Math.max(1, prev - 1))}
          disabled={currentStage === 1}
        >
          Previous
        </button>
        <span className="flex items-center font-bold text-gray-800 tracking-wide min-w-[120px] justify-center">
          Stage: {currentStage} / {STAGES.length}
        </span>
        <button 
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white font-semibold rounded-xl disabled:bg-gray-300 disabled:active:scale-100 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
          onClick={() => setCurrentStage(prev => Math.min(STAGES.length, prev + 1))}
          disabled={currentStage === STAGES.length}
        >
          Next
        </button>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [8, 8, 8], fov: 45 }} shadows dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize={[2048, 2048]} 
          shadow-bias={-0.0001}
        />
        
        {/* Nice realistic lighting/reflections */}
        <Environment preset="city" />
        
        {/* Allows the user to rotate around the land */}
        <OrbitControls 
          target={[0, 0, 0]} 
          maxPolarAngle={Math.PI / 2.1} 
          minDistance={2} 
          maxDistance={30}
          makeDefault 
        />

        <Suspense fallback={null}>
          {/* Iterate over stages. If the current stage is >= the object's stage, render it */}
          {STAGES.map((stage) => {
            if (currentStage >= stage.id) {
              return (
                <StageObject 
                  key={stage.id} 
                  modelPath={stage.path} 
                  // Stage 1 (land) shouldn't drop from the sky, it should just be there
                  dropHeight={stage.id === 1 ? 0 : 10} 
                />
              );
            }
            return null;
          })}
        </Suspense>
      </Canvas>
    </div>
  );
}
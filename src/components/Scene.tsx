"use client";
import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Homestead2 } from "./Homestead2";
import { EffectComposer, Bloom } from '@react-three/postprocessing'

export default function Scene() {
  const [currentStage, setCurrentStage] = useState(1);
  const totalStages = 26;

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
          Stage: {currentStage} / {totalStages}
        </span>
        <button 
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white font-semibold rounded-xl disabled:bg-gray-300 disabled:active:scale-100 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
          onClick={() => setCurrentStage(prev => Math.min(totalStages, prev + 1))}
          disabled={currentStage === totalStages}
        >
          Next
        </button>
      </div>

      {/* 3D Canvas */}
      <Canvas gl={{ logarithmicDepthBuffer: true }} camera={{ position: [100, 100, 100], fov: 45 }} shadows="percentage" dpr={[1, 2]}>
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
          maxDistance={200}
          makeDefault 
        />

        <Suspense fallback={null}>
          <Homestead2 currentStage={currentStage} />
          {currentStage === 26 && (
            <EffectComposer>
              <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={1.5} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
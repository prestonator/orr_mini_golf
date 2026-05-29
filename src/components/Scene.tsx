"use client";
import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Homestead2 } from "./Homestead";
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

function ResponsiveCamera() {
  const { camera, size } = useThree()
  
  useEffect(() => {
    // Check if we are on a narrow mobile screen
    const isMobile = size.width < 768;
    
    // On mobile, widen the FOV and adjust position so it doesn't look zoomed in and off-center
    // Type assertion used since we know it's a PerspectiveCamera
    const cam = camera as any;
    cam.fov = isMobile ? 65 : 45;
    
    // Slightly shift the camera to better center the view on mobile
    if (isMobile) {
      cam.position.set(120, 120, 120);
    } else {
      cam.position.set(100, 100, 100);
    }
    
    cam.updateProjectionMatrix();
  }, [size, camera]);
  
  return null;
}

export default function Scene() {
  const [currentStage, setCurrentStage] = useState(1);
  const totalStages = 26;

  return (
    <div className="relative w-full h-screen">
      {/* UI Overlay */}
      <div className="absolute top-4 sm:top-10 left-1/2 -translate-x-1/2 z-10 flex flex-wrap gap-2 sm:gap-4 bg-white/80 backdrop-blur-md p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl border border-white/20 items-center justify-center w-[95vw] sm:w-auto max-w-lg">
        <button 
          className="px-3 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white font-semibold rounded-lg sm:rounded-xl disabled:bg-gray-300 disabled:active:scale-100 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
          onClick={() => setCurrentStage(prev => Math.max(1, prev - 1))}
          disabled={currentStage === 1}
        >
          Previous
        </button>
        <span className="flex items-center text-sm sm:text-base font-bold text-gray-800 tracking-wide min-w-[100px] sm:min-w-[120px] justify-center">
          Stage: {currentStage} / {totalStages}
        </span>
        <button 
          className="px-3 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white font-semibold rounded-lg sm:rounded-xl disabled:bg-gray-300 disabled:active:scale-100 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
          onClick={() => setCurrentStage(prev => Math.min(totalStages, prev + 1))}
          disabled={currentStage === totalStages}
        >
          Next
        </button>
      </div>

      {/* Celebration Pop-up */}
      {currentStage === 26 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none p-4 mt-20 sm:mt-0">
          <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-sm text-center border-4 border-yellow-500 pointer-events-auto animate-[pop-up_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Congratulations!</h2>
            <p className="text-gray-600 text-sm sm:text-base mb-6">
              You have proven up your 160-acre plot! You are eligible for the $20,000 Land Rush Tournament!
            </p>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full p-2.5 sm:p-3 border rounded mb-4 text-black text-sm sm:text-base"
            />
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 sm:py-3 rounded transition-colors text-sm sm:text-base">
              Claim Certificate of Homestead
            </button>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas gl={{ logarithmicDepthBuffer: true }} camera={{ position: [100, 100, 100], fov: 45 }} shadows="percentage" dpr={[1, 2]}>
        <ResponsiveCamera />
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
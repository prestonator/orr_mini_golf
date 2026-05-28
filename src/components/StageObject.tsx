"use client";
import { useGLTF } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";

interface StageObjectProps {
  modelPath: string;
  dropHeight?: number;
}

export default function StageObject({ modelPath, dropHeight = 50 }: StageObjectProps) {
  // Load the GLB model
  const { scene } = useGLTF(modelPath);

  // Define the dropping animation
  const { position } = useSpring({
    from: { position: [0, dropHeight, 0] as [number, number, number] },
    to: { position: [0, 0, 0] as [number, number, number] },
    config: { mass: 2, tension: 150, friction: 20 }, // Gives a nice heavy "thud" feel
  });

  // We wrap the primitive in an <animated.group> to apply the spring animation
  return (
    <animated.group position={position}>
      {/* clone element to avoid mutating the cached GLTF scene */}
      <primitive object={scene.clone()} /> 
    </animated.group>
  );
}

// Preload models for performance
useGLTF.preload("/models/stage-1.glb");
// Add other preloads if needed
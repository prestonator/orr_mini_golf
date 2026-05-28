"use client";
import { useGLTF, Clone } from "@react-three/drei";
import { useSpring, animated, config } from "@react-spring/three";

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
    // Use an overdamped spring config to ensure it drops slowly and never goes below the floor
    config: { mass: 2, tension: 40, friction: 22, clamp: true },
  });

  // We wrap the Clone in an <animated.group> to apply the spring animation
  // Clone is much more performant than scene.clone() for instancing/reusing materials
  return (
    <animated.group position={position}>
      <Clone object={scene} castShadow receiveShadow />
    </animated.group>
  );
}
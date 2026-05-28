"use client";
import { useState } from "react";
import { useGLTF, Clone } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";

interface StageObjectProps {
  modelPath: string;
  dropHeight?: number;
  active: boolean;
}

export default function StageObject({ modelPath, dropHeight = 5, active }: StageObjectProps) {
  // Load the GLB model
  const { scene } = useGLTF(modelPath);

  // We track visibility so the model is hidden when it is fully at the dropHeight
  const [visible, setVisible] = useState(active);

  // If active becomes true, immediately show the object so it can animate down
  if (active && !visible) {
    setVisible(true);
  }

  // Define the dropping/rising animation
  const { y } = useSpring({
    y: active ? 0 : dropHeight,
    from: { y: dropHeight },
    // Use an overdamped spring config to ensure it drops slowly and never goes below the floor
    config: { mass: 2, tension: 40, friction: 22, clamp: true },
    onChange: ({ value }) => {
      // Hide the object once it has flown back up to the top
      if (!active && value.y >= dropHeight - 0.05) {
        setVisible(false);
      }
    },
  });

  // We wrap the Clone in an <animated.group> to apply the spring animation
  // Clone is much more performant than scene.clone() for instancing/reusing materials
  return (
    <animated.group 
      position={y.to(val => [0, val, 0]) as any}
      visible={visible}
    >
      <Clone object={scene} castShadow receiveShadow />
    </animated.group>
  );
}
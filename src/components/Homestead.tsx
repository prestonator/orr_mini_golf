import { Stages } from './homestead/Stages'
import React, { useState } from 'react'
import { useGLTF, Sparkles } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'

interface AnimatedGroupProps {
  children: React.ReactNode;
  stage: number;
  currentStage: number;
  dropHeight?: number;
  animType?: 'drop' | 'grow' | 'wobble';
}

export function AnimatedGroup({ children, stage, currentStage, dropHeight = 3000, animType = 'drop' }: AnimatedGroupProps) {
  const active = currentStage >= stage;
  const [visible, setVisible] = useState(active);

  // The Drop Animation (Buildings/Objects)
  const { y } = useSpring({
    y: active ? (stage * 0.5) : dropHeight,
    config: { mass: 6, tension: 40, friction: 22, clamp: true },
    onChange: ({ value }) => {
      if (!active && value.y >= dropHeight - 0.05) {
        setVisible(false);
      }
    },
  });

  // The Grow Animation (Plants/Crops)
  const { scale } = useSpring({
    scale: active ? 1 : 0,
    config: { mass: 1, tension: 120, friction: 14 },
    onChange: ({ value }) => {
      if (!active && value.scale >= 0.99) {
        setVisible(false);
      }
    },
  });

  // The Wobble Animation (Outhouse)
  const { rotateZ } = useSpring({
    rotateZ: active ? 0 : 0.5, // Starts tilted
    config: { mass: 3, tension: 200, friction: 5 } // Highly bouncy/wobbly
  });

  if (active && !visible) setVisible(true);

  if (animType === 'grow') {
    return <animated.group scale={scale} visible={visible}>{children}</animated.group>
  }

  if (animType === 'wobble') {
    return <animated.group position-y={y} rotation-z={rotateZ} visible={visible}>{children}</animated.group>
  }

  return <animated.group position-y={y} visible={visible}>{children}</animated.group>
}

export function CelebrationEffect({ currentStage }: { currentStage: number }) {
  const active = currentStage === 26;
  if (!active) return null;

  return (
    <group>
      <Sparkles count={500} scale={100} size={40} speed={0.4} color="#ffdf00" />
    </group>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Homestead2({ currentStage, ...props }: React.ComponentPropsWithoutRef<'group'> & { currentStage: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { nodes, materials } = useGLTF('/homestead2.glb') as any
  
  return (
    <group {...props} dispose={null}>
      <CelebrationEffect currentStage={currentStage} />
      <Stages nodes={nodes} materials={materials} currentStage={currentStage} />
    </group>
  )
}

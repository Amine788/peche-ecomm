import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useMouseParallax } from '../hooks/useMouseParallax';

// Animated glassy sphere — the ocean droplet
function OceanSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useMouseParallax();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.12 + mouse.x * 0.3;
    meshRef.current.rotation.x = Math.sin(t * 0.07) * 0.15 + mouse.y * 0.2;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[1.4, 64, 64]} />
        <MeshDistortMaterial
          color="#0277BD"
          attach="material"
          distort={0.35}
          speed={2.5}
          roughness={0.05}
          metalness={0.2}
          transparent
          opacity={0.9}
          envMapIntensity={2}
        />
      </mesh>
    </Float>
  );
}

// Inner glowing core
function GlowCore() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.getElapsedTime() * 0.2;
    const scale = 1 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.05;
    ref.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshBasicMaterial color="#4DD0E1" transparent opacity={0.15} />
    </mesh>
  );
}

// Orbiting ring
function Ring() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = Math.PI / 3 + Math.sin(state.clock.getElapsedTime() * 0.4) * 0.1;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.2, 0.015, 16, 100]} />
      <meshBasicMaterial color="#00ACC1" transparent opacity={0.4} />
    </mesh>
  );
}

// Outer faint ring
function Ring2() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = -Math.PI / 4;
    ref.current.rotation.y = -state.clock.getElapsedTime() * 0.2;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.8, 0.008, 16, 100]} />
      <meshBasicMaterial color="#67C8EC" transparent opacity={0.25} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#67C8EC" />
      <directionalLight position={[-5, -3, -5]} intensity={0.4} color="#0277BD" />
      <pointLight position={[0, 0, 3]} intensity={2} color="#00ACC1" distance={8} />
      <Stars radius={80} depth={50} count={800} factor={3} saturation={0} fade speed={0.5} />
      <OceanSphere />
      <GlowCore />
      <Ring />
      <Ring2 />
    </>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-full" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

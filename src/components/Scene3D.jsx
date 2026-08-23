import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function Particles({ count = 1400, radius = 16 }) {
  const ref = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * radius;
      arr[i * 3 + 1] = (Math.random() - 0.5) * radius;
      arr[i * 3 + 2] = (Math.random() - 0.5) * radius;
    }
    return arr;
  }, [count, radius]);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.04 + mouse.current.x * 0.25;
    ref.current.rotation.x = Math.sin(t * 0.06) * 0.12 + mouse.current.y * 0.2;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#8b5cf6"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function WireCore() {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.0016;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[2.4, 1]} />
      <meshStandardMaterial wireframe color="#a78bfa" transparent opacity={0.16} />
    </mesh>
  );
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[6, 6, 6]} intensity={1.4} color="#7c3aed" />
      <Particles />
      <WireCore />
      <Sparkles count={80} scale={10} size={2.5} speed={0.35} color="#22d3ee" opacity={0.5} />
    </Canvas>
  );
}

import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Group, Mesh } from 'three';

/**
 * Floating 3D donuts (real torus geometry) behind the hero headline — echoes
 * the reference banner. The whole group tilts toward the cursor (mouse effect)
 * and drifts up as you scroll (scroll effect). Each donut gently bobs + spins.
 *
 * Kept deliberately light: ~7 low-poly meshes, capped DPR, no postprocessing.
 * Only mounted on capable, non-reduced-motion, md+ viewports (see Home).
 */

interface DonutConfig {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
  phase: number;
}

const DONUTS: DonutConfig[] = [
  { position: [2.6, 1.1, 0], scale: 0.95, color: '#bf4324', speed: 0.7, phase: 0 },
  { position: [3.6, -0.8, -1], scale: 0.6, color: '#c2902f', speed: 0.9, phase: 1.4 },
  { position: [1.7, -1.4, 0.6], scale: 0.5, color: '#c25c7a', speed: 1.1, phase: 2.1 },
  { position: [4.1, 0.9, -0.5], scale: 0.42, color: '#e7d3b1', speed: 1.0, phase: 3.0 },
  { position: [0.4, 1.7, -1.2], scale: 0.5, color: '#d0892e', speed: 0.85, phase: 0.7 },
  { position: [3.0, 0.1, 0.8], scale: 0.34, color: '#4f8a86', speed: 1.2, phase: 4.2 },
  { position: [-0.6, -1.7, -0.8], scale: 0.4, color: '#a8392a', speed: 0.95, phase: 5.1 },
];

function Donut({ position, scale, color, speed, phase }: DonutConfig) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    m.position.y = position[1] + Math.sin(t * speed + phase) * 0.22;
    m.rotation.x += 0.004;
    m.rotation.y += 0.006;
  });
  return (
    <mesh ref={ref} position={position} scale={scale} rotation={[phase, phase, 0]}>
      <torusGeometry args={[1, 0.42, 16, 48]} />
      <meshStandardMaterial color={color} roughness={0.32} metalness={0.18} />
    </mesh>
  );
}

function Scene({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const group = useRef<Group>(null);
  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const { x, y } = state.pointer; // normalised -1..1
    const s = scrollRef.current ?? 0;
    // Tilt toward cursor (lerped for smoothness)
    g.rotation.y += (x * 0.5 - g.rotation.y) * 0.05;
    g.rotation.x += (-y * 0.3 - g.rotation.x) * 0.05;
    g.position.x += (x * 0.4 - g.position.x) * 0.05;
    // Drift up with scroll
    g.position.y = s * 4.5;
  });

  return (
    <group ref={group}>
      {DONUTS.map((d, i) => (
        <Donut key={i} {...d} />
      ))}
    </group>
  );
}

export default function HeroDonuts() {
  const scrollRef = useRef(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        scrollRef.current = Math.min(1, window.scrollY / window.innerHeight);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} color="#fff3e0" />
      <pointLight position={[-5, -2, 3]} intensity={30} color="#c2902f" />
      <Scene scrollRef={scrollRef} />
    </Canvas>
  );
}

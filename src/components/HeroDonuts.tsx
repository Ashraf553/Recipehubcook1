import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { Group, Mesh } from 'three';

interface ObjConfig {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
  phase: number;
}

const DONUTS: ObjConfig[] = [
  { position: [2.6, 1.1, 0], scale: 0.95, color: '#bf4324', speed: 0.7, phase: 0 },
  { position: [3.6, -0.8, -1], scale: 0.6, color: '#c2902f', speed: 0.9, phase: 1.4 },
  { position: [1.7, -1.4, 0.6], scale: 0.5, color: '#c25c7a', speed: 1.1, phase: 2.1 },
  { position: [4.1, 0.9, -0.5], scale: 0.42, color: '#e7d3b1', speed: 1.0, phase: 3.0 },
  { position: [0.4, 1.7, -1.2], scale: 0.5, color: '#d0892e', speed: 0.85, phase: 0.7 },
  { position: [3.0, 0.1, 0.8], scale: 0.34, color: '#4f8a86', speed: 1.2, phase: 4.2 },
  { position: [-0.6, -1.7, -0.8], scale: 0.4, color: '#a8392a', speed: 0.95, phase: 5.1 },
  { position: [1.0, 0.8, -2.0], scale: 0.55, color: '#b5742f', speed: 0.75, phase: 1.8 },
  { position: [5.0, 0.2, -0.8], scale: 0.48, color: '#a8392a', speed: 0.68, phase: 2.9 },
];

const GLASS_DONUTS: ObjConfig[] = [
  { position: [4.8, 0.6, -1.5], scale: 0.72, color: '#f8f4ff', speed: 0.65, phase: 2.5 },
  { position: [2.0, 2.1, -0.5], scale: 0.46, color: '#fff0f4', speed: 0.80, phase: 3.7 },
  { position: [-0.5, 0.6, 0.5], scale: 0.38, color: '#f0fff8', speed: 1.05, phase: 0.3 },
];

const GLOW_SPHERES: ObjConfig[] = [
  { position: [4.4, -1.3, 0.5], scale: 0.22, color: '#c2902f', speed: 1.3, phase: 1.1 },
  { position: [1.5, -0.3, 1.5], scale: 0.18, color: '#bf4324', speed: 1.1, phase: 2.8 },
  { position: [3.7, 1.9, -1.0], scale: 0.15, color: '#e7c090', speed: 0.9, phase: 4.5 },
  { position: [-0.8, 1.3, 0.2], scale: 0.20, color: '#c25c7a', speed: 1.2, phase: 3.3 },
  { position: [2.2, -2.0, -0.4], scale: 0.12, color: '#d0892e', speed: 1.4, phase: 0.9 },
];

function RendererSetup() {
  const { gl } = useThree();
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.35;
  }, [gl]);
  return null;
}

function Donut({ position, scale, color, speed, phase }: ObjConfig) {
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
      <torusGeometry args={[1, 0.42, 22, 72]} />
      <meshStandardMaterial color={color} roughness={0.26} metalness={0.24} />
    </mesh>
  );
}

function GlassDonut({ position, scale, color, speed, phase }: ObjConfig) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    m.position.y = position[1] + Math.sin(t * speed + phase) * 0.18;
    m.rotation.x += 0.003;
    m.rotation.z += 0.005;
  });
  return (
    <mesh ref={ref} position={position} scale={scale} rotation={[phase * 0.5, phase, 0]}>
      <torusGeometry args={[1, 0.32, 26, 80]} />
      <meshStandardMaterial
        color={color}
        metalness={0.12}
        roughness={0.04}
        transparent
        opacity={0.68}
      />
    </mesh>
  );
}

function GlowSphere({ position, scale, color, speed, phase }: ObjConfig) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    m.position.y = position[1] + Math.sin(t * speed + phase) * 0.30;
    m.position.x = position[0] + Math.cos(t * speed * 0.7 + phase) * 0.16;
    // Pulse glow
    (m.material as THREE.MeshStandardMaterial).emissiveIntensity =
      2.2 + Math.sin(t * 1.8 + phase) * 1.1;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 14, 14]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2.2}
        roughness={0.10}
        metalness={0.20}
      />
    </mesh>
  );
}

function Particles({ count = 280 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#c2902f'),
      new THREE.Color('#bf4324'),
      new THREE.Color('#e7d3b1'),
      new THREE.Color('#c25c7a'),
      new THREE.Color('#4f8a86'),
      new THREE.Color('#d0892e'),
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.15) * 17 + 1.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 11;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 9;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3 + 0] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    pointsRef.current.rotation.y = t * 0.022;
    pointsRef.current.rotation.x = Math.sin(t * 0.014) * 0.09;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.058} vertexColors transparent opacity={0.72} sizeAttenuation />
    </points>
  );
}

function MouseLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const l = lightRef.current;
    if (!l) return;
    const { x, y } = state.pointer;
    l.position.x += (x * 6 - l.position.x) * 0.1;
    l.position.y += (y * 4 - l.position.y) * 0.1;
  });
  return <pointLight ref={lightRef} position={[0, 0, 5]} intensity={22} color="#fff8ef" />;
}

function Scene({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const { x, y } = state.pointer;
    const t = state.clock.elapsedTime;
    const s = scrollRef.current ?? 0;

    // Idle drift when no strong mouse input
    const idleX = Math.sin(t * 0.18) * 0.12;
    const idleY = Math.cos(t * 0.22) * 0.08;

    g.rotation.y += (x * 0.65 + idleX - g.rotation.y) * 0.055;
    g.rotation.x += (-y * 0.35 + idleY - g.rotation.x) * 0.055;
    g.position.x += (x * 0.55 - g.position.x) * 0.055;

    // Cinematic scroll exit: fly upward + twist + shrink
    const targetY = s * 8;
    g.position.y += (targetY - g.position.y) * 0.08;
    g.rotation.z = s * 0.45;
    g.scale.setScalar(1 - s * 0.28);
  });

  return (
    <group ref={group}>
      <Particles />
      {DONUTS.map((d, i) => <Donut key={i} {...d} />)}
      {GLASS_DONUTS.map((d, i) => <GlassDonut key={i} {...d} />)}
      {GLOW_SPHERES.map((d, i) => <GlowSphere key={i} {...d} />)}
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
      <RendererSetup />
      <ambientLight intensity={0.45} />
      <hemisphereLight args={['#fff8ef', '#6b3a1f', 0.50]} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} color="#fff3e0" />
      <directionalLight position={[-6, -2, 2]} intensity={0.75} color="#c25c7a" />
      <pointLight position={[-5, -2, 3]} intensity={55} color="#c2902f" />
      <MouseLight />
      <Scene scrollRef={scrollRef} />
    </Canvas>
  );
}

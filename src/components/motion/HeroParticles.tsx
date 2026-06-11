import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';

/**
 * Generate a kawung-style batik motif as a CanvasTexture.
 * Kawung = traditional Javanese motif of 4 overlapping circles forming a flower.
 */
function makeBatikKawungTexture(size = 128): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Transparent background
  ctx.clearRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.22;
  const offset = size * 0.18;

  // Glow background (radial gradient)
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size / 2);
  glow.addColorStop(0, 'rgba(94, 234, 212, 0.9)');
  glow.addColorStop(0.4, 'rgba(20, 184, 166, 0.5)');
  glow.addColorStop(1, 'rgba(20, 184, 166, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // 4 overlapping circles forming kawung petals
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.95)';
  ctx.lineWidth = size * 0.018;
  const positions: [number, number][] = [
    [cx, cy - offset],
    [cx, cy + offset],
    [cx - offset, cy],
    [cx + offset, cy],
  ];
  for (const [x, y] of positions) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Inner dot
  ctx.fillStyle = 'rgba(251, 191, 36, 1)';
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.04, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function BatikField({ count = 800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const texture = useMemo(() => makeBatikKawungTexture(128), []);

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = 0.2 + Math.random() * 0.6;
    }
    return { positions: pos, sizes: sz };
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.08;
    // gentle parallax with mouse
    const mx = state.mouse.x * 0.3;
    const my = state.mouse.y * 0.3;
    ref.current.rotation.y += (mx - ref.current.rotation.y * 0.04) * delta * 0.5;
    ref.current.rotation.x += (my - ref.current.rotation.x * 0.04) * delta * 0.5;
  });

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [positions, sizes]);

  return (
    <points ref={ref} geometry={geom} frustumCulled={false}>
      <pointsMaterial
        map={texture}
        alphaMap={texture}
        size={0.4}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.95}
      />
    </points>
  );
}

interface HeroParticlesProps {
  className?: string;
  count?: number;
}

export default function HeroParticles({ className = '', count }: HeroParticlesProps) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <BatikField count={count} />
        </Suspense>
      </Canvas>
    </div>
  );
}

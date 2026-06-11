import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Line } from '@react-three/drei';
import { useRef, Suspense, useState, useMemo } from 'react';
import * as THREE from 'three';
import { INDONESIA_OUTLINES, type LatLng } from './indonesia-coords';

export interface GlobePin {
  lat: number;
  lng: number;
  label: string;
  id?: string | number;
  image?: string;
}

const GLOBE_RADIUS = 2;
// Initial Y rotation that brings Indonesia (lng ≈ 118°, lat ≈ -2°) to face the camera.
// Derived analytically from the latLngToVec3 mapping: y-rotation ≈ 152° = 2.654 rad.
const INDONESIA_FOCUS_Y = 2.654;

function latLngToVec3(lat: number, lng: number, radius = GLOBE_RADIUS): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function HeritagePin({
  pin,
  onClick,
  hovered,
  setHovered,
  pinScale = 1,
  pinPulse = true,
  labelScale = 1,
}: {
  pin: GlobePin;
  onClick?: (pin: GlobePin) => void;
  hovered: string | number | null;
  setHovered: (id: string | number | null) => void;
  pinScale?: number;
  pinPulse?: boolean;
  labelScale?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  // Offset ketinggian ikut skala pin agar pin kecil menempel di permukaan pulau
  // (offset besar membuat pin tampak melayang di luar pulau saat dilihat menyamping)
  const pos = latLngToVec3(pin.lat, pin.lng, GLOBE_RADIUS + 0.04 * pinScale);
  const id = pin.id ?? pin.label;

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (pinPulse) {
      const pulse = 1 + Math.sin(t * 3 + pin.lat) * 0.25;
      if (ref.current) ref.current.scale.setScalar(hovered === id ? pulse * 1.6 : pulse);
      if (haloRef.current) {
        const breath = 1.5 + Math.sin(t * 1.8 + pin.lat * 2) * 0.5;
        haloRef.current.scale.setScalar(hovered === id ? breath * 1.4 : breath);
        const m = haloRef.current.material as THREE.MeshBasicMaterial;
        m.opacity = (hovered === id ? 0.5 : 0.25) * (0.6 + Math.sin(t * 1.8 + pin.lat * 2) * 0.4);
      }
    } else {
      // Mode tenang: pin statis, hanya membesar halus saat hover
      if (ref.current) ref.current.scale.setScalar(hovered === id ? 1.5 : 1);
      if (haloRef.current) {
        haloRef.current.scale.setScalar(hovered === id ? 1.7 : 1.25);
        const m = haloRef.current.material as THREE.MeshBasicMaterial;
        m.opacity = hovered === id ? 0.35 : 0.14;
      }
    }
  });

  return (
    <group position={pos}>
      {/* Area klik tak terlihat — lebih besar dari pin visual agar pin kecil
          tetap mudah di-hover/klik */}
      <mesh
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onClick?.(pin);
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[Math.max(0.05 * pinScale, 0.035), 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={ref}>
        <sphereGeometry args={[0.04 * pinScale, 16, 16]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={hovered === id ? 1.8 : 1.0}
          toneMapped={false}
        />
      </mesh>
      {/* Pulsing halo glow */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.05 * pinScale, 16, 16]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.3} />
      </mesh>
      {hovered === id && (
        <Html distanceFactor={5 * labelScale} style={{ pointerEvents: 'none' }} center>
          <div className="px-3 py-1.5 -mt-10 rounded-lg bg-card/95 backdrop-blur-md border border-primary/40 text-xs text-foreground whitespace-nowrap shadow-xl">
            {pin.label}
          </div>
        </Html>
      )}
    </group>
  );
}

function IndonesiaArchipelago({
  outlines = INDONESIA_OUTLINES,
  lineColor = '#14b8a6',
  glowColor = '#5eead4',
}: {
  outlines?: LatLng[][];
  lineColor?: string;
  glowColor?: string;
}) {
  const lines = useMemo(() => {
    return outlines.map((coords) =>
      coords.map(([lng, lat]) => latLngToVec3(lat, lng, GLOBE_RADIUS + 0.012)),
    );
  }, [outlines]);

  return (
    <>
      {lines.map((points, i) => (
        <Line
          key={i}
          points={points}
          color={lineColor}
          lineWidth={1.5}
          transparent
          opacity={0.95}
        />
      ))}
      {/* Subtle glow underlay */}
      {lines.map((points, i) => (
        <Line
          key={`glow-${i}`}
          points={points}
          color={glowColor}
          lineWidth={4}
          transparent
          opacity={0.18}
        />
      ))}
    </>
  );
}

function Globe({
  pins,
  onPinClick,
  outlines,
  lineColor,
  glowColor,
  pinScale,
  pinPulse,
  labelScale,
}: {
  pins: GlobePin[];
  onPinClick?: (pin: GlobePin) => void;
  outlines?: LatLng[][];
  lineColor?: string;
  glowColor?: string;
  pinScale?: number;
  pinPulse?: boolean;
  labelScale?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | number | null>(null);

  // Subtle oscillating idle motion (small back-and-forth) — never pulls Indonesia out of view.
  useFrame((s) => {
    if (!ref.current || hovered) return;
    const drift = Math.sin(s.clock.elapsedTime * 0.15) * 0.05; // ±3°
    ref.current.rotation.y = INDONESIA_FOCUS_Y + drift;
  });

  return (
    <group ref={ref} rotation={[0, INDONESIA_FOCUS_Y, 0]}>
      {/* Base ocean sphere */}
      <Sphere args={[GLOBE_RADIUS, 64, 64]}>
        <meshStandardMaterial color="#082f3a" roughness={0.85} metalness={0.15} />
      </Sphere>
      {/* Subtle latitude/longitude grid */}
      <Sphere args={[GLOBE_RADIUS + 0.001, 32, 16]}>
        <meshBasicMaterial color="#0d4a55" wireframe transparent opacity={0.25} />
      </Sphere>
      {/* Indonesia archipelago outline (the hero element) */}
      <IndonesiaArchipelago outlines={outlines} lineColor={lineColor} glowColor={glowColor} />
      {/* Heritage pins */}
      {pins.map((pin, i) => (
        <HeritagePin
          key={pin.id ?? i}
          pin={pin}
          onClick={onPinClick}
          hovered={hovered}
          setHovered={setHovered}
          pinScale={pinScale}
          pinPulse={pinPulse}
          labelScale={labelScale}
        />
      ))}
    </group>
  );
}

interface IndonesiaGlobeProps {
  pins?: GlobePin[];
  onPinClick?: (pin: GlobePin) => void;
  className?: string;
  height?: string;
  /** Polyline pulau kustom (default: outline sederhana indonesia-coords) */
  outlines?: LatLng[][];
  lineColor?: string;
  glowColor?: string;
  /** Posisi kamera — dekatkan (z lebih kecil) untuk fokus zoom ke Indonesia */
  cameraPosition?: [number, number, number];
  fov?: number;
  /** Skala ukuran pin (1 = default) */
  pinScale?: number;
  /** Animasi denyut pin; false = pin statis yang tenang */
  pinPulse?: boolean;
  /** Skala tooltip nama situs saat hover (1 = default) */
  labelScale?: number;
  /** Batas rotasi horizontal simetris (radian) agar Indonesia tak keluar frame */
  azimuthLimit?: number;
  /** Batas rotasi vertikal [min, max] (radian) */
  polarRange?: [number, number];
  /** Aktifkan zoom via scroll wheel di atas kanvas */
  enableZoom?: boolean;
  /** Batas jarak kamera saat zoom [terdekat, terjauh] */
  zoomRange?: [number, number];
}

export default function IndonesiaGlobe({
  pins = [],
  onPinClick,
  className = '',
  height = 'h-[500px] md:h-[600px]',
  outlines,
  lineColor,
  glowColor,
  cameraPosition = [0, 0.3, 5.2],
  fov = 38,
  pinScale = 1,
  pinPulse = true,
  labelScale = 1,
  azimuthLimit = Math.PI / 5,
  polarRange = [Math.PI / 2.4, Math.PI / 1.7],
  enableZoom = false,
  zoomRange = [2.6, 6],
}: IndonesiaGlobeProps) {
  return (
    <div className={`w-full ${height} ${className}`}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: cameraPosition, fov }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} color="#ffffff" />
        <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#14b8a6" />
        <pointLight position={[0, 0, 6]} intensity={0.8} color="#fbbf24" />
        <Suspense fallback={null}>
          <Globe
            pins={pins}
            onPinClick={onPinClick}
            outlines={outlines}
            lineColor={lineColor}
            glowColor={glowColor}
            pinScale={pinScale}
            pinPulse={pinPulse}
            labelScale={labelScale}
          />
        </Suspense>
        <OrbitControls
          enableZoom={enableZoom}
          minDistance={zoomRange[0]}
          maxDistance={zoomRange[1]}
          zoomSpeed={0.6}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={polarRange[0]}
          maxPolarAngle={polarRange[1]}
          minAzimuthAngle={-azimuthLimit}
          maxAzimuthAngle={azimuthLimit}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

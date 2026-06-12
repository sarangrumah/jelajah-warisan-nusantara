import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { INDONESIA_OUTLINES_REAL } from '@/components/motion/indonesia-coords-real';
import type { V2Pin } from '@/lib/v2/useSites';

interface V2IndonesiaSvgMapProps {
  pins: V2Pin[];
  onPinClick?: (pin: V2Pin) => void;
  activePinId?: string | null;
  className?: string;
}

// Bounding box Indonesia (sedikit dipadding agar pulau-pulau tepi tidak terpotong)
const LNG_MIN = 94;
const LNG_MAX = 141.5;
const LAT_MIN = -11.5;
const LAT_MAX = 7;
const VIEW_W = 1000;
const VIEW_H = Math.round(((LAT_MAX - LAT_MIN) / (LNG_MAX - LNG_MIN)) * VIEW_W);

function projectX(lng: number) {
  return ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * VIEW_W;
}
function projectY(lat: number) {
  return ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * VIEW_H;
}

// Ambil ~80 outline terbesar — cukup untuk siluet kepulauan utama
const OUTLINES = INDONESIA_OUTLINES_REAL.slice(0, 80);

const PATHS = OUTLINES.map((ring) => {
  if (ring.length < 3) return '';
  let d = `M ${projectX(ring[0][0]).toFixed(1)} ${projectY(ring[0][1]).toFixed(1)}`;
  for (let i = 1; i < ring.length; i++) {
    d += ` L ${projectX(ring[i][0]).toFixed(1)} ${projectY(ring[i][1]).toFixed(1)}`;
  }
  return d + ' Z';
}).filter(Boolean);

/**
 * Peta 2D Indonesia berbasis SVG — ringan (tanpa WebGL), responsif, dan
 * cocok sebagai pengganti globe 3D di perangkat mobile atau saat WebGL
 * sedang dimuat. Memakai data garis pantai yang sama dengan globe.
 */
export default function V2IndonesiaSvgMap({
  pins,
  onPinClick,
  activePinId,
  className = '',
}: V2IndonesiaSvgMapProps) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  const projectedPins = useMemo(
    () =>
      pins
        .filter(
          (p) =>
            Number.isFinite(p.lat) &&
            Number.isFinite(p.lng) &&
            p.lng >= LNG_MIN &&
            p.lng <= LNG_MAX &&
            p.lat >= LAT_MIN &&
            p.lat <= LAT_MAX,
        )
        .map((p) => ({
          ...p,
          x: projectX(p.lng),
          y: projectY(p.lat),
        })),
    [pins],
  );

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="block w-full h-full"
        role="img"
        aria-label="Peta sebaran museum dan cagar budaya Indonesia"
      >
        {/* Lautan: pakai background; tambahkan tone halus di tengah */}
        <defs>
          <radialGradient id="v2map-sea" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="hsl(175 84% 35% / 0.06)" />
            <stop offset="100%" stopColor="hsl(20 8% 8% / 0)" />
          </radialGradient>
          <linearGradient id="v2map-land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150 30% 28% / 0.55)" />
            <stop offset="100%" stopColor="hsl(150 30% 18% / 0.55)" />
          </linearGradient>
        </defs>

        <rect width={VIEW_W} height={VIEW_H} fill="url(#v2map-sea)" />

        {/* Kepulauan */}
        <g>
          {PATHS.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="url(#v2map-land)"
              stroke="hsl(175 84% 55% / 0.65)"
              strokeWidth={0.6}
              strokeLinejoin="round"
            />
          ))}
        </g>

        {/* Pin */}
        <g>
          {projectedPins.map((p) => {
            const isActive = activePinId === String(p.id) || hoverId === String(p.id);
            return (
              <motion.g
                key={p.id}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{ cursor: 'pointer' }}
                onClick={() => onPinClick?.(p)}
                onMouseEnter={() => setHoverId(String(p.id))}
                onMouseLeave={() => setHoverId(null)}
              >
                {/* Tap target lebih besar (invisible) untuk mobile */}
                <circle cx={p.x} cy={p.y} r={14} fill="transparent" />
                {/* Halo lembut */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? 10 : 7}
                  fill="hsl(175 84% 55% / 0.25)"
                  style={{ transition: 'r 200ms ease, fill 200ms ease' }}
                />
                {/* Titik utama */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? 4.5 : 3.5}
                  fill="hsl(175 84% 50%)"
                  stroke="hsl(43 15% 95% / 0.9)"
                  strokeWidth={1}
                  style={{ transition: 'r 200ms ease' }}
                />
                {isActive && (
                  <text
                    x={p.x + 10}
                    y={p.y - 8}
                    fontSize={11}
                    fill="hsl(43 15% 92%)"
                    style={{
                      paintOrder: 'stroke',
                      stroke: 'hsl(20 8% 8%)',
                      strokeWidth: 3,
                      strokeLinejoin: 'round',
                    }}
                  >
                    {p.label}
                  </text>
                )}
              </motion.g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

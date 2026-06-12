import IndonesiaGlobe from '@/components/motion/IndonesiaGlobe';
import type { GlobePin } from '@/components/motion/IndonesiaGlobe';
import { INDONESIA_OUTLINES_REAL } from '@/components/motion/indonesia-coords-real';

// Pulau-pulau terbesar saja (ring terpanjang) agar jumlah draw call terkendali
// — tetap mencakup seluruh pulau besar + ratusan pulau menengah yang dikenali.
const OUTLINES = INDONESIA_OUTLINES_REAL.slice(0, 90);

interface HeritageGlobeProps {
  pins?: GlobePin[];
  onPinClick?: (pin: GlobePin) => void;
}

/**
 * Globe versi /v2: garis pantai riil (Natural Earth 50m), aksen teal sesuai
 * tema heritage v1, dan kamera didekatkan agar kepulauan Indonesia tampil
 * besar memenuhi lebar layar. Di-load lazy — data koordinat ikut chunk ini,
 * bukan bundle utama.
 */
export default function HeritageGlobe({ pins = [], onPinClick }: HeritageGlobeProps) {
  return (
    <IndonesiaGlobe
      pins={pins}
      onPinClick={onPinClick}
      outlines={OUTLINES}
      lineColor="#0EA398"
      glowColor="#17CFBF"
      cameraPosition={[0, 0.2, 3.3]}
      fov={36}
      height="h-full"
      pinScale={0.15}
      pinPulse={false}
      labelScale={0.3}
      azimuthLimit={Math.PI / 20}
      polarRange={[Math.PI / 2.25, Math.PI / 1.8]}
      enableZoom
      zoomRange={[2.45, 4.2]}
    />
  );
}

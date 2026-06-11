import { ReactNode, Suspense, useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface Deferred3DProps {
  children: ReactNode;
  /** Tampilan pengganti di mobile / prefers-reduced-motion (gambar statis dsb.) */
  fallback: ReactNode;
  className?: string;
}

/**
 * Gerbang pemuatan konten WebGL: chunk three-vendor (~1MB) hanya diunduh
 * ketika section hampir terlihat, di perangkat desktop, dan pengguna tidak
 * menyetel prefers-reduced-motion. Selain itu render fallback statis.
 */
export function Deferred3D({ children, fallback, className = '' }: Deferred3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '200px 0px', once: true });
  const isMobile = useIsMobile();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const enabled = inView && !isMobile && !reduceMotion;

  return (
    <div ref={ref} className={className}>
      {enabled ? (
        <Suspense fallback={fallback}>{children}</Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}

export default Deferred3D;

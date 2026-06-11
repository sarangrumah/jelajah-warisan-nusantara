import { Suspense, useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LenisProvider } from '@/components/motion/LenisProvider';
import { PageTransition } from '@/components/motion/PageTransition';
import V2Header from './V2Header';
import V2Footer from './V2Footer';
import '@/styles/v2-theme.css';

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-2 w-2 rounded-full bg-primary animate-pulse"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function V2Layout() {
  const { pathname } = useLocation();

  // Tema dipasang di <html> agar portal Radix/Sonner (yang mount ke body,
  // di luar wrapper) ikut ter-theme; dilepas saat unmount agar v1 tak terdampak.
  useEffect(() => {
    document.documentElement.classList.add('theme-v2');
    return () => {
      document.documentElement.classList.remove('theme-v2');
    };
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="theme-v2 min-h-screen bg-background text-foreground">
      <LenisProvider>
        <V2Header />
        <main>
          <Suspense fallback={<PageFallback />}>
            <PageTransition key={pathname}>
              <Outlet />
            </PageTransition>
          </Suspense>
        </main>
        <V2Footer />
      </LenisProvider>
    </div>
  );
}

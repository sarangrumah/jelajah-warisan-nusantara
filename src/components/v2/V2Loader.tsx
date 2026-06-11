// Fallback Suspense untuk route group /v2. Sengaja self-contained
// (warna inline, tanpa framer/lenis) supaya bisa di-import eager di App.tsx
// dengan bobot ~1KB dan tetap tampil bergaya v2 sebelum tema ter-mount.
export default function V2Loader() {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#0B0A08' }}
      className="flex flex-col items-center justify-center gap-6"
      role="status"
      aria-label="Memuat halaman"
    >
      <div className="flex items-center gap-3">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="block h-2.5 w-2.5 rounded-full animate-pulse"
            style={{
              background: '#C9A227',
              animationDelay: `${i * 180}ms`,
              boxShadow: '0 0 14px rgba(201, 162, 39, 0.55)',
            }}
          />
        ))}
      </div>
      <p
        style={{ color: 'rgba(233, 221, 191, 0.65)', letterSpacing: '0.3em' }}
        className="text-xs uppercase"
      >
        Memuat Jelajah Nusantara
      </p>
    </div>
  );
}

interface BatikBackdropProps {
  /** kawung (default, halaman cagar budaya) atau megamendung (halaman museum) */
  variant?: 'kawung' | 'megamendung';
  /** Tampilkan lapisan kabut radial emas/tembaga */
  mist?: boolean;
  className?: string;
}

/**
 * Latar atmosfer budaya: motif batik SVG data-URI + kabut gradien.
 * Murni CSS (lihat v2-theme.css) — tanpa JS animation, tanpa request gambar.
 */
export function BatikBackdrop({ variant = 'kawung', mist = true, className = '' }: BatikBackdropProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div
        className={`absolute inset-0 ${
          variant === 'megamendung' ? 'v2-megamendung-overlay' : 'v2-kawung-overlay'
        }`}
      />
      {mist && <div className="absolute inset-0 v2-mist" />}
    </div>
  );
}

export default BatikBackdrop;

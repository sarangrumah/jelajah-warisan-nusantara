import { Link } from 'react-router-dom';

export function V2Footer() {
  return (
    <footer className="relative border-t border-border/40 mt-24">
      <div className="v2-rule absolute top-0 inset-x-0" />
      <div className="container mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="v2-kicker mb-3">Museum dan Cagar Budaya</p>
          <h3 className="text-2xl v2-display text-heritage-gradient mb-4">
            Jelajah Warisan Nusantara
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            Ruang jelajah warisan budaya dan sejarah yang kolaboratif — mendorong daya cipta
            dan pembangunan karakter berbudaya.
          </p>
        </div>
        <div>
          <p className="v2-kicker mb-4">Jelajahi</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/v2" className="text-foreground/70 hover:text-primary transition-colors">
                Beranda
              </Link>
            </li>
            <li>
              <Link to="/v2/heritage" className="text-foreground/70 hover:text-primary transition-colors">
                Cagar Budaya
              </Link>
            </li>
            <li>
              <Link to="/v2/museums" className="text-foreground/70 hover:text-primary transition-colors">
                Museum
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="v2-kicker mb-4">Tentang Preview Ini</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Halaman /v2 adalah purwarupa revamp sinematik untuk bahan presentasi.
            Versi produksi tetap tersedia tanpa perubahan.
          </p>
          <Link
            to="/"
            className="inline-flex items-center text-xs px-4 py-2 rounded-full border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Buka Website v1
          </Link>
        </div>
      </div>
      <div className="border-t border-border/30">
        <div className="container mx-auto px-4 py-5 text-xs text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Museum dan Cagar Budaya — Kemenbud RI</span>
          <span className="tracking-[0.25em] uppercase">Nusantara · Budaya · Lestari</span>
        </div>
      </div>
    </footer>
  );
}

export default V2Footer;

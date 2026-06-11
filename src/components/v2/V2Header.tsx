import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/images/logo/MCB Logo_Putih_notext.png';

// Struktur menu mengikuti Header v1 (src/components/Header.tsx).
// Rute yang sudah punya versi sinematik diarahkan ke /v2; sisanya tetap ke v1.
const NAVIGATION_ITEMS = [
  { name: 'Beranda', href: '/v2' },
  {
    name: 'Destinasi',
    href: '/v2/museums',
    subItems: [
      { name: 'Museum', href: '/v2/museums' },
      { name: 'Warisan Budaya', href: '/v2/heritage' },
    ],
  },
  {
    name: 'Koleksi',
    href: '/collection',
    subItems: [
      { name: 'Koleksi', href: '/collection' },
      { name: 'Memory Of the World', href: '/mow' },
    ],
  },
  { name: 'Agenda', href: '/agenda' },
  {
    name: 'Tentang Kami',
    href: '/tentang-kami',
    subItems: [
      { name: 'Tentang Kami', href: '/tentang-kami' },
      { name: 'Struktur Organisasi', href: '/struktur-organisasi' },
      { name: 'Layanan Konservasi', href: '/laboratorium-konservasi' },
      { name: 'Media & Publikasi', href: '/media-publikasi' },
      { name: 'Pemanfaatan Aset', href: '/pemanfaatan-aset' },
      { name: 'Merchandise', href: '/merchandise' },
      { name: 'Hubungi Kami', href: '/hubungi-kami' },
      { name: 'Karir', href: '/karir' },
    ],
  },
  { name: 'PPID', href: '/ppid' },
];

// Pemetaan label → kunci i18n, sama seperti Header v1
const NAV_TEXT_KEYS: Record<string, string> = {
  Beranda: 'nav.beranda',
  Destinasi: 'nav.destinasi',
  Museum: 'nav.museum',
  'Warisan Budaya': 'nav.heritage',
  Koleksi: 'nav.collection',
  'Memory Of the World': 'nav.mow',
  Agenda: 'nav.agenda',
  'Tentang Kami': 'nav.tentangKami',
  'Struktur Organisasi': 'nav.strukturOrganisasi',
  'Layanan Konservasi': 'nav.layananKonservasi',
  'Media & Publikasi': 'nav.mediaPublikasi',
  'Pemanfaatan Aset': 'nav.pemanfaatanAset',
  Merchandise: 'nav.merchandise',
  'Hubungi Kami': 'nav.hubungiKami',
  Karir: 'nav.career',
  PPID: 'nav.ppid',
};

export function V2Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language } = useLanguage();
  const { t } = useTranslation();

  const items = useMemo(
    () =>
      NAVIGATION_ITEMS.map((item) => ({
        ...item,
        name: t(NAV_TEXT_KEYS[item.name] || item.name) || item.name,
        subItems: item.subItems?.map((sub) => ({
          ...sub,
          name: t(NAV_TEXT_KEYS[sub.name] || sub.name) || sub.name,
        })),
      })),
    [t],
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-heritage ${
          isScrolled
            ? 'bg-background/90 backdrop-blur-md border-b border-border/40'
            : 'bg-gradient-to-b from-background/80 to-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between py-4 gap-4">
            <Link to="/v2" className="flex items-center gap-3 min-w-0">
              <img src={logo} alt="Logo Museum dan Cagar Budaya" className="w-[3rem] shrink-0" />
              <h1 className="hidden sm:block text-lg xl:text-xl text-heritage-gradient v2-display truncate">
                {language === 'id' ? 'Museum dan Cagar Budaya' : 'Museum and Cultural Heritage'}
              </h1>
              <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full border border-primary/50 bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider">
                V2 Preview
              </span>
            </Link>

            {/* Navigasi desktop */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              {items.map((item) =>
                item.subItems ? (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`transition-heritage font-medium ${
                          item.subItems.some((sub) => isActive(sub.href))
                            ? 'text-primary'
                            : 'text-foreground hover:text-primary'
                        }`}
                      >
                        {item.name}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {item.subItems.map((sub) => (
                        <DropdownMenuItem key={sub.name} asChild>
                          <Link
                            to={sub.href}
                            className={`w-full cursor-pointer ${
                              isActive(sub.href) ? 'bg-primary/10 text-primary' : ''
                            }`}
                          >
                            {sub.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 transition-heritage font-medium ${
                      isActive(item.href)
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-foreground hover:text-primary'
                    }`}
                  >
                    {item.name}
                  </Link>
                ),
              )}
              <LanguageSwitcher />
              <Link
                to="/"
                className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors whitespace-nowrap"
              >
                Kembali ke v1
              </Link>
            </div>

            {/* Tombol menu mobile */}
            <div className="flex items-center gap-2 lg:hidden">
              <LanguageSwitcher />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Navigasi mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div
            className="fixed inset-0 bg-background/95 backdrop-blur-md"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed right-0 top-20 bottom-0 w-64 bg-card border-l border-border p-6 overflow-y-auto">
            <nav className="space-y-4 pb-8">
              {items.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className={`block transition-heritage font-medium py-2 ${
                      isActive(item.href)
                        ? 'text-primary bg-primary/10'
                        : 'text-foreground hover:text-primary'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.subItems && (
                    <div className="ml-4 space-y-2 mt-2">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.href}
                          className={`block transition-heritage font-medium py-1 text-sm ${
                            isActive(sub.href)
                              ? 'text-primary bg-primary/10'
                              : 'text-muted-foreground hover:text-primary'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                to="/"
                className="block text-sm text-muted-foreground hover:text-primary pt-4 border-t border-border/40"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Kembali ke v1
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default V2Header;

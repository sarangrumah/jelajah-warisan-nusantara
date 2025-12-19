import { useState, useEffect, useMemo } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import logo from '@/assets/images/logo/MCB Logo_Putih_notext.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language } = useLanguage();

  // Navigation items with original Indonesian text
  const navigationItems = [
    { name: 'Beranda', href: '/beranda' },
    { name: 'Dashboard', href: '/dashboard' },
    {
      name: 'Destinasi',
      href: '/museum',
      subItems: [
        { name: 'Museum', href: '/museums' },
        { name: 'Warisan Budaya', href: '/heritage' },
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
      ]
    },
    { name: 'PPID', href: '/ppid' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  // Collect all texts that need translation
  const allTexts = useMemo(() => {
    const texts: Record<string, string> = {
      'Beranda': 'nav.beranda',
      'Destinasi': 'nav.destinasi',
      'Museum': 'nav.museum',
      'Warisan Budaya': 'nav.heritage',
      'Koleksi': 'nav.collection',
      'Memory Of the World': 'nav.mow',
      'Agenda': 'nav.agenda',
      'Tentang Kami': 'nav.tentangKami',
      'Struktur Organisasi': 'nav.strukturOrganisasi',
      'Layanan Konservasi': 'nav.layananKonservasi',
      'Media & Publikasi': 'nav.mediaPublikasi',
      'Pemanfaatan Aset': 'nav.pemanfaatanAset',
      'Merchandise': 'nav.merchandise',
      'Hubungi Kami': 'nav.hubungiKami',
      'Karir': 'nav.career',
      'PPID': 'nav.ppid',
      'Dashboard': 'nav.dashboard',
      'Prosedur Operasional Standar': 'nav.sop',
      'Admin': 'nav.admin'
    };
    return texts;
  }, []);

  // Use standard translation hook
  const { t } = useTranslation();

  // Create translated navigation items
  const translatedNavigationItems = useMemo(() => {
    return navigationItems.map(item => ({
      ...item,
      name: t(allTexts[item.name] || `nav.${item.name.toLowerCase().replace(/\s+/g, '')}`) || item.name,
      subItems: item.subItems ? item.subItems.map(subItem => ({
        ...subItem,
        name: t(allTexts[subItem.name] || `nav.${subItem.name.toLowerCase().replace(/\s+/g, '')}`) || subItem.name
      })) : undefined
    }));
  }, [navigationItems, t, allTexts]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-heritage ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-md border-b border-border heritage-glow' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          {/* Main navigation */}
          <nav className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12x w-[1.5rem] h-12x bg-gradient-to-brx from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <img src={logo} alt="Logo" className='w-[3rem]'/>
              </div>
              <div>
                <h1 className="text-xl font-bold text-heritage-gradient">
                  {language === 'id' ? 'Museum dan Cagar Budaya' : 'Museum and Cultural Heritage'}
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8 text-[1rem]">
              {translatedNavigationItems.map((item) => (
                item.subItems ? (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className={`transition-heritage font-medium ${
                        item.subItems.some(subItem => location.pathname === subItem.href)
                          ? 'text-primary border-b-2 border-primary' 
                          : 'text-foreground hover:text-primary'
                      }`}>
                        {item.name}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {item.subItems.map((subItem) => (
                        <DropdownMenuItem key={subItem.name} asChild>
                          <Link 
                            to={subItem.href}
                            className={`w-full ${
                              location.pathname === subItem.href ? 'bg-primary/10' : ''
                            } cursor-pointer`}
                          >
                            {subItem.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`transition-heritage font-medium ${
                      location.pathname === item.href
                        ? 'text-primary border-b-2 border-primary' 
                        : 'text-foreground hover:text-primary'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <LanguageSwitcher />
            </div>

            {/* Mobile Language Switcher & Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <LanguageSwitcher />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-background/95 backdrop-blur-md" />
          <div className="fixed right-0 top-20 bottom-0 w-64 bg-card border-l border-border p-6 overflow-y-auto">
            <nav className="space-y-4 pb-8">
              {translatedNavigationItems.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className={`block transition-heritage font-medium py-2 ${
                      location.pathname === item.href 
                        ? 'text-primary bg-primary/10' 
                        : 'text-foreground hover:text-primary'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.subItems && (
                    <div className="ml-4 space-y-2 mt-2">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className={`block transition-heritage font-medium py-1 text-sm ${
                            location.pathname === subItem.href 
                              ? 'text-primary bg-primary/10' 
                              : 'text-muted-foreground hover:text-primary'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
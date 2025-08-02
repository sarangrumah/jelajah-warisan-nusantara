import { useState, useEffect } from 'react';
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
import { useTranslation } from 'react-i18next';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { name: t('nav.beranda'), href: '/beranda' },
    { name: t('nav.agenda'), href: '/agenda' },
    { 
      name: t('nav.tentangKami'), 
      href: '/tentang-kami',
      subItems: [
        { name: 'Profil Perusahaan', href: '/tentang-kami/profil-perusahaan' },
        { name: t('nav.tentangKami'), href: '/tentang-kami' },
        { name: t('nav.mediaPublikasi'), href: '/media-publikasi' },
        { name: t('nav.hubungiKami'), href: '/hubungi-kami' },
        { name: t('nav.career'), href: '/career' },
      ]
    },
    { name: t('nav.ppid'), href: '/ppid' },
    { name: t('nav.admin'), href: '/admin' },
  ];

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
              <div className="w-12x w-[5rem] h-12x bg-gradient-to-brx from-primary to-primary-glow rounded-lg flex items-center justify-center">
                {/* <span className="text-primary-foreground font-bold text-xl">
                </span> */}
                <img src="/src/assets/images/logo/MCB Logo_Putih.png" alt="Logo" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-heritage-gradient">
                  Museum dan Cagar Budaya
                </h1>
                <p className="text-sm text-muted-foreground">
                  Republik Indonesia
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
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
                            }`}
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

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-background/95 backdrop-blur-md" />
          <div className="fixed right-0 top-0 h-full w-64 bg-card border-l border-border p-6 mt-20">
            <nav className="space-y-4">
              {navigationItems.map((item) => (
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
              <div className="pt-4 border-t border-border">
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
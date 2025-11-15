import { Phone, Mail, MapPin, Instagram, Youtube } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBatchTranslateOptimized } from '@/hooks/useBatchTranslateOptimized';
import logo from '@/assets/images/logo/MCB Logo_Putih_notext.png';

const Footer = () => {
  const { language } = useLanguage();
  
  // Collect all texts that need translation
  const footerTexts = {
    contactUs: 'Hubungi Kami',
    phone: 'Telepon',
    email: 'Email',
    address: 'Alamat',
    quickLinks: 'Tautan Cepat',
    socialMedia: 'Media Sosial',
    copyright: 'Hak Cipta © 2024 Museum dan Cagar Budaya. Semua Hak Dilindungi.',
    privacy: 'Kebijakan Privasi',
    terms: 'Syarat & Ketentuan',
    sitemap: 'Peta Situs',
    beranda: 'Beranda',
    agenda: 'Agenda',
    tentangKami: 'Tentang Kami',
    strukturOrganisasi: 'Struktur Organisasi',
    layananKonservasi: 'Layanan Konservasi',
    mediaPublikasi: 'Media & Publikasi',
    pemanfaatanAset: 'Pemanfaatan Aset',
    hubungiKami: 'Hubungi Kami',
    karir: 'Karir',
    ppid: 'PPID',
    sop: 'SOP'
  };

  // Batch translate all footer texts at once
  const { translations } = useBatchTranslateOptimized(footerTexts, { debounceMs: 50 });

  const orgName = language === 'id' ? 'Museum dan Cagar Budaya' : 'Museum and Cultural Heritage';
  const ministry = language === 'id' ? 'Kementerian Kebudayaan Republik Indonesia' : 'Ministry of Culture Republic of Indonesia';
  const contactUs = translations.contactUs || 'Hubungi Kami';
  const phone = translations.phone || 'Telepon';
  const email = translations.email || 'Email';
  const address = translations.address || 'Alamat';
  const quickLinks = translations.quickLinks || 'Tautan Cepat';
  const socialMedia = translations.socialMedia || 'Media Sosial';
  const copyright = translations.copyright || 'Hak Cipta © 2024 Museum dan Cagar Budaya. Semua Hak Dilindungi.';
  const privacy = translations.privacy || 'Kebijakan Privasi';
  const terms = translations.terms || 'Syarat & Ketentuan';
  const sitemap = translations.sitemap || 'Peta Situs';

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/indonesianheritageagency/', label: 'Instagram' },
    { icon: Youtube, href: 'https://www.youtube.com/@IndonesianHeritageAgency', label: 'YouTube' },
  ];

  // Quick links with translated text
  const translatedQuickLinks = [
    { label: translations.beranda || 'Beranda', href: '/beranda' },
    { label: translations.agenda || 'Agenda', href: '/agenda' },
    { label: translations.tentangKami || 'Tentang Kami', href: '/tentang-kami' },
    { label: translations.strukturOrganisasi || 'Struktur Organisasi', href: '/struktur-organisasi' },
    { label: translations.layananKonservasi || 'Layanan Konservasi', href: '/laboratorium-konservasi' },
    { label: translations.mediaPublikasi || 'Media & Publikasi', href: '/media-publikasi' },
    { label: translations.pemanfaatanAset || 'Pemanfaatan Aset', href: '/pemanfaatan-aset' },
    { label: translations.hubungiKami || 'Hubungi Kami', href: '/hubungi-kami' },
    { label: translations.karir || 'Karir', href: '/karir' },
    { label: translations.ppid || 'PPID', href: '/ppid' },
    { label: translations.sop || 'SOP', href: '/prosedur-operasional-standar' },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {/* Logo and Ministry Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 gap-3">
              <div className="w-12x h-12x bg-gradient-to-brx from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <img src={logo} alt="Logo" className='w-[5rem] h-[5rem]x' />
              </div>
              <div>
                <h3 className="text-lg font-bold text-heritage-gradient">
                  {orgName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {ministry}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">{contactUs}</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-primary" />
                <span className="text-sm text-muted-foreground">+62 21 12345678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-primary" />
                <span className="text-sm text-muted-foreground">info@museumbudaya.go.id</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-primary mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  {language === 'id' 
                    ? 'Jl. Medan Merdeka Barat No. 12, Jakarta Pusat 10110' 
                    : 'Jl. Medan Merdeka Barat No. 12, Central Jakarta 10110'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">{quickLinks}</h4>
            <div className='flex gap-x-5 w-full'>
              <div className="space-y-2">
                {translatedQuickLinks.slice(0, 5).map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-muted-foreground hover:text-primary transition-heritage"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="space-y-2">
                {translatedQuickLinks.slice(5, 10).map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-muted-foreground hover:text-primary transition-heritage"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">{socialMedia}</h4>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target='_blank'
                  className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-heritage"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            {copyright}
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-heritage">
              {privacy}
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-heritage">
              {terms}
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-heritage">
              {sitemap}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
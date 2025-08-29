import { Phone, Mail, MapPin, Instagram, Youtube } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from '@/assets/images/logo/MCB Logo_Putih_notext.png';

const Footer = () => {
  const { t } = useTranslation();
  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/indonesianheritageagency/', label: 'Instagram' },
    { icon: Youtube, href: 'https://www.youtube.com/@IndonesianHeritageAgency', label: 'YouTube' },
  ];

  const quickLinks = [
    'Beranda', 'Agenda', 'Tentang Kami', 'Struktur Organisasi', 'Laboratorium Konservasi', 'Berita & Publikasi', 
    'Hubungi Kami', 'Career', 'PPID', 'Prosedur Operasional Standar', 'Pengaturan',
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {/* Logo and Ministry Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 gap-3">
              <div className="w-12x h-12x bg-gradient-to-brx from-primary to-primary-glow rounded-lg flex items-center justify-center">
                {/* <span className="text-primary-foreground font-bold text-xl">M</span> */}
                <img src={logo} alt="Logo" className='w-[5rem] h-[5rem]x' />

              </div>
              <div>
                <h3 className="text-lg font-bold text-heritage-gradient">
                  {t('footer.orgName')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Kementerian Kebudayaan Republik Indonesia
                </p>
              </div>
            </div>
            {/* <p className="text-sm text-muted-foreground leading-relaxed">
              Kementerian Kebudayaan
            </p> */}
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Kontak Kami</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-primary" />
                <span className="text-sm text-muted-foreground">{t('footer.phone')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-primary" />
                <span className="text-sm text-muted-foreground">{t('footer.email')}</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-primary mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  {t('footer.address')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">{t('footer.quickLinks')}</h4>
            <div className='flex gap-x-5 w-full'>
              <div className="space-y-2">
                {quickLinks.map((link) => (
                  <a
                    key={link}
                    href={`${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-heritage"
                  >
                    {link}
                  </a>
                )).slice(0, 6)}
              </div>
              <div className="space-y-2">
                {quickLinks.map((link) => (
                  <a
                    key={link}
                    href={`${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-heritage"
                  >
                    {link}
                  </a>
                )).slice(6, 12)}
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">{t('footer.socialMedia')}</h4>
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
            {t('footer.copyright')}
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-heritage">
              {t('footer.privacy')}
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-heritage">
              {t('footer.terms')}
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-heritage">
              {t('footer.sitemap')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
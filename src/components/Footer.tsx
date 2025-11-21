import { Phone, Mail, MapPin, Instagram, Youtube } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import logo from '@/assets/images/logo/MCB Logo_Putih_notext.png';

const Footer = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();

  const orgName = t('footer.orgName');
  const ministry = t('footer.ministry');
  const contactUs = t('footer.contactUs');
  const phone = t('footer.phone');
  const email = t('footer.email');
  const address = t('footer.address');
  const quickLinks = t('footer.quickLinks');
  const socialMedia = t('footer.socialMedia');
  const copyright = t('footer.copyright');
  const privacy = t('footer.privacy');
  const terms = t('footer.terms');
  const sitemap = t('footer.sitemap');

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/indonesianheritageagency/', label: 'Instagram' },
    { icon: Youtube, href: 'https://www.youtube.com/@IndonesianHeritageAgency', label: 'YouTube' },
  ];

  // Quick links with translated text
  const translatedQuickLinks = [
    { label: t('nav.beranda'), href: '/beranda' },
    { label: t('nav.agenda'), href: '/agenda' },
    { label: t('nav.tentangKami'), href: '/tentang-kami' },
    { label: t('nav.strukturOrganisasi'), href: '/struktur-organisasi' },
    { label: t('nav.layananKonservasi'), href: '/laboratorium-konservasi' },
    { label: t('nav.mediaPublikasi'), href: '/media-publikasi' },
    { label: t('nav.pemanfaatanAset'), href: '/pemanfaatan-aset' },
    { label: t('nav.hubungiKami'), href: '/hubungi-kami' },
    { label: t('nav.career'), href: '/karir' },
    { label: t('nav.ppid'), href: '/ppid' },
    { label: t('nav.sop'), href: '/prosedur-operasional-standar' },
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
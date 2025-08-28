import { MessageCircle, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FloatingButtons = () => {
  const socialMedia = [
    { icon: Instagram, href: 'https://www.instagram.com/indonesianheritageagency/', label: 'Instagram' },
    { icon: Youtube, href: 'https://www.youtube.com/@IndonesianHeritageAgency', label: 'YouTube' },
  ];

  return (
    <>
      {/* WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-[rgba(13,148,136,0.75)] hover:bg-[rgba(0, 82, 75, 0.75)] heritage-glow shadow-lg float-animation"
          onClick={() => window.open('https://wa.me/6281295953929', '_blank')}
        >
          <MessageCircle size={24} className="text-white" />
        </Button>
      </div>

      {/* Social Media Buttons - Vertical Stack */}
      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-4 max-md:hidden">
        {socialMedia.map((social, index) => (
          <Button
            key={social.label}
            size="icon"
            variant="secondary"
            className="rounded-full w-12 h-12 cultural-shadow hover:scale-110 transition-bounce bg-[rgba(13,148,136,0.75)]"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => window.open(social.href, '_blank')}
          >
            <social.icon size={20} />
          </Button>
        ))}
      </div>
    </>
  );
};

export default FloatingButtons;
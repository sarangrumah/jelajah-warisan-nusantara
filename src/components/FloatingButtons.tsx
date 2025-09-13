import { MessageCircle, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FloatingButtons = () => {
  const socialMedia = [
    { icon: Instagram, href: 'https://www.instagram.com/indonesianheritageagency/', label: 'Instagram', color: '#E4405F' },
    { icon: Youtube, href: 'https://www.youtube.com/@IndonesianHeritageAgency', label: 'YouTube', color: '#FF0000' },
  ];

  return (
    <>
      {/* Social Media Buttons - Vertical Stack above chat button */}
      <div className="fixed flex flex-col gap-3 z-50" style={{ right: 24, bottom: 110 }}>
        {socialMedia.map((social, index) => (
          <button
            key={social.label}
            title={social.label}
            aria-label={social.label}
            onClick={() => window.open(social.href, '_blank')}
            style={{
              background: social.color,
              color: "#fff",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px #0002",
              fontSize: 22,
              transition: "transform 0.2s",
            }}
            tabIndex={0}
          >
            <social.icon size={22} />
          </button>
        ))}
      </div>

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
    </>
  );
};

export default FloatingButtons;
import { MessageCircle, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FloatingButtons = () => {
  const socialMedia = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ];

  return (
    <>
      {/* WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 heritage-glow shadow-lg float-animation"
          onClick={() => window.open('https://wa.me/6212345678', '_blank')}
        >
          <MessageCircle size={24} className="text-white" />
        </Button>
      </div>

      {/* Social Media Buttons */}
      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-40 space-y-3">
        {socialMedia.map((social, index) => (
          <Button
            key={social.label}
            size="icon"
            variant="secondary"
            className="rounded-full w-12 h-12 cultural-shadow hover:scale-110 transition-bounce"
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
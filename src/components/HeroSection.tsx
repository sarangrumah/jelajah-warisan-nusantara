import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslate } from '@/hooks/useTranslate';
import { bannerService } from '@/lib/api-services';
import { defaultSlides } from '@/../database/default-data';
import { assetUrl } from '@/lib/asset-url';

function isImage(filename: string) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
}
function isVideo(filename: string) {
  return /\.(mp4|webm|ogg)$/i.test(filename);
}

const mapSlidesWithImageUrl = (slidesArr: any[]) =>
  slidesArr.map(slide => {
    const originalPath = slide.image_url || slide.image;
    const transformedPath = assetUrl(originalPath) || '/placeholder.svg';
    
    return {
      ...slide,
      asset: slide.image?.split('/').pop() || slide.image,
      image: transformedPath,
    };
  });

interface HeroSectionProps {
  onScrollToNextSection?: () => void;
}

const HeroSlideContent = ({ slide }: { slide: any }) => {
    const { translatedText: title } = useTranslate(slide.title);
    const { translatedText: subtitle } = useTranslate(slide.subtitle);
    const { translatedText: buttonLabel1 } = useTranslate(slide.button_label_1);
    const { translatedText: buttonLabel2 } = useTranslate(slide.button_label_2);

    const linkTo = (slideURL: string) => {
        if(slideURL === 'museum') {      
            return `/museums`;
        } else if(slideURL === 'heritage') {
            return `/heritage`
        } else {
            return `/collection`;
        }
    }

    return (
        <div className="max-w-4xl mx-auto scroll-reveal">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-6 text-heritage-gradientx pb-5" dangerouslySetInnerHTML={{ __html: title }} />
            <p className="text-xl md:text-2xl mb-8 text-foreground/90 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: subtitle }} />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {slide?.button_url_1 && buttonLabel1 && (
                <Link to={linkTo((slide.button_url_1 || '').split('.')[1] || '')}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-semibold transition-bounce"
                  >
                    {buttonLabel1}
                  </Button>
                </Link>
              )}
              {slide?.button_url_2 && buttonLabel2 && (
                <Link to={linkTo((slide.button_url_2 || '').split('.')[1] || '')}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-semibold transition-bounce"
                  >
                    {buttonLabel2}
                  </Button>
                </Link>
              )}
            </div>
        </div>
    );
}

const HeroSection = ({ onScrollToNextSection }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasSnappedRef = useRef(false);

  useEffect(() => {
    const handleSnapScroll = (e: WheelEvent | TouchEvent) => {
      if (hasSnappedRef.current) { return; }
      const section = sectionRef.current;
      if (!section) { return; }

      if ('deltaY' in e && (e as WheelEvent).deltaY > 0) {
        e.preventDefault();
        hasSnappedRef.current = true;
        if (onScrollToNextSection) { onScrollToNextSection(); }
      }
      if ('touches' in e && e.type === 'touchend') {
        const touchEndY = (e as TouchEvent).changedTouches[0].clientY;
        if (section.dataset.touchStartY && Number(section.dataset.touchStartY) - touchEndY > 30) {
          e.preventDefault();
          hasSnappedRef.current = true;
          if (onScrollToNextSection) { onScrollToNextSection(); }
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (sectionRef.current) {
        sectionRef.current.dataset.touchStartY = String(e.touches[0].clientY);
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('wheel', handleSnapScroll, { passive: false });
      section.addEventListener('touchstart', handleTouchStart, { passive: true });
      section.addEventListener('touchend', handleSnapScroll, { passive: false });
    }
    return () => {
      if (section) {
        section.removeEventListener('wheel', handleSnapScroll);
        section.removeEventListener('touchstart', handleTouchStart);
        section.removeEventListener('touchend', handleSnapScroll);
      }
    };
  }, [onScrollToNextSection]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, _setIsVideoPlaying] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentSlideObj = slides.length > 0 ? slides[currentSlide] : null;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVideoPlaying && slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides.length, isVideoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  };

  const prevSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };
  
  const fetchSlides = async () => {
    try {
      const response = await bannerService.getAll();
      if (response.error || !response.data || response.data.length === 0) {
        console.error('Error fetching slides:', response.error);
        setSlides(mapSlidesWithImageUrl(defaultSlides));
      } else {
        const filteredSlides = response.data
          .filter((slide: any) => (
            slide.is_active === true
            && slide.is_approved === true
            && new Date(slide.start_publish_date) <= new Date()
            && new Date(slide.end_publish_date) >= new Date()
          ))
          .map((slide: any) => ({
            ...slide,
            image: slide.image && !slide.image.startsWith('/uploads/hero-sections/')
              ? `/uploads/hero-sections/${slide.image.split('/').pop()}`
              : slide.image
          }));
        setSlides(mapSlidesWithImageUrl(filteredSlides));
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
    }
  };

  useEffect(() => {
    fetchSlides();
  },[]);

  return (
    <section
      id="beranda"
      className="relative h-screen overflow-hidden"
      ref={sectionRef}
    >
      <div className="absolute inset-0">
        {slides && slides.map((slide, index) => {
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {isImage(slide.asset) ? (
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover parallax"
                  onError={(e) => {
                    console.error('[HeroSection] Image failed to load:', slide.image);
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              ) : isVideo(slide.asset) ? (
                <video
                  src={slide.image}
                  controls
                  className="w-full h-full object-cover parallax"
                  onError={() => {
                    console.error('[HeroSection] Video failed to load:', slide.image);
                  }}
                />
              ) : (
                <img
                  src="/placeholder.svg"
                  alt="Not found"
                  className="w-full h-full object-cover parallax"
                />
              )}
              <div className="absolute inset-0 overlay-gradient" />
            </div>
          );
        })}
        {isLoading && (
          <div className="absolute inset-0 bg-card/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
            {currentSlideObj && <HeroSlideContent slide={currentSlideObj} />}
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-background/20 backdrop-blur-md border border-border/30 rounded-full p-3 hover:bg-background/40 transition-heritage"
      >
        <ChevronLeft size={24} className="text-foreground" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-background/20 backdrop-blur-md border border-border/30 rounded-full p-3 hover:bg-background/40 transition-heritage"
      >
        <ChevronRight size={24} className="text-foreground" />
      </button>

      {!isLoading && slides.length > 0 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-heritage ${
                index === currentSlide
                  ? 'bg-primary heritage-glow'
                  : 'bg-foreground/30 hover:bg-foreground/50'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;

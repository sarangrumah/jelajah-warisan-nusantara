import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { bannerService, TypesAndCategoriesSites } from '@/lib/api-services';
import { assetUrl } from '@/lib/asset-url';

// <<<<<<< HEAD
// --- Helpers to resolve image/video URLs without triggering Vite glob watchers ---
// =======
// Avoid Vite glob imports on src/assets to prevent HMR reloads when files change
// >>>>>>> origin/main
function isImage(filename: string) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
}
function isVideo(filename: string) {
  return /\.(mp4|webm|ogg)$/i.test(filename);
}

const images = import.meta.glob('/src/assets/images/hero-section/*.{jpg,jpeg,png,gif,webp}', { eager: true, import: 'default' });

function getImageOrVideoUrl(p: string) {
  if (typeof p !== 'string' || p.length === 0) { return ''; }
  // Resolve uploads to API base; keep /assets local references intact
  if (p.startsWith('/uploads/') || p.startsWith('../uploads')) { return assetUrl(p); }
  if (p.startsWith('/src/assets/')) { return p.replace('/src', ''); }
  // If it's just a filename, try to resolve from src/assets/images
  if (/^[\w,\s-]+\.(jpg|jpeg|png|gif|webp)$/i.test(p) && !p.startsWith('/assets/')) {
    const match = Object.entries(images).find(([key]) => key.endsWith('/' + p));
    if (match) {
      return match[1] as string;
    }
    // fallback to previous public assets path for legacy
    return `/assets/images/${p}`;
  }
  return p;
}
const mapSlidesWithImageUrl = (slidesArr: any[]) =>
  slidesArr.map(slide => ({
    ...slide,
    asset: slide.image?.split('/').pop() || slide.image,
    image: getImageOrVideoUrl(slide.image),
  }));

import { useRef } from 'react';

interface HeroSectionProps {
  onScrollToNextSection?: () => void;
}

const HeroSection = ({ onScrollToNextSection }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasSnappedRef = useRef(false);

  useEffect(() => {
    const handleSnapScroll = (e: WheelEvent | TouchEvent) => {
      if (hasSnappedRef.current) { return; }
      // Only trigger if at top of page or HeroSection is in view
      const section = sectionRef.current;
      if (!section) { return; }

      // For wheel event
      if ('deltaY' in e && (e as WheelEvent).deltaY > 0) {
        e.preventDefault();
        hasSnappedRef.current = true;
        if (onScrollToNextSection) { onScrollToNextSection(); }
      }
      // For touch event (swipe up)
      if ('touches' in e && e.type === 'touchend') {
        const touchEndY = (e as TouchEvent).changedTouches[0].clientY;
        if (section.dataset.touchStartY && Number(section.dataset.touchStartY) - touchEndY > 30) {
          e.preventDefault();
          hasSnappedRef.current = true;
          if (onScrollToNextSection) { onScrollToNextSection(); }
        }
      }
    };

    // Touch start to record initial Y
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
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { t } = useTranslation();
  const [slides, setSlides] = useState([]);
  // const [videoList, setVideoList] = useState([]);
  // const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const [types, setTypes] = useState([]);

  // const handleVideoEnded = () => {
  //   setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoList.length);
  // };
  // const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

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
  
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await bannerService.getAll();
        if (response.error) {
          console.error('Error fetching slides:', response.error);
          // setSlides(mapSlidesWithImageUrl(defaultSlides));
        } else {
          const filteredSlides = response.data.filter((slide: any) => (
            slide.is_active === true 
            && slide.is_approved === true 
            && new Date(slide.start_publish_date) <= new Date()
            && new Date(slide.end_publish_date) >= new Date()
          ));
          setSlides(mapSlidesWithImageUrl(filteredSlides));
        }
      } catch (error) {
        console.error('Error fetching slides:', error);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    const fetchTypeSites = async () => {
      try {
        const response = await TypesAndCategoriesSites.getAllTypes();
        if (response.error || response.data.length === 0) {
          console.error('Error fetching types:', response.error);
        } else {
          setTypes(response.data);
        }
      } catch (error) {
        console.error('Error fetching museums:', error);
      }
    }
    fetchTypeSites();
  }, []);

  const linkTo = (slides: string) => {
    const type = types.find((type) => type.name === slides)?.id;
    if(slides === 'museum' || slides === 'heritage') {      
      return `/museums/${type}`;
    } else {
      return `/collection`;
    }
  }

  return (
    <section
      id="beranda"
      className="relative h-screen overflow-hidden"
      ref={sectionRef}
    >
      {/* Background Image Slider */}
      <div className="absolute inset-0">
        {slides && slides.map((slide, index) => {
          console.log('[HeroSection] Rendering slide:', {
            index,
            asset: slide.asset,
            image: slide.image,
            slide
          });
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* --- Improved: Render image or video based on original filename (asset) --- */}
              {isImage(slide.asset) ? (
                <img
                  src={slide.image}
                  alt={t(slide.title)}
                  className="w-full h-full object-cover parallax"
                  onLoad={() => {
                    console.log('[HeroSection] Image loaded:', slide.image);
                  }}
                  onError={() => {
                    console.error('[HeroSection] Image failed to load:', slide.image);
                  }}
                />
              ) : isVideo(slide.asset) ? (
                <video
                  src={slide.image}
                  controls
                  className="w-full h-full object-cover parallax"
                />
              ) : (
                <img
                  src="/public/placeholder.svg"
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

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto scroll-reveal">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-6 text-heritage-gradientx pb-5">
              {slides.length > 0 && t(slides[currentSlide].title)}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-foreground/90 max-w-2xl mx-auto">
              {slides.length > 0 && t(slides[currentSlide].subtitle)}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={slides.length > 0 ? linkTo(slides[currentSlide].button_url_1.split('.')[1]) : "/"}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-semibold transition-bounce"
                >
                  {slides.length > 0 && t(slides[currentSlide].button_url_1)}
                </Button>
              </Link>
              
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-semibold transition-bounce"
                onClick={() => setIsVideoPlaying(true)}
              >
                <Play size={24} className="mr-2" />
                {t('hero.watchVideo')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
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

      {/* Slide Indicators */}
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

      {/* Video Modal */}
      {/*isVideoPlaying && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center">
          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute -top-12 right-0 text-foreground hover:text-primary transition-heritage"
            >
              <span className="text-2xl">×</span>
            </button>
            <div className="aspect-video bg-card rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <video 
                // key={currentVideoIndex}
                // src={getImageUrl(videoList[currentVideoIndex].image)}
                // onEnded={handleVideoEnded} controls autoPlay className="w-full"

              </div>
            </div>
          </div>
        </div>
      )*/}
    {/* (Button removed: snap scroll is now automatic) */}
    </section>
  );
};

export default HeroSection;

import { useState, useEffect, useRef } from 'react';
import { useHybridTranslation } from '@/components/HybridTranslationProvider';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { merchandiseProductService } from '@/lib/api-services';
import { assetUrl } from '@/lib/asset-url';

interface MerchandiseBannerSlide {
  id: string;
  name: string;
  short_description?: string;
  images: string[];
  price: number;
  is_published: boolean;
  is_approved?: boolean;
  is_rejected?: boolean;
  whatsapp_number?: string;
  category?: {
    name: string;
  };
}

interface MerchandiseBannerProps {
  onScrollToNextSection?: () => void;
}

const MerchandiseBanner = ({ onScrollToNextSection }: MerchandiseBannerProps) => {
  const { t } = useHybridTranslation();
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
  const [slides, setSlides] = useState<MerchandiseBannerSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentSlideObj = slides.length > 0 ? slides[currentSlide] : null;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

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

  const fetchFeaturedProducts = async () => {
    try {
      const response = await merchandiseProductService.getAll();
      if (response.error) {
        console.error('Error fetching featured products:', response.error);
        setSlides([]);
      } else {
        // Filter for published and approved products, take first 5 for banner
        const featuredProducts = (response.data as MerchandiseBannerSlide[])
          .filter(product => product.is_published && product.is_approved && !product.is_rejected)
          .slice(0, 5);
        setSlides(featuredProducts);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setSlides([]);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section
      id="merchandise-banner"
      className="relative h-screen overflow-hidden"
      ref={sectionRef}
    >
      <div className="absolute inset-0">
        {slides && slides.map((slide, index) => {
          const imageUrl = slide.images && slide.images.length > 0 
            ? assetUrl(slide.images[0]) || '/placeholder.svg'
            : '/placeholder.svg';
            
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={imageUrl}
                alt={slide.name}
                className="w-full h-full object-cover parallax"
                onError={(e) => {
                  console.error('[MerchandiseBanner] Image failed to load:', imageUrl);
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
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
          {currentSlideObj && (
            <div className="max-w-4xl mx-auto scroll-reveal">
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-6 text-heritage-gradientx pb-5">
                {currentSlideObj.name}
              </h1>
              {currentSlideObj.short_description && (
                <p className="text-xl md:text-2xl mb-8 text-foreground/90 max-w-2xl mx-auto">
                  {currentSlideObj.short_description}
                </p>
              )}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex gap-4">
                  <Link to={`/merchandise/${currentSlideObj.id}`}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-semibold transition-bounce"
                    >
                      {t('merchandise.viewDetails')}
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-semibold transition-bounce"
                    onClick={() => {
                      const whatsappNumber = currentSlideObj.whatsapp_number || '6281234567890';
                      const message = `Halo, saya tertarik dengan produk ${currentSlideObj.name} seharga ${formatPrice(currentSlideObj.price)}. Apakah masih tersedia?`;
                      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                  >
                    {t('merchandise.buyNow')}
                  </Button>
                </div>
              </div>
              {currentSlideObj.category && (
                <div className="mt-4">
                  <span className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium">
                    {currentSlideObj.category.name}
                  </span>
                </div>
              )}
            </div>
          )}
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

export default MerchandiseBanner;
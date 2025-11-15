import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { assetUrl } from '@/lib/asset-url';
import { useHybridTranslation } from '@/components/HybridTranslationProvider';
// Remove old getImageUrl

const BannerSection = () => {
  const { t } = useHybridTranslation();
  const [isLoading, setIsLoading] = React.useState(true);
  const [slides, setSlides] = React.useState([]);
  const [translatedSlides, setTranslatedSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  // TODO: Replace this with API call to fetch banners from backend
  // For now, use a sample with the correct image URL format
  const defaultSlides = [
    {
      title: 'Contoh Banner',
      subtitle: 'Ini adalah contoh banner dengan URL gambar dari upload admin.',
      image: '/uploads/hero-sections/whatsapp-image-2025-09-28-at-15.08.39_40247507.jpg', // Example from your log
    }
  ];

  useEffect(() => {
    if (slides.length > 0) {
      const translated = slides.map(slide => ({
        ...slide,
        title: t(slide.title),
        subtitle: t(slide.subtitle),
      }));
      setTranslatedSlides(translated);
    }
  }, [slides, t]);

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
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  // Log all slide image URLs on render for debugging
  useEffect(() => {
    setSlides(defaultSlides);
  }, [slides]);

  return (
    <section id="beranda" className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        {slides && slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={assetUrl(slide.image)}
              alt={slide.title}
              className="w-full h-full object-cover parallax"
              onLoad={() => {
                setIsLoading(false);
              }}
              onError={() => {
                console.error('[BannerSection] Image failed to load:', slide.image);
                setIsLoading(false);
              }}
            />
            <div className="absolute inset-0 overlay-gradient" />
          </div>
        ))}
        {isLoading && (
          <div className="absolute inset-0 bg-card/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto scroll-reveal">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-heritage-gradientx pb-5">
              {translatedSlides.length > 0 && translatedSlides[currentSlide].title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-8xl mx-autox px-6 pt-5 leading-relaxed">
              {translatedSlides.length > 0 && translatedSlides[currentSlide].subtitle}
            </p>
          </div>
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
    </section>
  )
}

export default BannerSection
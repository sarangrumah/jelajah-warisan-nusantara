import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import heroBorobudur from '@/assets/hero-borobudur.jpg';
import museumInterior from '@/assets/museum-interior.jpg';
import heritageSites from '@/assets/heritage-sites.jpg';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { t } = useTranslation();

  const slides = [
    {
      image: heroBorobudur,
      title: 'Melestarikan Warisan Budaya Indonesia',
      subtitle: 'Mengelola dan melindungi kekayaan budaya nusantara untuk generasi mendatang',
      cta: 'Jelajahi Museum',
    },
    {
      image: museumInterior,
      title: 'Koleksi Bersejarah Nusantara',
      subtitle: 'Menyimpan dan memamerkan artifak berharga dari seluruh Indonesia',
      cta: 'Lihat Koleksi',
    },
    {
      image: heritageSites,
      title: 'Cagar Budaya Indonesia',
      subtitle: 'Melindungi situs-situs bersejarah yang menjadi kebanggaan bangsa',
      cta: 'Temukan Situs',
    },
  ];

  useEffect(() => {
    if (!isVideoPlaying) {
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
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id="beranda" className="relative h-screen overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover parallax"
            />
            <div className="absolute inset-0 overlay-gradient" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto scroll-reveal">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-heritage-gradient">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-foreground/90 max-w-2xl mx-auto">
              {slides[currentSlide].subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="heritage-gradient text-primary-foreground px-8 py-6 text-lg font-semibold heritage-glow hover:scale-105 transition-bounce"
              >
                {slides[currentSlide].cta}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-semibold transition-bounce"
                onClick={() => setIsVideoPlaying(true)}
              >
                <Play size={24} className="mr-2" />
                Tonton Video
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

      {/* Video Modal */}
      {isVideoPlaying && (
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
                <p className="text-muted-foreground">Video player placeholder</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
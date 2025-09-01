import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect } from 'react'

const BannerSection = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [slides, setSlides] = React.useState([]);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const defaultSlides = [
    {
      title: 'Laboratorium Uji Sampel',
      subtitle: 'Museum & Cagar Budaya (Indonesia Heritage Agency) menyediakan fasilitas analisis sampel untuk hasil yang akurat dan terpercaya. Kami berkomitmen untuk memberikan layanan pengujian yang profesional, tepat waktu, dan sesuai dengan standar yang berlaku.',
      image: '/src/assets/conservation/berita1.jpg',
    },
    {
      title: 'Penyewaan Alat',
      subtitle: 'Museum & Cagar Budaya (Indonesian Heritage Agency) menyediakan layanan penyewaan alat berbasis proyek. Untuk melihat alat yang kami sediakan anda dapat memeriksa halaman daftar peralatan.',
      image: '/src/assets/conservation/berita3.jpeg',
    },
    {
      title: 'Edukasi',
      subtitle: 'Museum & Cagar Budaya (Indonesian Heritage Agency) mendorong perluasan kolaborasi bersama pengunjung dan pecinta warisan budaya, pemangku kepentingan dalam negeri, serta institusi mancanegara sebagai komitmen utama.',
      image: '/src/assets/conservation/berita2.jpg',
    }
  ]

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
  useEffect(() => {
    setSlides(defaultSlides);
  }, []);

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
              // src={slide.image?.startsWith('http') ? slide.image : `/src/assets/images/hero-section/${slide.image}` || slide.image}
              src={ slide.image }
              alt={slide.title}
              className="w-full h-full object-cover parallax"
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
              {slides.length > 0 && slides[currentSlide].title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-8xl mx-autox px-6 pt-5 leading-relaxed">
              {slides.length > 0 && slides[currentSlide].subtitle}
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
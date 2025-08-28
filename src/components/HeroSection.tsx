import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { bannerService } from '@/lib/api-services';
import { heroVideoService } from '@/lib/api-services';
import { defaultSlides } from '@/../database/default-data';
import { defaultVideos } from '@/../database/default-data';

const HeroSection = () => {

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { t } = useTranslation();
  const [slides, setSlides] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoList.length);
  };
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
  
  const fetchSlides = async () => {
    try {
      const response = await bannerService.getAll();
      if (response.error) {
        console.log('Error fetching slides:', response.error);
      }
      setSlides(response.data || defaultSlides);
    } catch (error) {
      console.error('Error fetching slides:', error);
    }

  };

  useEffect(() => {
    fetchSlides();
  },[]);

  const fetchVideos = async () => {
    try {
      const response = await heroVideoService.getAll();
      if (response.error) {
        console.log('Error fetching videos:', response.error)
      }
      setVideoList(response.data || defaultVideos);
    } catch (error) {
      console.error('Error fetching videos:', error)
    }
  }

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <section id="beranda" className="relative h-screen overflow-hidden">
      {/* Background Image Slider */}
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
              alt={t(slide.title)}
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

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto scroll-reveal">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-heritage-gradientx pb-5">
              {slides.length > 0 && t(slides[currentSlide].title)}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-foreground/90 max-w-2xl mx-auto">
              {slides.length > 0 && t(slides[currentSlide].subtitle)}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={currentSlide === 0 ? "/museum" : currentSlide === 1 ? "/collection" : "/heritage"}>
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
                <video 
                key={currentVideoIndex} 
                src={videoList[currentVideoIndex].video}
                onEnded={handleVideoEnded} controls autoPlay className="w-full" />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
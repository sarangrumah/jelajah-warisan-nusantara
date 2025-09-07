import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { bannerService, TypesAndCategoriesSites } from '@/lib/api-services';
import { defaultSlides } from '@/../database/default-data';
import { defaultVideos } from '@/../database/default-data';

// --- Vite Dynamic Image Import Solution ---
const heroImages = import.meta.glob('../assets/images/hero-section/*', { eager: true });
function getImageUrl(filename: string) {
  const match = Object.entries(heroImages).find(([path]) => path.endsWith(filename));
  return match ? (match[1] as any).default : filename;
}
const mapSlidesWithImageUrl = (slidesArr: any[]) =>
  slidesArr.map(slide => ({
    ...slide,
    image: getImageUrl(slide.image?.split('/').pop() || slide.image),
  }));

const HeroSection = () => {

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { t } = useTranslation();
  const [slides, setSlides] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [types, setTypes] = useState([]);

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
  
  // --- Vite-compatible fetchSlides with image mapping ---
  const fetchSlides = async () => {
    try {
      const response = await bannerService.getAll();
      const imageResponse = response.data.filter((slide: any) => slide.media_type === 'image').sort((a: any, b: any) => b.id.localeCompare(a.id));
      const videoResponse = response.data.filter((slide: any) => slide.media_type === 'video').sort((a: any, b: any) => b.id.localeCompare(a.id));
      if (response.error || response.data.length === 0) {
        setSlides(mapSlidesWithImageUrl(defaultSlides));
        setVideoList(mapSlidesWithImageUrl(defaultVideos));
      } else {
        setSlides(mapSlidesWithImageUrl(imageResponse));
        setVideoList(mapSlidesWithImageUrl(videoResponse));
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
      setSlides(mapSlidesWithImageUrl(defaultSlides));
    }
  };

  useEffect(() => {
    fetchSlides();
  },[]);

  const fetchTypeSites = async () => {
    try {
      const response = await TypesAndCategoriesSites.getAllTypes();
      if (response.error || response.data.length === 0) {
        console.error('Error fetching tyes:', response.error);
      } else {
        setTypes(response.data);
      }
    } catch (error) {
      console.error('Error fetching museums:', error);
    }
  }

  useEffect(() => {
    fetchTypeSites();
  },[]);

  const linkTo = (slides: string) => {
    const type = types.find((type) => type.name === slides)?.id;
    if(slides === 'museum' || slides === 'heritage') {      
      return `/museums/${type}`;
    } else {
      return `/collection`;
    }
  }

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
            {/* --- Vite Dynamic Image Import Solution --- */}
            <img
              src={ getImageUrl(slide.image) }
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
                src={getImageUrl(videoList[currentVideoIndex].image)}
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
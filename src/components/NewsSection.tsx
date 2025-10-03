import * as React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { mediaService } from '@/lib/api-services';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';

const newsImages = import.meta.glob('../assets/news/*', { eager: true });

function getNewsImageUrl(filename: string) {
  if (
    typeof filename === 'string' &&
    (filename.startsWith('http://') ||
      filename.startsWith('https://') ||
      filename.startsWith('/assets/'))
  ) {
    return filename;
  }
  const justFile = filename?.split('/').pop() || filename;
  const match = Object.entries(newsImages).find(([path]) => path.endsWith(justFile));
  if (match) {
    return (match[1] as any).default;
  }
  // Fallback: try public/assets/news/ for production
  if (justFile) {
    return `/assets/news/${justFile}`;
  }
  return undefined;
}

const NewsSection = () => {
  const [carouselApi, setCarouselApi] = React.useState(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [news, setNews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch news from tb_media
  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    mediaService.getAll()
      .then((response) => {
        if (mounted) {
          if (response.error) {
            console.error('Error fetching news:', response.error);
            setNews([]);
          } else {
            // Only show news that are active and approved
            setNews((response.data || []).filter(
              (item: any) => item.is_active === true && item.is_approved === true
            ));
          }
        }
      })
      .catch((err) => {
        if (mounted) {
          console.error('Error fetching news:', err);
          setNews([]);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  // Accessibility: Announce slide changes
  const totalSlides = news.length;

  // Auto-slide logic
  React.useEffect(() => {
    if (!carouselApi || isPaused) { return; }
    const interval = setInterval(() => {
      if (carouselApi) {
        carouselApi.scrollNext();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselApi, isPaused, news]);

  // Update current index for live region
  React.useEffect(() => {
    if (!carouselApi) { return; }
    const onSelect = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap() ?? 0);
    };
    carouselApi.on('select', onSelect);
    onSelect();
    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi, news]);

  // Pause on hover/focus, resume on mouse leave/blur
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleFocus = () => setIsPaused(true);
  const handleBlur = () => setIsPaused(false);

  // Diagnostic log for Embla API
  React.useEffect(() => {
    if (carouselApi) {
      // eslint-disable-next-line no-console
      console.log('[NewsSection] Carousel API set:', carouselApi);
    }
  }, [carouselApi]);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-heritage-gradient">
            Berita & Artikel
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ikuti perkembangan terbaru seputar museum, cagar budaya, dan kegiatan pelestarian
            warisan budaya Indonesia.
          </p>
        </div>

        <div className="relative mb-12">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <span className="text-lg text-muted-foreground">Memuat berita...</span>
            </div>
          ) : (
            <Carousel
              setApi={setCarouselApi}
              aria-label="News Carousel"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              <CarouselPrevious
                className="h-16 w-16 text-3xl focus:ring-2 focus:ring-primary -left-20 z-20"
                size="icon"
                aria-label="Previous slide"
                onClick={() => { setIsPaused(true); carouselApi?.scrollPrev(); }}
              />
              <CarouselNext
                className="h-16 w-16 text-3xl focus:ring-2 focus:ring-primary -right-20 z-20"
                size="icon"
                aria-label="Next slide"
                onClick={() => { setIsPaused(true); carouselApi?.scrollNext(); }}
              />
              <CarouselContent>
                {news.map((article, index) => (
                  <CarouselItem
                    key={article.id}
                    className="md:basis-1/2 lg:basis-1/3"
                    aria-label={`Slide ${index + 1} of ${news.length}`}
                  >
                    <Card className="overflow-hidden scroll-reveal heritage-glow hover:scale-105 transition-bounce h-full flex flex-col">
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={getNewsImageUrl(article.image || article.image_url)}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                            {article.category || article.categories}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {article.excerpt || article.subtitle || article.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>
                              {article.date
                                ? new Date(article.date).toLocaleDateString('id-ID')
                                : article.published_date
                                  ? new Date(article.published_date).toLocaleDateString('id-ID')
                                  : ''}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User size={14} />
                            <span>
                              {Array.isArray(article.author)
                                ? article.author.join(', ')
                                : article.author}
                            </span>
                          </div>
                        </div>
                        <Link to={`/news/${article.id}`} className="flex items-center gap-2 text-primary hover:text-primary-glow transition-colors mt-auto">
                          Baca Selengkapnya
                          <ArrowRight size={16} />
                        </Link>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* Pause/Resume Button */}
              {/* <div className="absolute right-4 bottom-4 z-10">
                <button
                  onClick={() => setIsPaused((p) => !p)}
                  aria-pressed={isPaused}
                  aria-label={isPaused ? "Resume auto-slide" : "Pause auto-slide"}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded focus:ring-2 focus:ring-primary"
                  tabIndex={0}
                >
                  {isPaused ? "Resume" : "Pause"}
                </button>
              </div> */}
              {/* Live region for screen readers */}
              <div className="sr-only" aria-live="polite" aria-atomic="true">
                {news[currentIndex]
                  ? `Showing slide ${currentIndex + 1} of ${news.length}: ${news[currentIndex].title}`
                  : ""}
              </div>
            </Carousel>
          )}
        </div>

        <div className="text-center scroll-reveal">
          <Link to={'/media-publikasi'}>
            <button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-bounce heritage-glow">
              Lihat Semua Berita
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
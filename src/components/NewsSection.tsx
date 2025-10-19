import * as React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { mediaService } from '@/lib/api-services';
import { useTranslation } from 'react-i18next';
import { useContentTranslation } from '@/hooks/useContentTranslation';
// Utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
}

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
  const { t } = useTranslation();
  const [carouselApi, setCarouselApi] = React.useState(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [news, setNews] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { translatedContent: translatedNews, isTranslating } = useContentTranslation(news);

  // Fetch news from tb_media
  React.useEffect(() => {
    let mounted = true;
    console.log('🔍 NewsSection: Starting to fetch news data...');
    setLoading(true);
    mediaService.getAll()
      .then((response) => {
        if (mounted) {
          console.log('🔍 NewsSection: API response received:', response);
          if (response.error) {
            console.error('❌ NewsSection: Error fetching news:', response.error);
            setNews([]);
          } else {
            const rawData = response.data || [];
            console.log('🔍 NewsSection: Raw data length:', rawData.length);

            // Only show news that are active and approved
            const sortedAndFilteredNews = rawData
              .filter((item: any) => {
                console.log('🔍 NewsSection: Checking item:', item.id, 'is_active:', item.is_active, 'is_approved:', item.is_approved);
                return item.is_active === true && item.is_approved === true;
              })
              .sort((a: any, b: any) => new Date(b.published_date || b.date).getTime() - new Date(a.published_date || a.date).getTime());

            console.log('🔍 NewsSection: Filtered and sorted news:', sortedAndFilteredNews.length);

            // Slice to get only the latest 6 news
            const finalNews = sortedAndFilteredNews.slice(0, 6);
            console.log('🔍 NewsSection: Final news to display:', finalNews.length);
            setNews(finalNews);
          }
        }
      })
      .catch((err) => {
        if (mounted) {
          console.error('❌ NewsSection: Error fetching news:', err);
          setNews([]);
        }
      })
      .finally(() => {
        if (mounted) {
          console.log('🔍 NewsSection: Loading finished');
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

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

  // Enhanced diagnostic logging
  React.useEffect(() => {
    console.log('🔍 NewsSection: Component mounted and running');
    console.log('🔍 NewsSection: Current state - loading:', loading, 'news length:', news.length, 'isTranslating:', isTranslating);
    console.log('🔍 NewsSection: Translation hook state - translatedNews length:', translatedNews?.length || 0);

    // Check if component is actually rendering
    const timer = setTimeout(() => {
      console.log('🔍 NewsSection: Still alive after 100ms - checking DOM presence');
      const newsSection = document.querySelector('section.py-20.bg-background');
      console.log('🔍 NewsSection: DOM element found:', !!newsSection);
      if (newsSection) {
        console.log('🔍 NewsSection: Element classes:', newsSection.className);
        console.log('🔍 NewsSection: Element visibility:', getComputedStyle(newsSection).display);
        console.log('🔍 NewsSection: Element opacity:', getComputedStyle(newsSection).opacity);
        console.log('🔍 NewsSection: Element height:', getComputedStyle(newsSection).height);
        console.log('🔍 NewsSection: Element position:', getComputedStyle(newsSection).position);
        console.log('🔍 NewsSection: Element top:', getComputedStyle(newsSection).top);
        console.log('🔍 NewsSection: Element z-index:', getComputedStyle(newsSection).zIndex);

        // Check if element is in viewport
        const rect = newsSection.getBoundingClientRect();
        console.log('🔍 NewsSection: Element bounding rect:', rect);
        console.log('🔍 NewsSection: Is in viewport:', rect.top < window.innerHeight && rect.bottom > 0);

        // Check scroll-reveal elements specifically
        const scrollRevealElements = newsSection.querySelectorAll('.scroll-reveal');
        console.log('🔍 NewsSection: Found scroll-reveal elements:', scrollRevealElements.length);
        scrollRevealElements.forEach((el, index) => {
          const classes = el.className;
          const hasRevealed = classes.includes('revealed');
          const opacity = getComputedStyle(el).opacity;
          const transform = getComputedStyle(el).transform;
          console.log(`🔍 NewsSection: Scroll-reveal element ${index}:`, {
            classes,
            hasRevealed,
            opacity,
            transform,
            inView: el.getBoundingClientRect().top < window.innerHeight && el.getBoundingClientRect().bottom > 0
          });
        });

        // Check for any parent elements that might be hiding it
        let parent = newsSection.parentElement;
        let depth = 0;
        while (parent && depth < 5) {
          const parentStyle = getComputedStyle(parent);
          if (parentStyle.display === 'none' || parentStyle.visibility === 'hidden' || parseFloat(parentStyle.opacity) === 0) {
            console.log('🔍 NewsSection: Hidden parent found:', parent.tagName, parent.className);
            console.log('🔍 NewsSection: Hidden parent display:', parentStyle.display);
            console.log('🔍 NewsSection: Hidden parent visibility:', parentStyle.visibility);
            console.log('🔍 NewsSection: Hidden parent opacity:', parentStyle.opacity);
          }
          parent = parent.parentElement;
          depth++;
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [loading, news.length, isTranslating, translatedNews?.length]);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {(() => { console.log('🔍 NewsSection: Component is rendering'); return null; })()}
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-heritage-gradient">
            {t('news.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('news.subtitle')}
          </p>
        </div>

        <div className="relative mb-12">
          {(() => {
            console.log('🔍 NewsSection: Render state - loading:', loading, 'isTranslating:', isTranslating, 'news length:', news.length);
            return null;
          })()}
          {loading || isTranslating ? (
            <div className="flex items-center justify-center h-64">
              {(() => { console.log('🔍 NewsSection: Showing loading state'); return null; })()}
              <span className="text-lg text-muted-foreground">{t('news.loading')}</span>
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
                {(() => {
                  // Fix the logic: if translatedNews is empty or null, use news
                  const newsToShow = (translatedNews && translatedNews.length > 0) ? translatedNews : news;
                  console.log('🔍 NewsSection: translatedNews:', translatedNews?.length || 0, 'news:', news.length, 'newsToShow:', newsToShow.length);
                  if (newsToShow.length === 0) {
                    console.log('⚠️ NewsSection: No news items to display');
                    return (
                      <div className="flex items-center justify-center h-64 col-span-full">
                        <span className="text-lg text-muted-foreground">No news available</span>
                      </div>
                    );
                  }
                  return newsToShow.map((article, index) => (
                    <CarouselItem
                      key={article.id}
                      className="md:basis-1/2 lg:basis-1/3"
                      aria-label={`Slide ${index + 1} of ${newsToShow.length}`}
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
                          <span
                            dangerouslySetInnerHTML={{
                              __html: fixBrokenHtmlTags(article.title)
                            }}
                          />
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: fixBrokenHtmlTags(article.excerpt || article.subtitle || article.description)
                            }}
                          />
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
                          {t('news.button.readMore')}
                          <ArrowRight size={16} />
                        </Link>
                      </CardContent>
                    </Card>
                    </CarouselItem>
                  ));
                })()}
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
                {(() => {
                  const newsToShow = (translatedNews && translatedNews.length > 0) ? translatedNews : news;
                  return newsToShow[currentIndex]
                    ? `Showing slide ${currentIndex + 1} of ${newsToShow.length}: ${newsToShow[currentIndex].title}`
                    : "";
                })()}
              </div>
            </Carousel>
          )}
        </div>

        <div className="text-center scroll-reveal">
          <Link to={'/media-publikasi'}>
            <button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-bounce heritage-glow">
              {t('news.button.viewAll')}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
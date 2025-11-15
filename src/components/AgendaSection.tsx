import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHybridTranslation } from '@/components/HybridTranslationProvider';
import { useContent } from '@/hooks/useContent';
import { Link } from 'react-router-dom';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { EventsService, TypesAndCategoriesEvent } from '@/lib/api-services';
import logo from '@/assets/MCB-Logo.png';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';

const eventImages = import.meta.glob('../assets/events/*', { eager: true });

function getEventImageUrl(filename: string) {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  if (typeof filename !== 'string' || !filename) {
    return undefined;
  }
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  if (filename.startsWith('/uploads/')) {
    return filename;
  }
  if (filename.startsWith('/assets/')) {
    return filename;
  }
  
  const justFile = filename.split('/').pop();
  const match = Object.entries(eventImages).find(([path]) => path.endsWith(justFile));
  if (match) {
    return (match[1] as any).default;
  }
  
  return `/assets/events/${justFile}`;
}

const AgendaCard = ({ event }) => {
  const { t } = useHybridTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'ongoing': return 'bg-green-500';
      case 'registration': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming': return t('agenda.status.upcoming', 'Upcoming');
      case 'ongoing': return t('agenda.status.ongoing', 'Ongoing');
      case 'registration': return t('agenda.status.registration', 'Registration');
      default: return t('agenda.status.finished', 'Finished');
    }
  };

  return (
    <div className="relative bg-card border border-border rounded-2xl overflow-hidden heritage-glow hover:scale-105 transition-bounce group h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary-glow/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
        <div className={`absolute bg-primary/90 top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(event.status)}`}>
          {getStatusLabel(event.status)}
        </div>
        <img
          src={
            event.banner_img
              ? getEventImageUrl(event.banner_img) || logo
              : logo
          }
          alt={event.title}
          className="w-full h-full object-contain object-center"
        />
      </div>
      <div className="p-6 mb-9 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-heritage">
          <span
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(event.title || '')
            }}
          />
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          <span
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(event.description || '')
            }}
          />
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar size={16} className="mr-3 text-primary" />
            {event.start_date ? new Date(event.start_date).toLocaleDateString() : 'Date not available'}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock size={16} className="mr-3 text-primary" />
            {event.start_date ? new Date(event.start_date).toLocaleTimeString() : 'Time not available'}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin size={16} className="mr-3 text-primary" />
            <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.location || 'Location not specified') }} />
          </div>
        </div>
      </div>
      <div className='p-6 absolute left-0 bottom-0 right-0'>
        <Link to={`/event/${event.id}`}>
          <Button className="w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:scale-105 transition-bounce">
            {t('agenda.button.detail', 'Detail Event')}
            <ChevronRight size={16} className="ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

const AgendaSection = () => {
  const { t } = useHybridTranslation();
  const [activeCategory, setActiveCategory] = useState('semua');
  const [categories, setCategories] = useState([]);
  const [carouselApi, setCarouselApi] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: events, loading: isTranslating } = useContent(EventsService, { limit: 10, active: true, approved: true });
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await TypesAndCategoriesEvent.getAllCategories();
        if (!response.error) {
          setCategories(response.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleFocus = () => setIsPaused(true);
  const handleBlur = () => setIsPaused(false);

  const sortedEvents = (events || []).sort((a,b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

  const filteredEvents = activeCategory === 'semua'
    ? sortedEvents
    : sortedEvents.filter((event: any) => event.category === activeCategory);

  return (
    <section id="agenda" className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-2xl md:text-4xl font-bold pb-3 text-heritage-gradient">
            {t('agenda.title', 'Agenda')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('agenda.subtitle', 'Ikuti berbagai kegiatan menarik dari museum dan situs cagar budaya di seluruh Indonesia')}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12 scroll-reveal">
          {[
            { id: 'semua', name: t('agenda.categories.all', 'All Events') },
            ...categories
          ].map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-heritage ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground heritage-glow'
                  : 'bg-card border border-border text-foreground hover:bg-muted'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="relative mb-12 scroll-reveal">
          {isTranslating ? (
            <div className="flex items-center justify-center h-64">
              <span className="text-lg text-muted-foreground">
                {t('agenda.loading', 'Loading events...')}
              </span>
            </div>
          ) : (
            <Carousel
              setApi={setCarouselApi}
              aria-label="Agenda Events Carousel"
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
                {filteredEvents.map((event, index) => (
                  <CarouselItem
                    key={event.id}
                    className="md:basis-1/2 lg:basis-1/3"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    aria-label={`Slide ${index + 1} of ${filteredEvents.length}`}
                  >
                    <AgendaCard event={event} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="sr-only" aria-live="polite" aria-atomic="true">
                {filteredEvents.length > 0 && filteredEvents[currentIndex]
                  ? `Showing slide ${currentIndex + 1} of ${filteredEvents.length}: ${filteredEvents[currentIndex].title}`
                  : ""}
              </div>
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;
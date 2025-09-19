import { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { eventCategories, defaultEvents } from '@/../database/default-data';
import { agendaService } from '@/lib/api-services';
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
  if (
    typeof filename === 'string' &&
    (filename.startsWith('http://') ||
      filename.startsWith('https://') ||
      filename.startsWith('/assets/'))
  ) {
    return filename;
  }
  const justFile = filename?.split('/').pop() || filename;
  const match = Object.entries(eventImages).find(([path]) => path.endsWith(justFile));
  if (match) {
    return (match[1] as any).default;
  }
  // Fallback: try public/assets/events/ for production
  if (justFile) {
    return `/assets/events/${justFile}`;
  }
  return undefined;
}

const AgendaSection = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('semua');
  const [events, setEvents] = useState([]);
  const [carouselApi, setCarouselApi] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Accessibility: Announce slide changes
  const totalSlides = (
    activeCategory === 'semua'
      ? events.slice(0, 6)
      : events.filter(event => event.category === activeCategory).slice(0, 6)
  ).length;

  // Auto-slide logic
  useEffect(() => {
    if (!carouselApi || isPaused) return;
    const interval = setInterval(() => {
      if (carouselApi) {
        carouselApi.scrollNext();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselApi, isPaused, activeCategory, events]);

  // Update current index for live region
  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap() ?? 0);
    };
    carouselApi.on('select', onSelect);
    onSelect();
    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi, activeCategory, events]);

  // Pause on hover/focus, resume on mouse leave/blur
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleFocus = () => setIsPaused(true);
  const handleBlur = () => setIsPaused(false);

  // Diagnostic log for Embla API
  useEffect(() => {
    if (carouselApi) {
      // eslint-disable-next-line no-console
      console.log('[AgendaSection] Carousel API set:', carouselApi);
    }
  }, [carouselApi]);

  const fetchEvents = async () => {
    try {
      const response = await agendaService.getAll();
      if (response.error) {
        console.error('Error fetching events:', response.error);
      }
  
      setEvents(response.data || defaultEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = activeCategory === 'semua' 
    ? events.slice(0, 6) 
    : events.filter(event => event.category === activeCategory).slice(0, 6);

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
      case 'upcoming': return 'Akan Datang';
      case 'ongoing': return 'Berlangsung';
      case 'registration': return 'Pendaftaran';
      default: return 'Selesai';
    }
  };

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

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 scroll-reveal">
          {eventCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-heritage ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground heritage-glow'
                  : 'bg-card border border-border text-foreground hover:bg-muted'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Events Carousel */}
        <div className="relative mb-12 scroll-reveal">
          <Carousel
            setApi={setCarouselApi}
            aria-label="Agenda Events Carousel"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            <CarouselPrevious
              className="h-16 w-16 text-3xl focus:ring-2 focus:ring-primary"
              size="icon"
              aria-label="Previous slide"
              onClick={() => { setIsPaused(true); carouselApi?.scrollPrev(); }}
            />
            <CarouselNext
              className="h-16 w-16 text-3xl focus:ring-2 focus:ring-primary"
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
                  <div className="relative bg-card border border-border rounded-2xl overflow-hidden heritage-glow hover:scale-105 transition-bounce group h-full flex flex-col">
                    {/* Event Image */}
                    <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary-glow/20 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                      <div className={`absolute bg-primary/90 top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(event.status)}`}>
                        {getStatusLabel(event.status)}
                      </div>
                      <img
                        src={
                          event.image_url
                            ? getEventImageUrl(event.image_url) || logo
                            : logo
                        }
                        alt={event.title}
                        className="w-full h-full object-contain object-center"
                      />
                    </div>

                    {/* Event Content */}
                    <div className="p-6 mb-9 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-heritage">
                        {event.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar size={16} className="mr-3 text-primary" />
                          {event.date}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock size={16} className="mr-3 text-primary" />
                          {event.time}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin size={16} className="mr-3 text-primary" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                    <div className='p-6 absolute left-0 bottom-0 right-0'>
                      <Link to={`/event/${event.id}`}>
                        <Button className="w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:scale-105 transition-bounce">
                          Detail Event
                          <ChevronRight size={16} className="ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Pause/Resume Button */}
            <div className="absolute right-4 bottom-4 z-10">
              <Button
                onClick={() => setIsPaused((p) => !p)}
                aria-pressed={isPaused}
                aria-label={isPaused ? "Resume auto-slide" : "Pause auto-slide"}
                className="bg-primary text-primary-foreground px-4 py-2 rounded focus:ring-2 focus:ring-primary"
                tabIndex={0}
              >
                {isPaused ? "Resume" : "Pause"}
              </Button>
            </div>
            {/* Live region for screen readers */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
              {filteredEvents[currentIndex]
                ? `Showing slide ${currentIndex + 1} of ${filteredEvents.length}: ${filteredEvents[currentIndex].title}`
                : ""}
            </div>
          </Carousel>
        </div>

        {/* Call to Action */}
        {/* <div className="text-center">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Jangan Lewatkan Event Menarik Lainnya
            </h3>
            <p className="text-muted-foreground mb-6">
              Daftarkan diri Anda untuk mendapatkan notifikasi event terbaru dan informasi menarik lainnya
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/agenda">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-8 hover:scale-105 transition-bounce heritage-glow"
                >
                  Lihat Semua Agenda
                </Button>
              </Link>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default AgendaSection;
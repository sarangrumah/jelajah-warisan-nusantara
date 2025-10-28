import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EventsService, TypesAndCategoriesEvent } from '@/lib/api-services';
import { defaultEvents } from '@/../database/default-data';
import { Link } from 'react-router-dom';
import logo from '@/assets/MCB-Logo.png';

const eventImages = import.meta.glob('../../assets/events/*', { eager: true });

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

const AgendaList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('semua');
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await TypesAndCategoriesEvent.getAllCategories();
      if (response.error) {
        console.error('Error fetching categories:', response.error);
        // Fallback to default categories if API fails
        setCategories([
          { id: 'semua', name: 'Semua Event' },
          { id: 'pameran', name: 'Pameran' },
          { id: 'workshop', name: 'Workshop' },
          { id: 'seminar', name: 'Seminar' },
          { id: 'festival', name: 'Festival' }
        ]);
      } else {
        // Add "All Events" option and map database categories
        const categoryOptions = [
          { id: 'semua', name: 'Semua Event' },
          ...response.data.map((cat: any) => ({
            id: cat.id,
            name: cat.name
          }))
        ];
        setCategories(categoryOptions);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([
        { id: 'semua', name: 'Semua Event' },
        { id: 'pameran', name: 'Pameran' },
        { id: 'workshop', name: 'Workshop' },
        { id: 'seminar', name: 'Seminar' },
        { id: 'festival', name: 'Festival' }
      ]);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await EventsService.getAll();
      if (response.error || response.data.length === 0) {
        console.error('Error fetching events:', response.error);
        setEvents(defaultEvents);
      } else {
        const filteredEvents = response.data.filter((event: any) => (
          event.is_active === true
          && event.is_approved === true
          && new Date(event.start_published_date) <= new Date()
          && new Date(event.end_published_date) >= new Date()
        ));
        setEvents(filteredEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  const filteredEvents = events.filter(event => {
    if (activeCategory === 'semua') {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    } else {
      const matchesSearch = event.category === activeCategory &&
                           (event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.description?.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    }
  });
  
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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className="text-sm"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="relative overflow-hidden heritage-glow hover:scale-105 transition-bounce">
                <div className="aspect-video relative overflow-hidden">
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary-glow/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                    <div className={`absolute bg-primary/90 top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(event.status)}`}>
                      {getStatusLabel(event.status)}
                    </div>
                    <img
                      src={event.image_url ? getEventImageUrl(event.image_url) || logo : logo}
                      alt={event.name}
                      className="w-full h-full object-contain object-center"
                    />
                  </div>
                </div>
              <CardHeader>
                <CardTitle className="text-xl line-clamp-2">{event.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {event.description}
                </p>
                
                <div className="space-y-2 mb-[4rem]">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-primary" />
                    {/* <span>{formatDate(event.date)}</span> */}
                    <span>{event.date}</span>
                  </div>
                  
                  {event.time && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={16} className="text-primary" />
                      {/* <span>{formatTime(event.time)} WIB</span> */}
                      <span>{event.time}</span>
                    </div>
                  )}
                  
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={16} className="text-primary" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                
                <div className='p-6 absolute left-0 bottom-0 right-0'>
                <Link to={`/event/${event.id}`}>
                  <Button className="w-full">
                    Detail Acara
                  </Button>
                </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Tidak ada event ditemukan</h3>
            <p className="text-muted-foreground">
              Coba ubah kata kunci pencarian atau filter kategori
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AgendaList;
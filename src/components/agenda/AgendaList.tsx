import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EventsService, TypesAndCategoriesEvent } from '@/lib/api-services';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';

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
          ...response.data.map((cat: { id: string; name: string }) => ({
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
      } else {
        const filteredEvents = response.data.filter((event: {
          is_active: boolean;
          is_approved: boolean;
          start_published_date: Date;
          end_published_date: Date;
        }) => (
          event.is_active === true
          && event.is_approved === true
          && new Date(event.start_published_date) <= new Date()
          && new Date(event.end_published_date) >= new Date()
        ))
        .map((event: {banner_img: string}) => ({
          ...event,
          image: event.banner_img && !event.banner_img.startsWith('/uploads/images/')
            ? `/uploads/images/${event.banner_img.split('/').pop()}`
            : event.banner_img
        }));
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
  
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) 
    || event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return activeCategory === 'semua'
      ? matchesSearch
      : event.category.id === activeCategory && matchesSearch;
  });
  
  const getEventStatus = (event) => {
    const now = new Date();

    if (event.start_published_date === null && new Date(event.start_date) > now) {
      return 'upcoming';
    }

    if (new Date(event.start_published_date) < now && new Date(event.start_date) > now) {
      return 'registration';
    }

    if (new Date(event.start_date) <= now && new Date(event.end_date) >= now) {
      return 'ongoing';
    }

    if (new Date(event.end_date) < now) {
      return 'finished';
    }

    return 'unknown';
  };
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
            
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-muted-foreground" />
              <Select value={activeCategory} onValueChange={setActiveCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="relative overflow-hidden heritage-glow hover:scale-105 transition-bounce">
              <div className="aspect-video relative overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary-glow/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                  <div className={`absolute bg-primary/90 top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(getEventStatus(event))}`}>
                    {getStatusLabel(getEventStatus(event))}
                  </div>
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      console.error('[Event] Image failed to load:', event.image);
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl line-clamp-2">{event.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground mb-4x line-clamp-3">
                  {parse(event.description)}
                </div>
                
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
                      <span>{parse(event.location)}</span>
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
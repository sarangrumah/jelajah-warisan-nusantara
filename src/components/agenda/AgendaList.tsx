import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { agendaService } from '@/lib/api-services';
import { categories, placeholder, events } from '@/../database/get-data';
import { Link } from 'react-router-dom';

const AgendaList = () => {
  // const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('semua');

  const categoriesx = [
    { id: 'semua', name: 'Semua Event' },
    { id: 'workshop', name: 'Workshop' },
    { id: 'pameran', name: 'Pameran' },
    { id: 'seminar', name: 'Seminar' },
    { id: 'festival', name: 'Festival' },
  ];

  const fetchEvents = async () => {
    try {
      const response = await agendaService.getAll();
      console.log(response)

      if (response.error) {
        console.error('Error fetching events:', response.error);
        return;
      }

      setEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const filteredEventsx = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredEvents = activeCategory === 'semua' 
    ? events 
    : events.filter(event => event.category === activeCategory);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time.slice(0, 5);
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
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden heritage-glow hover:scale-105 transition-bounce">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={event.image ? event.image : placeholder.image} 
                    alt={event.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              <CardHeader>
                <CardTitle className="text-xl line-clamp-2">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {event.description}
                </p>
                
                <div className="space-y-2 mb-4">
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
                
                <Link to={`/event/${event.id}`}>
                  <Button className="w-full">
                    Detail Event
                  </Button>
                </Link>
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
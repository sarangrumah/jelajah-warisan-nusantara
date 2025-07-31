import { useState } from 'react';
import { Calendar, MapPin, Clock, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const AgendaSection = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('semua');

  const categories = [
    { id: 'semua', label: 'Semua Event' },
    { id: 'pameran', label: 'Pameran' },
    { id: 'workshop', label: 'Workshop' },
    { id: 'konservasi', label: 'Konservasi' },
    { id: 'edukasi', label: 'Edukasi' },
  ];

  const events = [
    {
      id: 1,
      title: 'Pameran Warisan Majapahit',
      category: 'pameran',
      date: '15-30 Februari 2024',
      time: '09:00 - 17:00 WIB',
      location: 'Museum Nasional Jakarta',
      participants: 500,
      description: 'Pameran artefak dan benda bersejarah dari era Kerajaan Majapahit',
      image: '/api/placeholder/400/250',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Workshop Konservasi Naskah Kuno',
      category: 'workshop',
      date: '20 Februari 2024',
      time: '08:00 - 16:00 WIB',
      location: 'Museum Nasional Jakarta',
      participants: 30,
      description: 'Pelatihan teknik konservasi dan restorasi naskah kuno Indonesia',
      image: '/api/placeholder/400/250',
      status: 'registration'
    },
    {
      id: 3,
      title: 'Program Edukasi Sekolah: Mengenal Budaya Nusantara',
      category: 'edukasi',
      date: '25 Februari 2024',
      time: '10:00 - 15:00 WIB',
      location: 'Museum Tekstil Jakarta',
      participants: 150,
      description: 'Program edukasi interaktif untuk siswa SD-SMA tentang kekayaan budaya Indonesia',
      image: '/api/placeholder/400/250',
      status: 'ongoing'
    },
    {
      id: 4,
      title: 'Restorasi Candi Borobudur Fase 3',
      category: 'konservasi',
      date: '1 Maret - 30 Juni 2024',
      time: 'Ongoing',
      location: 'Candi Borobudur, Magelang',
      participants: 50,
      description: 'Proyek restorasi dan konservasi struktur candi untuk pelestarian jangka panjang',
      image: '/api/placeholder/400/250',
      status: 'ongoing'
    },
  ];

  const filteredEvents = activeCategory === 'semua' 
    ? events 
    : events.filter(event => event.category === activeCategory);

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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-heritage-gradient">
            {t('agenda.title', 'Agenda & Event')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('agenda.subtitle', 'Ikuti berbagai kegiatan menarik dari museum dan situs cagar budaya di seluruh Indonesia')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 scroll-reveal">
          {categories.map((category) => (
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

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredEvents.map((event, index) => (
            <div
              key={event.id}
              className="bg-card border border-border rounded-2xl overflow-hidden heritage-glow hover:scale-105 transition-bounce group scroll-reveal"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Event Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary-glow/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(event.status)}`}>
                  {getStatusLabel(event.status)}
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
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
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users size={16} className="mr-3 text-primary" />
                    {event.participants} peserta
                  </div>
                </div>

                <Link to={`/event/${event.id}`}>
                  <Button className="w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:scale-105 transition-bounce">
                    Detail Event
                    <ChevronRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center scroll-reveal">
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
              <Button 
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 transition-heritage"
              >
                Berlangganan Newsletter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;
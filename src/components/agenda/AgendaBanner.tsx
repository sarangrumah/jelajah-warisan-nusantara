import { Calendar, MapPin, Clock } from 'lucide-react';

const AgendaBanner = () => {
  const slides = [
    {
      image: '/src/assets/hero-borobudur.jpg',
      title: 'Agenda Kegiatan Museum & Cagar Budaya',
      subtitle: 'Ikuti berbagai kegiatan menarik yang diselenggarakan oleh museum dan situs cagar budaya di seluruh Indonesia',
    }
  ];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${slides[0].image})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="mb-6">
          <Calendar size={64} className="mx-auto mb-4 text-primary-glow" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-heritage-gradient">
          {slides[0].title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white/90">
          {slides[0].subtitle}
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Event Terjadwal</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>Seluruh Indonesia</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>Update Berkala</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgendaBanner;
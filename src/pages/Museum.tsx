import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { museums } from '@/../database/get-data';

const Museum = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const museumsx = [
    {
      id: 1,
      title: 'Museum Nasional Indonesia',
      subtitle: 'Koleksi artefak budaya nusantara terlengkap',
      type: 'museum',
      location: 'Jakarta Pusat',
      image: '/src/assets/museum-interior.jpg',
      description: 'Museum terbesar di Indonesia dengan koleksi lebih dari 140.000 artefak'
    },
    {
      id: 2,
      title: 'Galeri Nasional',
      subtitle: 'Warisan dunia UNESCO yang memukau',
      type: 'museum',
      location: 'Jakarta Pusat',
      image: '/src/assets/hero-borobudur.jpg',
      description: 'Candi Buddha terbesar di dunia yang dibangun pada abad ke-8'
    },
    {
      id: 3,
      title: 'Museum Basoeki Abdullah',
      subtitle: 'Sejarah Jakarta dari masa ke masa',
      type: 'museum',
      location: 'Jakarta Selatan',
      image: '/src/assets/heritage-sites.jpg',
      description: 'Museum sejarah Jakarta yang berlokasi di Kota Tua'
    },
    {
      id: 4,
      title: 'Museum Batik Indonesia',
      subtitle: 'Kompleks candi Hindu terbesar di Indonesia',
      type: 'museum',
      location: 'Jakarta Timur',
      image: '/src/assets/heritage-sites.jpg',
      description: 'Kompleks candi Hindu yang didedikasikan untuk Trimurti'
    },
    {
      id: 5,
      title: 'Museum Kebangkitan Nasional',
      subtitle: 'Kompleks candi Hindu terbesar di Indonesia',
      type: 'museum',
      location: 'Jakarta Pusat',
      image: '/src/assets/heritage-sites.jpg',
      description: 'Kompleks candi Hindu yang didedikasikan untuk Trimurti'
    },
    {
      id: 6,
      title: 'Museum Sumpah Pemuda',
      subtitle: 'Kompleks candi Hindu terbesar di Indonesia',
      type: 'museum',
      location: 'Jakarta Pusat',
      image: '/src/assets/heritage-sites.jpg',
      description: 'Kompleks candi Hindu yang didedikasikan untuk Trimurti'
    },
    {
      id: 7,
      title: 'Museum Perumusan Naskah Proklamasi',
      subtitle: 'Kompleks candi Hindu terbesar di Indonesia',
      type: 'museum',
      location: 'Jakarta Pusat',
      image: '/src/assets/heritage-sites.jpg',
      description: 'Kompleks candi Hindu yang didedikasikan untuk Trimurti'
    },
    {
      id: 8,
      title: 'Museum Perumusan Naskah Proklamasi',
      subtitle: 'Kompleks candi Hindu terbesar di Indonesia',
      type: 'museum',
      location: 'Jakarta Pusat',
      image: '/src/assets/heritage-sites.jpg',
      description: 'Kompleks candi Hindu yang didedikasikan untuk Trimurti'
    },
  ];

  const filteredMuseums = museums.filter(museum => {
    const matchesSearch = museum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         museum.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || museum.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Banner */}
      <section className="relative h-64 bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t('Museum & Heritage Sites')}
          </h1>
          <p className="text-xl">
            {t('Explore Indonesia\'s rich cultural heritage')}
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder={t('Search museums and heritage sites...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-48">
              <Filter size={20} className="mr-2" />
              <SelectValue placeholder={t('Filter by type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('All')}</SelectItem>
              <SelectItem value="museum">{t('Museums')}</SelectItem>
              <SelectItem value="heritage">{t('Heritage Sites')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMuseums.map((item) => (
            <Link key={item.id} to={`/museum/${item.id}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-bottom"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin size={16} className="mr-1" />
                    {item.location}
                  </div>
                  <p className="text-sm">{item.description}</p>
                  <div className="mt-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      item.type === 'museum' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-secondary/10 text-secondary'
                    }`}>
                      {item.type === 'museum' ? t('Museum') : t('Heritage Site')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredMuseums.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {t('No results found. Try adjusting your search or filter.')}
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Museum;
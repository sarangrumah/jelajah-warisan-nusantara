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
import { heritages } from '@/../database/get-data';

const Heritage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const heritagesx = [
    {
      id: 1,
      title: 'Candi Borobudur',
      subtitle: 'Warisan dunia UNESCO yang memukau',
      type: 'temple',
      location: 'Magelang, Jawa Tengah',
      period: 'Abad ke-8',
      image: '/src/assets/hero-borobudur.jpg',
      description: 'Candi Buddha terbesar di dunia yang dibangun pada abad ke-8 dan menjadi keajaiban arsitektur kuno'
    },
    {
      id: 2,
      title: 'Candi Prambanan',
      subtitle: 'Kompleks candi Hindu terbesar di Indonesia',
      type: 'temple',
      location: 'Yogyakarta',
      period: 'Abad ke-9',
      image: '/src/assets/heritage-sites.jpg',
      description: 'Kompleks candi Hindu yang didedikasikan untuk Trimurti dengan arsitektur yang menakjubkan'
    },
    {
      id: 3,
      title: 'Situs Sangiran',
      subtitle: 'Situs fosil manusia purba',
      type: 'archaeological',
      location: 'Sragen, Jawa Tengah',
      period: '1.5 juta tahun lalu',
      image: '/src/assets/heritage-sites.jpg',
      description: 'Situs arkeologi penting yang mengungkap sejarah evolusi manusia di Asia Tenggara'
    },
    {
      id: 4,
      title: 'Benteng Vredeburg',
      subtitle: 'Benteng kolonial bersejarah',
      type: 'fortress',
      location: 'Yogyakarta',
      period: 'Abad ke-18',
      image: '/src/assets/heritage-sites.jpg',
      description: 'Benteng kolonial Belanda yang kini menjadi museum sejarah perjuangan Indonesia'
    }
  ];

  const filteredHeritages = heritages.filter(heritage => {
    const matchesSearch = heritage.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         heritage.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || heritage.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Banner */}
      <section className="relative h-64 bg-gradient-to-r from-secondary to-secondary/80 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t('Heritage Sites')}
          </h1>
          <p className="text-xl">
            {t('Discover Indonesia\'s precious cultural heritage sites')}
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder={t('Search heritage sites...')}
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
              <SelectItem value="all">{t('All Types')}</SelectItem>
              <SelectItem value="temple">{t('Temples')}</SelectItem>
              <SelectItem value="archaeological">{t('Archaeological Sites')}</SelectItem>
              <SelectItem value="fortress">{t('Fortresses')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHeritages.map((item) => (
            <Link key={item.id} to={`/heritage/${item.id}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      {item.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      {item.period}
                    </div>
                  </div>
                  <p className="text-sm mt-3">{item.description}</p>
                  <div className="mt-4">
                    <span className="inline-block px-2 py-1 rounded-full text-xs bg-secondary/10 text-secondary">
                      {t(item.type)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredHeritages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {t('No heritage sites found. Try adjusting your search or filter.')}
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Heritage;
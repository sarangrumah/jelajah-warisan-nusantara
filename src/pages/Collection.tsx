import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Calendar, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Collection = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const collections = [
    {
      id: 1,
      title: 'Keris Pusaka Majapahit',
      subtitle: 'Senjata tradisional bersejarah dari era Majapahit',
      category: 'weapons',
      museum: 'Museum Nasional Indonesia',
      period: 'Abad ke-14',
      image: '/src/assets/heritage-sites.jpg',
      description: 'Keris pusaka yang ditemukan di situs Majapahit dengan ukiran detail yang menawan'
    },
    {
      id: 2,
      title: 'Arca Ganesha Kuno',
      subtitle: 'Patung dewa Ganesha dari periode klasik',
      category: 'sculpture',
      museum: 'Museum Fatahillah',
      period: 'Abad ke-9',
      image: '/src/assets/museum-interior.jpg',
      description: 'Arca Ganesha yang terbuat dari batu andesit dengan detail yang sangat halus'
    },
    {
      id: 3,
      title: 'Manuskrip Lontar Bali',
      subtitle: 'Naskah kuno pada daun lontar dari Bali',
      category: 'manuscript',
      museum: 'Museum Nasional Indonesia',
      period: 'Abad ke-16',
      image: '/src/assets/heritage-sites.jpg',
      description: 'Koleksi manuskrip lontar berisi ajaran agama dan filosofi Bali kuno'
    },
    {
      id: 4,
      title: 'Kain Tenun Sumba',
      subtitle: 'Tekstil tradisional dengan motif simbolis',
      category: 'textile',
      museum: 'Museum Tekstil Jakarta',
      period: 'Abad ke-19',
      image: '/src/assets/museum-interior.jpg',
      description: 'Kain tenun ikat dari Sumba dengan pewarna alami dan motif tradisional'
    },
    {
      id: 5,
      title: 'Perhiasan Emas Srivijaya',
      subtitle: 'Ornamen emas dari kerajaan Srivijaya',
      category: 'jewelry',
      museum: 'Museum Nasional Indonesia',
      period: 'Abad ke-7-8',
      image: '/src/assets/heritage-sites.jpg',
      description: 'Koleksi perhiasan emas dengan teknik filigri khas Srivijaya'
    },
    {
      id: 6,
      title: 'Gerabah Neolitikum',
      subtitle: 'Tembikar dari periode prasejarah Indonesia',
      category: 'ceramic',
      museum: 'Museum Arkeologi Jakarta',
      period: '2000 SM',
      image: '/src/assets/museum-interior.jpg',
      description: 'Gerabah dengan motif geometris dari situs neolitikum di Indonesia'
    }
  ];

  const filteredCollections = collections.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Banner */}
      <section className="relative h-64 bg-gradient-to-r from-secondary to-secondary/80 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t('Masterpiece Collections')}
          </h1>
          <p className="text-xl">
            {t('Discover Indonesia\'s most precious cultural artifacts')}
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder={t('Search collections...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter size={20} className="mr-2" />
              <SelectValue placeholder={t('Filter by category')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('All Categories')}</SelectItem>
              <SelectItem value="weapons">{t('Weapons')}</SelectItem>
              <SelectItem value="sculpture">{t('Sculptures')}</SelectItem>
              <SelectItem value="manuscript">{t('Manuscripts')}</SelectItem>
              <SelectItem value="textile">{t('Textiles')}</SelectItem>
              <SelectItem value="jewelry">{t('Jewelry')}</SelectItem>
              <SelectItem value="ceramic">{t('Ceramics')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map((item) => (
            <Link key={item.id} to={`/collection/${item.id}`}>
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
                      <Building size={16} className="mr-1" />
                      {item.museum}
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      {item.period}
                    </div>
                  </div>
                  <p className="text-sm mt-3">{item.description}</p>
                  <div className="mt-4">
                    <span className="inline-block px-2 py-1 rounded-full text-xs bg-accent/10 text-accent">
                      {t(item.category)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredCollections.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {t('No collections found. Try adjusting your search or filter.')}
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Collection;
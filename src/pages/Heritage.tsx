import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, MapPin, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { museumService, TypesAndCategoriesSites } from '@/lib/api-services';
import { mapSlidesWithImageUrl } from '@/components/helper';

const museumsImages = import.meta.glob('../assets/museums/*', { eager: true });
const imagesImages = import.meta.glob('../assets/images/*', { eager: true });

function getMuseumsImageUrl(filename: string) {
  if (
    typeof filename === 'string' &&
    (filename.startsWith('http://') ||
      filename.startsWith('https://') ||
      filename.startsWith('/assets/'))
  ) {
    return filename;
  }
  const justFile = filename?.split('/').pop() || filename;
  // Try museums first
  let match = Object.entries(museumsImages).find(([path]) => path.endsWith(justFile));
  if (match) {
    return (match[1] as { default: string }).default;
  }
  // Try images as fallback
  match = Object.entries(imagesImages).find(([path]) => path.endsWith(justFile));
  if (match) {
    return (match[1] as { default: string }).default;
  }
  // Fallback: try public/assets/museums/ or public/assets/images/ for production
  if (justFile) {
    return `/assets/museums/${justFile}`;
  }
  return '/placeholder.svg';
}
const Heritage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [heritages, setHeritages] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const { pathname } = useLocation();
      
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const fetchType = async () => {
      try {
        const response = await TypesAndCategoriesSites.getAllTypes();
        if (response.error || response.data.length === 0) {
          console.error('Error fetching tyes:', response.error);
        } else {
          setTypes(response.data);
        }
      } catch (error) {
        console.error('Error fetching museums:', error);
      }
    };
    fetchType();
  }, []);

  useEffect(() => {
      if(types.length > 0) {
        const fetchCategory = async () => {
          try {
            const museumId = types.find((t) => t.name.toLowerCase() === 'cagar budaya')?.id;
            const response = await TypesAndCategoriesSites.getAllCategories(museumId);
            if (response.error || response.data.length === 0) {
              console.error('Error fetching categories:', response.error);
            } else {
              setCategories(response.data);
            }
          } catch (error) {
            console.error('Error fetching museums:', error);
          }
        };
        fetchCategory();
      }
    }, [types]);

  useEffect(() => {
    const fetchHeritages = async () => {
      try {
        const response = await museumService.getAll();
        if(response.error || response.data.length === 0) {
          console.error('Error fetching heritages:', response.error);
        } else {
          const filteredHeritages = response.data.filter((heritage: { 
            is_active: boolean; 
            is_approved: boolean; 
            is_rejected: boolean; 
          }) => (
            heritage.is_active === true && 
            heritage.is_approved === true &&
            heritage.is_rejected === false
          ))
          setHeritages(mapSlidesWithImageUrl(filteredHeritages));
        }
      } catch (error) {
        console.error('Error fetching heritages:', error);
      }
    };
    fetchHeritages();
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    scrollRevealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const heritageId = types.find((t) => t.name.toLowerCase() === 'cagar budaya')?.id;
  const filteredHeritages = heritages.filter(heritage => {
    const matchesSearch = heritage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         heritage.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || categories.length > 0 && categories.find((c) => c.id === heritage.category)?.id === filterType;
    return heritage.type === heritageId && matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Banner */}
      <section className="relative h-64 bg-gradient-to-r from-secondary to-secondary/80 flex items-center justify-center">
        <div className="text-center text-white scroll-reveal">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t('heritage.title')}
          </h1>
          <p className="text-xl">
            {t('heritage.subtitle')}
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder={t('filter.heritage.search')}
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
              <SelectItem value="all">{'Semua'}</SelectItem>
              {categories.length > 0 && categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
              ))}
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
                    src={(() => {
                      const imageCandidate = item.img_banner || '';
                      const resolved = getMuseumsImageUrl(imageCandidate);
                      // Use logo as placeholder if no image
                      return (resolved && resolved !== '/placeholder.svg')
                        ? resolved
                        : '/src/assets/MCB-Logo.png';
                    })()}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
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
                      {types.find((t) => t.id === item.type)?.name}
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
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
// Utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
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

  const fetchHeritages = async () => {
    try {
      const response = await museumService.getAll();
      if(response.error) {
        console.error('Error fetching heritages:', response.error);
      } else {
        const filteredHeritages = response.data.filter((heritage: {
            is_active: boolean;
            is_approved: boolean;
            start_publish_date: Date;
            end_publish_date: Date;
          }) => (
            heritage.is_active === true 
            && heritage.is_approved === true
            && new Date(heritage.start_publish_date) <= new Date()
            && new Date(heritage.end_publish_date) >= new Date()
          ))
          .map((heritage: {img_banner: string}) => ({
            ...heritage,
            image: heritage.img_banner && !heritage.img_banner.startsWith('/uploads/sites/')
              ? `/uploads/sites/${heritage.img_banner.split('/').pop()}`
              : heritage.img_banner
          }));
        setHeritages(filteredHeritages);
      }
    } catch (error) {
      console.error('Error fetching heritages:', error);
    }
  };

  const fetchTypesAndCategories = async () => {
    try {
      // Fetch all types first
      const typesResponse = await TypesAndCategoriesSites.getAllTypes();
      if (typesResponse.error) {
        console.error('Error fetching types:', typesResponse.error);
        return;
      }
      setTypes(typesResponse.data || []);

      // Find "cagar budaya" type
      const cagarBudayaType: { id?: string; name?: string; } = typesResponse.data?.find((t: { name: string; title: string; }) => {
        const name = typeof t.name === 'string' ? t.name : (typeof t.title === 'string' ? t.title : undefined);
        return name?.toLowerCase() === 'cagar budaya';
      });

      if (cagarBudayaType?.id) {
        // Fetch categories for "cagar budaya" type
        const categoriesResponse = await TypesAndCategoriesSites.getAllCategories(cagarBudayaType.id);
        if (categoriesResponse.error) {
          console.error('Error fetching categories:', categoriesResponse.error);
          return;
        }
        setCategories(categoriesResponse.data || []);
      }
    } catch (error) {
      console.error('Error fetching types and categories:', error);
    }
  };

  useEffect(() => {
    fetchHeritages();
    fetchTypesAndCategories();
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

  // Defensive: prefer .name, fallback to .title for legacy data
  const heritageId = types.find((t) => {
    const name = typeof t.name === 'string' ? t.name : (typeof t.title === 'string' ? t.title : undefined);
    if (!name) {
      console.warn('Type item missing name/title:', t);
      return false;
    }
    return name.toLowerCase() === 'cagar budaya';
  })?.id;

  const filteredHeritages = heritages.filter(heritage => {
    // Defensive: prefer .name, fallback to .title for legacy data
    const name = typeof heritage.name === 'string' ? heritage.name : (typeof heritage.title === 'string' ? heritage.title : undefined);
    const subtitle = typeof heritage.subtitle === 'string' ? heritage.subtitle : '';
    if (!name) {
      console.warn('Heritage item missing name:', heritage);
      return false;
    }
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || (categories.length > 0 && categories.find((c) => c.id === heritage.category)?.id === filterType);
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
              <div className='flex justify-start gap-1'>
                <Filter size={20} />
                <SelectValue placeholder={t('Filter by type')} />
              </div>
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
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover parallax"
                    onError={(e) => {
                      console.error('[Heritage] Image failed to load:', item.image);
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
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
                  <p className="text-sm mt-3">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: fixBrokenHtmlTags(item.description)
                      }}
                    />
                  </p>
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
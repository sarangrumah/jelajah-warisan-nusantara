import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { defaultMuseums } from '@/../database/default-data';
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

const Museum = () => {
  const { type } = useParams();
  const [museums, setMuseums] = useState([]);
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);

  const { pathname } = useLocation();
      
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const fetchMuseums = async () => {
    try {
      const response = await museumService.getAll();

      if (response.error || response.data.length === 0) {
        console.error('Error fetching museums:', response.error);
        setMuseums(mapSlidesWithImageUrl(defaultMuseums));
      } else {
        const filteredMuseums = response.data.filter((museum: any) => (
          museum.is_active === true 
          && museum.is_approved === true
          // && new Date(museum.start_publish_date) <= new Date()
          // && new Date(museum.end_publish_date) >= new Date()
        ));
        setMuseums(mapSlidesWithImageUrl(filteredMuseums)); // mapSlidesWithImageUrl(response.data);
      }
    } catch (error) {
      console.error('Error fetching museums:', error);
    }
  };

  useEffect(() => {
    fetchMuseums();
  }, []);
  
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
          const museumId = types.find((t) => t.name.toLowerCase() === 'museum')?.id;
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

  const museumId = types.find((t) => t.name.toLowerCase() === 'museum')?.id;
  const filteredMuseums = museums.filter(museum => {
    const matchesSearch = museum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         museum.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || categories.length > 0 && categories.find((c) => c.id === museum.category)?.id === filterType;
    return museum.type === museumId && matchesSearch && matchesFilter;
  });
  
  useEffect(() => {
    const selectedType = types.find((t) => t.id === type)?.name;
    if (type) {
      setFilterType(selectedType);
    } else {
      setFilterType('all');
    }
  }, [type, types]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Banner */}
      <section className="py-20 relative from-primary to-primary-glow flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="py-4 text-4xl md:text-6xl font-bold mb-4">
            {t('Museum & Cagar Budaya')}
          </h1>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder={t('filter.museum.search')}
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
          {filteredMuseums.map((item) => (
            <Link key={item.id} to={`/museum/${item.id}`}>
              <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:scale-105">
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
                    className="w-full h-full object-cover object-bottom"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription>{item.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1" />
                    <div className="flex gap-2 mt-6">
                      <button
                        className="bg-primary text-white rounded px-4 py-2 font-semibold hover:bg-primary/80 transition w-1/2"
                        type="button"
                      >
                        Beli Tiket
                      </button>
                      <Link
                        to={`/museum/${item.id}`}
                        className="bg-secondary text-white rounded px-4 py-2 font-semibold hover:bg-secondary/80 transition w-1/2 text-center"
                      >
                        Kunjungi Museum
                      </Link>
                    </div>
                  </CardContent>
                </div>
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
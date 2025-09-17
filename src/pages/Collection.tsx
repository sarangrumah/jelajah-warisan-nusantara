import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Calendar, Building } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { defaultCollections } from '@/../database/default-data';
import { collectionService } from '@/lib/api-services';
import logo from '@/assets/MCB-Logo.png';

const collectionImages = import.meta.glob('../assets/collections/*', { eager: true });

function getCollectionImageUrl(filename: string) {
  if (
    typeof filename === 'string' &&
    (filename.startsWith('http://') ||
      filename.startsWith('https://') ||
      filename.startsWith('/assets/'))
  ) {
    return filename;
  }
  // Try to resolve using Vite's import
  const match = Object.entries(collectionImages).find(([path]) => path.endsWith(filename));
  return match ? (match[1] as any).default : filename;
}

const Collection = () => {
  const { t } = useTranslation();
  const [collections, setCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const { pathname } = useLocation();
    
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const fetchCollections = async () => {
    try {
      const response = await collectionService.getAll();

      if (response.error) {
        console.error('Error fetching collections:', response.error);
      }

      setCollections(response.data || defaultCollections);

    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

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
      <section className="relative py-20 from-secondary to-secondary/80 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t('collection.title')}
          </h1>
          <p className="text-xl">
            {t('collection.subtitle')}
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder={t('filter.collection.search')}
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
              <SelectItem value="all">{t('filter.collection.categoryAll')}</SelectItem>
              <SelectItem value="weapons">{t('filter.collection.categoryWeapon')}</SelectItem>
              <SelectItem value="sculpture">{t('filter.collection.categorySculpture')}</SelectItem>
              <SelectItem value="manuscript">{t('filter.collection.categoryManuscript')}</SelectItem>
              <SelectItem value="textile">{t('filter.collection.categoryTextile')}</SelectItem>
              <SelectItem value="jewelry">{t('filter.collection.categoryJewelry')}</SelectItem>
              <SelectItem value="ceramic">{t('filter.collection.categoryCeramic')}</SelectItem>
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
                    src={item.image_url ? getCollectionImageUrl(item.image_url.split('/').pop() || item.image_url) : logo}
                    alt={item.title}
                    className="w-full h-full object-contain object-center"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.subtitle}</CardDescription>
                </CardHeader>
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
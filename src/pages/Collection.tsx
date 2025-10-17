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
import { masterCollectionService } from '@/lib/api-services';
import logo from '@/assets/MCB-Logo.png';
// Utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
}

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
  return match ? (match[1] as { default: string }).default : filename;
}

const Collection = () => {
  const { t } = useTranslation();
  const [collections, setCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategories, setFilterCategories] = useState('all');
  const [filterCategoriesCollection, setFilterCategoriesCollection] = useState([]);
  const { pathname } = useLocation();
    
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const fetchCollections = async () => {
    try {
      const response = await masterCollectionService.getAll();

      if (response.error || response.data.length === 0) {
        console.error('Error fetching collections:', response.error);
        setCollections(defaultCollections);
      } else {
        setCollections(response.data);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    const fetchCategoriesCollection = async () => {
      try {
        const response = await categoriesCollection.getAllCategories();
        if (response.error || response.data.length === 0) {
          console.error('Error fetching categories:', response.error);
        } else {
          setFilterCategoriesCollection(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategoriesCollection();
  }, []);

  const filteredCollections = collections.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategories === 'all' || item.categories_id === filterCategories;
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
          <Select value={filterCategories} onValueChange={setFilterCategories}>
            <SelectTrigger className="w-full md:w-48">
              <Filter size={20} className="mr-2" />
              <SelectValue placeholder={t('Filter by category')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{'Semua Kategori'}</SelectItem>
              {filterCategoriesCollection.length > 0 && filterCategoriesCollection.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
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
                  <CardTitle className="text-lg">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: fixBrokenHtmlTags(item.title)
                      }}
                    />
                  </CardTitle>
                  <CardDescription>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: fixBrokenHtmlTags(item.subtitle)
                      }}
                    />
                  </CardDescription>
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
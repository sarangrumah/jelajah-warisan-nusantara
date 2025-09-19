import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { defaultMemories } from '@/../database/default-data';
import { collectionService } from '@/lib/api-services';
import logo from '@/assets/MCB-Logo.png';

interface Memory {
  type: string;
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
  return match ? (match[1] as any).default : filename;
}
const MemoryOfWorld = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [memories, setMemories] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const { pathname } = useLocation();
      
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const fetchMemories = async () => {
    try {
      const response = await collectionService.getAll();
      const filteredResponse = (response.data as Memory[]).filter(item => item.type === 'mow');
      if(response.error || filteredResponse.length === 0) {
        console.error('Error fetching memories:', response.error);
        setMemories(defaultMemories);
      } else {
        setMemories(filteredResponse);
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
    }
  }
  useEffect(() => {
    fetchMemories();
  }, []);

  const filteredMemories = memories.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Banner */}
      <section className="relative py-20 h-80 from-primary to-primary-glow flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t('mow.title')}
          </h1>
          <p className="text-xl">
            {t('mow.subtitle')}
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder={t('filter.mow.search')}
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
              {/* <SelectItem value="weapons">{t('filter.collection.categoryWeapon')}</SelectItem>
              <SelectItem value="sculpture">{t('filter.collection.categorySculpture')}</SelectItem>
              <SelectItem value="manuscript">{t('filter.collection.categoryManuscript')}</SelectItem>
              <SelectItem value="textile">{t('filter.collection.categoryTextile')}</SelectItem>
              <SelectItem value="jewelry">{t('filter.collection.categoryJewelry')}</SelectItem>*/}
              <SelectItem value="ceramic">{t('filter.collection.categoryCeramic')}</SelectItem> 
              <SelectItem value="etnograhpy">{t('filter.collection.categoryEtnograhpy')}</SelectItem>
              <SelectItem value="archeology">{t('filter.collection.categoryArcheology')}</SelectItem>
              <SelectItem value="history">{t('filter.collection.categoryHistory')}</SelectItem>
              <SelectItem value="numismatic">{t('filter.collection.categoryNumismatic')}</SelectItem>
              <SelectItem value="prehistorical">{t('filter.collection.categoryPreHistorical')}</SelectItem>
              <SelectItem value="geographic">{t('filter.collection.categoryGeographic')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((item) => (
            <Link key={item.id} to={`/collection/${item.id}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="aspect-video overflow-hidden rounded-t-lg pt-5">
                  <img
                    src={item.image_url ? getCollectionImageUrl(item.image_url.split('/').pop() || item.image_url) : logo}
                    alt={item.title}
                    className="w-full h-full object-contain object-center"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {item.title}
                  </CardTitle>
                  <CardDescription>
                    {item.subtitle}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {filteredMemories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {t('No memories found. Try adjusting your search or filter.')}
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default MemoryOfWorld
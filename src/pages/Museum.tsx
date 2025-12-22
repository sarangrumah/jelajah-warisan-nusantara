import { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { defaultMuseums } from '@/../database/default-data';
import { museumService, TypesAndCategoriesSites } from '@/lib/api-services';
import { useUnifiedTranslation, useTranslationSystem } from '@/contexts/UnifiedTranslationContext';
import { mapSlidesWithImageUrl } from '@/components/helper';
import SEO from '@/components/SEO';
// Utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
}

import { assetUrl } from '@/lib/asset-url';

// Updated function to match the approach used in HeroSection
function getMuseumsImageUrl(filename: string) {
  if (!filename) {
    return ''; // Return empty string, let the component handle the fallback
  }
  
  // Use the same assetUrl function as HeroSection for consistency
  return assetUrl(filename) || '';
}

const Museum = () => {
  const { type } = useParams();
  const [museums, setMuseums] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);

  const { translatedContent: translatedMuseums } = useTranslationSystem(museums, 'museums-list');
  const displayMuseums = translatedMuseums || museums;

  const { pathname } = useLocation();
  const { t } = useUnifiedTranslation();
      
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
  const filteredMuseums = displayMuseums.filter(museum => {
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

  const handleVisitMuseum = (museumLink: string) => {
    let url = `https://${museumLink}`;
    if (
      typeof museumLink === 'string' &&
      (museumLink.startsWith('http://') ||
        museumLink.startsWith('https://'))
    ) {
      url = museumLink;
    }
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Museum"
        description="Temukan berbagai museum menarik di Indonesia yang menyimpan sejarah dan budaya bangsa."
        keywords="museum indonesia, daftar museum, wisata sejarah, edukasi budaya"
      />
      <Header />
      
      {/* Hero Banner */}
      <section className="py-20 relative from-primary to-primary-glow flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="py-4 text-4xl md:text-6xl font-bold mb-4">
            {t('management.museum.title')}
          </h1>
          <p className="text-xl">
            {t('management.museum.description')}
          </p>
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
              <SelectValue placeholder={t('filter.museum.categoryAll')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filter.museum.categoryAll')}</SelectItem>
              {categories.length > 0 && categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMuseums.map((item) => (
            <Card key={item.id} className="h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Link to={`/museum/${item.id}`}>
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  {(() => {
                    // Try image_url first (from database), then fall back to other fields
                    const imageCandidate = item.image_url || item.img_banner || item.image;
                    
                    // If no image candidate, directly use logo
                    if (!imageCandidate) {
                      return (
                        <img
                          src="/assets/logo/LOGO V 4 - hitam.png"
                          alt={item.name}
                          className="w-full h-full object-cover object-bottom"
                        />
                      );
                    }
                    
                    const resolved = getMuseumsImageUrl(imageCandidate);
                    const finalImageSrc = (resolved && resolved !== '/placeholder.svg' && resolved.trim() !== '')
                      ? resolved
                      : '/assets/logo/LOGO V 4 - hitam.png';
                    
                    return (
                      <img
                        src={finalImageSrc}
                        alt={item.name}
                        className="w-full h-full object-cover object-bottom"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          if (img.src !== '/assets/logo/LOGO V 4 - hitam.png') {
                            console.error('[Museum] Image failed to load:', imageCandidate);
                            img.src = '/assets/logo/LOGO V 4 - hitam.png';
                          }
                        }}
                      />
                    );
                  })()}
                </div>
                <div className="flex-1 flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: fixBrokenHtmlTags(item.name)
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
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1" />
                    <div className="flex gap-2 mt-6">
                      <button
                        className="bg-primary text-white rounded px-4 py-2 font-semibold hover:bg-primary/80 transition w-1/2"
                        type="button"
                      >
                        {t('buttons.buyTicket') || 'Beli Tiket'}
                      </button>
                      <Link
                        to={`/museum/${item.id}`}
                        className="bg-secondary text-white rounded px-4 py-2 font-semibold hover:bg-secondary/80 transition w-1/2 text-center"
                      >
                        {t('buttons.visitWebsite') || 'Kunjungi Museum'}
                      </Link>
                    </div>
                  </CardContent>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {filteredMuseums.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {t('common.notFound')}
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Museum;
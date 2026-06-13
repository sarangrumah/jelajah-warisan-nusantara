import { useLocation, useParams } from 'react-router-dom';
import { useHybridTranslation } from '@/components/HybridTranslationProvider';
import { Calendar, Building, Ruler, Palette, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import { defaultCollections } from '@/../database/default-data';
import { useEffect, useState } from 'react';
import { masterCollectionService } from '@/lib/api-services';
import { ResponsiveImage } from '@/components/ui/responsive-image';
// Utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
}
import logo from '@/assets/MCB-Logo.png';

const CollectionDetail = () => {
  const { id } = useParams();
  const { t } = useHybridTranslation();
  const { pathname } = useLocation();
  const [collections, setCollections] = useState([]);
      
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const fetchCollections = async () => {
      try {
        const response = await masterCollectionService.getAll();
  
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

  const filteredCollection = collections.filter(collection => collection.id.toString() === id);

  if (filteredCollection.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('Collection not found')}</h1>
          <p className="text-muted-foreground">{t('The requested collection could not be found.')}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-5">
      <Header />
      
      {/* Breadcrumb */}
      {filteredCollection.map(collection => (
       <div key={collection.id}> 
          <section className="border-b hidden">
            <div className="container mx-auto px-4 py-4">
              <Link to="/collection">
                <Button variant="ghost" className="p-0 hidden">
                  <ArrowLeft size={20} className="mr-2" />
                  {t('Back to Collections')}
                </Button>
              </Link>
            </div>
          </section>

          {/* Content */}
          <section className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image */}
              <div className="space-y-4">
                {(collection.image_landscape || collection.image_portrait || collection.image_url) ? (
                  <ResponsiveImage
                    landscape={collection.image_landscape}
                    portrait={collection.image_portrait}
                    fallback={collection.image_url}
                    alt={collection.title}
                    bucket="hero-sections"
                    ratio="square"
                    className="rounded-lg border"
                  />
                ) : (
                  <div className="aspect-square overflow-hidden rounded-lg border flex items-center justify-center">
                    <img src={logo} alt={collection.title} className="w-2/3 h-2/3 object-contain opacity-80" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <Badge className="mb-2 hidden">{t(collection.category)}</Badge>
                  <h1 className="text-4xl font-bold mb-2">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: fixBrokenHtmlTags(collection.title)
                      }}
                    />
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: fixBrokenHtmlTags(collection.subtitle)
                      }}
                    />
                  </p>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground leading-relaxed">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: fixBrokenHtmlTags(collection.description)
                        }}
                      />
                    </p>
                  </CardContent>
                </Card>

                {collection.show_basic_information !== false && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('Basic Information')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Building className="text-primary" size={20} />
                      <div>
                        <p className="font-semibold">{t('Museum')}</p>
                        <p className="text-sm text-muted-foreground">{collection.museum_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="text-primary" size={20} />
                      <div>
                        <p className="font-semibold">{t('Discovered Year')}</p>
                        <p className="text-sm text-muted-foreground">{collection.discovered_year}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Palette className="text-primary" size={20} />
                      <div>
                        <p className="font-semibold">{t('Condition')}</p>
                        <p className="text-sm text-muted-foreground">{collection.condition}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Palette className="text-primary" size={20} />
                      <div>
                        <p className="font-semibold">{t('Material')}</p>
                        <p className="text-sm text-muted-foreground">{collection.material}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Ruler className="text-primary" size={20} />
                      <div>
                        <p className="font-semibold">{t('Dimensions')}</p>
                        <p className="text-sm text-muted-foreground">{collection.dimensions}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="text-primary" size={20} />
                      <div>
                        <p className="font-semibold">{t('Origin')}</p>
                        <p className="text-sm text-muted-foreground">{collection.origin}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                )}
              </div>
            </div>
          </section>
        </div>
      ))}

      <Footer />
    </div>
  );
};

export default CollectionDetail;
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Building, Ruler, Palette, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { defaultCollections } from '@/../database/default-data';
import { useEffect, useState } from 'react';
import { collectionService } from '@/lib/api-services';
import logo from '@/assets/MCB-Logo.png';

const CollectionDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [collections, setCollections] = useState([]);
      
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

  // const collection = collections[parseInt(id as string) as keyof typeof collections];
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
          <section className="border-b">
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
          <section className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image */}
              <div className="space-y-4">
                <div className="aspect-square overflow-hidden rounded-lg border">
                  <img
                    src={collection.image_url ? collection.image_url : logo}
                    alt={collection.title}
                    className={collection.image_url ? "w-full h-full object-cover" : "w-full h-full object-contain"}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <Badge className="mb-2">{t(collection.category)}</Badge>
                  <h1 className="text-4xl font-bold mb-2">{collection.title}</h1>
                  <p className="text-xl text-muted-foreground">{collection.subtitle}</p>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {collection.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('Basic Information')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Building className="text-primary" size={20} />
                      <div>
                        <p className="font-semibold">{t('Museum')}</p>
                        <p className="text-sm text-muted-foreground">{collection.museum}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="text-primary" size={20} />
                      <div>
                        <p className="font-semibold">{t('Period')}</p>
                        <p className="text-sm text-muted-foreground">{collection.period}</p>
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
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>{t('Historical Significance')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {collection.significance}
                  </p>
                  <div className="space-y-2">
                    <p><span className="font-semibold">{t('Discovered Year')}:</span> {collection.discoveredYear}</p>
                    <p><span className="font-semibold">{t('Condition')}:</span> {collection.condition}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('Cultural Context')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {collection.cultural_context}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>{t('Related Artifacts')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {typeof collection.related_artifacts === 'string' ? collection.related_artifacts.slice(1, -1).split(',').map((artifact, index) => (
                    <Badge key={index} variant="outline">
                      {artifact.trim()}
                    </Badge>
                  )) : collection.related_artifacts.map((artifact, index) => (

                    <Badge key={index} variant="outline">
                      {artifact}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      ))}

      <Footer />
    </div>
  );
};

export default CollectionDetail;
import { useParams, Link, useLocation } from 'react-router-dom';
import { useHybridTranslation } from '@/components/HybridTranslationProvider';
import { ArrowLeft, MapPin, Clock, Camera, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { defaultHeritages } from '@/../database/default-data';
import { useEffect, useState } from 'react';
import { heritageService } from '@/lib/api-services';
// Utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
}

const museumImages = import.meta.glob('../assets/museums/*', { eager: true });
const PLACEHOLDER_IMAGE = '/placeholder.svg';

function getImageUrl(filename: string | undefined | null) {
  // Handle null/undefined/empty filenames
  if (!filename) { return PLACEHOLDER_IMAGE };
  
  // If it's already a full URL, return as-is
  if (
    typeof filename === 'string' &&
    (filename.startsWith('http://') ||
      filename.startsWith('https://') ||
      filename.startsWith('/assets/') ||
      filename.startsWith('/src/assets/'))
  ) {
    return filename;
  }
  
  // Try to resolve using Vite's import
  const match = Object.entries(museumImages).find(([path]) => path.endsWith(filename));
  return match ? (match[1] as { default: string }).default : PLACEHOLDER_IMAGE;
}

const HeritageDetail = () => {
  const { id } = useParams();
  const { t } = useHybridTranslation();
  const [heritages, setHeritages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
      
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const fetchHeritages = async () => {
    try {
      setLoading(true);
      const response = await heritageService.getPublished(); // Public only sees approved heritage sites
      if(response.error || response.data.length === 0) {
        console.error('Error fetching heritages:', response.error);
        setHeritages(defaultHeritages);
      } else {
        setHeritages(response.data);
      }
    } catch (error) {
      console.error('Error fetching heritages:', error);
      setHeritages(defaultHeritages);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchHeritages();
  }, []);

  const filteredHeritage = heritages.filter((h) => h.id.toString() === id);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading heritage details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (filteredHeritage.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('Heritage site not found')}</h1>
          <p className="text-muted-foreground mb-4">{t('Heritage site with ID')} "{id}" {t('cannot be found.')}</p>
          <p className="text-muted-foreground mb-6">{t('Available heritage sites count')}: {heritages.length}</p>
          <Link to="/heritage">
            <Button variant="outline">
              {t('Back to Heritage Sites')}
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8 mt-8x hidden">
        <Link to="/heritage">
          <Button variant="outline" className="mb-6">
            <ArrowLeft size={16} className="mr-2" />
            {t('Back to Heritage Sites')}
          </Button>
        </Link>
      </div>
      {/* Hero Image */}
      {filteredHeritage.map((heritage) => (
      <div key={heritage.id}>
        <section className="relative h-96 overflow-hidden">
          <img
            src={getImageUrl(heritage.image_url || heritage.img_banner || heritage.banner_image)}
            alt={heritage.title || heritage.name || t('Heritage site')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-2">
              <span
                dangerouslySetInnerHTML={{
                  __html: fixBrokenHtmlTags(heritage.title || heritage.name || t('Heritage site'))
                }}
              />
            </h1>
            <p className="text-xl">
              <span
                dangerouslySetInnerHTML={{
                  __html: fixBrokenHtmlTags(heritage.subtitle || '')
                }}
              />
            </p>
          </div>
        </section>
        {/* Content */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">{t('About')}</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: fixBrokenHtmlTags(heritage.full_description || heritage.description || heritage.desc || t('No description available'))
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">{t('Info Singkat')}</h3>
                  <div className="space-y-3">
                    {heritage.location && (
                      <div className="flex items-start gap-3">
                        <MapPin size={20} className="mr-1 text-primary" />
                        <div>
                          <p className="font-semibold">{t('museumDetail.location')}</p>
                          <p className="text-sm text-muted-foreground">{heritage.location}</p>
                        </div>
                      </div>
                    )}
                    {heritage.period && (
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-3 text-primary" />
                        <span className="text-sm">{heritage.period}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Visit Information */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">{t('Informasi Kunjungan')}</h3>
                  <div className="space-y-4">
                    {heritage.visit_info && typeof heritage.visit_info === 'object' && (
                      <>
                        {heritage.visit_info.openHours && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2">{t('Jam Buka')}</h4>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock size={16} className="mr-2" />
                              <p>{heritage.visit_info.openHours}</p>
                            </div>
                          </div>
                        )}
                        
                        {heritage.visit_info.ticketPrice && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2">{t('Harga Tiket')}</h4>
                            <p className="text-sm text-muted-foreground">
                              {heritage.visit_info.ticketPrice}
                            </p>
                          </div>
                        )}
                        
                        {heritage.visit_info.bestTime && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2">{t('Waktu Terbaik untuk Berkunjung')}</h4>
                            <p className="text-sm text-muted-foreground">
                              {heritage.visit_info.bestTime}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-2">{t('Fasilitas')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {heritage.facilities && Array.isArray(heritage.facilities) && heritage.facilities.length > 0 ? (
                          heritage.facilities.map((facility, index) => (
                            <span key={index} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                              {facility}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">{t('Informasi fasilitas tidak tersedia')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="p-6 space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      // Open Google Maps with latitude and longitude
                      if (heritage.latitude && heritage.longitude) {
                        const googleMapsUrl = `https://www.google.com/maps?q=${heritage.latitude},${heritage.longitude}`;
                        window.open(googleMapsUrl, '_blank');
                      } else if (heritage.location) {
                        // Fallback to search by location name if coordinates not available
                        const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(heritage.location)}`;
                        window.open(googleMapsUrl, '_blank');
                      }
                    }}
                  >
                    <MapPin size={16} className="mr-2" />
                    {t('Lokasi')}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-semibold transition-bounce"
                    onClick={() => {
                      // For heritage sites, use WhatsApp contact
                      window.open('https://wa.me/6281295953929', '_blank');
                    }}
                  >
                    {t('Kontak Informasi')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>  
      ))}
      <Footer />
    </div>
  );
};

export default HeritageDetail;
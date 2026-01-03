import { useLocation, useParams } from 'react-router-dom';
import { useHybridTranslation } from '@/components/HybridTranslationProvider';
import { MapPin, Clock, Phone, Globe, Calendar} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { defaultMuseums } from '@/../database/default-data';
import { useEffect, useState } from 'react';
import { museumService } from '@/lib/api-services';
import { mapSlidesWithImageUrl } from '@/components/helper';
import SEO from '@/components/SEO';
import { logError } from '@/utils/logger';

// Utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
}
import GalleryCollection from '@/components/museum/GalleryCollection';

const museumImages = import.meta.glob(['../assets/museums/*', '../assets/sites/*'], { eager: true });
const PLACEHOLDER_IMAGE = '/placeholder.svg';
const shareEventHandler = (museumLink: string) => {
  let url = `https://${museumLink}`;
  if (
    typeof museumLink === 'string' &&
    (museumLink.startsWith('http://') ||
      museumLink.startsWith('https://'))
  ) {
    url = museumLink;
  }
  const link = document.createElement("a");
  link.href = url;
  // link.download = filename || "download";
  link.rel="noopener noreferrer";
  link.target="_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
function getMuseumImageUrl(filename: string | undefined | null) {
  if (!filename) { return PLACEHOLDER_IMAGE };
  
  // Check if the filename is just a filename (no path) and might be an uploaded file
  if (typeof filename === 'string' && !filename.includes('/') && !filename.includes('\\')) {
    // This is likely just a filename from the database, assume it's in uploads/museum/
    const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
    return `${baseUrl}/uploads/museum/${filename}`;
  }
  
  // For uploaded images, construct full URL
  if (typeof filename === 'string' && filename.startsWith('/uploads/')) {
    const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
    return `${baseUrl}${filename}`;
  }
  
  // For external URLs and assets, use as-is
  if (
    typeof filename === 'string' &&
    (filename.startsWith('http://') ||
      filename.startsWith('https://') ||
      filename.startsWith('/assets/'))
  ) {
    return filename;
  }
  
  // Try to resolve using Vite's import for local assets
  // Extract filename to match against glob paths which are relative
  const cleanFilename = filename.split('/').pop();
  if (!cleanFilename) return PLACEHOLDER_IMAGE;

  const match = Object.entries(museumImages).find(([path]) => path.endsWith(cleanFilename));
  return match ? (match[1] as { default: string }).default : PLACEHOLDER_IMAGE;
}

const MuseumDetail = () => {
  const { id } = useParams();
  const { t } = useHybridTranslation();
  const { pathname } = useLocation();
  
  const [museums, setMuseums] = useState([]);
      
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const fetchMuseums = async () => {
    try {
      const response = await museumService.getPublished(); // Public only sees approved museums
      if (response.error || response.data.length === 0) {
        logError('Error fetching museums:', response.error);
        setMuseums(mapSlidesWithImageUrl(defaultMuseums));
      } else {
        setMuseums(mapSlidesWithImageUrl(response.data)); // mapSlidesWithImageUrl(response.data);
      }
    } catch (error) {
      logError('Error fetching museums:', error);
    }
  }
  useEffect(() => {
    fetchMuseums();
  }, []);

  const filteredMuseum = museums.filter((m) => m.id === id);

  if (filteredMuseum.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('Museum tidak ditemukan')}</h1>
          <p className="text-muted-foreground">{t('Museum yang diminta tidak dapat ditemukan.')}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      {filteredMuseum.map((museum) => (
        <div key={museum.id}>
        <SEO
          title={museum.name.replace(/<[^>]*>?/gm, '')}
          description={museum.subtitle?.replace(/<[^>]*>?/gm, '') || museum.description?.replace(/<[^>]*>?/gm, '').substring(0, 160)}
          image={getMuseumImageUrl(museum.img_banner)}
        />

        <section className="relative h-96 overflow-hidden">
          <img
            src={getMuseumImageUrl(museum.img_banner)}
            alt={museum.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute bottom-8 left-8 text-white">
            <Badge className="mb-2">
              {museum.type === 'museum' ? t('museumDetail.museum') : t('museumDetail.heritage')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-2">
              <span
                dangerouslySetInnerHTML={{
                  __html: fixBrokenHtmlTags(museum.name)
                }}
              />
            </h1>
            <p className="text-xl pe-8">
              <span
                dangerouslySetInnerHTML={{
                  __html: fixBrokenHtmlTags(museum.subtitle)
                }}
              />
            </p>
          </div>
        </section>  
        {/* Content */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('museumDetail.about')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: fixBrokenHtmlTags(museum.description)
                      }}
                    />
                  </p>
                </CardContent>
              </Card>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{t('museumDetail.facilities')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {typeof museum.facilities === 'string' 
                      ? museum.facilities.split(',') 
                      : museum.facilities ?? [].map((facility, index) => (
                      <Badge key={index} variant="outline">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{t('museumDetail.galleryCollection')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <GalleryCollection museum={museum.name} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('museumDetail.visitInformation')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 text-primary" size={20} />
                    <div>
                      <p className="font-semibold">{t('museumDetail.location')}</p>
                      <p className="text-sm text-muted-foreground">{museum.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="mt-1 text-primary" size={20} />
                    <div>
                      <p className="font-semibold">{t('museumDetail.openingHours')}</p>
                      <div className="text-sm text-muted-foreground">
                        {museum.opening_hours.map((openingHour, index) => (
                          <p key={index}>{`${Object.keys(openingHour)} : ${Object.values(openingHour)}`}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="mt-1 text-primary" size={20} />
                    <div>
                      <p className="font-semibold">{t('museumDetail.contact')}</p>
                      <p className="text-sm text-muted-foreground">{museum.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Globe className="mt-1 text-primary" size={20} />
                    <div>
                      <p className="font-semibold">{t('museumDetail.website')}</p>
                      <p className="text-sm text-muted-foreground">{museum.website}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="mt-1 text-primary" size={20} />
                    <div>
                      <p className="font-semibold">{t('museumDetail.ticketPrice')}</p>
                      <p className="text-sm text-muted-foreground">{museum.ticket_price}</p>
                    </div>
                  </div>
                  {/* <button 
                    className="w-full bg-gradient-to-r from-primary to-secondary to-primary-glowx text-primary-foreground px-7 py-1 rounded-lg text-sm hover:scale-105 transition-bounce heritage-glow">
                    Beli Tiket
                  </button> */}
                </CardContent>
              </Card>
                {/* Actions */}
                <Card>
                  <CardContent className="p-6 space-y-3">
                    {/* <Button className="w-full bg-gradient-to-r from-primary to-primary-glow">
                      {t('Register Now')}
                    </Button> */}
                    <Button 
                      variant="outline" 
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-semibold transition-bounce"
                      onClick={() => shareEventHandler(`https://${museum.website}`)}
                    >
                      <Globe size={20} className="mr-2" />
                      {t('Kunjungi Situs Web')}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-semibold transition-bounce"
                      onClick={() => {
                        const ticketUrl = museum.ticket_url;
                        if (ticketUrl && ticketUrl.trim() !== '') {
                          shareEventHandler(ticketUrl);
                        } else {
                          shareEventHandler('https://wa.me/6281295953929');
                        }
                      }}
                    >Beli Tiket
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

export default MuseumDetail;
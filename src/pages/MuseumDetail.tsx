import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Phone, Globe, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { defaultMuseums } from '@/../database/default-data';
import { useEffect, useState } from 'react';
import { museumService } from '@/lib/api-services';
import { mapSlidesWithImageUrl, getImageUrl } from '@/components/helper';
import GalleryCollection from '@/components/museum/GalleryCollection';

const museumImages = import.meta.glob('../assets/museums/*', { eager: true });
const PLACEHOLDER_IMAGE = '/placeholder.svg';

function getMuseumImageUrl(filename: string | undefined | null) {
  if (!filename) return PLACEHOLDER_IMAGE;
  if (
    typeof filename === 'string' &&
    (filename.startsWith('http://') ||
      filename.startsWith('https://') ||
      filename.startsWith('/assets/'))
  ) {
    return filename;
  }
  // Try to resolve using Vite's import
  const match = Object.entries(museumImages).find(([path]) => path.endsWith(filename));
  return match ? (match[1] as any).default : PLACEHOLDER_IMAGE;
}

const MuseumDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  
  const [museums, setMuseums] = useState([]);
      
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
        setMuseums(mapSlidesWithImageUrl(response.data)); // mapSlidesWithImageUrl(response.data);
      }
    } catch (error) {
      console.error('Error fetching museums:', error);
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
          <h1 className="text-4xl font-bold mb-4">{t('Museum not found')}</h1>
          <p className="text-muted-foreground">{t('The requested museum could not be found.')}</p>
        </div>
        <Footer />
      </div>
    );
  }

  // const parseStringToJSON = (openingHoursString) => {
  //   try {
  //     const jsonString = openingHoursString
  //     .replace(/'/g, '"')
  //     console.log(jsonString);
  //     return JSON.parse(jsonString);
  //   } catch (error) {
  //     return { days_hours: openingHoursString, error }; // Fallback
  //   }
  // };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      {filteredMuseum.map((museum) => (
        <div key={museum.id}>

        <section className="relative h-96 overflow-hidden">
          <img
            src={getMuseumImageUrl(museum.image_url?.split('/').pop() || museum.image_url)}
            alt={museum.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute bottom-8 left-8 text-white">
            <Badge className="mb-2">
              {museum.type === 'museum' ? t('museumDetail.museum') : t('museumDetail.heritage')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-2">{museum.name}</h1>
            <p className="text-xl pe-8">{museum.subtitle}</p>
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
                    {museum.description}
                  </p>
                </CardContent>
              </Card>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{t('museumDetail.facilities')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(museum.facilities ?? []).map((facility, index) => (
                      <Badge key={index} variant="outline">
                        {facility}
                      </Badge>
                    ))}
                    {/* {typeof museum.facilities === 'string' && Object.entries(parseStringToJSON(museum.facilities)).map(([key, value]) => (
                      <Badge key={key} variant="outline" className='p-2'>
                        {key.charAt(0).toUpperCase() + key.slice(1)+' '}: {(value as string).charAt(0).toUpperCase() + (value as string).slice(1)}
                      </Badge>
                    ))} */}
                  </div>
                </CardContent>
              </Card>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{t('museumDetail.galleryCollection')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <GalleryCollection />
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
                        {/* {parseStringToJSON(museum.opening_hours).days_hours} */}
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
                      <p className="font-semibold hidden">{t('button.visitWebsite')}</p>
                      <p className="text-sm text-muted-foreground hidden">{museum.website}</p>
                      <button 
                        onClick={() => window.open(`https://${museum.website}`, '_blank')} 
                        className="bg-gradient-to-r from-primary to-secondary to-primary-glowx text-primary-foreground px-2 py-1 rounded-lg text-sm hover:scale-105 transition-bounce heritage-glow">
                        Kunjungi Situs
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="mt-1 text-primary" size={20} />
                    <div>
                      <p className="font-semibold">{t('museumDetail.ticketPrice')}</p>
                      <p className="text-sm text-muted-foreground">{museum.ticketPrice}</p>
                    </div>
                  </div>
                  <button 
                    className="w-full bg-gradient-to-r from-primary to-secondary to-primary-glowx text-primary-foreground px-7 py-1 rounded-lg text-sm hover:scale-105 transition-bounce heritage-glow">
                    Beli Tiket
                  </button>
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
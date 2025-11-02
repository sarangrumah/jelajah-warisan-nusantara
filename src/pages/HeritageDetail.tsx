import { useParams, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, Clock, Camera } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { museumService } from '@/lib/api-services';
import parse from 'html-react-parser';
// Utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
}

const HeritageDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [heritages, setHeritages] = useState([]);
  const { pathname } = useLocation();
      
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const fetchHeritages = async () => {
      try {
        const response = await museumService.getAll();
        if(response.error || response.data.length === 0) {
          console.error('Error fetching heritages:', response.error);
        } else {
          const filteredHeritages = response.data.filter((h:{id: string}) => h.id === id)
          .map((museum: {img_banner: string}) => ({
            ...museum,
            image: museum.img_banner && !museum.img_banner.startsWith('/uploads/museum/')
              ? `/uploads/museum/${museum.img_banner.split('/').pop()}`
              : museum.img_banner
          }));
          setHeritages(filteredHeritages);
        }
      } catch (error) {
        console.error('Error fetching heritages:', error);
      }
    };
    fetchHeritages();
  }, [id]);

  if (heritages.length === 0) {
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
      {heritages.map((heritage) => (
      <div key={heritage.id}>
        <section className="relative h-96 overflow-hidden">
          <img
            src={heritage.image}
            alt={heritage.name}
            className="w-full h-full object-cover parallax"
            onError={(e) => {
              console.error('[Museum] Image failed to load:', heritage.image);
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
          {/* <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" /> */}
          <div className="absolute bottom-8 left-8 text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-2">
              <span
                dangerouslySetInnerHTML={{
                  __html: fixBrokenHtmlTags(heritage.name)
                }}
              />
            </h1>
            <p className="text-xl">
              <span
                dangerouslySetInnerHTML={{
                  __html: fixBrokenHtmlTags(heritage.subtitle)
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
                        __html: fixBrokenHtmlTags(heritage.description)
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
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="mr-1 text-primary" />
                      <div>
                        <p className="font-semibold">{t('museumDetail.location')}</p>
                        <p className="text-sm text-muted-foreground">{heritage.address}</p>
                      </div>
                    </div>
                    {/* <div className="flex items-center">
                      <Calendar size={16} className="mr-3 text-primary" />
                      <span className="text-sm">{heritage.period}</span>
                    </div> */}
                  </div>
                </CardContent>
              </Card>

              {/* Visit Information */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">{t('Informasi Kunjungan')}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">{t('Jam Buka')}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock size={16} className="mr-2" />
                        {heritage.opening_hours.map((openingHour, index) => (
                          <p key={index}>{`${Object.keys(openingHour)} : ${Object.values(openingHour)}`}</p>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-2">{t('Harga Tiket')}</h4>
                      <p className="text-sm text-muted-foreground">
                        {heritage.ticket_price}
                      </p>
                    </div>
                    
                    {/* <div>
                      <h4 className="font-semibold text-sm mb-2">{t('Waktu Terbaik untuk Berkunjung')}</h4>
                      <p className="text-sm text-muted-foreground">
                        {heritage.visit_info.bestTime}
                      </p>
                    </div> */}
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-2">{t('Fasilitas')}</h4>
                      <div className="flex flex-wrap gap-2">{parse(heritage.facilities)}
                        {/* {heritage.facilities && heritage.facilities.map((facility, index) => (
                          <span key={index} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                            {facility}
                          </span>
                        ))} */}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="p-6 space-y-3">
                  <Button className="w-full bg-gradient-to-r from-primary to-primary-glow">
                    <Camera size={16} className="mr-2" />
                    {t('Tur Virtual')}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MapPin size={16} className="mr-2" />
                    {t('Lokasi')}
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
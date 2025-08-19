import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Phone, Globe, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { defaultMuseums } from '@/../database/default-data';
// import { museums } from '@/../database/get-data';
import { useEffect, useState } from 'react';
import { museumService } from '@/lib/api-services';

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
      if (response.error) {
        console.error('Error fetching museums:', response.error);
      }

      setMuseums(response.data || defaultMuseums);
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      {filteredMuseum.map((museum) => (
        <div key={museum.id}>

        <section className="relative h-96 overflow-hidden">
          <img
            src={museum.image_url}
            alt={museum.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute bottom-8 left-8 text-white">
            <Badge className="mb-2">
              {museum.type === 'museum' ? t('Museum') : t('Heritage Site')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-2">{museum.name}</h1>
            <p className="text-xl">{museum.subtitle}</p>
          </div>
        </section>  
        {/* Content */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('About')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {museum.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{t('Collections & Highlights')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {museum.collections.map((collection, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-semibold">{collection}</h4>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{t('Facilities')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {museum.facilities.map((facility, index) => (
                      <Badge key={index} variant="outline">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('Visit Information')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 text-primary" size={20} />
                    <div>
                      <p className="font-semibold">{t('Location')}</p>
                      <p className="text-sm text-muted-foreground">{museum.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="mt-1 text-primary" size={20} />
                    <div>
                      <p className="font-semibold">{t('Opening Hours')}</p>
                      <p className="text-sm text-muted-foreground">{museum.openingHours}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="mt-1 text-primary" size={20} />
                    <div>
                      <p className="font-semibold">{t('Contact')}</p>
                      <p className="text-sm text-muted-foreground">{museum.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Globe className="mt-1 text-primary" size={20} />
                    <div>
                      <p className="font-semibold">{t('Website')}</p>
                      <p className="text-sm text-muted-foreground">{museum.website}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="mt-1 text-primary" size={20} />
                    <div>
                      <p className="font-semibold">{t('Ticket Price')}</p>
                      <p className="text-sm text-muted-foreground">{museum.ticketPrice}</p>
                    </div>
                  </div>
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
import { useParams, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, Calendar, Clock, Camera } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { heritages } from '@/../database/get-data';
import { useEffect } from 'react';

const HeritageDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const { pathname } = useLocation();
      
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const filteredHeritage = heritages.filter((h) => h.id === parseInt(id as string));

  if (filteredHeritage.length === 0) {
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
            src={heritage.image}
            alt={heritage.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-2">{heritage.title}</h1>
            <p className="text-xl">{heritage.subtitle}</p>
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
                    {heritage.fullDescription.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Details */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">{t('Technical Details')}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(heritage.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">{t('Quick Info')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-3 text-primary" />
                      <span className="text-sm">{heritage.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-3 text-primary" />
                      <span className="text-sm">{heritage.period}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Visit Information */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">{t('Visit Information')}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">{t('Opening Hours')}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock size={16} className="mr-2" />
                        {heritage.visitInfo.openHours}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-2">{t('Ticket Price')}</h4>
                      <p className="text-sm text-muted-foreground">{heritage.visitInfo.ticketPrice}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-2">{t('Best Time to Visit')}</h4>
                      <p className="text-sm text-muted-foreground">{heritage.visitInfo.bestTime}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-2">{t('Facilities')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {heritage.visitInfo.facilities.map((facility, index) => (
                          <span key={index} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                            {facility}
                          </span>
                        ))}
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
                    {t('Virtual Tour')}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MapPin size={16} className="mr-2" />
                    {t('Get Directions')}
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
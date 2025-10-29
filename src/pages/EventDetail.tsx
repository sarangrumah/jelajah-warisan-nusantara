import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Phone, Mail, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { EventsService, contentService } from '@/lib/api-services';
import { useEffect, useState } from 'react';
import logo from '@/assets/MCB-Logo.png';
import parse from 'html-react-parser';

const eventImages = import.meta.glob('../assets/hero-sections/*', { eager: true });

function getEventsImageUrl(filename: string) {
  if (
    typeof filename === 'string' &&
    (filename.startsWith('http://') ||
      filename.startsWith('https://') ||
      filename.startsWith('/assets/'))
  ) {
    return filename;
  }
  const justFile = filename?.split('/').pop() || filename;
  // Try museums first
  const match = Object.entries(eventImages).find(([path]) => path.endsWith(justFile));
  if (match) {
    return (match[1] as { default: string }).default;
  }
  // Fallback: try public/assets/museums/ or public/assets/images/ for production
  if (justFile) {
    return `/assets/museums/${justFile}`;
  }
  return '/placeholder.svg';
}
interface CompanyProfile {
  whatsapp?: string;
}

const EventDetail = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companyWhatsApp, setCompanyWhatsApp] = useState<string>('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  // Fetch company profile to get WhatsApp number
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await contentService.getAll();
        if (response.data && response.data.length > 0) {
          const company = response.data[0] as CompanyProfile;
          if (company.whatsapp) {
            setCompanyWhatsApp(company.whatsapp);
          }
        }
      } catch (error) {
        console.error('Error fetching company profile:', error);
      }
    };

    fetchCompanyProfile();
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!id) {
          console.error('No event ID provided');
          setEvent(null);
          setLoading(false);
          return;
        }
        
        const response = await EventsService.getAll();
        if (response.error) {
          console.error('Error fetching event:', response.error);
          setEvent(null);
        } else {
          const foundEvent = response.data.find(
            (event: { id: string }) => event.id === id
          );
          if (!foundEvent) {
            console.warn(`Event with ID ${id} not found`);
            setEvent(null);
          } else {
            setEvent(foundEvent);
            setStatus(getEventStatus(foundEvent));
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);
  // console.log(event)

  const getEventStatus = (event) => {
    const now = new Date();

    if (event.start_published_date === null && new Date(event.start_date) > now) {
      return 'upcoming';
    }

    if (new Date(event.start_published_date) < now && new Date(event.start_date) > now) {
      return 'registration';
    }

    if (new Date(event.start_date) <= now && new Date(event.end_date) >= now) {
      return 'ongoing';
    }

    if (new Date(event.end_date) < now) {
      return 'finished';
    }

    return 'unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'ongoing': return 'bg-green-500';
      case 'registration': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Akan Datang';
      case 'ongoing': return 'Berlangsung';
      case 'registration': return 'Pendaftaran';
      default: return 'Selesai';
    }
  };

  // WhatsApp share function
  const handleShare = () => {
    if (!event) {
      return;
    }

    const eventTitle = event.title || 'Event Menarik';
    const eventUrl = window.location.href;
    
    // Create WhatsApp share message
    const message = `Halo! Saya ingin berbagi informasi event menarik dari Museum Cagar dan Budaya:\n\n${eventTitle}\n\nLihat detail event di: ${eventUrl}\n\n*Jelajah Warisan Nusantara* - Melestarikan Warisan Budaya Indonesia`;
    
    // Open WhatsApp share dialog (no specific recipient)
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Ticket purchase function
  const handleTicketPurchase = () => {
    if (!event) {
      return;
    }

    // If event has ticket_url, use it
    if (event.ticket_url) {
      window.open(event.ticket_url, '_blank');
      return;
    }

    // Fallback to WhatsApp for ticket purchase
    const eventTitle = event.title || 'Event Menarik';
    const message = `Halo! Saya tertarik untuk membeli tiket event:\n\n${eventTitle}\n\nBisa dibantu untuk informasi pembelian tiketnya?`;
    
    if (companyWhatsApp) {
      const formattedNumber = companyWhatsApp.replace(/[^\d+]/g, '');
      const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center h-64">
            <span className="text-lg text-muted-foreground">
              {t('Loading event details...')}
            </span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('Event not found')}</h1>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div key={event.id} className="pt-20">
        {/* Hero Image */}
          <section className="relative overflow-hidden h-[60vh]">
            {/* <img
              src={event.image_url ? event.image_url : logo}
              alt={event.title}
              className={event.image_url ? "w-full h-full object-cover object-center" : "absolute right-[42.5%] top-3 h-[70%] max-md:right-[37.5%] object-contain object-center"}
            /> */}
            <img
              src={
                (() => {
                  const imageCandidate = event.banner_img || '';
                  const resolved = getEventsImageUrl(imageCandidate);
                  // Use logo as placeholder if no image
                  return (resolved && resolved !== '/placeholder.svg')
                    ? resolved
                    : logo;
                })()}
              alt={event.name}
              className={event.banner_img ? "w-full h-full object-cover object-center" : "absolute right-[42.5%] top-3 h-[70%] max-md:right-[37.5%] object-contain object-center"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 right-8">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-primary/90 ${getStatusColor(status)}`}>
                {getStatusLabel(status)}
              </span>
            </div>
            <div className="absolute bottom-4 left-8 w-[70%] text-white">
              <h1 className="text-4xl md:text-4xl font-bold mb-2">{event.title}</h1>
              {/* <p className="text-xl">{event.description}</p> */}
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
                    <h2 className="text-2xl font-bold mb-4">{t('About This Event')}</h2>
                    <div className="space-y-4 text-muted-foreground">
                      {event.description ? (
                        event.description.split('\n\n').map((paragraph, index) => (
                          <p key={index}>{parse(paragraph)}</p>
                        ))
                      ) : (
                        <p>{t('No description available')}</p>
                      )}
                    </div>
                  </CardContent>
                  {/* <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">{t('Event Highlights')}</h3>
                    <ul className="space-y-2">
                      {event.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent> */}
                </Card>

                {/* Highlights */}
                {/* <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">{t('Event Highlights')}</h3>
                    <ul className="space-y-2">
                      {event.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card> */}

                {/* Schedule */}
                {/* <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">{t('Event Schedule')}</h3>
                    <div className="space-y-4">
                      {typeof event.schedule === 'string' ? parseSchedule(event.schedule).map((item: any, index: number) => (
                        <div key={index} className="flex gap-4 pb-4 border-b border-border last:border-0">
                          <div className="text-sm font-semibold text-primary min-w-24">
                            {item.time}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.activity}
                          </div>
                        </div>
                      ))
                      : 
                      event.schedule.map((item, index) => (
                        <div key={index} className="flex gap-4 pb-4 border-b border-border last:border-0">
                          <div className="text-sm font-semibold text-primary min-w-24">
                            {item.time}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.activity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card> */}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Event Info */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">{t('Event Information')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Calendar size={16} className="mr-3 text-primary mt-1" />
                        <div>
                          <div className="font-semibold text-sm">{event.date}</div>
                          <div className="text-sm text-muted-foreground">{event.time}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <MapPin size={16} className="mr-3 text-primary mt-1" />
                        <div>
                          <div className="font-semibold text-sm">{parse(event.location)}</div>
                          <div className="text-sm text-muted-foreground">{parse(event.address) || t('No address provided')}</div>
                        </div>
                      </div>
                      
                    </div>
                  </CardContent>
                </Card>

                {/* Contact */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">{t('Contact Information')}</h3>
                    <div className="space-y-3 pb-5">
                      {event.contact && (
                        <div className="flex items-center">
                          <Phone size={16} className="mr-3 text-primary" />
                          <span className="text-sm">{event.contact}</span>
                        </div>
                      )}
                      {event.contact_email && (
                        <div className="flex items-center">
                          <Mail size={16} className="mr-3 text-primary" />
                          <span className="text-sm">{event.contact_email}</span>
                        </div>
                      )}
                      {!event.contact && (
                        <div className="text-sm text-muted-foreground">
                          {t('No contact information available')}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardContent className="p-6 space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-semibold transition-bounce"
                      onClick={handleShare}
                    >
                      <Share2 size={16} className="mr-2" />
                      {t('Bagikan')}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-semibold transition-bounce"
                      onClick={handleTicketPurchase}
                    >Beli Tiket
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </div>

      <Footer />
    </div>
  );
};

export default EventDetail;
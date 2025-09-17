import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, MapPin, Phone, Mail, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { defaultEvents } from '@/../database/default-data';
import { agendaService, EventsService } from '@/lib/api-services';
import { useEffect, useState } from 'react';
import logo from '@/assets/MCB-Logo.png';

const EventDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await EventsService.getAll();
      if (response.error || response.data.length === 0) {
        console.error('Error fetching events:', response.error);
        setEvents(defaultEvents);
      } else {
        const filteredEvents = response.data.filter((event: any) => event.id === id);
        setEvents(filteredEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  // const filteredEvent = events.filter((event) => event.id.toString() === id);

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

  // function parseSchedule(str: string) {
  //   try {
  //     let clean = str.trim();
  //     clean = clean.replace(/^\{\{/, "[").replace(/\}\}$/, "]");
  //     if (!clean.includes("{")) {
  //       clean = clean.replace(/\[\s*'/, "[{ '");
  //     } else {
  //       clean = clean.replace(/\[\s*'/, "[{ '");
  //     }
      
  //     if (!clean.includes("}")) {
  //       clean = clean.replace(/}?\s*]$/, "}]");
  //     } else {
  //       clean = clean.replace(/}?\s*]$/, "}]");
  //     }
  //     clean = `[${clean}]`;
  //     clean = clean.replace(/'/g, '"');
  //     const parsed = JSON.parse(clean);
  //     return Array.isArray(parsed[0]) ? parsed[0] : parsed;
  //   } catch (e) {
  //     console.error("Parsing error:", e);
  //     return [];
  //   }
  // }

  const shareEventHandler = (url) => {
    const link = document.createElement("a");
    link.href = url;
    // link.download = filename || "download";
    link.rel="noopener noreferrer";
    link.target="_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8x py-10">
        <Link to="/agenda">
          <Button variant="outline" className="mb-6 hidden">
            <ArrowLeft size={16} className="mr-2" />
            {t('Back to Agenda')}
          </Button>
        </Link>
      </div>

      {events && events.map((event) => (
        <div key={event.id}>
        {/* Hero Image */}
          <section className="relative h-96x overflow-hidden h-[86vh]">
            <img
              src={event.image_url ? event.image_url : logo}
              alt={event.title}
              className={event.image_url ? "w-full h-full object-cover object-center" : "absolute right-[42.5%] top-3 h-[70%] max-md:right-[37.5%] object-contain object-center"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 right-8">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-primary/90 ${getStatusColor(event.status)}`}>
                {getStatusLabel(event.status)}
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
                      {event.description.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
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
                          <div className="font-semibold text-sm">{event.location}</div>
                          <div className="text-sm text-muted-foreground">{event.address}</div>
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
                      <div className="flex items-center">
                        <Phone size={16} className="mr-3 text-primary" />
                        <span className="text-sm">{event.contact.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail size={16} className="mr-3 text-primary" />
                        <span className="text-sm">{event.contact.email}</span>
                      </div>
                    </div>
                    {/* <button 
                      className="bg-gradient-to-r w-full from-primary to-secondary to-primary-glowx text-primary-foreground px-7 py-1 rounded-lg text-sm hover:scale-105 transition-bounce heritage-glow">
                      Beli Tiket
                    </button> */}
                  </CardContent>
                </Card>

                {/* Requirements */}
                {/* <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">{t('Requirements')}</h3>
                    <ul className="space-y-2">
                      {event.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card> */}

                {/* Actions */}
                <Card>
                  <CardContent className="p-6 space-y-3">
                    {/* <Button className="w-full bg-gradient-to-r from-primary to-primary-glow">
                      {t('Register Now')}
                    </Button> */}
                    <Button 
                      variant="outline" 
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-semibold transition-bounce"
                      onClick={() => shareEventHandler('https://wa.me/6281295953929')}
                    >
                      <Share2 size={16} className="mr-2" />
                      {t('Share Event')}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-semibold transition-bounce"
                      onClick={() => shareEventHandler('https://wa.me/6281295953929')}
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

export default EventDetail;
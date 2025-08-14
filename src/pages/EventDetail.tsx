import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Phone, Mail, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { events, placeholder } from '@/../database/get-data';

const EventDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  // Mock data - in real app, fetch by ID
  const eventx = {
    id: 1,
    title: 'Pameran Warisan Majapahit',
    category: 'pameran',
    date: '15-30 Februari 2024',
    time: '09:00 - 17:00 WIB',
    location: 'Museum Nasional Jakarta',
    address: 'Jl. Medan Merdeka Barat No.12, Gambir, Jakarta Pusat',
    participants: 500,
    description: 'Pameran artefak dan benda bersejarah dari era Kerajaan Majapahit',
    image: '/src/assets/heritage-sites.jpg',
    status: 'upcoming',
    fullDescription: `Pameran Warisan Majapahit merupakan sebuah pameran komprehensif yang menampilkan koleksi artefak bersejarah dari era Kerajaan Majapahit, salah satu kerajaan terbesar dalam sejarah Indonesia.

Pameran ini menampilkan lebih dari 200 artefak autentik termasuk prasasti, keramik, perhiasan, senjata tradisional, dan karya seni dari periode 1293-1527 Masehi. Pengunjung akan dapat melihat langsung bukti-bukti kejayaan Majapahit yang pernah menguasai sebagian besar wilayah Nusantara.

Pameran dilengkapi dengan teknologi multimedia interaktif, diorama, dan rekonstruksi 3D yang memberikan pengalaman immersive kepada pengunjung untuk memahami kehidupan dan budaya masyarakat Majapahit.`,
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62 21 3868172',
      email: 'info@museumnasional.or.id',
      website: 'www.museumnasional.or.id'
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  };

  const filteredEvent = events.filter((event) => event.id === Number(id));

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8 hidden">
        <Link to="/agenda">
          <Button variant="outline" className="mb-6">
            <ArrowLeft size={16} className="mr-2" />
            {t('Back to Agenda')}
          </Button>
        </Link>
      </div>

      {filteredEvent && filteredEvent.map((event) => (
        <div key={event.id}>
        {/* Hero Image */}
          <section className="relative h-96 overflow-hidden">
            <img
              src={event.image ? event.image : placeholder.image}
              alt={event.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 right-8">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(event.status)}`}>
                {getStatusLabel(event.status)}
              </span>
            </div>
            <div className="absolute bottom-8 left-8 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{event.title}</h1>
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
                </Card>

                {/* Highlights */}
                <Card>
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
                </Card>

                {/* Schedule */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">{t('Event Schedule')}</h3>
                    <div className="space-y-4">
                      {event.schedule.map((item, index) => (
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
                </Card>
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
                      
                      <div className="flex items-center">
                        <Users size={16} className="mr-3 text-primary" />
                        <span className="text-sm">{event.participants} peserta terdaftar</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">{t('Contact Information')}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Phone size={16} className="mr-3 text-primary" />
                        <span className="text-sm">{event.contact.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail size={16} className="mr-3 text-primary" />
                        <span className="text-sm">{event.contact.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card>
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
                </Card>

                {/* Actions */}
                <Card>
                  <CardContent className="p-6 space-y-3">
                    <Button className="w-full bg-gradient-to-r from-primary to-primary-glow">
                      {t('Register Now')}
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Share2 size={16} className="mr-2" />
                      {t('Share Event')}
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
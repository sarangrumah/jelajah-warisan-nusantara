import { Shield, BookOpen, Microscope, Globe, Camera, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Services = () => {
  const services = [
    {
      icon: Shield,
      title: 'Pelestarian Cagar Budaya',
      description: 'Konservasi dan restorasi situs bersejarah serta artefak budaya',
      features: ['Konservasi preventif', 'Restorasi struktural', 'Monitoring kondisi', 'Dokumentasi digital']
    },
    {
      icon: BookOpen,
      title: 'Pengelolaan Museum',
      description: 'Manajemen koleksi dan operasional museum di seluruh Indonesia',
      features: ['Kurasi koleksi', 'Manajemen penyimpanan', 'Program pameran', 'Layanan pengunjung']
    },
    {
      icon: Microscope,
      title: 'Penelitian & Pengembangan',
      description: 'Riset ilmiah untuk pengembangan metode pelestarian modern',
      features: ['Penelitian arkeologi', 'Studi konservasi', 'Inovasi teknologi', 'Publikasi ilmiah']
    },
    {
      icon: Globe,
      title: 'Kerjasama Internasional',
      description: 'Kolaborasi dengan lembaga internasional dalam pelestarian budaya',
      features: ['Program pertukaran', 'Standar internasional', 'Capacity building', 'Best practices']
    },
    {
      icon: Camera,
      title: 'Digitalisasi Warisan',
      description: 'Transformasi digital koleksi untuk preservasi dan akses public',
      features: ['3D scanning', 'Virtual reality', 'Database digital', 'Platform online']
    },
    {
      icon: Users,
      title: 'Edukasi & Outreach',
      description: 'Program pendidikan dan sosialisasi kepada masyarakat',
      features: ['Workshop komunitas', 'Program sekolah', 'Pelatihan SDM', 'Kampanye awareness']
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-heritage-gradient">
            Layanan Kami
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Kami menyediakan berbagai layanan profesional dalam bidang pelestarian 
            dan pengelolaan warisan budaya Indonesia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="scroll-reveal heritage-glow hover:scale-105 transition-bounce">
              <CardHeader>
                <service.icon size={48} className="text-primary mb-4" />
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <p className="text-muted-foreground">{service.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-primary">Key Features:</h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center scroll-reveal">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Butuh Layanan Khusus?
            </h3>
            <p className="text-muted-foreground mb-6">
              Tim ahli kami siap membantu Anda dengan kebutuhan khusus dalam 
              pelestarian dan pengelolaan warisan budaya.
            </p>
            <button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-bounce heritage-glow">
              Konsultasi Gratis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
import { Building2, Landmark, ArrowRight, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ManagementSection = () => {
  const { t } = useTranslation();
  const managementCards = [
    {
      icon: Building2,
      title: 'Museum',
      description: 'Pengelolaan koleksi, pameran, dan program edukasi di seluruh museum Indonesia',
      features: [
        'Sistem koleksi digital',
        'Program pameran berkala',
        'Layanan edukasi publik',
        'Penelitian dan dokumentasi'
      ],
      stats: { museums: 500, visitors: '2.5M', programs: 150 },
      gradient: 'from-primary to-primary-glow'
    },
    {
      icon: Landmark,
      title: 'Cagar Budaya',
      description: 'Pelestarian dan perlindungan situs bersejarah dan warisan budaya nasional',
      features: [
        'Konservasi situs bersejarah',
        'Monitoring kondisi',
        'Program restorasi',
        'Penelitian arkeologi'
      ],
      stats: { sites: 1200, provinces: 34, projects: 85 },
      gradient: 'from-accent to-secondary'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-card to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-heritage-gradient">
            {t('management.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('management.description')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {managementCards.map((card, index) => (
            <div
              key={index}
              className="group bg-card border border-border rounded-2xl overflow-hidden heritage-glow hover:scale-105 transition-bounce scroll-reveal"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${card.gradient} p-8 text-primary-foreground`}>
                <div className="flex items-center mb-4">
                  <card.icon size={40} className="mr-4" />
                  <h3 className="text-3xl font-bold">{card.title}</h3>
                </div>
                <p className="text-primary-foreground/90 text-lg">
                  {card.description}
                </p>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Features */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-foreground mb-4">
                    Layanan Utama
                  </h4>
                  <ul className="space-y-3">
                    {card.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {Object.entries(card.stats).map(([key, value], statIndex) => (
                    <div key={statIndex} className="text-center">
                      <div className="text-2xl font-bold text-heritage-gradient">
                        {value}
                      </div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {key === 'museums' ? 'Museum' : 
                         key === 'visitors' ? 'Pengunjung' :
                         key === 'programs' ? 'Program' :
                         key === 'sites' ? 'Situs' :
                         key === 'provinces' ? 'Provinsi' :
                         key === 'projects' ? 'Proyek' : key}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to={card.title === 'Museum' ? '/museum' : '/heritage'} className="flex-1">
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:scale-105 transition-bounce"
                    >
                      <Users size={16} className="mr-2" />
                      Kelola {card.title}
                    </Button>
                  </Link>
                  <Link to="/agenda" className="flex-1">
                    <Button 
                      variant="outline" 
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-heritage"
                    >
                      <Calendar size={16} className="mr-2" />
                      Lihat Agenda
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary-glow/10 opacity-0 group-hover:opacity-100 transition-heritage pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Integration highlight */}
        <div className="mt-16 text-center scroll-reveal">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Sistem Terintegrasi Nasional
            </h3>
            <p className="text-muted-foreground mb-6">
              Platform digital yang menghubungkan seluruh museum dan situs cagar budaya 
              di Indonesia dalam satu ekosistem yang mudah diakses dan dikelola.
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-8 py-3 hover:scale-105 transition-bounce heritage-glow"
            >
              Akses Sistem
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManagementSection;
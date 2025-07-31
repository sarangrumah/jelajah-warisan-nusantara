import { Shield, BookOpen, Microscope, Globe, Camera, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const Services = () => {
  const { t } = useTranslation();
  
  const services = [
    {
      icon: Shield,
      title: t('about.services.heritage.title'),
      description: t('about.services.heritage.description'),
      features: t('about.services.heritage.features', { returnObjects: true }) as string[]
    },
    {
      icon: BookOpen,
      title: t('about.services.museum.title'),
      description: t('about.services.museum.description'),
      features: t('about.services.museum.features', { returnObjects: true }) as string[]
    },
    {
      icon: Microscope,
      title: t('about.services.research.title'),
      description: t('about.services.research.description'),
      features: t('about.services.research.features', { returnObjects: true }) as string[]
    },
    {
      icon: Globe,
      title: t('about.services.international.title'),
      description: t('about.services.international.description'),
      features: t('about.services.international.features', { returnObjects: true }) as string[]
    },
    {
      icon: Camera,
      title: t('about.services.digitization.title'),
      description: t('about.services.digitization.description'),
      features: t('about.services.digitization.features', { returnObjects: true }) as string[]
    },
    {
      icon: Users,
      title: t('about.services.education.title'),
      description: t('about.services.education.description'),
      features: t('about.services.education.features', { returnObjects: true }) as string[]
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-heritage-gradient">
            {t('about.services.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('about.services.subtitle')}
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
              {t('about.services.consultationTitle')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('about.services.consultationText')}
            </p>
            <button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-bounce heritage-glow">
              {t('about.services.consultationButton')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
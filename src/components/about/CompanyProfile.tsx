import { Building, Users, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { DynamicComponent } from '../dynamic-components';

const CompanyProfile = () => {
  const { t } = useTranslation();
  const [highlights, setHighlights] = useState([]);
  
  const highlightsx = [
    {
      icon: Building,
      title: t('about.companyProfile.highlights.institution.title'),
      description: t('about.companyProfile.highlights.institution.description')
    },
    {
      icon: Users,
      title: t('about.companyProfile.highlights.team.title'),
      description: t('about.companyProfile.highlights.team.description')
    },
    {
      icon: Target,
      title: t('about.companyProfile.highlights.mission.title'),
      description: t('about.companyProfile.highlights.mission.description')
    },
    {
      icon: Award,
      title: t('about.companyProfile.highlights.recognition.title'),
      description: t('about.companyProfile.highlights.recognition.description')
    }
  ];

  const getHighlights = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/highlights');
      const data = await response.json();
      setHighlights(data);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getHighlights();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-heritage-gradient">
            {t('about.companyProfile.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('about.companyProfile.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="scroll-reveal">
            <img 
              src="/src/assets/museum-interior.jpg" 
              alt="Museum Interior"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          
          <div className="space-y-6 scroll-reveal">
            <h3 className="text-3xl font-bold text-foreground">
              {t('about.companyProfile.historyTitle')}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('about.companyProfile.historyText1')}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t('about.companyProfile.historyText2')}
            </p>
            
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
              <h4 className="text-xl font-semibold text-primary mb-3">{t('about.companyProfile.commitmentTitle')}</h4>
              <p className="text-muted-foreground">
                {t('about.companyProfile.commitmentText')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 scroll-reveal">
          {highlights.map((item, index) => (
            <Card key={index} className="heritage-glow hover:scale-105 transition-bounce">
              <CardHeader className="text-center">
                <DynamicComponent componentName={item.icon} size={48} className="text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">{t(`about.companyProfile.highlights.${item.title}`)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center text-sm">
                  {t(`about.companyProfile.highlights.${item.description}`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyProfile;
import { Users, Award, MapPin, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DynamicComponent } from './dynamic-components';


const ProfileSection = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState([]);
  
  const statsx = [
    { icon: Users, value: '500+', label: t('profile.stats.museums') },
    { icon: Award, value: '1,200+', label: t('profile.stats.heritage') },
    { icon: MapPin, value: '34', label: t('profile.stats.provinces') },
    { icon: Clock, value: '50+', label: t('profile.stats.experience') },
  ];

  const getStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-heritage-gradient">
            {t('profile.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('profile.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6 scroll-reveal">
            <h3 className="text-3xl font-bold text-foreground">
              Visi & Misi Kami
            </h3>
            
            <div className="space-y-4">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                <h4 className="text-xl font-semibold text-primary mb-3">{t('profile.vision')}</h4>
                <p className="text-muted-foreground">
                  {t('profile.visionText')}
                </p>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                <h4 className="text-xl font-semibold text-primary mb-3">{t('profile.mission')}</h4>
                <ul className="space-y-2 text-muted-foreground">
                  {(t('profile.missionItems', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 scroll-reveal">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 text-center heritage-glow hover:scale-105 transition-bounce"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* {<stat.icon size={32} className="text-primary mx-auto mb-4" />} */}
                <DynamicComponent componentName={stat.icon} size={32} className="text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-heritage-gradient mb-2">
                  {stat.value >= 50 ? `${stat.value}+` : stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t(`profile.stats.${stat.label}`)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center scroll-reveal">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {t('profile.callToAction')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('profile.callToActionText')}
            </p>
            <Link to="/tentang-kami">
              <button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-bounce heritage-glow">
                {t('profile.learnMore')}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
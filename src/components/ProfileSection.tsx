import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DynamicComponent } from './dynamic-components';
import { museumStat } from '@/../database/get-data';

const ProfileSection = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState([
    { icon: 'Users', value: museumStat.museums, label: 'museums' },
    { icon: 'Award', value: museumStat.heritages, label: 'heritage' },
    { icon: 'MapPin', value: museumStat.provinces, label: 'provinces' },
    { icon: 'Clock', value: museumStat.experiences, label: 'experience' },
  ]);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-4xl font-bold text-heritage-gradient pb-3">
            {t('profile.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-8xl mx-autox p-6 leading-relaxed text-justify">
            {t('profile.description')}
          </p>
        </div>

        <div className="grid gap-12 items-center mb-16">
          <div className="space-y-6 scroll-reveal">
            {/* <h3 className="text-3xl font-bold text-foreground">
              Visi & Misi Kami
            </h3> */}
            
            <div className="space-y-4 items-center">
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
        </div>

        {/* Call to Action */}
        {/* <div className="text-center scroll-reveal">
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
        </div> */}
      </div>
    </section>
  );
};

export default ProfileSection;
import { Building2, Landmark, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHybridTranslation } from '@/components/HybridTranslationProvider';
import { Link } from 'react-router-dom';
import { useMemo, useEffect, useState } from 'react';
import { museumStat } from '@/../database/get-data';

const ManagementSectionDebug = () => {
  const { t, i18n, ready } = useHybridTranslation();
  const [debugInfo, setDebugInfo] = useState<any>({});
  
  useEffect(() => {
    // Debug: Check what translations are loaded
    
    // Try to get the translation store
    const store = (i18n as any).store;
    if (store && store.data) {
      
      // Check if management translations exist
      const currentLang = i18n.language;
      const translations = store.data[currentLang]?.translation || {};
      
      // Filter management keys
      const managementKeys = Object.keys(translations).filter(key => 
        key.includes('management')
      );
      
      // Show actual values
      const managementTranslations: any = {};
      managementKeys.forEach(key => {
        managementTranslations[key] = translations[key];
      });
      
      setDebugInfo({
        ready,
        language: i18n.language,
        totalKeys: Object.keys(translations).length,
        managementKeys: managementKeys.length,
        managementTranslations
      });
    }
    
    // Test specific translations
  }, [t, i18n, ready]);
  
  // Define cards inside useMemo to make them reactive to language changes
  const managementCards = useMemo(() => [
    {
      icon: Building2,
      type: 'museum',
      title: t('management.museum.title'),
      description: t('management.museum.description'),
      features: [
        t('management.museum.feature1'),
        t('management.museum.feature2'),
        t('management.museum.feature3'),
        t('management.museum.feature4')
      ],
      stats: { 
        museums: museumStat.museums, 
        visitors: museumStat.visitors, 
        programs: museumStat.programs 
      },
      gradient: 'from-primary to-primary-glow',
      link: '/museum'
    },
    {
      icon: Landmark,
      type: 'heritage',
      title: t('management.heritage.title'),
      description: t('management.heritage.description'),
      features: [
        t('management.heritage.feature1'),
        t('management.heritage.feature2'),
        t('management.heritage.feature3'),
        t('management.heritage.feature4')
      ],
      stats: { 
        sites: museumStat.sites, 
        provinces: museumStat.provinces, 
        projects: museumStat.projects 
      },
      gradient: 'from-accent to-secondary',
      link: '/heritage'
    }
  ], [t]);

  return (
    <>
      {/* Debug Panel */}
      <div className="bg-yellow-100 border-2 border-yellow-500 p-4 m-4 rounded">
        <h3 className="font-bold text-lg mb-2">🐛 Debug Info</h3>
        <div className="text-sm space-y-1">
          <p><strong>i18n Ready:</strong> {ready ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Language:</strong> {i18n.language}</p>
          <p><strong>Total Translation Keys:</strong> {debugInfo.totalKeys || 0}</p>
          <p><strong>Management Keys Found:</strong> {debugInfo.managementKeys || 0}</p>
          <details className="mt-2">
            <summary className="cursor-pointer font-semibold">View Management Translations</summary>
            <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-60">
              {JSON.stringify(debugInfo.managementTranslations, null, 2)}
            </pre>
          </details>
          <div className="mt-2 p-2 bg-white rounded">
            <p className="font-semibold">Test Translations:</p>
            <p>museum.title: <code className="bg-gray-200 px-1">{t('management.museum.title')}</code></p>
            <p>heritage.title: <code className="bg-gray-200 px-1">{t('management.heritage.title')}</code></p>
            <p>mainServices: <code className="bg-gray-200 px-1">{t('management.mainServices')}</code></p>
          </div>
        </div>
      </div>

      {/* Original Component */}
      <section className="py-20 from-card to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-reveal">
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {managementCards.map((card, index) => (
              <Link 
                key={index}
                to={card.link} 
                className="flex-1"
              >
                <div
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
                        {t('management.mainServices')}
                      </h4>
                      <ul className="space-y-3">
                        {card.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-muted-foreground">
                            <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                            <span>{feature}</span>
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
                            {t(`management.${card.type}.stats.${key}`)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link to={card.link} className="flex-1">
                        <Button 
                          className="w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:scale-105 transition-bounce"
                        >
                          <Users size={16} className="mr-2" />
                          {t('management.manage')} {card.title}
                        </Button>
                      </Link>
                      <Link to="/agenda" className="flex-1">
                        <Button 
                          variant="outline" 
                          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-heritage"
                        >
                          <Calendar size={16} className="mr-2" />
                          {t('management.viewAgenda')}
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary-glow/10 opacity-0 group-hover:opacity-100 transition-heritage pointer-events-none" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ManagementSectionDebug;

import { Building, Landmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import IndonesiaMap from './IndonesiaMap';
import { useTranslation } from 'react-i18next';
import { useContentTranslation } from '@/hooks/useContentTranslation';
import { museumService } from '@/lib/api-services';
import { useEffect, useState } from 'react';

const DistributionSection = () => {
  const { t } = useTranslation();
  const [regions, setRegions] = useState([]);
  const { translatedContent } = useContentTranslation(regions);

  useEffect(() => {
    const fetchRegions = async () => {
      const response = await museumService.getAll();
      if (response.data) {
        // Assuming the API returns data that can be processed into regions
        // This is a placeholder for the actual data processing logic
        const processedRegions = response.data.map((item: any) => ({
          key: item.region_key,
          museums: item.museums_count,
          heritage: item.heritage_count,
          color: item.color,
        }));
        setRegions(processedRegions);
      }
    };
    fetchRegions();
  }, []);

  const displayRegions = translatedContent || regions;

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal hidden">
          <h2 className="text-4xl md:text-4xl font-bold pb-3 text-heritage-gradient">
            {t('distribution.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('distribution.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 hidden">
          {displayRegions.map((region, index) => (
            <Card key={index} className="scroll-reveal heritage-glow hover:scale-105 transition-bounce">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${region.color}`}></div>
                  {t(`distribution.regions.${region.key}`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building size={16} className="text-primary" />
                      <span className="text-sm">{t('distribution.labels.museum')}</span>
                    </div>
                    <span className="font-bold text-heritage-gradient">{region.museums}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Landmark size={16} className="text-primary" />
                      <span className="text-sm">{t('distribution.labels.heritage')}</span>
                    </div>
                    <span className="font-bold text-heritage-gradient">{region.heritage}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="relative text-center scroll-reveal">
          <IndonesiaMap />

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur-sm p-4 rounded-lg border border-border">
            <h4 className="font-bold mb-2 text-heritage-gradient">{t('distribution.legend.title', 'Legend')}</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary"></div>
                <span>{t('distribution.legend.museum', 'Museum')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-secondary"></div>
                <span>{t('distribution.legend.heritage', 'Heritage')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistributionSection;
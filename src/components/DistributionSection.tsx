import { Building, Landmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import IndonesiaMap from './IndonesiaMap';
import { useTranslation } from 'react-i18next';
import { museumService } from '@/lib/api-services';
import { useEffect, useState } from 'react';

const RegionCard = ({ region }: { region: { key: string; color: string; museums: number; heritage: number } }) => {
  const { t } = useTranslation();
  const regionName = t(`distribution.regions.${region.key}`) || region.key;
  const museumLabel = t('distribution.labels.museum');
  const heritageLabel = t('distribution.labels.heritage');

  return (
    <Card className="scroll-reveal heritage-glow hover:scale-105 transition-bounce">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded-full ${region.color}`}></div>
          {regionName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building size={16} className="text-primary" />
              <span className="text-sm">{museumLabel}</span>
            </div>
            <span className="font-bold text-heritage-gradient">{region.museums}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark size={16} className="text-primary" />
              <span className="text-sm">{heritageLabel}</span>
            </div>
            <span className="font-bold text-heritage-gradient">{region.heritage}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DistributionSection = () => {
    const [regions, setRegions] = useState([]);
    const { t } = useTranslation();
  
    const title = t('distribution.title');
    const subtitle = t('distribution.subtitle');
    const legendTitle = t('distribution.legend.title');
    const legendMuseum = t('distribution.legend.museum');
    const legendHeritage = t('distribution.legend.heritage');

  useEffect(() => {
    const fetchRegions = async () => {
      const response = await museumService.getPublished(); // Public only sees approved museums
      if (response.data) {
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

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal hidden">
          <h2 className="text-4xl md:text-4xl font-bold pb-3 text-heritage-gradient">
            {title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 hidden">
          {regions.map((region, index) => (
            <RegionCard key={index} region={region} />
          ))}
        </div>

        <div className="relative text-center scroll-reveal">
          <IndonesiaMap />

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur-sm p-4 rounded-lg border border-border">
            <h4 className="font-bold mb-2 text-heritage-gradient">{legendTitle}</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary"></div>
                <span>{legendMuseum}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-secondary"></div>
                <span>{legendHeritage}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistributionSection;
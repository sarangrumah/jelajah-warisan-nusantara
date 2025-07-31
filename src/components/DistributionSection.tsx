import { MapPin, Building, Landmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DistributionSection = () => {
  const regions = [
    { name: 'Sumatera', museums: 45, heritage: 123, color: 'bg-blue-500' },
    { name: 'Jawa', museums: 187, heritage: 456, color: 'bg-green-500' },
    { name: 'Kalimantan', museums: 23, heritage: 78, color: 'bg-yellow-500' },
    { name: 'Sulawesi', museums: 34, heritage: 92, color: 'bg-purple-500' },
    { name: 'Papua', museums: 12, heritage: 34, color: 'bg-red-500' },
    { name: 'Maluku & Nusa Tenggara', museums: 18, heritage: 56, color: 'bg-orange-500' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-heritage-gradient">
            Sebaran Museum & Cagar Budaya
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Distribusi museum dan situs cagar budaya di seluruh Indonesia yang dikelola 
            oleh Direktorat Museum dan Cagar Budaya.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {regions.map((region, index) => (
            <Card key={index} className="scroll-reveal heritage-glow hover:scale-105 transition-bounce">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${region.color}`}></div>
                  {region.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building size={16} className="text-primary" />
                      <span className="text-sm">Museum</span>
                    </div>
                    <span className="font-bold text-heritage-gradient">{region.museums}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Landmark size={16} className="text-primary" />
                      <span className="text-sm">Cagar Budaya</span>
                    </div>
                    <span className="font-bold text-heritage-gradient">{region.heritage}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center scroll-reveal">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <MapPin size={32} className="text-primary" />
              <h3 className="text-2xl font-bold text-foreground">
                Peta Interaktif
              </h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Jelajahi lokasi museum dan cagar budaya di seluruh Indonesia melalui peta interaktif kami.
            </p>
            <button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-bounce heritage-glow">
              Buka Peta Interaktif
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistributionSection;
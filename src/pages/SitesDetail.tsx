import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Building, Ruler, Palette, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const SitesDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  // Mock data - in real app, fetch from API based on id
  const collectionData = {
    1: {
      title: 'Keris Pusaka Majapahit',
      subtitle: 'Senjata tradisional bersejarah dari era Majapahit',
      category: 'weapons',
      museum: 'Museum Nasional Indonesia',
      period: 'Abad ke-14',
      image: '/src/assets/heritage-sites.jpg',
      description: 'Keris pusaka yang ditemukan di situs Majapahit dengan ukiran detail yang menawan. Keris ini merupakan salah satu contoh terbaik dari seni pandai besi Jawa kuno yang menggabungkan fungsi praktis dengan nilai spiritual dan estetika tinggi.',
      material: 'Baja dengan pamor, gagang kayu, sarung kayu',
      dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
      origin: 'Trowulan, Mojokerto, Jawa Timur',
      discoveredYear: '1965',
      condition: 'Baik, terawat dengan preservasi khusus',
      significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
      culturalContext: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
      relatedArtifacts: [
        'Tombak Majapahit',
        'Pedang Ceremonial',
        'Perhiasan Emas Majapahit'
      ]
    },
    2: {
      title: 'Arca Ganesha Kuno',
      subtitle: 'Patung dewa Ganesha dari periode klasik',
      category: 'sculpture',
      museum: 'Museum Fatahillah',
      period: 'Abad ke-9',
      image: '/src/assets/museum-interior.jpg',
      description: 'Arca Ganesha yang terbuat dari batu andesit dengan detail yang sangat halus. Patung ini menggambarkan Ganesha dalam posisi duduk dengan empat lengan, menunjukkan pengaruh seni Hindu-Jawa yang khas.',
      material: 'Batu andesit',
      dimensions: 'Tinggi: 85 cm, Lebar: 60 cm, Tebal: 45 cm',
      origin: 'Candi Plaosan, Klaten, Jawa Tengah',
      discoveredYear: '1885',
      condition: 'Sangat baik, masih utuh dengan detail yang jelas',
      significance: 'Arca ini menunjukkan tingkat keahlian seniman masa klasik dalam mengolah batu dan memahami iconografi Hindu.',
      culturalContext: 'Ganesha sebagai dewa penghilang rintangan sangat dihormati dalam tradisi Hindu-Jawa dan sering ditempatkan di pintu masuk candi.',
      relatedArtifacts: [
        'Arca Durga',
        'Relief Ramayana',
        'Arca Buddha'
      ]
    }
  };

  const collection = collectionData[parseInt(id as string) as keyof typeof collectionData];

  if (!collection) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('Collection not found')}</h1>
          <p className="text-muted-foreground">{t('The requested collection could not be found.')}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <section className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/collection">
            <Button variant="ghost" className="p-0">
              <ArrowLeft size={20} className="mr-2" />
              {t('Back to Collections')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <img
                src={collection.image}
                alt={collection.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2">{t(collection.category)}</Badge>
              <h1 className="text-4xl font-bold mb-2">{collection.title}</h1>
              <p className="text-xl text-muted-foreground">{collection.subtitle}</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed">
                  {collection.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('Basic Information')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building className="text-primary" size={20} />
                  <div>
                    <p className="font-semibold">{t('Museum')}</p>
                    <p className="text-sm text-muted-foreground">{collection.museum}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="text-primary" size={20} />
                  <div>
                    <p className="font-semibold">{t('Period')}</p>
                    <p className="text-sm text-muted-foreground">{collection.period}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Palette className="text-primary" size={20} />
                  <div>
                    <p className="font-semibold">{t('Material')}</p>
                    <p className="text-sm text-muted-foreground">{collection.material}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Ruler className="text-primary" size={20} />
                  <div>
                    <p className="font-semibold">{t('Dimensions')}</p>
                    <p className="text-sm text-muted-foreground">{collection.dimensions}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="text-primary" size={20} />
                  <div>
                    <p className="font-semibold">{t('Origin')}</p>
                    <p className="text-sm text-muted-foreground">{collection.origin}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('Historical Significance')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {collection.significance}
              </p>
              <div className="space-y-2">
                <p><span className="font-semibold">{t('Discovered Year')}:</span> {collection.discoveredYear}</p>
                <p><span className="font-semibold">{t('Condition')}:</span> {collection.condition}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Cultural Context')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {collection.culturalContext}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{t('Related Artifacts')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {collection.relatedArtifacts.map((artifact, index) => (
                <Badge key={index} variant="outline">
                  {artifact}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
};

export default SitesDetail;
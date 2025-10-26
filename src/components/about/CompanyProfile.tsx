import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Building, Award, Target, Eye } from 'lucide-react';
import { useTranslate } from '@/hooks/useTranslate';
import { DynamicComponent } from '../dynamic-components';
import compProfile from '@/assets/museum-interior.jpg'
import { contentService } from '@/lib/api-services';
import { useEffect, useState } from 'react';

// Utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  // Replace < tag > and < / tag > with <tag> and </tag>
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
}

const CompanyStatCard = ({ stat }: { stat: { icon: any; label: string; value: string; color: string } }) => {
    const { translatedText: label } = useTranslate(stat.label);
    const { translatedText: value } = useTranslate(stat.value);

    return (
        <Card className="text-center border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
            <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                    <stat.icon className={`h-12 w-12 ${stat.color}`} />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">{value}</h3>
                <p className="text-muted-foreground">{label}</p>
            </CardContent>
        </Card>
    );
}

const HighlightCard = ({ item }: { item: { icon: string; title: string; description: string } }) => {
    const { translatedText: title } = useTranslate(item.title);
    const { translatedText: description } = useTranslate(item.description);

    return (
        <Card className="heritage-glow hover:scale-105 transition-bounce">
            <CardHeader className="text-center">
                <DynamicComponent componentName={item.icon} size={48} className="text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-center text-sm">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
};

const CompanyProfile = () => {
  const [company, setCompany] = useState<any>(null);
  
  const { translatedText: name } = useTranslate(company?.name || '');
  const { translatedText: aboutus } = useTranslate(company?.aboutus || '');
  const { translatedText: vision } = useTranslate(company?.vision || '');
  const { translatedText: mission } = useTranslate(company?.mission || '');
    
  const { translatedText: historyTitle } = useTranslate('Sejarah & Perkembangan');
  const { translatedText: historyText1 } = useTranslate('Didirikan dengan tujuan untuk mengelola, melestarikan, dan mengembangkan museum serta situs cagar budaya di seluruh Indonesia. Sejak berdiri, kami telah berperan aktif dalam pelestarian warisan budaya bangsa.');
  const { translatedText: historyText2 } = useTranslate('Terbentuk pada tahun 2022 berdasarkan Permendikbudristek Nomor 28 Tahun 2022 tentang OTK Museum dan Cagar Budaya, dan diresmikan menjadi badan layanan umum per 1 September 2023, Museum dan Cagar Budaya mempunyai visi menjadi institusi yang bersifat kolaboratif dan mendorong daya cipta, perubahan sosial, serta pembangunan masyarakat yang berbudaya.');
  const { translatedText: commitmentTitle } = useTranslate('Komitmen Kami');
  const { translatedText: commitmentText } = useTranslate('Museum dan Cagar Budaya mengedepankan peningkatan pelayanan yang berbasis perlindungan sebagai prioritas utama. Dengan merangkul kreativitas dan mengusung semangat kolaborasi yang inklusif. Museum dan Cagar Budaya secara kolektif berkontribusi untuk membuka wawasan apresiasi mendalam terhadap warisan budaya Indonesia yang beragam.');
  const { translatedText: aboutUsTitle } = useTranslate('Tentang Kami');
  const { translatedText: visionTitle } = useTranslate('Visi');
  const { translatedText: missionTitle } = useTranslate('Misi');

  const fetchCompanies = async () => {
    const response = await contentService.getAll();
    if (response.error || response.data.length === 0) {
      console.error('Error fetching companies:', response.error);
    } 
    setCompany(response.data[0]);
  };
  
  useEffect(() => {
    fetchCompanies();
  }, []);

  const highlights = [
    {
      icon: 'Building',
      title: 'Institusi Terpercaya',
      description: 'Lembaga resmi pemerintah yang mengelola warisan budaya Indonesia'
    },
    {
      icon: 'Users',
      title: 'Tim Profesional',
      description: 'Didukung oleh para ahli konservasi, kurator, dan peneliti berpengalaman'
    },
    {
      icon: 'Target',
      title: 'Misi Pelestarian',
      description: 'Berkomitmen melestarikan warisan budaya untuk generasi mendatang'
    },
    {
      icon: 'Award',
      title: 'Pengakuan Internasional',
      description: 'Berbagai penghargaan dalam bidang pelestarian budaya'
    }
  ];

  const companyStats = [
    { icon: Building, label: 'Museum Terkelola', value: '19', color: 'text-blue-600' },
    { icon: Award, label: 'Cagar Budaya', value: '34', color: 'text-green-600' },
    { icon: Users, label: 'Pengunjung per Tahun', value: '5.2 Juta', color: 'text-purple-600' },
    { icon: MapPin, label: 'Provinsi', value: '34', color: 'text-orange-600' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-4xl font-bold mb-6 text-heritage-gradient">
            {name}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xlx mx-auto leading-relaxed" dangerouslySetInnerHTML={{ __html: fixBrokenHtmlTags(aboutus) }} />
        </div>

        <div className="mb-16 mx-auto gap-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyStats.map((stat, index) => (
              <CompanyStatCard key={index} stat={stat} />
            ))}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="scroll-reveal">
            <img 
              src={compProfile}
              alt="Museum Interior"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          
          <div className="space-y-6 scroll-reveal">
            <h3 className="text-3xl font-bold text-foreground text-heritage-gradient">
              {historyTitle}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-justify">
              {historyText1}
            </p>
            <p className="text-muted-foreground leading-relaxed text-justify">
              {historyText2}
            </p>
          </div>
        </div>
        <div className="gap-12 items-center mb-16">
          <div className="space-y-6 scroll-reveal">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
              <h4 className="text-xl font-semibold text-primary mb-3 text-center">{commitmentTitle}</h4>
              <p className="text-muted-foreground text-justify">
                {commitmentText}
              </p>
            </div>
          </div>
        </div>
        
        <div className="gap-12 mb-16 mx-auto px-4 pt-6 scroll-reveal">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center pb-12 text-heritage-gradient">{aboutUsTitle}</h2>
            <div className="space-y-8">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-6 w-6 text-primary" />
                    {visionTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground leading-relaxed text-justify" dangerouslySetInnerHTML={{ __html: fixBrokenHtmlTags(vision) }} />
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-6 w-6 text-primary" />
                    {missionTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground leading-relaxed text-justify" dangerouslySetInnerHTML={{ __html: fixBrokenHtmlTags(mission) }} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 scroll-reveal">
          {highlights.map((item, index) => (
            <HighlightCard key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyProfile;
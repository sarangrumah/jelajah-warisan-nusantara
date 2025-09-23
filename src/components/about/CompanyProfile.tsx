import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Building, Award, Target, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DynamicComponent } from '../dynamic-components';
import compProfile from '@/assets/museum-interior.jpg'
import { contentService } from '@/lib/api-services';
import { useEffect, useState } from 'react';

type CompanyProfile = {
  id: string;
  name: string;
  brand?: string;
  aboutus?: string;
  vision?: string;
  mission?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  latitude?: string;
  longitude?: string;
  // Add other fields as needed
};

const CompanyProfile = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await contentService.getAll();
        if (response.error) { throw new Error(response.error); }
        // Use the first profile (or adjust as needed)
        const data = response.data as CompanyProfile[];
        setProfile(data && data.length > 0 ? data[0] : null);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const highlights = [
    {
      icon: 'Building',
      title: t('about.companyProfile.highlights.institution.title'),
      description: t('about.companyProfile.highlights.institution.description')
    },
    {
      icon: 'Users',
      title: t('about.companyProfile.highlights.team.title'),
      description: t('about.companyProfile.highlights.team.description')
    },
    {
      icon: 'Target',
      title: t('about.companyProfile.highlights.mission.title'),
      description: t('about.companyProfile.highlights.mission.description')
    },
    {
      icon: 'Award',
      title: t('about.companyProfile.highlights.recognition.title'),
      description: t('about.companyProfile.highlights.recognition.description')
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
            {t('profile.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xlx mx-auto leading-relaxed">
            {t('profile.description')}
          </p>
        </div>

        {loading && (
          <div className="text-center text-muted-foreground">Loading company profile...</div>
        )}
        {error && (
          <div className="text-center text-red-500">Error: {error}</div>
        )}

        <div className="mb-16 mx-auto gap-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyStats.map((stat, index) => (
              <Card key={index} className="text-center border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <stat.icon className={`h-12 w-12 ${stat.color}`} />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
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
              {t('about.companyProfile.historyTitle')}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-justify">
              {t('about.companyProfile.historyText1')}
            </p>
            <p className="text-muted-foreground leading-relaxed text-justify">
              {t('about.companyProfile.historyText2')}
            </p>
          </div>
        </div>
        <div className="gap-12 items-center mb-16">
          <div className="space-y-6 scroll-reveal">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
              <h4 className="text-xl font-semibold text-primary mb-3 text-center">{t('about.companyProfile.commitmentTitle')}</h4>
              <p className="text-muted-foreground text-justify">
                {t('about.companyProfile.commitmentText')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="gap-12 mb-16 mx-auto px-4 pt-6 scroll-reveal">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center pb-12 text-heritage-gradient">Tentang Kami</h2>
            {profile && (
              <div className="space-y-8">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-6 w-6 text-primary" />
                      {t('profile.vision')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-muted-foreground leading-relaxed text-justify" dangerouslySetInnerHTML={{ __html: profile.vision || '-' }} />
                    {!profile.vision && (
                      <div style={{ color: 'red', fontSize: '0.9em' }}>
                        <b>Debug:</b> Vision is missing or empty from backend.
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-6 w-6 text-primary" />
                      {t('profile.mission')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg text-muted-foreground leading-relaxed text-justify" dangerouslySetInnerHTML={{ __html: profile.mission || '-' }} />
                    {!profile.mission && (
                      <div style={{ color: 'red', fontSize: '0.9em' }}>
                        <b>Debug:</b> Mission is missing or empty from backend.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 scroll-reveal">
          {highlights.map((item, index) => (
            <Card key={index} className="heritage-glow hover:scale-105 transition-bounce">
              <CardHeader className="text-center">
                <DynamicComponent componentName={item.icon} size={48} className="text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center text-sm">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* <div className="gap-12 mb-16 mx-auto px-4 pt-6 ">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-heritage-gradient">Informasi Kontak</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Kantor Pusat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Alamat</p>
                    <p className="text-muted-foreground">Jl. Jenderal Sudirman, Senayan<br />Jakarta Pusat 10270</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Gedung</p>
                    <p className="text-muted-foreground">Gedung E, Kompleks Kemendikbudristek</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-left">
                <div>
                  <p className="font-medium">Telepon</p>
                  <p className="text-muted-foreground">+62 21 5725019</p>
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">info@kebudayaan.kemdikbud.go.id</p>
                </div>
                <div>
                  <p className="font-medium">Website</p>
                  <p className="text-muted-foreground">www.kebudayaan.kemdikbud.go.id</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default CompanyProfile;
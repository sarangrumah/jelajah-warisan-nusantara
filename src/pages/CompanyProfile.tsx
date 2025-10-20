
import React, { useEffect } from 'react';
import { MapPin, Users, Building, Award, Target, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import heritageSites from '@/assets/heritage-sites.jpg';
import museumInterior from '@/assets/museum-interior.jpg';
// Utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  // Replace < tag > and < / tag > with <tag> and </tag>
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
}

const CompanyProfile = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const companyStats = [
    { icon: Building, label: 'Museum Terkelola', value: '19', color: 'text-blue-600' },
    { icon: Award, label: 'Cagar Budaya', value: '34', color: 'text-green-600' },
    { icon: Users, label: 'Pengunjung per Tahun', value: '5.2 Juta', color: 'text-purple-600' },
    { icon: MapPin, label: 'Provinsi', value: '34', color: 'text-orange-600' },
  ];

  const leadership = [
    {
      name: 'Abi Kusno, S.Hum., M.E.M',
      position: 'Kepala Museum dan Cagar Budaya',
      education: 'Ph.D. Sejarah, Universitas Amsterdam',
      experience: '20+ tahun di bidang kebudayaan dan sejarah'
    },
    {
      name: 'Muhammad Ikbal, S.Hum',
      position: 'Kepala Bagian Umum',
      education: 'Ph.D. Urban Planning, University of Cambridge',
      experience: '25+ tahun dalam pelestarian warisan budaya'
    }
  ];

  return (
    <div className="py-20 min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary-glow/10 to-background overflow-hidden">
        <div className={`bg-[url(${heritageSites})] absolute inset-0 bg-cover bg-center opacity-10`} />
        <div className="relative z-10 container mx-auto px-4 text-center scroll-reveal">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-heritage-gradient mb-6">
              Profil Institusi
            </h1>
            {/* <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Museum dan Cagar Budaya
            </p> */}
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Museum dan Cagar Budaya merupakan unit eselon II di bawah Direktorat Jenderal Kebudayaan, Kementerian Kebudayaan Republik Indonesia.
            </p>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4">
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
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 pt-6 scroll-reveal">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center pb-12 text-heritage-gradient">Tentang Kami</h2>
            <div className="space-y-8">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-6 w-6 text-primary" />
                    Visi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-lg text-muted-foreground leading-relaxed text-justify"
                    dangerouslySetInnerHTML={{
                      __html: fixBrokenHtmlTags(
                        `"Menjadi institusi terdepan dalam pelestarian, perlindungan, dan pengembangan warisan budaya Indonesia
                        yang berkelanjutan untuk memperkuat identitas bangsa dan meningkatkan kesejahteraan masyarakat."`
                      )
                    }}
                  />
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-6 w-6 text-primary" />
                    Misi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="space-y-3 text-muted-foreground"
                    dangerouslySetInnerHTML={{
                      __html: fixBrokenHtmlTags(`
                        <ul>
                          <li class="flex items-start gap-2"><span class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>Melindungi dan melestarikan cagar budaya serta koleksi museum sebagai warisan bangsa</li>
                          <li class="flex items-start gap-2"><span class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>Mengembangkan museum sebagai pusat edukasi, penelitian, dan rekreasi budaya</li>
                          <li class="flex items-start gap-2"><span class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>Meningkatkan kesadaran masyarakat terhadap pentingnya warisan budaya</li>
                          <li class="flex items-start gap-2"><span class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>Membangun sistem informasi terintegrasi untuk pengelolaan warisan budaya</li>
                        </ul>
                      `)
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <div className="container grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="scroll-reveal">
          <img 
            src={museumInterior} 
            alt="Museum Interior"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        
        <div className="container mx-auto px-6 pt-6 space-y-6 scroll-reveal">
          <h3 className="text-3xl font-bold text-foreground">
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
      <div className="container gap-12 items-center mb-16">        
        <div className="container mx-auto px-6 pt-6 space-y-6 scroll-reveal">          
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
            <h4 className="text-xl font-semibold text-primary mb-3 text-center">{t('about.companyProfile.commitmentTitle')}</h4>
            <p className="text-muted-foreground text-justify">
              {t('about.companyProfile.commitmentText')}
            </p>
          </div>
        </div>
      </div>

      {/* Leadership Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-heritage-gradient">Kepemimpinan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {leadership.map((leader, index) => (
              <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
                <CardHeader>
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-glow rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-primary-foreground text-2xl font-bold">
                      {leader.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  </div>
                  <CardTitle className="text-center">{leader.name}</CardTitle>
                  <p className="text-center text-primary font-medium">{leader.position}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
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
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default CompanyProfile;
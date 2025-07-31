import { Building, Users, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CompanyProfile = () => {
  const highlights = [
    {
      icon: Building,
      title: 'Institusi Terpercaya',
      description: 'Lembaga resmi pemerintah yang mengelola warisan budaya Indonesia'
    },
    {
      icon: Users,
      title: 'Tim Profesional',
      description: 'Didukung oleh para ahli konservasi, kurator, dan peneliti berpengalaman'
    },
    {
      icon: Target,
      title: 'Misi Pelestarian',
      description: 'Berkomitmen melestarikan warisan budaya untuk generasi mendatang'
    },
    {
      icon: Award,
      title: 'Pengakuan Internasional',
      description: 'Berbagai penghargaan dalam bidang pelestarian budaya'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-heritage-gradient">
            Profil Institusi
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Direktorat Museum dan Cagar Budaya merupakan unit eselon II di bawah 
            Direktorat Jenderal Kebudayaan, Kementerian Pendidikan, Kebudayaan, 
            Riset, dan Teknologi Republik Indonesia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="scroll-reveal">
            <img 
              src="/src/assets/museum-interior.jpg" 
              alt="Museum Interior"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          
          <div className="space-y-6 scroll-reveal">
            <h3 className="text-3xl font-bold text-foreground">
              Sejarah & Perkembangan
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Didirikan dengan tujuan untuk mengelola, melestarikan, dan mengembangkan 
              museum serta situs cagar budaya di seluruh Indonesia. Sejak berdiri, 
              kami telah berperan aktif dalam pelestarian warisan budaya bangsa.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Dengan pengalaman lebih dari 50 tahun, kami terus berinovasi dalam 
              menghadapi tantangan modern sambil mempertahankan nilai-nilai 
              tradisional dalam pelestarian budaya.
            </p>
            
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
              <h4 className="text-xl font-semibold text-primary mb-3">Komitmen Kami</h4>
              <p className="text-muted-foreground">
                Menjaga dan melestarikan kekayaan budaya Indonesia melalui pengelolaan 
                museum yang profesional, pelestarian situs bersejarah, dan pengembangan 
                program edukasi yang berkelanjutan.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 scroll-reveal">
          {highlights.map((item, index) => (
            <Card key={index} className="heritage-glow hover:scale-105 transition-bounce">
              <CardHeader className="text-center">
                <item.icon size={48} className="text-primary mx-auto mb-4" />
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
    </section>
  );
};

export default CompanyProfile;
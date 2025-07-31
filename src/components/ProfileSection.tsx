import { Users, Award, MapPin, Clock } from 'lucide-react';

const ProfileSection = () => {
  const stats = [
    { icon: Users, value: '500+', label: 'Museum Terdaftar' },
    { icon: Award, value: '1,200+', label: 'Cagar Budaya' },
    { icon: MapPin, value: '34', label: 'Provinsi' },
    { icon: Clock, value: '50+', label: 'Tahun Pengalaman' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-heritage-gradient">
            Tentang Kami
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Direktorat Museum dan Cagar Budaya bertanggung jawab dalam pelestarian, 
            pengelolaan, dan pengembangan warisan budaya Indonesia untuk kepentingan 
            pendidikan, penelitian, dan pariwisata budaya.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6 scroll-reveal">
            <h3 className="text-3xl font-bold text-foreground">
              Visi & Misi Kami
            </h3>
            
            <div className="space-y-4">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                <h4 className="text-xl font-semibold text-primary mb-3">Visi</h4>
                <p className="text-muted-foreground">
                  Menjadi institusi terdepan dalam pelestarian dan pengelolaan warisan budaya 
                  Indonesia yang berkualitas dunia dan berkelanjutan.
                </p>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                <h4 className="text-xl font-semibold text-primary mb-3">Misi</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Mengelola dan melestarikan koleksi museum nasional</li>
                  <li>• Melindungi dan memelihara situs cagar budaya</li>
                  <li>• Mengembangkan program edukasi dan penelitian</li>
                  <li>• Mempromosikan pariwisata budaya berkelanjutan</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 scroll-reveal">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 text-center heritage-glow hover:scale-105 transition-bounce"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <stat.icon size={32} className="text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-heritage-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center scroll-reveal">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Mari Bersama Lestarikan Budaya Indonesia
            </h3>
            <p className="text-muted-foreground mb-6">
              Bergabunglah dengan kami dalam upaya melestarikan kekayaan budaya nusantara 
              untuk generasi mendatang.
            </p>
            <button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-bounce heritage-glow">
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
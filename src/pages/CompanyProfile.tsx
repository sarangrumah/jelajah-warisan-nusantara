import React from 'react';
import { Calendar, MapPin, Users, Building, Award, Target, Eye, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

const CompanyProfile = () => {
  const companyStats = [
    { icon: Building, label: 'Museum Terkelola', value: '1,200+', color: 'text-blue-600' },
    { icon: Award, label: 'Cagar Budaya', value: '2,800+', color: 'text-green-600' },
    { icon: Users, label: 'Pengunjung per Tahun', value: '5.2 Juta', color: 'text-purple-600' },
    { icon: MapPin, label: 'Provinsi', value: '34', color: 'text-orange-600' },
  ];

  const milestones = [
    { year: '1945', event: 'Pembentukan Departemen Pendidikan dan Kebudayaan' },
    { year: '1950', event: 'Pendirian Museum Nasional Indonesia' },
    { year: '1975', event: 'Pembentukan Direktorat Permuseuman' },
    { year: '1992', event: 'UU No. 5 tentang Benda Cagar Budaya' },
    { year: '2010', event: 'UU No. 11 tentang Cagar Budaya' },
    { year: '2019', event: 'Pembentukan Direktorat Jenderal Kebudayaan' },
    { year: '2024', event: 'Digitalisasi dan Modernisasi Sistem Informasi' },
  ];

  const leadership = [
    {
      name: 'Dr. Hilmar Farid',
      position: 'Direktur Jenderal Kebudayaan',
      education: 'Ph.D. Sejarah, Universitas Amsterdam',
      experience: '20+ tahun di bidang kebudayaan dan sejarah'
    },
    {
      name: 'Prof. Dr. Wiendu Nuryanti',
      position: 'Direktur Pelestarian Cagar Budaya',
      education: 'Ph.D. Urban Planning, University of Cambridge',
      experience: '25+ tahun dalam pelestarian warisan budaya'
    },
    {
      name: 'Dr. Nadjamuddin Ramly',
      position: 'Direktur Permuseuman',
      education: 'Ph.D. Arkeologi, Universitas Indonesia',
      experience: '18+ tahun dalam manajemen museum'
    }
  ];

  const departments = [
    {
      name: 'Direktorat Pelestarian Cagar Budaya',
      description: 'Bertanggung jawab atas pelestarian, perlindungan, dan pemanfaatan cagar budaya di seluruh Indonesia.',
      functions: ['Identifikasi dan Penetapan', 'Pelestarian dan Pemeliharaan', 'Pengawasan dan Pengendalian']
    },
    {
      name: 'Direktorat Permuseuman',
      description: 'Mengelola dan mengembangkan museum-museum di Indonesia serta koleksi budaya nasional.',
      functions: ['Pengembangan Museum', 'Manajemen Koleksi', 'Program Edukasi']
    },
    {
      name: 'Direktorat Sejarah',
      description: 'Mengkaji, mendokumentasikan, dan menyosialisasikan sejarah bangsa Indonesia.',
      functions: ['Penelitian Sejarah', 'Dokumentasi', 'Publikasi dan Diseminasi']
    },
    {
      name: 'Direktorat Nilai Budaya, Seni dan Film',
      description: 'Mengembangkan dan melestarikan nilai-nilai budaya, seni, dan perfilman Indonesia.',
      functions: ['Pengembangan Seni', 'Nilai Budaya', 'Industri Film']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary-glow/10 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[url('/src/assets/heritage-sites.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-heritage-gradient mb-6">
              Profil Perusahaan
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Direktorat Jenderal Kebudayaan
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Memimpin pelestarian, perlindungan, dan pengembangan warisan budaya Indonesia untuk generasi masa depan
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
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-heritage-gradient">Tentang Kami</h2>
            <div className="space-y-8">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-6 w-6 text-primary" />
                    Visi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    "Menjadi institusi terdepan dalam pelestarian, perlindungan, dan pengembangan warisan budaya Indonesia 
                    yang berkelanjutan untuk memperkuat identitas bangsa dan meningkatkan kesejahteraan masyarakat."
                  </p>
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
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      Melindungi dan melestarikan cagar budaya serta koleksi museum sebagai warisan bangsa
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      Mengembangkan museum sebagai pusat edukasi, penelitian, dan rekreasi budaya
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      Meningkatkan kesadaran masyarakat terhadap pentingnya warisan budaya
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      Membangun sistem informasi terintegrasi untuk pengelolaan warisan budaya
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-6 w-6 text-primary" />
                    Nilai-Nilai Perusahaan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Integritas</h4>
                      <p className="text-sm text-muted-foreground">Menjunjung tinggi kejujuran dan transparansi dalam setiap tindakan</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Profesionalitas</h4>
                      <p className="text-sm text-muted-foreground">Melaksanakan tugas dengan kompetensi dan dedikasi tinggi</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Inovasi</h4>
                      <p className="text-sm text-muted-foreground">Mengembangkan solusi kreatif untuk tantangan pelestarian budaya</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Kolaborasi</h4>
                      <p className="text-sm text-muted-foreground">Bekerja sama dengan berbagai pihak untuk tujuan bersama</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-heritage-gradient">Sejarah dan Pencapaian</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                      {milestone.year}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <p className="text-muted-foreground">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-heritage-gradient">Kepemimpinan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {leadership.map((leader, index) => (
              <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
                <CardHeader>
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-glow rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-primary-foreground text-2xl font-bold">
                      {leader.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <CardTitle className="text-center">{leader.name}</CardTitle>
                  <p className="text-center text-primary font-medium">{leader.position}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Pendidikan:</strong> {leader.education}</p>
                    <p><strong>Pengalaman:</strong> {leader.experience}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Organizational Structure */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-heritage-gradient">Struktur Organisasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {departments.map((dept, index) => (
              <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{dept.description}</p>
                  <Separator className="my-4" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Fungsi Utama:</h4>
                    <ul className="space-y-1">
                      {dept.functions.map((func, funcIndex) => (
                        <li key={funcIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {func}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
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
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default CompanyProfile;
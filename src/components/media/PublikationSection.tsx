import { FileText, Download, Calendar, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PublikationSection = () => {
  const publications = [
    {
      title: 'Laporan Tahunan 2023',
      description: 'Laporan lengkap kegiatan dan pencapaian Direktorat Museum dan Cagar Budaya tahun 2023',
      type: 'Laporan Tahunan',
      year: '2023',
      size: '12.5 MB',
      pages: 156,
      downloadCount: 2543
    },
    {
      title: 'Panduan Konservasi Artefak',
      description: 'Panduan teknis konservasi dan perawatan koleksi museum',
      type: 'Panduan Teknis',
      year: '2023',
      size: '8.2 MB',
      pages: 89,
      downloadCount: 1876
    },
    {
      title: 'Katalog Museum Nasional',
      description: 'Katalog lengkap koleksi Museum Nasional Indonesia',
      type: 'Katalog',
      year: '2023',
      size: '45.7 MB',
      pages: 324,
      downloadCount: 3421
    },
    {
      title: 'Standar Pengelolaan Museum',
      description: 'Standar operasional pengelolaan museum di Indonesia',
      type: 'Standar',
      year: '2022',
      size: '5.4 MB',
      pages: 67,
      downloadCount: 987
    }
  ];

  const budgetData = [
    { year: '2023', budget: '125.6 Miliar', allocation: 'Konservasi 40%, Operasional 35%, Pengembangan 25%' },
    { year: '2022', budget: '118.3 Miliar', allocation: 'Konservasi 38%, Operasional 37%, Pengembangan 25%' },
    { year: '2021', budget: '102.7 Miliar', allocation: 'Konservasi 35%, Operasional 40%, Pengembangan 25%' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-heritage-gradient">
            Publikasi & Dokumen
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Akses dokumen resmi, laporan, dan publikasi ilmiah tentang 
            pengelolaan museum dan pelestarian cagar budaya.
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 scroll-reveal">
            Dokumen Publikasi
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {publications.map((pub, index) => (
              <Card key={index} className="scroll-reveal heritage-glow hover:scale-105 transition-bounce">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <FileText size={24} className="text-primary" />
                      <div>
                        <CardTitle className="text-lg">{pub.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{pub.type} • {pub.year}</p>
                      </div>
                    </div>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                      PDF
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{pub.description}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                    <div className="text-center">
                      <div className="font-semibold text-heritage-gradient">{pub.pages}</div>
                      <div className="text-muted-foreground">Halaman</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-heritage-gradient">{pub.size}</div>
                      <div className="text-muted-foreground">Ukuran</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-heritage-gradient">{pub.downloadCount}</div>
                      <div className="text-muted-foreground">Download</div>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Download size={16} className="mr-2" />
                    Unduh Dokumen
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-center mb-8 scroll-reveal">
            Transparansi Anggaran
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {budgetData.map((budget, index) => (
              <Card key={index} className="scroll-reveal heritage-glow hover:scale-105 transition-bounce">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <BarChart3 size={24} className="text-primary" />
                    <div>
                      <CardTitle className="text-lg">Anggaran {budget.year}</CardTitle>
                      <p className="text-2xl font-bold text-heritage-gradient">{budget.budget}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{budget.allocation}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download size={16} className="mr-2" />
                    Detail Anggaran
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center scroll-reveal">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Calendar size={32} className="text-primary" />
              <h3 className="text-2xl font-bold text-foreground">
                Berlangganan Update
              </h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Dapatkan notifikasi ketika publikasi baru tersedia atau update 
              penting lainnya dari Direktorat Museum dan Cagar Budaya.
            </p>
            <button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-bounce heritage-glow">
              Berlangganan Newsletter
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublikationSection;
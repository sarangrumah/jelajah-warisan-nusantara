import { FileText, Scale, CheckCircle, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RulesAndSOP = () => {
  const regulations = [
    {
      title: 'UU No. 11 Tahun 2010',
      description: 'Undang-Undang tentang Cagar Budaya',
      type: 'Undang-Undang',
      status: 'Aktif'
    },
    {
      title: 'PP No. 66 Tahun 2015',
      description: 'Peraturan Pemerintah tentang Museum',
      type: 'Peraturan Pemerintah',
      status: 'Aktif'
    },
    {
      title: 'Permendikbud No. 52 Tahun 2021',
      description: 'Pelestarian dan Pemanfaatan Cagar Budaya',
      type: 'Peraturan Menteri',
      status: 'Aktif'
    },
    {
      title: 'Permendikbud No. 19 Tahun 2017',
      description: 'Pengelolaan Museum Pemerintah',
      type: 'Peraturan Menteri',
      status: 'Aktif'
    }
  ];

  const procedures = [
    {
      title: 'SOP Registrasi Cagar Budaya',
      description: 'Prosedur pendaftaran dan penetapan status cagar budaya',
      steps: 5,
      duration: '30-60 hari'
    },
    {
      title: 'SOP Izin Penelitian',
      description: 'Tata cara permohonan izin penelitian di museum dan situs',
      steps: 4,
      duration: '14-21 hari'
    },
    {
      title: 'SOP Konservasi Koleksi',
      description: 'Standar prosedur konservasi dan perawatan koleksi museum',
      steps: 8,
      duration: 'Berkelanjutan'
    },
    {
      title: 'SOP Pameran Temporer',
      description: 'Prosedur penyelenggaraan pameran sementara',
      steps: 6,
      duration: '45-90 hari'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-heritage-gradient">
            Regulasi & Standar Operasional
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dasar hukum dan prosedur standar yang mengatur pengelolaan museum 
            dan pelestarian cagar budaya di Indonesia.
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 scroll-reveal">
            Regulasi & Peraturan
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {regulations.map((regulation, index) => (
              <Card key={index} className="scroll-reveal heritage-glow hover:scale-105 transition-bounce">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Scale size={24} className="text-primary" />
                      <div>
                        <CardTitle className="text-lg">{regulation.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{regulation.type}</p>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      {regulation.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{regulation.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
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
            Standar Operasional Prosedur (SOP)
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {procedures.map((procedure, index) => (
              <Card key={index} className="scroll-reveal heritage-glow hover:scale-105 transition-bounce">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <FileText size={24} className="text-primary" />
                    <CardTitle className="text-lg">{procedure.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{procedure.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tahapan:</span>
                      <span className="font-semibold">{procedure.steps} langkah</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estimasi Waktu:</span>
                      <span className="font-semibold">{procedure.duration}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <CheckCircle size={16} className="mr-2" />
                    Lihat Detail SOP
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center scroll-reveal">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Perlu Bantuan dengan Regulasi?
            </h3>
            <p className="text-muted-foreground mb-6">
              Tim legal kami siap membantu Anda memahami dan menerapkan 
              regulasi yang berlaku dalam pengelolaan warisan budaya.
            </p>
            <button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-bounce heritage-glow">
              Konsultasi Legal
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RulesAndSOP;
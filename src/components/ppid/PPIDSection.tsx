import { Info, FileText, Clock, Download, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const PPIDSection = () => {
  const { t } = useTranslation();
  const informationTypes = [
    {
      title: 'Informasi Berkala',
      description: 'Informasi yang wajib disediakan dan diumumkan secara berkala',
      examples: ['Laporan keuangan tahunan', 'Laporan kinerja', 'Profil institusi', 'Struktur organisasi'],
      timeline: 'Dipublikasi setiap 6 bulan'
    },
    {
      title: 'Informasi Serta Merta',
      description: 'Informasi yang dapat mengancam hajat hidup orang banyak dan ketertiban umum',
      examples: ['Informasi darurat', 'Kebijakan mendadak', 'Pengumuman penting', 'Status layanan'],
      timeline: 'Dipublikasi segera'
    },
    {
      title: 'Informasi Setiap Saat',
      description: 'Informasi yang wajib disediakan dan diumumkan setiap saat',
      examples: ['Daftar informasi publik', 'Hasil keputusan', 'Kebijakan dan regulasi', 'SOP layanan'],
      timeline: 'Tersedia setiap saat'
    }
  ];

  const requestProcedure = [
    {
      step: 1,
      title: 'Pengajuan Permohonan',
      description: 'Ajukan permohonan informasi melalui formulir atau surat resmi',
      duration: '1 hari'
    },
    {
      step: 2,
      title: 'Registrasi & Verifikasi',
      description: 'Petugas PPID melakukan registrasi dan verifikasi kelengkapan',
      duration: '2 hari'
    },
    {
      step: 3,
      title: 'Penelusuran Informasi',
      description: 'Tim melakukan penelusuran dan klasifikasi informasi yang diminta',
      duration: '7 hari'
    },
    {
      step: 4,
      title: 'Keputusan & Penyampaian',
      description: 'Keputusan disampaikan beserta informasi atau alasan penolakan',
      duration: '3 hari'
    }
  ];

  const documents = [
    { title: 'Formulir Permohonan Informasi', type: 'PDF', size: '245 KB' },
    { title: 'Standar Layanan PPID', type: 'PDF', size: '1.2 MB' },
    { title: 'Daftar Informasi yang Dikecualikan', type: 'PDF', size: '780 KB' },
    { title: 'Maklumat Pelayanan PPID', type: 'PDF', size: '540 KB' },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-heritage-gradient">
            PPID - Pejabat Pengelola Informasi dan Dokumentasi
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Pelayanan informasi publik yang transparan dan akuntabel sesuai dengan 
            Undang-Undang No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {informationTypes.map((type, index) => (
            <Card key={index} className="scroll-reveal heritage-glow hover:scale-105 transition-bounce">
              <CardHeader>
                <Info size={32} className="text-primary mb-2" />
                <CardTitle className="text-xl">{type.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Contoh Informasi:</h4>
                    <ul className="space-y-1">
                      {type.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-primary" />
                    <span className="font-medium">{type.timeline}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="scroll-reveal">
            <Card className="heritage-glow">
              <CardHeader>
                <CardTitle className="text-2xl">Prosedur Permohonan Informasi</CardTitle>
                <p className="text-muted-foreground">
                  Langkah-langkah untuk mengajukan permohonan informasi publik
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {requestProcedure.map((proc, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {proc.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{proc.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{proc.description}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <Clock size={12} className="text-primary" />
                          <span className="text-primary font-medium">Maksimal {proc.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    💡 Total waktu layanan maksimal 13 hari kerja sesuai regulasi UU KIP
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="scroll-reveal">
            <Card className="heritage-glow mb-6">
              <CardHeader>
                <CardTitle className="text-2xl">Dokumen & Formulir</CardTitle>
                <p className="text-muted-foreground">
                  Unduh dokumen yang diperlukan untuk permohonan informasi
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-primary" />
                        <div>
                          <h4 className="font-medium text-sm">{doc.title}</h4>
                          <p className="text-xs text-muted-foreground">{doc.type} • {doc.size}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-4">
                  <FileText size={16} className="mr-2" />
                  Ajukan Permohonan Informasi
                </Button>
              </CardContent>
            </Card>

            <Card className="heritage-glow">
              <CardHeader>
                <CardTitle className="text-xl">Kontak PPID</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-primary" />
                    <div>
                      <p className="font-medium">Telepon</p>
                      <p className="text-sm text-muted-foreground">+62 21 3811551 ext. 205</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">ppid@museumcagarbudaya.go.id</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-primary" />
                    <div>
                      <p className="font-medium">Jam Layanan</p>
                      <p className="text-sm text-muted-foreground">Senin - Jumat: 08:00 - 16:00 WIB</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center scroll-reveal">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Komitmen Pelayanan
            </h3>
            <p className="text-muted-foreground mb-6">
              Kami berkomitmen untuk memberikan pelayanan informasi publik yang 
              cepat, akurat, dan transparan kepada seluruh masyarakat Indonesia 
              sesuai dengan prinsip keterbukaan informasi publik.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="font-bold text-heritage-gradient text-2xl mb-2">24 Jam</div>
                <div className="text-muted-foreground">Respon Awal</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="font-bold text-heritage-gradient text-2xl mb-2">13 Hari</div>
                <div className="text-muted-foreground">Maksimal Layanan</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="font-bold text-heritage-gradient text-2xl mb-2">100%</div>
                <div className="text-muted-foreground">Transparan</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PPIDSection;
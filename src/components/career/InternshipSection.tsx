import { GraduationCap, Clock, MapPin, Users, FileText, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const InternshipSection = () => {
  const internshipPrograms = [
    {
      title: 'Magang Konservasi',
      department: 'Divisi Konservasi & Restorasi',
      duration: '3-6 bulan',
      slots: 5,
      requirements: [
        'Mahasiswa D3/S1 Arkeologi, Sejarah, atau bidang terkait',
        'Semester 5 ke atas',
        'IPK minimal 3.0',
        'Memiliki minat pada konservasi budaya'
      ],
      description: 'Program magang untuk mempelajari teknik konservasi dan restorasi artefak budaya serta manajemen koleksi museum.',
      deadline: '15 Februari 2024'
    },
    {
      title: 'Magang Digital Heritage',
      department: 'Divisi Teknologi Informasi',
      duration: '4-6 bulan',
      slots: 3,
      requirements: [
        'Mahasiswa S1 Teknik Informatika, Sistem Informasi, atau DKV',
        'Semester 6 ke atas',
        'IPK minimal 3.2',
        'Menguasai software desain/pemrograman'
      ],
      description: 'Program magang untuk mengembangkan sistem digitalisasi warisan budaya dan platform teknologi museum.',
      deadline: '20 Februari 2024'
    },
    {
      title: 'Magang Penelitian',
      department: 'Divisi Penelitian & Pengembangan',
      duration: '6 bulan',
      slots: 4,
      requirements: [
        'Mahasiswa S1/S2 Arkeologi, Antropologi, atau Sejarah',
        'Sedang mengerjakan tugas akhir',
        'IPK minimal 3.25',
        'Proposal penelitian yang relevan'
      ],
      description: 'Program magang untuk melakukan penelitian ilmiah terkait warisan budaya Indonesia.',
      deadline: '28 Februari 2024'
    },
    {
      title: 'Magang Komunikasi & Media',
      department: 'Divisi Humas & Komunikasi',
      duration: '3-4 bulan',
      slots: 2,
      requirements: [
        'Mahasiswa Ilmu Komunikasi, Jurnalistik, atau PR',
        'Semester 5 ke atas',
        'IPK minimal 3.0',
        'Portfolio karya komunikasi'
      ],
      description: 'Program magang untuk mengelola komunikasi publik, media sosial, dan publikasi institusi.',
      deadline: '10 Maret 2024'
    }
  ];

  const benefits = [
    'Sertifikat resmi dari Kementerian Pendidikan dan Kebudayaan',
    'Pengalaman kerja di lembaga pemerintah',
    'Mentoring dari ahli berpengalaman',
    'Networking dengan profesional di bidang warisan budaya',
    'Akses ke koleksi dan fasilitas museum',
    'Kemungkinan publikasi hasil penelitian'
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-heritage-gradient">
            Program Magang
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Bergabunglah dengan program magang kami dan dapatkan pengalaman 
            berharga dalam bidang pelestarian warisan budaya Indonesia.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {internshipPrograms.map((program, index) => (
            <Card key={index} className="scroll-reveal heritage-glow hover:scale-105 transition-bounce">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{program.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{program.department}</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {program.slots} posisi
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{program.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-primary" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={16} className="text-primary" />
                    <span>{program.slots} posisi tersedia</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">Persyaratan:</h4>
                  <ul className="space-y-1">
                    {program.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Deadline: </span>
                    <span className="font-semibold text-primary">{program.deadline}</span>
                  </div>
                  <Button size="sm">
                    <FileText size={16} className="mr-2" />
                    Daftar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="scroll-reveal">
            <Card className="heritage-glow">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <GraduationCap size={28} className="text-primary" />
                  Manfaat Program Magang
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="scroll-reveal">
            <Card className="heritage-glow">
              <CardHeader>
                <CardTitle className="text-2xl">Proses Pendaftaran</CardTitle>
                <p className="text-muted-foreground">
                  Ikuti langkah-langkah berikut untuk mendaftar
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Persiapan Dokumen</h4>
                      <p className="text-sm text-muted-foreground">CV, transkrip nilai, surat pengantar, dan proposal (jika ada)</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Pengajuan Online</h4>
                      <p className="text-sm text-muted-foreground">Submit aplikasi melalui form online atau email</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Seleksi Administrasi</h4>
                      <p className="text-sm text-muted-foreground">Review dokumen dan verifikasi persyaratan</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold">Wawancara</h4>
                      <p className="text-sm text-muted-foreground">Interview dengan tim dan mentor program</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    <div>
                      <h4 className="font-semibold">Pengumuman Hasil</h4>
                      <p className="text-sm text-muted-foreground">Notifikasi penerimaan dan orientasi program</p>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-6">
                  <Send size={16} className="mr-2" />
                  Mulai Pendaftaran
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16 text-center scroll-reveal">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ada Pertanyaan?
            </h3>
            <p className="text-muted-foreground mb-6">
              Tim HR kami siap membantu Anda dengan informasi lebih lanjut 
              tentang program magang dan proses pendaftaran.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline">
                <MapPin size={16} className="mr-2" />
                Lokasi Kantor
              </Button>
              <button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-bounce heritage-glow">
                Hubungi HR
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InternshipSection;
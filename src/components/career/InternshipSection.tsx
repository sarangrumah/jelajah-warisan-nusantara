import { GraduationCap, Clock, MapPin, Users, FileText, Send, Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import FileUploadPDF from '@/components/FileUploadPDF';

const registrationSchema = z.object({
  fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  university: z.string().min(2, 'Nama universitas harus diisi'),
  major: z.string().min(2, 'Program studi harus diisi'),
  semester: z.string().min(1, 'Semester harus diisi'),
  gpa: z.string().min(1, 'IPK harus diisi'),
  internshipProgram: z.string().min(1, 'Program magang harus dipilih'),
  motivation: z.string().min(50, 'Motivasi minimal 50 karakter'),
  cv: z.string().url('URL CV tidak valid').min(1, 'CV harus diupload'),
  transcript: z.string().url('URL transkrip tidak valid').min(1, 'Transkrip harus diupload'),
  coverLetter: z.string().url().optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const InternshipSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      university: '',
      major: '',
      semester: '',
      gpa: '',
      internshipProgram: '',
      motivation: '',
      cv: '',
      transcript: '',
      coverLetter: '',
    }
  });

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      // Here you would typically upload files and submit form data
      console.log('Form data:', data);
      
      toast({
        title: "Pendaftaran Berhasil!",
        description: "Aplikasi magang Anda telah dikirim. Tim kami akan menghubungi Anda dalam 1-2 minggu.",
      });
      
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengirim aplikasi. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  const internshipPrograms = [
    {
      id: 'konservasi',
      title: 'Magang Konservasi & Restorasi',
      department: 'Divisi Konservasi & Restorasi',
      duration: '3-6 bulan',
      slots: 5,
      location: 'Jakarta Pusat',
      requirements: [
        'Mahasiswa D3/S1 Arkeologi, Sejarah, Kimia, atau bidang terkait',
        'Semester 5 ke atas dengan IPK minimal 3.0',
        'Memiliki minat pada konservasi budaya',
        'Tidak takut bekerja dengan bahan kimia (dengan APD)',
        'Teliti dan sabar dalam bekerja dengan artefak'
      ],
      description: 'Program magang untuk mempelajari teknik konservasi dan restorasi artefak budaya, manajemen koleksi museum, serta dokumentasi kondisi benda cagar budaya.',
      responsibilities: [
        'Membantu proses konservasi artefak di laboratorium',
        'Dokumentasi kondisi sebelum dan sesudah konservasi',
        'Belajar teknik pembersihan dan stabilisasi artefak',
        'Membantu pengelolaan database koleksi'
      ],
      deadline: '15 Februari 2024',
      supervisor: 'Dr. Sari Yuliati, M.Si. (Konservator Senior)'
    },
    {
      id: 'digital-heritage',
      title: 'Magang Digital Heritage & IT',
      department: 'Divisi Teknologi Informasi',
      duration: '4-6 bulan',
      slots: 3,
      location: 'Jakarta Pusat (Hybrid)',
      requirements: [
        'Mahasiswa S1 Teknik Informatika, Sistem Informasi, atau DKV',
        'Semester 6 ke atas dengan IPK minimal 3.2',
        'Menguasai bahasa pemrograman (Python, JavaScript, atau PHP)',
        'Familiar dengan database dan web development',
        'Portfolio projek teknologi (wajib)'
      ],
      description: 'Program magang untuk mengembangkan sistem digitalisasi warisan budaya, platform virtual museum, dan aplikasi teknologi untuk pelestarian.',
      responsibilities: [
        'Pengembangan sistem informasi museum',
        'Digitalisasi koleksi dengan teknologi 3D scanning',
        'Pembuatan virtual tour dan AR/VR experiences',
        'Maintenance website dan aplikasi mobile'
      ],
      deadline: '20 Februari 2024',
      supervisor: 'Budi Santoso, S.Kom, M.T. (IT Manager)'
    },
    {
      id: 'penelitian',
      title: 'Magang Penelitian & Dokumentasi',
      department: 'Divisi Penelitian & Pengembangan',
      duration: '6 bulan',
      slots: 4,
      location: 'Jakarta Pusat + Site visits',
      requirements: [
        'Mahasiswa S1/S2 Arkeologi, Antropologi, atau Sejarah',
        'Sedang mengerjakan tugas akhir dengan topik relevan',
        'IPK minimal 3.25',
        'Proposal penelitian yang sudah disetujui dosen pembimbing',
        'Kemampuan analisis dan penulisan ilmiah yang baik'
      ],
      description: 'Program magang untuk melakukan penelitian ilmiah terkait warisan budaya Indonesia, publikasi jurnal, dan dokumentasi temuan arkeologi.',
      responsibilities: [
        'Penelitian koleksi museum dan situs cagar budaya',
        'Analisis data arkeologi dan historis',
        'Penulisan laporan penelitian dan artikel ilmiah',
        'Presentasi hasil penelitian di seminar internal'
      ],
      deadline: '28 Februari 2024',
      supervisor: 'Prof. Dr. Agus Aris Munandar (Peneliti Senior)'
    },
    {
      id: 'komunikasi',
      title: 'Magang Komunikasi & Media',
      department: 'Divisi Humas & Komunikasi',
      duration: '3-4 bulan',
      slots: 2,
      location: 'Jakarta Pusat',
      requirements: [
        'Mahasiswa Ilmu Komunikasi, Jurnalistik, atau Public Relations',
        'Semester 5 ke atas dengan IPK minimal 3.0',
        'Portfolio karya komunikasi (artikel, video, desain)',
        'Kemampuan menulis dan editing yang baik',
        'Familiar dengan media sosial dan content creation'
      ],
      description: 'Program magang untuk mengelola komunikasi publik, media sosial, publikasi institusi, dan event management.',
      responsibilities: [
        'Pengelolaan konten media sosial (@museumcagarbudaya)',
        'Penulisan press release dan artikel publikasi',
        'Dokumentasi acara dan kegiatan museum',
        'Koordinasi dengan media dan influencer'
      ],
      deadline: '10 Maret 2024',
      supervisor: 'Maya Sari, S.Sos, M.I.Kom (Head of Communications)'
    },
    {
      id: 'edukasi',
      title: 'Magang Program Edukasi',
      department: 'Divisi Edukasi & Pengunjung',
      duration: '4-5 bulan',
      slots: 3,
      location: 'Jakarta Pusat + Museum sites',
      requirements: [
        'Mahasiswa Pendidikan, Psikologi, atau bidang terkait',
        'Semester 5 ke atas dengan IPK minimal 3.0',
        'Pengalaman mengajar atau public speaking',
        'Kreatif dalam mengembangkan materi edukasi',
        'Suka berinteraksi dengan anak-anak dan dewasa'
      ],
      description: 'Program magang untuk mengembangkan program edukasi museum, workshop, dan kegiatan pembelajaran untuk berbagai usia.',
      responsibilities: [
        'Pengembangan materi edukasi interaktif',
        'Memandu tur edukasi untuk sekolah dan grup',
        'Pembuatan worksheet dan aktivitas pembelajaran',
        'Evaluasi efektivitas program edukasi'
      ],
      deadline: '5 Maret 2024',
      supervisor: 'Rina Handayani, S.Pd, M.Ed (Education Manager)'
    },
    {
      id: 'kuratorial',
      title: 'Magang Kuratorial & Pameran',
      department: 'Divisi Kuratorial',
      duration: '5-6 bulan',
      slots: 2,
      location: 'Jakarta Pusat + Gallery spaces',
      requirements: [
        'Mahasiswa S1 Seni Rupa, Desain, Arkeologi, atau Sejarah Seni',
        'Semester 6 ke atas dengan IPK minimal 3.3',
        'Portfolio desain atau karya kuratorial',
        'Pemahaman teori kuratorial dan exhibition design',
        'Kemampuan riset dan presentasi yang baik'
      ],
      description: 'Program magang untuk belajar kuratorial pameran, exhibition design, dan manajemen galeri museum.',
      responsibilities: [
        'Riset untuk pameran temporer dan permanent',
        'Membantu perencanaan layout dan display pameran',
        'Penulisan label dan katalog pameran',
        'Koordinasi dengan seniman dan peminjam koleksi'
      ],
      deadline: '25 Februari 2024',
      supervisor: 'Dr. Farah Wardani, M.A. (Chief Curator)'
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
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-heritage-gradient">
            Program Magang
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Bergabunglah dengan program magang kami dan dapatkan pengalaman 
            berharga dalam bidang pelestarian warisan budaya Indonesia.
          </p>
        </div>

        {/* Benefits and Registration Process Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
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

          <div>
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
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-6">
                      <Send size={16} className="mr-2" />
                      Mulai Pendaftaran
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Formulir Pendaftaran Magang</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nama Lengkap *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Masukkan nama lengkap" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="email@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nomor Telepon *</FormLabel>
                                <FormControl>
                                  <Input placeholder="08XXXXXXXXX" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="university"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Universitas *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nama universitas" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="major"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Program Studi *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Jurusan" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="semester"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Semester *</FormLabel>
                                <FormControl>
                                  <Input placeholder="5" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="gpa"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>IPK *</FormLabel>
                                <FormControl>
                                  <Input placeholder="3.50" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="internshipProgram"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Program Magang *</FormLabel>
                              <FormControl>
                                <select {...field} className="w-full p-2 border border-input rounded-md">
                                  <option value="">Pilih program magang</option>
                                  {internshipPrograms.map((program) => (
                                    <option key={program.id} value={program.id}>
                                      {program.title}
                                    </option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="motivation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Motivasi & Tujuan *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Jelaskan motivasi dan tujuan Anda mengikuti program magang ini..."
                                  className="min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-4">
                          <h4 className="font-semibold">Dokumen yang Diperlukan</h4>
                          
                          <div className="space-y-4">
                            <FileUploadPDF
                              bucket="cv-uploads"
                              label="CV/Resume *"
                              description="Upload CV dalam format PDF (maksimal 5MB)"
                              required
                              onUploadComplete={(url, fileName) => {
                                form.setValue('cv', url);
                              }}
                              onUploadError={(error) => {
                                toast({
                                  title: 'Error',
                                  description: `Gagal upload CV: ${error}`,
                                  variant: 'destructive',
                                });
                              }}
                            />
                          </div>

                          <div className="space-y-4">
                            <FileUploadPDF
                              bucket="transcripts"
                              label="Transkrip Nilai *"
                              description="Upload transkrip dalam format PDF (maksimal 5MB)"
                              required
                              onUploadComplete={(url, fileName) => {
                                form.setValue('transcript', url);
                              }}
                              onUploadError={(error) => {
                                toast({
                                  title: 'Error',
                                  description: `Gagal upload transkrip: ${error}`,
                                  variant: 'destructive',
                                });
                              }}
                            />
                          </div>

                          <div className="space-y-4">
                            <FileUploadPDF
                              bucket="cover-letters"
                              label="Surat Pengantar (Opsional)"
                              description="Upload surat pengantar dalam format PDF (maksimal 5MB)"
                              onUploadComplete={(url, fileName) => {
                                form.setValue('coverLetter', url);
                              }}
                              onUploadError={(error) => {
                                toast({
                                  title: 'Error',
                                  description: `Gagal upload surat pengantar: ${error}`,
                                  variant: 'destructive',
                                });
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            className="flex-1"
                          >
                            Batal
                          </Button>
                          <Button type="submit" className="flex-1">
                            <Upload size={16} className="mr-2" />
                            Kirim Aplikasi
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Internship Programs */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {internshipPrograms.map((program, index) => (
            <Card key={index} className="heritage-glow hover:scale-105 transition-bounce">
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
                    <MapPin size={16} className="text-primary" />
                    <span>{program.location}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">Persyaratan:</h4>
                  <ul className="space-y-1">
                    {program.requirements.slice(0, 3).map((req, reqIndex) => (
                      <li key={reqIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        {req}
                      </li>
                    ))}
                    {program.requirements.length > 3 && (
                      <li className="text-xs text-muted-foreground/70 italic">
                        +{program.requirements.length - 3} persyaratan lainnya
                      </li>
                    )}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">Tanggung Jawab:</h4>
                  <ul className="space-y-1">
                    {program.responsibilities.slice(0, 2).map((resp, respIndex) => (
                      <li key={respIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        {resp}
                      </li>
                    ))}
                    {program.responsibilities.length > 2 && (
                      <li className="text-xs text-muted-foreground/70 italic">
                        +{program.responsibilities.length - 2} tanggung jawab lainnya
                      </li>
                    )}
                  </ul>
                </div>

                <div className="border-t border-border pt-3 mb-4">
                  <p className="text-xs text-muted-foreground">
                    <strong>Supervisor:</strong> {program.supervisor}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Deadline: </span>
                    <span className="font-semibold text-primary">{program.deadline}</span>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => form.setValue('internshipProgram', program.id)}>
                        <FileText size={16} className="mr-2" />
                        Daftar
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
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

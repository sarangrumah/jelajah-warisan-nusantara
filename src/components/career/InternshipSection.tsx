import { GraduationCap, Send, Upload } from 'lucide-react';
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
import { useEffect, useState } from 'react';
import FileUploadPDF from '@/components/FileUploadPDF';
import { useLocation } from 'react-router-dom';
import InternshipProgram from './InternshipProgram';
import { useTranslation } from 'react-i18next';

const registrationSchema = z.object({
  fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  university: z.string().min(2, 'Nama Sekolah / Universitas harus diisi'),
  major: z.string().min(2, 'Program studi harus diisi'),
  semester: z.string().min(1, 'Semester harus diisi'),
  gpa: z.string().optional(),
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
  const { pathname } = useLocation();
  const { t: _t } = useTranslation();
    
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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

  const onSubmit = async (_data: RegistrationFormData) => {
    try {
      // Here you would typically upload files and submit form data
      
      toast({
        title: "Pendaftaran Berhasil!",
        description: "Aplikasi magang Anda telah dikirim. Tim kami akan menghubungi Anda dalam 1-2 minggu.",
      });
      
      form.reset();
      setIsDialogOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Gagal mengirim aplikasi. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

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
          <h2 className="text-4xl md:text-4xl font-bold pb-6 text-heritage-gradient">
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
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
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
                                <FormLabel>Sekolah / Universitas *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nama Sekolah / Universitas" {...field} />
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
                                <FormLabel>IPK</FormLabel>
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
                                <select {...field} className="w-full p-2 border border-input rounded-md bg-background">
                                  <option value="">Pilih program magang</option>
                                  {/* {InternshipProgram.map((program) => (
                                    <option key={program.id} value={program.id}>
                                      {program.title}
                                    </option>
                                  ))} */}
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
                              onUploadComplete={(url, _fileName) => {
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
                              onUploadComplete={(url, _fileName) => {
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
                              onUploadComplete={(url, _fileName) => {
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
        <InternshipProgram form={form} onSetIsDialogOpen={setIsDialogOpen} />
      </div>
    </section>
  );
};

export default InternshipSection;

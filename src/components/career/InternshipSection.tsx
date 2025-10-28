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
import { careerMgmtService, careerSubmissionService } from '@/lib/api-services';

// Security validation functions
const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/<script>/gi, '')
    .replace(/<\/script>/gi, '')
    .trim();
};

const validatePDFUrl = (url: string): boolean => {
  // Check if URL is from allowed domains and is a PDF
  const allowedDomains = [
    'localhost',
    '127.0.0.1',
    'mcb-jelajah-warisan-nusantara',
    // Add your production domains here
  ];
  
  try {
    const urlObj = new URL(url);
    const isAllowedDomain = allowedDomains.some(domain =>
      urlObj.hostname.includes(domain)
    );
    
    const isPDF = url.toLowerCase().endsWith('.pdf') ||
                  url.toLowerCase().includes('.pdf') ||
                  url.toLowerCase().includes('application/pdf');
    
    return isAllowedDomain && isPDF;
  } catch {
    return false;
  }
};

const registrationSchema = z.object({
  fullName: z.string()
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter')
    .refine(val => !/[<>{}]|script|javascript/i.test(val), 'Nama tidak boleh mengandung karakter berbahaya'),
  email: z.string()
    .email('Email tidak valid')
    .max(150, 'Email maksimal 150 karakter')
    .refine(val => !/[<>{}]|script|javascript/i.test(val), 'Email tidak valid'),
  phone: z.string()
    .min(10, 'Nomor telepon minimal 10 digit')
    .max(20, 'Nomor telepon maksimal 20 digit')
    .regex(/^[0-9+\-\s()]+$/, 'Nomor telepon hanya boleh berisi angka, +, -, dan spasi'),
  university: z.string()
    .min(2, 'Nama Sekolah / Universitas harus diisi')
    .max(200, 'Nama universitas maksimal 200 karakter')
    .refine(val => !/[<>{}]|script|javascript/i.test(val), 'Nama universitas tidak valid'),
  major: z.string()
    .min(2, 'Program studi harus diisi')
    .max(100, 'Program studi maksimal 100 karakter')
    .refine(val => !/[<>{}]|script|javascript/i.test(val), 'Program studi tidak valid'),
  semester: z.string()
    .min(1, 'Semester harus diisi')
    .max(2, 'Semester maksimal 2 digit')
    .regex(/^[0-9]+$/, 'Semester harus berupa angka'),
  gpa: z.string()
    .optional()
    .refine(val => !val || /^[0-9.]*$/.test(val || ''), 'IPK harus berupa angka atau desimal')
    .refine(val => !val || (parseFloat(val || '0') >= 0 && parseFloat(val || '0') <= 4.0), 'IPK harus antara 0 dan 4.0'),
  internshipProgram: z.string()
    .min(1, 'Program magang harus dipilih')
    .uuid('ID program magang tidak valid'),
  motivation: z.string()
    .min(50, 'Motivasi minimal 50 karakter')
    .max(2000, 'Motivasi maksimal 2000 karakter')
    .refine(val => !/<script|javascript:|on\w+=/i.test(val), 'Motivasi mengandung konten berbahaya'),
  cv: z.string()
    .url('URL CV tidak valid')
    .min(1, 'CV harus diupload')
    .refine(val => validatePDFUrl(val), 'File CV harus berupa PDF yang valid'),
  transcript: z.string()
    .url('URL transkrip tidak valid')
    .min(1, 'Transkrip harus diupload')
    .refine(val => validatePDFUrl(val), 'File transkrip harus berupa PDF yang valid'),
  coverLetter: z.string()
    .url()
    .optional()
    .refine(val => !val || validatePDFUrl(val || ''), 'File surat pengantar harus berupa PDF yang valid'),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const InternshipSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { pathname } = useLocation();
  const [internshipPrograms, setInternshipPrograms] = useState([]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  useEffect(() => {
    const fetchInternshipPrograms = async () => {
      try {
        const response = await careerMgmtService.getAll();
        if(response.error || response.data.length === 0) {
          console.error('Error fetching internship programs:', response.error);
        } else {
          const filteredInternshipPrograms = response.data.filter((program: {
              is_active: boolean;
              is_approved: boolean;
              is_rejected: boolean;
              publish_date: string;
              end_publish_date: string;
          }) => (
              program.is_active === true
              && program.is_approved === true
              && program.is_rejected === false
              && new Date(program.publish_date) <= new Date()
              && new Date(program.end_publish_date) >= new Date()
          ));
          setInternshipPrograms(filteredInternshipPrograms);
        }
      } catch (error) {
        console.error('Error fetching internship programs:', error);
      }
    };

    fetchInternshipPrograms();
  }, []);
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    scrollRevealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
  
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
      // Find the selected program to get its ID
      const selectedProgram = internshipPrograms.find((program: any) => program.id === data.internshipProgram);
      
      if (!selectedProgram) {
        toast({
          title: "Error",
          description: "Program magang tidak valid.",
          variant: "destructive",
        });
        return;
      }

      // Sanitize all text inputs to prevent XSS and injection attacks
      const sanitizedData = {
        ...data,
        fullName: sanitizeInput(data.fullName),
        email: sanitizeInput(data.email),
        phone: sanitizeInput(data.phone),
        university: sanitizeInput(data.university),
        major: sanitizeInput(data.major),
        motivation: sanitizeInput(data.motivation),
      };

      // Additional validation for PDF URLs to prevent PDF injection
      const pdfUrls = [sanitizedData.cv, sanitizedData.transcript, sanitizedData.coverLetter].filter(Boolean);
      for (const url of pdfUrls) {
        if (!validatePDFUrl(url)) {
          toast({
            title: "Error",
            description: "URL dokumen tidak valid atau tidak aman.",
            variant: "destructive",
          });
          return;
        }
      }

      // Prepare submission data
      const submissionData = {
        career_id: sanitizedData.internshipProgram,
        name_volunteer: sanitizedData.fullName,
        email: sanitizedData.email,
        mobile_phone: sanitizedData.phone,
        university_name: sanitizedData.university,
        major: sanitizedData.major,
        semester: parseInt(sanitizedData.semester),
        ipk: sanitizedData.gpa ? parseFloat(sanitizedData.gpa) : null,
        motivation: sanitizedData.motivation,
        cv_url: sanitizedData.cv,
        transcript_url: sanitizedData.transcript,
        cover_letter_url: sanitizedData.coverLetter || '',
        application_status: 'pending'
      };

      // Submit the application
      const response = await careerSubmissionService.create(submissionData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: "Pendaftaran Berhasil!",
        description: "Aplikasi magang Anda telah dikirim. Tim kami akan menghubungi Anda dalam 1-2 minggu.",
      });
      
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error submitting application:', error);
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
                                  {internshipPrograms.map((program: any) => (
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
        <InternshipProgram internshipPrograms={internshipPrograms} form={form} onSetIsDialogOpen={setIsDialogOpen} />

        {/* Internship Programs */}
        {/* <div className="grid lg:grid-cols-2 gap-8 mb-16">
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
        </div> */}

        {/* <div className="mt-16 text-center">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ada Pertanyaan?
            </h3>
            <p className="text-muted-foreground mb-6">
              Tim HR kami siap membantu Anda dengan informasi lebih lanjut 
              tentang program magang dan proses pendaftaran.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className='bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-bounce heritage-glow'>
                <MapPin size={16} className="mr-2" />
                Lokasi Kantor
              </Button>
              <Button variant="outline" className='bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-bounce heritage-glow'>
                Hubungi HR
              </Button>
              <button className="hidden bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-8 py-3x rounded-lg font-semibold hover:scale-105 transition-bounce heritage-glow">
                Hubungi HR
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default InternshipSection;

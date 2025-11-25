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
import { useHybridTranslation } from '@/components/HybridTranslationProvider';
import { useContentTranslation } from '@/hooks/useContentTranslation';

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

const createRegistrationSchema = (t: (key: string) => string) => z.object({
  fullName: z.string()
    .min(2, t('internship.validation.nameMin'))
    .max(100, t('internship.validation.nameMax'))
    .refine(val => !/[<>{}]|script|javascript/i.test(val), t('internship.validation.nameInvalid')),
  email: z.string()
    .email(t('internship.validation.emailInvalid'))
    .max(150, t('internship.validation.emailMax'))
    .refine(val => !/[<>{}]|script|javascript/i.test(val), t('internship.validation.emailInvalid')),
  phone: z.string()
    .min(10, t('internship.validation.phoneMin'))
    .max(20, t('internship.validation.phoneMax'))
    .regex(/^[0-9+\-\s()]+$/, t('internship.validation.phoneInvalid')),
  university: z.string()
    .min(2, t('internship.validation.universityMin'))
    .max(200, t('internship.validation.universityMax'))
    .refine(val => !/[<>{}]|script|javascript/i.test(val), t('internship.validation.universityInvalid')),
  major: z.string()
    .min(2, t('internship.validation.majorMin'))
    .max(100, t('internship.validation.majorMax'))
    .refine(val => !/[<>{}]|script|javascript/i.test(val), t('internship.validation.majorInvalid')),
  semester: z.string()
    .min(1, t('internship.validation.semesterMin'))
    .max(2, t('internship.validation.semesterMax'))
    .regex(/^[0-9]+$/, t('internship.validation.semesterInvalid')),
  gpa: z.string()
    .optional()
    .refine(val => !val || /^[0-9.]*$/.test(val || ''), t('internship.validation.gpaInvalid'))
    .refine(val => !val || (parseFloat(val || '0') >= 0 && parseFloat(val || '0') <= 4.0), t('internship.validation.gpaRange')),
  internshipProgram: z.string()
    .min(1, t('internship.validation.programRequired'))
    .uuid(t('internship.validation.programInvalid')),
  motivation: z.string()
    .min(50, t('internship.validation.motivationMin'))
    .max(2000, t('internship.validation.motivationMax'))
    .refine(val => !/<script|javascript:|on\w+=/i.test(val), t('internship.validation.motivationInvalid')),
  cv: z.string()
    .url(t('internship.validation.cvUrl'))
    .min(1, t('internship.validation.cvRequired'))
    .refine(val => validatePDFUrl(val), t('internship.validation.cvPdf')),
  transcript: z.string()
    .url(t('internship.validation.transcriptUrl'))
    .min(1, t('internship.validation.transcriptRequired'))
    .refine(val => validatePDFUrl(val), t('internship.validation.transcriptPdf')),
  coverLetter: z.string()
    .url()
    .optional()
    .refine(val => !val || validatePDFUrl(val || ''), t('internship.validation.coverLetterPdf')),
});

type RegistrationFormData = z.infer<ReturnType<typeof createRegistrationSchema>>;

const InternshipSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { pathname } = useLocation();
  const [internshipPrograms, setInternshipPrograms] = useState([]);
  const { t } = useHybridTranslation();

  // Batch translate all programs at once
  const { translatedContent: translatedPrograms } = useContentTranslation(internshipPrograms);
  const displayPrograms = translatedPrograms || internshipPrograms;

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
    resolver: zodResolver(createRegistrationSchema(t)),
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
          title: t('internship.errorTitle'),
          description: t('internship.invalidProgram'),
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
        if (!validatePDFUrl(url as string)) {
          toast({
            title: t('internship.errorTitle'),
            description: t('internship.invalidUrl'),
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
        title: t('internship.successTitle'),
        description: t('internship.successDesc'),
      });
      
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: t('internship.errorTitle'),
        description: t('internship.errorDesc'),
        variant: "destructive",
      });
    }
  };

  const benefits = [
    t('internship.benefit1'),
    t('internship.benefit2'),
    t('internship.benefit3'),
    t('internship.benefit4'),
    t('internship.benefit5'),
    t('internship.benefit6')
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-4xl font-bold pb-6 text-heritage-gradient">
            {t('internship.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('internship.description')}
          </p>
        </div>

        {/* Benefits and Registration Process Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <Card className="heritage-glow">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <GraduationCap size={28} className="text-primary" />
                  {t('internship.benefitsTitle')}
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
                <CardTitle className="text-2xl">{t('internship.processTitle')}</CardTitle>
                <p className="text-muted-foreground">
                  {t('internship.processSubtitle')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">{t('internship.step1Title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('internship.step1Desc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">{t('internship.step2Title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('internship.step2Desc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">{t('internship.step3Title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('internship.step3Desc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold">{t('internship.step4Title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('internship.step4Desc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    <div>
                      <h4 className="font-semibold">{t('internship.step5Title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('internship.step5Desc')}</p>
                    </div>
                  </div>
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-6">
                      <Send size={16} className="mr-2" />
                      {t('internship.startRegistration')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
                    <DialogHeader>
                      <DialogTitle>{t('internship.formTitle')}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('internship.nameLabel')}</FormLabel>
                                <FormControl>
                                  <Input placeholder={t('internship.namePlaceholder')} {...field} />
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
                                <FormLabel>{t('internship.emailLabel')}</FormLabel>
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
                                <FormLabel>{t('internship.phoneLabel')}</FormLabel>
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
                                <FormLabel>{t('internship.universityLabel')}</FormLabel>
                                <FormControl>
                                  <Input placeholder={t('internship.universityPlaceholder')} {...field} />
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
                                <FormLabel>{t('internship.majorLabel')}</FormLabel>
                                <FormControl>
                                  <Input placeholder={t('internship.majorPlaceholder')} {...field} />
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
                                <FormLabel>{t('internship.semesterLabel')}</FormLabel>
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
                                <FormLabel>{t('internship.gpaLabel')}</FormLabel>
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
                              <FormLabel>{t('internship.programLabel')}</FormLabel>
                              <FormControl>
                                <select {...field} className="w-full p-2 border border-input rounded-md bg-background">
                                  <option value="">{t('internship.selectProgram')}</option>
                                  {displayPrograms.map((program: any) => (
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
                              <FormLabel>{t('internship.motivationLabel')}</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={t('internship.motivationPlaceholder')}
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-4">
                          <h4 className="font-semibold">{t('internship.docsTitle')}</h4>
                          
                          <div className="space-y-4">
                            <FileUploadPDF
                              bucket="cv-uploads"
                              label={t('internship.cvLabel')}
                              description={t('internship.cvDesc')}
                              required
                              onUploadComplete={(url, _fileName) => {
                                form.setValue('cv', url);
                              }}
                              onUploadError={(error) => {
                                toast({
                                  title: t('internship.errorTitle'),
                                  description: `${t('internship.uploadErrorCV')}: ${error}`,
                                  variant: 'destructive',
                                });
                              }}
                            />
                          </div>

                          <div className="space-y-4">
                            <FileUploadPDF
                              bucket="transcripts"
                              label={t('internship.transcriptLabel')}
                              description={t('internship.transcriptDesc')}
                              required
                              onUploadComplete={(url, _fileName) => {
                                form.setValue('transcript', url);
                              }}
                              onUploadError={(error) => {
                                toast({
                                  title: t('internship.errorTitle'),
                                  description: `${t('internship.uploadErrorTranscript')}: ${error}`,
                                  variant: 'destructive',
                                });
                              }}
                            />
                          </div>

                          <div className="space-y-4">
                            <FileUploadPDF
                              bucket="cover-letters"
                              label={t('internship.coverLetterLabel')}
                              description={t('internship.coverLetterDesc')}
                              onUploadComplete={(url, _fileName) => {
                                form.setValue('coverLetter', url);
                              }}
                              onUploadError={(error) => {
                                toast({
                                  title: t('internship.errorTitle'),
                                  description: `${t('internship.uploadErrorCoverLetter')}: ${error}`,
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
                            {t('internship.cancel')}
                          </Button>
                          <Button type="submit" className="flex-1">
                            <Upload size={16} className="mr-2" />
                            {t('internship.submit')}
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
        <InternshipProgram
          internshipPrograms={displayPrograms}
          form={form}
          onSetIsDialogOpen={setIsDialogOpen}
          t={t}
        />
      </div>
    </section>
  );
};

export default InternshipSection;

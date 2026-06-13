import { MapPin, Phone, Mail, Clock, MessageSquare, Send, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';
import { faqService } from '@/lib/api-services';
import { useUnifiedTranslation, useTranslationSystem } from '@/contexts/UnifiedTranslationContext';
import { useSiteContact } from '@/hooks/useSiteContact';
import { stripHtml } from '@/lib/utils';

// Utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  // Replace < tag > and < / tag > with <tag> and </tag>
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
}

const ContactSection = () => {
  const { t } = useUnifiedTranslation();
  const { toast } = useToast();
  const { pathname } = useLocation();
  const contact = useSiteContact();
  const [faqs, setFaqs] = useState([]);
  
  const { translatedContent: translatedFaqs } = useTranslationSystem(faqs, 'faqs-list');
  const displayFaqs = translatedFaqs || faqs;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await faqService.getAll();
        if(response.error || response.data.length === 0) {
          console.error('Error fetching FAQs:', response.error);
        } else {
          const filteredFaqs = response.data.filter((faq: { 
            is_active: boolean 
            is_published: boolean
            is_rejected: boolean
          }) => (
            faq.is_active === true
            && faq.is_published === true
            && faq.is_rejected === false
          ));
          setFaqs(filteredFaqs.sort((a: any, b: any) => a.order_index - b.order_index));
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    fetchFaqs();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: t('contact.error.title'),
        description: t('contact.validation.required'),
        variant: "destructive"
      });
      return;
    }

    try {
      // Note: For email functionality, you'll need to set up Resend
      // For now, we'll just show a success message
      toast({
        title: t('contact.success.title'),
        description: t('contact.success.message'),
      });
      
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: t('contact.error.title'),
        description: t('contact.error.message'),
        variant: "destructive"
      });
      console.error(error)
    }
  };

  // const faqData = [
  //   {
  //     question: "Bagaimana cara mengunjungi museum?",
  //     answer: "Sebagian besar museum buka Selasa-Minggu, 09:00-16:00 WIB. Kami menyarankan untuk memeriksa jadwal khusus setiap museum di website resmi mereka atau menghubungi langsung sebelum berkunjung."
  //   },
  //   {
  //     question: "Apakah ada tiket masuk untuk museum?",
  //     answer: "Tarif tiket bervariasi per museum. Museum Nasional: Rp 10.000, Museum Gajah: Rp 5.000. Banyak museum memberikan diskon untuk pelajar, kelompok, dan lansia."
  //   },
  //   {
  //     question: "Bisakah mengadakan acara atau penelitian di museum?",
  //     answer: "Ya, kami menerima proposal untuk acara edukasi, penelitian akademis, dan kegiatan budaya. Silakan ajukan permohonan melalui email dengan proposal lengkap minimal 30 hari sebelumnya."
  //   },
  //   {
  //     question: "Bagaimana cara melaporkan penemuan benda cagar budaya?",
  //     answer: "Segera hubungi Balai Pelestarian Cagar Budaya (BPCB) setempat atau langsung ke kantor pusat kami. Jangan memindahkan benda tersebut dan dokumentasikan lokasi dengan foto."
  //   },
  //   {
  //     question: "Apakah ada program edukasi untuk sekolah?",
  //     answer: "Ya, kami memiliki program 'Museum Goes to School' dan kunjungan edukasi untuk siswa. Sekolah dapat mendaftar melalui website atau menghubungi divisi edukasi untuk mengatur kunjungan."
  //   },
  //   {
  //     question: "Bagaimana cara menjadi volunteer museum?",
  //     answer: "Kami membuka program relawan untuk mahasiswa dan umum. Daftar melalui email dengan CV dan motivation letter. Program volunteer biasanya berlangsung 3-6 bulan."
  //   },
  //   {
  //     question: "Bisakah mendonasikan koleksi ke museum?",
  //     answer: "Museum menerima donasi koleksi yang sesuai dengan misi pelestarian budaya. Tim kurator akan mengevaluasi nilai sejarah dan kondisi artefak sebelum menerima donasi."
  //   },
  //   {
  //     question: "Bagaimana cara mengakses arsip dan dokumen sejarah?",
  //     answer: "Peneliti dapat mengajukan akses ke arsip dengan mengisi formulir penelitian dan menyertakan proposal. Akses diberikan setelah persetujuan kurator dan sesuai prosedur keamanan."
  //   }
  // ];

  const contactInfo = [
    {
      icon: MapPin,
      title: 'contact.office.title',
      details: [
        'contact.office.address1',
        'contact.office.address2',
        'contact.office.address3'
      ]
    },
    {
      icon: Phone,
      title: 'contact.whatsapp',
      details: [
        contact.whatsapp
      ]
    },
    {
      icon: Mail,
      title: 'contact.email',
      details: [
        contact.email
      ]
    },
    {
      icon: Clock,
      title: 'contact.hours.title',
      details: [
        'contact.hours.monThu',
        'contact.hours.fri',
        'contact.hours.weekend'
      ]
    }
  ];

  const socialMedia = [
    { name: 'Instagram', handle: '@indonesianheritageagency', url: contact.instagram },
    { name: 'YouTube', handle: 'Indonesian Heritage Agency', url: contact.youtube },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-4xl font-bold pb-6 text-heritage-gradient">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold mb-8">{t('contact.infoTitle')}</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="heritage-glow hover:scale-105 transition-bounce">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <info.icon size={24} className="text-primary" />
                      <CardTitle className="text-lg">
                        <span dangerouslySetInnerHTML={{ __html: fixBrokenHtmlTags(t(info.title)) }} />
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {info.details.map((detail, detailIndex) => (
                        <p
                          key={detailIndex}
                          className="text-muted-foreground text-sm"
                        >
                          {detail.startsWith('contact.') ? (
                            <span dangerouslySetInnerHTML={{ __html: fixBrokenHtmlTags(t(detail)) }} />
                          ) : (
                            detail
                          )}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-4">{t('contact.socialMedia')}</h4>
              <div className="grid grid-cols-2 gap-3">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:bg-card/80 transition-colors"
                  >
                    <MessageSquare size={16} className="text-primary" />
                    <div>
                      <div className="font-medium text-sm">{social.name}</div>
                      <div className="text-xs text-muted-foreground">{social.handle}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Card className="heritage-glow">
              <CardHeader>
                <CardTitle className="text-2xl">{t('contact.form.title')}</CardTitle>
                <p className="text-muted-foreground">
                  {t('contact.form.subtitle')}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('contact.form.name')}</label>
                      <Input 
                        placeholder={t('contact.form.namePlaceholder')}
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('contact.form.email')}</label>
                      <Input 
                        type="email" 
                        placeholder={t('contact.form.emailPlaceholder')}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('contact.form.subject')}</label>
                    <Input 
                      placeholder={t('contact.form.subjectPlaceholder')}
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('contact.form.message')}</label>
                    <Textarea 
                      placeholder={t('contact.form.messagePlaceholder')}
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Send size={16} className="mr-2" />
                    {t('contact.form.submit')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* FAQ Section */}
        <div className="mb-16">
          <Card className="heritage-glow">
            <CardHeader>
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                <HelpCircle size={28} className="text-primary" />
                {t('contact.faq.title')}
              </CardTitle>
              <p className="text-muted-foreground text-center">
                {t('contact.faq.subtitle')}
              </p>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {displayFaqs.length > 0 && displayFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <span className="[&_p]:m-0 [&_p]:inline">{stripHtml(faq.question)}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-muted-foreground leading-relaxed">
                        {stripHtml(faq.answer)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, HelpCircle, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const { toast } = useToast();
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
        title: "Error",
        description: "Mohon lengkapi semua field yang diperlukan",
        variant: "destructive"
      });
      return;
    }

    try {
      // Note: For email functionality, you'll need to set up Resend
      // For now, we'll just show a success message
      toast({
        title: "Pesan Terkirim!",
        description: "Terima kasih! Kami akan merespons dalam 1-2 hari kerja.",
      });
      
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengirim pesan. Silakan coba lagi.",
        variant: "destructive"
      });
    }
  };

  const faqData = [
    {
      question: "Bagaimana cara mengunjungi museum?",
      answer: "Sebagian besar museum buka Selasa-Minggu, 09:00-16:00 WIB. Kami menyarankan untuk memeriksa jadwal khusus setiap museum di website resmi mereka atau menghubungi langsung sebelum berkunjung."
    },
    {
      question: "Apakah ada tiket masuk untuk museum?",
      answer: "Tarif tiket bervariasi per museum. Museum Nasional: Rp 10.000, Museum Gajah: Rp 5.000. Banyak museum memberikan diskon untuk pelajar, kelompok, dan lansia."
    },
    {
      question: "Bisakah mengadakan acara atau penelitian di museum?",
      answer: "Ya, kami menerima proposal untuk acara edukasi, penelitian akademis, dan kegiatan budaya. Silakan ajukan permohonan melalui email dengan proposal lengkap minimal 30 hari sebelumnya."
    },
    {
      question: "Bagaimana cara melaporkan penemuan benda cagar budaya?",
      answer: "Segera hubungi Balai Pelestarian Cagar Budaya (BPCB) setempat atau langsung ke kantor pusat kami. Jangan memindahkan benda tersebut dan dokumentasikan lokasi dengan foto."
    },
    {
      question: "Apakah ada program edukasi untuk sekolah?",
      answer: "Ya, kami memiliki program 'Museum Goes to School' dan kunjungan edukasi untuk siswa. Sekolah dapat mendaftar melalui website atau menghubungi divisi edukasi untuk mengatur kunjungan."
    },
    {
      question: "Bagaimana cara menjadi volunteer museum?",
      answer: "Kami membuka program relawan untuk mahasiswa dan umum. Daftar melalui email dengan CV dan motivation letter. Program volunteer biasanya berlangsung 3-6 bulan."
    },
    {
      question: "Bisakah mendonasikan koleksi ke museum?",
      answer: "Museum menerima donasi koleksi yang sesuai dengan misi pelestarian budaya. Tim kurator akan mengevaluasi nilai sejarah dan kondisi artefak sebelum menerima donasi."
    },
    {
      question: "Bagaimana cara mengakses arsip dan dokumen sejarah?",
      answer: "Peneliti dapat mengajukan akses ke arsip dengan mengisi formulir penelitian dan menyertakan proposal. Akses diberikan setelah persetujuan kurator dan sesuai prosedur keamanan."
    }
  ];

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Alamat Kantor',
      details: [
        'Jl. Medan Merdeka Barat No. 12',
        'Jakarta Pusat 10110',
        'DKI Jakarta, Indonesia'
      ]
    },
    {
      icon: Phone,
      title: 'Telepon',
      details: [
        '+62 21 3811551',
        '+62 21 3447777',
        'Fax: +62 21 3810350'
      ]
    },
    {
      icon: Mail,
      title: 'Email',
      details: [
        'info@museumcagarbudaya.go.id',
        'humas@museumcagarbudaya.go.id',
        'admin@museumcagarbudaya.go.id'
      ]
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      details: [
        'Senin - Jumat: 08:00 - 16:00 WIB',
        'Sabtu: 08:00 - 12:00 WIB',
        'Minggu & Libur: Tutup'
      ]
    }
  ];

  const socialMedia = [
    { name: 'Instagram', handle: '@museumcagarbudaya', url: '#' },
    { name: 'Facebook', handle: 'Museum Cagar Budaya Indonesia', url: '#' },
    { name: 'Twitter', handle: '@museumcagarbudaya', url: '#' },
    { name: 'YouTube', handle: 'Museum Cagar Budaya Indonesia', url: '#' },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">{/* removed scroll-reveal for testing */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-heritage-gradient">
            Hubungi Kami
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Kami siap membantu Anda dengan pertanyaan, saran, atau informasi 
            lebih lanjut tentang museum dan cagar budaya Indonesia.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold mb-8">Informasi Kontak</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="heritage-glow hover:scale-105 transition-bounce">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <info.icon size={24} className="text-primary" />
                      <CardTitle className="text-lg">{info.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-muted-foreground text-sm">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-4">Media Sosial</h4>
              <div className="grid grid-cols-2 gap-3">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
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
                <CardTitle className="text-2xl">Kirim Pesan</CardTitle>
                <p className="text-muted-foreground">
                  Sampaikan pertanyaan atau saran Anda kepada kami
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nama Lengkap</label>
                      <Input 
                        placeholder="Masukkan nama lengkap" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input 
                        type="email" 
                        placeholder="Masukkan email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Subjek</label>
                    <Input 
                      placeholder="Masukkan subjek pesan" 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Pesan</label>
                    <Textarea 
                      placeholder="Tulis pesan Anda..." 
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Send size={16} className="mr-2" />
                    Kirim Pesan
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
                Pertanyaan yang Sering Diajukan (FAQ)
              </CardTitle>
              <p className="text-muted-foreground text-center">
                Temukan jawaban untuk pertanyaan umum seputar museum dan cagar budaya
              </p>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Lokasi Kantor</CardTitle>
              <p className="text-muted-foreground text-center">
                Kunjungi kantor pusat kami di Jakarta
              </p>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Peta lokasi akan ditampilkan di sini
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
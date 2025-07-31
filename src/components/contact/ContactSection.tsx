import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const ContactSection = () => {
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
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-heritage-gradient">
            Hubungi Kami
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Kami siap membantu Anda dengan pertanyaan, saran, atau informasi 
            lebih lanjut tentang museum dan cagar budaya Indonesia.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="scroll-reveal">
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

          <div className="scroll-reveal">
            <Card className="heritage-glow">
              <CardHeader>
                <CardTitle className="text-2xl">Kirim Pesan</CardTitle>
                <p className="text-muted-foreground">
                  Sampaikan pertanyaan atau saran Anda kepada kami
                </p>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nama Lengkap</label>
                      <Input placeholder="Masukkan nama lengkap" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input type="email" placeholder="Masukkan email" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Subjek</label>
                    <Input placeholder="Masukkan subjek pesan" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Pesan</label>
                    <Textarea 
                      placeholder="Tulis pesan Anda..." 
                      rows={6}
                    />
                  </div>
                  
                  <Button className="w-full">
                    <Send size={16} className="mr-2" />
                    Kirim Pesan
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="scroll-reveal">
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
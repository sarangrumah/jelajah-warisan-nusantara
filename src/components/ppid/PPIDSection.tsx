import { FileText, Clock, Download, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
}
import { useUnifiedTranslation, useTranslationSystem } from '@/contexts/UnifiedTranslationContext';
import { useSiteContact } from '@/hooks/useSiteContact';
import { ppidDocumentService } from '@/lib/api-services';
import { getUploadedImageUrl } from '@/lib/asset-url';
import { useEffect, useState } from 'react';

const rawRequestProcedure = [
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

const rawRequestCriteria = [
  {
    step: 1,
    title: 'Pengajuan atas Perseorangan',
    description: 'Apabila pemohon mengatasnamakan perseorangan wajib menyertakan fotokopi/scan KTP atau identitas lainnya yang masih berlaku (Paspor/SIM).',
    duration: '1 hari'
  },
  {
    step: 2,
    title: 'Pengajuan atas Badan Hukum',
    description: 'Apabila pemohon mengatasnamakan badan hukum Indonesia (organisasi masyarakat/lembaga swadaya masyarakat, organisasi politik, yayasan, dan perusahaan), wajib menyertakan fotokopi/scan akte pendirian badan hukum, surat kuasa dari badan hukum yang bermaterai, dan fotokopi/scan KTP atas nama pemohon/penerima kuasa.',
    duration: '2 hari'
  },
  {
    step: 3,
    title: 'Waktu penyampaian Informasi',
    description: 'Berdasarkan Undang-Undang Nomor 14 Tahun 2008 tentang Keterbukaan Informasi Publik, jangka waktu pemenuhan permintaan informasi publik yaitu selama 10 hari kerja terhitung diterimanya dokumen permintaan informasi publik yang lengkap dan dapat ditambah 7 hari kerja jika diperlukan.',
    duration: '7 hari'
  },
  {
    step: 4,
    title: 'Ketentuan Biaya',
    description: 'Permintaan informasi publik ini tidak dipungut biaya (gratis), namun jika ada dokumen/informasi yang harus difotokopi dan atau digandakan maka biaya dibebankan kepada Pemohon.',
    duration: '3 hari'
  }
];

const PPIDSection = () => {
  const { t } = useUnifiedTranslation();
  const contact = useSiteContact();
  const [documents, setDocuments] = useState<any[]>([]);

  const { translatedContent: requestProcedure } = useTranslationSystem(rawRequestProcedure, 'ppid-procedure');
  const { translatedContent: requestCriteria } = useTranslationSystem(rawRequestCriteria, 'ppid-criteria');

  useEffect(() => {
    let cancelled = false;
    ppidDocumentService.getPublished()
      .then((res) => { if (!cancelled && !res.error && Array.isArray(res.data)) { setDocuments(res.data); } })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-4xl font-bold pb-6 text-heritage-gradient">
            {t('ppid.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('ppid.description')}
          </p>
        </div>

        {/* PPID Commitment Statement */}
        <div className="text-center mb-16 scroll-reveal">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <p className="text-muted-foreground leading-relaxed text-left whitespace-pre-line">
              Museum dan Cagar Budaya dibawah naungan Kementerian Kebudayaan, berkomitmen untuk:
              <ul>
                <li>Menyediakan layanan informasi publik yang transparan, cepat, dan akurat.</li>
                <li> Menyediakan akses bagi masyarakat terhadap informasi terkait pengelolaan museum, pelestarian cagar budaya, serta program/kegiatan yang dilaksanakan.</li>
                <li>Menjamin keterbukaan informasi sesuai ketentuan peraturan perundang-undangan.</li>
              </ul>
              Dasar hukum keberadaan PPID Kementerian Kebudayaan diatur dalam Keputusan Menteri Kebudayaan Republik Indonesia Nomor 161/P/2025 tentang Pejabat Pengelola Informasi dan Dokumentasi Kementerian Kebudayaan, yang juga menjadi acuan bagi PPID Museum dan Cagar Budaya dalam melaksanakan tugas dan fungsinya.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="scroll-reveal">
            <Card className="heritage-glow">
              <CardHeader>
                <CardTitle className="text-2xl">{t('ppid.requestCriteria.title')}</CardTitle>
                {/* <p className="text-muted-foreground">
                  Langkah-langkah untuk mengajukan permohonan informasi publik
                </p> */}
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(requestCriteria || rawRequestCriteria).map((proc, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {proc.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: fixBrokenHtmlTags(proc.title)
                            }}
                          />
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: fixBrokenHtmlTags(proc.description)
                            }}
                          />
                        </p>
                        {/* <div className="flex items-center gap-2 text-xs">
                          <Clock size={12} className="text-primary" />
                          <span className="text-primary font-medium">Maksimal {proc.duration}</span>
                        </div> */}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    💡 Total waktu layanan maksimal 13 hari kerja sesuai regulasi UU KIP
                  </p>
                </div> */}
              </CardContent>
            </Card>
          </div>
          <div className="scroll-reveal">
            <Card className="heritage-glow">
              <CardHeader>
                <CardTitle className="text-2xl">{t('ppid.requestProcedure.title')}</CardTitle>
                <p className="text-muted-foreground">
                  {t('ppid.requestProcedure.subtitle')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(requestProcedure || rawRequestProcedure).map((proc, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {proc.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: fixBrokenHtmlTags(proc.title)
                            }}
                          />
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: fixBrokenHtmlTags(proc.description)
                            }}
                          />
                        </p>
                        <div className="flex items-center gap-2 text-xs">
                          <Clock size={12} className="text-primary" />
                          <span className="text-primary font-medium">{proc.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    💡 Total waktu layanan maksimal 13 hari kerja sesuai regulasi UU KIP
                  </p>
                </div> */}
              </CardContent>
            </Card>
          </div>

          <div className="scroll-reveal">
            {documents.length > 0 && (
            <Card className="heritage-glow mb-6">
              <CardHeader>
                <CardTitle className="text-2xl">Dokumen & Formulir</CardTitle>
                <p className="text-muted-foreground">
                  Unduh dokumen yang diperlukan untuk permohonan informasi
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.map((doc) => {
                    const href = doc.file_url ? getUploadedImageUrl(doc.file_url, 'documents') : null;
                    return (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText size={20} className="text-primary" />
                          <div>
                            <h4 className="font-medium text-sm">{doc.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {(doc.file_type || 'PDF')}{doc.file_size ? ` • ${doc.file_size}` : ''}
                            </p>
                          </div>
                        </div>
                        {href ? (
                          <a href={href} target="_blank" rel="noreferrer" aria-label={`Unduh ${doc.title}`}>
                            <Button size="sm" variant="outline"><Download size={14} /></Button>
                          </a>
                        ) : (
                          <Button size="sm" variant="outline" disabled><Download size={14} /></Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            )}

            {/* <Card className="heritage-glow">
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
            </Card> */}
          </div>
        </div>

        <div className="text-center scroll-reveal gap-12 mb-16">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {t('ppid.contact.title')}
            </h3>
            {/* <p className="text-muted-foreground mb-6">
              Kami berkomitmen untuk memberikan pelayanan informasi publik yang 
              cepat, akurat, dan transparan kepada seluruh masyarakat Indonesia 
              sesuai dengan prinsip keterbukaan informasi publik.
            </p> */}
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="font-bold text-heritage-gradient text-2xl mb-2">{contact.phone}</div>
                <div className="text-muted-foreground">{t('ppid.contact.phone')}</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="font-bold text-heritage-gradient text-2xl mb-2">{contact.email}</div>
                <div className="text-muted-foreground">{t('ppid.contact.email')}</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="font-bold text-heritage-gradient text-2xl mb-2">{t('ppid.contact.hoursText')}</div>
                <div className="text-muted-foreground">{t('ppid.contact.hours')}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center scroll-reveal">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {t('ppid.commitment.title')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('ppid.commitment.description')}
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="font-bold text-heritage-gradient text-2xl mb-2">{t('ppid.commitment.stats.responseValue')}</div>
                <div className="text-muted-foreground">{t('ppid.commitment.stats.response')}</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="font-bold text-heritage-gradient text-2xl mb-2">{t('ppid.commitment.stats.serviceValue')}</div>
                <div className="text-muted-foreground">{t('ppid.commitment.stats.service')}</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="font-bold text-heritage-gradient text-2xl mb-2">{t('ppid.commitment.stats.transparencyValue')}</div>
                <div className="text-muted-foreground">{t('ppid.commitment.stats.transparency')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PPIDSection;
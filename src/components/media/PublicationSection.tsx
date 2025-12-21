import { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { publicationService } from '@/lib/api-services';
import { stripHtml } from '@/lib/utils';
import { unescapeHtml, sanitizeHtml } from '@/lib/sanitize-html';

const PublicationSection = () => {
  const { t } = useTranslation();
  const [publications, setPublications] = useState<any[]>([]);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await publicationService.getAll();
        if (response.data) {
          console.log('Fetched publications from publication service:', response.data);
          setPublications(response.data);
        }
      } catch (error) {
        console.error('Error fetching publications:', error);
      }
    };

    fetchPublications();
  }, []);

  const downloadFromUrl = (url: string) => {
    if (!url) return;

    let publicUrl = url;

    // Handle /src/assets replacement
    if (url.includes('/src/assets/')) {
      publicUrl = url.replace('/src/assets/', '/assets/');
    }
    // Handle uploads path if it doesn't start with http
    else if (url.startsWith('/uploads') || (url.startsWith('uploads/') && !url.startsWith('http'))) {
       const baseUrl = import.meta.env.VITE_API_URL || '';
       publicUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
    }

    const link = document.createElement("a");
    link.href = publicUrl;
    link.rel = "noopener noreferrer";
    link.target = "_blank";
    link.download = url.split('/').pop() || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4">
        {/* <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-4xl font-bold mb-6 text-heritage-gradient">
            Publikasi & Dokumen
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Akses dokumen resmi, laporan, dan publikasi ilmiah tentang 
            pengelolaan museum dan pelestarian cagar budaya.
          </p>
        </div> */}

        <div className="mb-16">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl md:text-4xl font-bold mb-6 text-heritage-gradient">
              {t('publication.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('publication.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 px-3">
            {publications.map((pub, index) => {
              const cleanDescription = stripHtml(unescapeHtml(pub.description || ''));
              const isLong = cleanDescription.length > 100;
              const displayDescription = isLong
                ? cleanDescription.substring(0, 100) + '...'
                : cleanDescription;

              return (
                <Card key={index} className="scroll-reveal heritage-glow hover:scale-105 transition-bounce relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <FileText size={24} className="text-primary" />
                      <div>
                        <CardTitle className="text-lg">{pub.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{pub.type} • {pub.year}</p>
                      </div>
                    </div>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                      PDF
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='pb-6'>
                    <div className="text-muted-foreground mb-4 text-sm min-h-[60px]">
                      {displayDescription}
                      {isLong && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <span className="text-primary cursor-pointer ml-1 hover:underline font-medium inline-block">
                              {t('publication.readMore')}
                            </span>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-2xl mb-4">{pub.title}</DialogTitle>
                              <DialogDescription
                                className="text-foreground text-base leading-relaxed text-justify"
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(unescapeHtml(pub.description || '')) }}
                              />
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                    {pub.url && (
                      <>
                        <div className="grid grid-cols-3 gap-4 text-sm mb-8">
                          <div className="text-center">
                            <div className="font-semibold text-heritage-gradient">{pub.pages}</div>
                            <div className="text-muted-foreground">{t('publication.pages')}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-heritage-gradient">{pub.size}</div>
                            <div className="text-muted-foreground">{t('publication.size')}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-heritage-gradient">{pub.downloadCount}</div>
                            <div className="text-muted-foreground">{t('publication.downloadCount')}</div>
                          </div>
                        </div>
                        <div className='p-6 absolute left-0 bottom-0 right-0'>
                          <Button className="w-full" onClick={() => downloadFromUrl(pub.url)}>
                            <Download size={16} className="mr-2" />
                            {t('publication.downloadButton')}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublicationSection;
import { Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { mediaService } from '@/lib/api-services';

const PublicationSection = () => {
  const [publications, setPublications] = useState([]);

  const downloadFromUrl = (url: string) => {
    // Convert src/assets paths to public assets paths
    // const publicUrl = url.replace('/src/assets/Berita/', '/uploads/documents/');
    const link = document.createElement("a");
    link.href = `/uploads/documents/${url}`;
    link.rel = "noopener noreferrer";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await mediaService.getAll();
  
        if (response.error || response.data.length === 0) {
          console.error('Error fetching articles:', response.error);
        } else {
          const filteredArticles = response.data.filter((article: {
            is_active: boolean;
            is_approved: boolean;
            is_rejected: boolean;
            published_date: Date;
            categories: string;
          }) => (
            article.is_active === true
            && article.is_approved === true
            && article.is_rejected === false
            && new Date(article.published_date) <= new Date()
            && article.categories.toLowerCase() === 'artikel'
          ))
          .map((article: {file_url: string}) => ({
            ...article,
            image: article.file_url && !article.file_url.startsWith('/uploads/documents/')
              ? `/uploads/documents/${article.file_url.split('/').pop()}`
              : article.file_url
          }));
          setPublications(filteredArticles);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchArticles();
  }, []);

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
              Dokumen Publikasi
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Akses dokumen resmi, laporan, dan publikasi ilmiah tentang 
              pengelolaan museum dan pelestarian cagar budaya.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 px-3">
            {publications.map((pub, index) => (
              <Card key={index} className="scroll-reveal heritage-glow hover:scale-105 transition-bounce relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {/* <FileText size={24} className="text-primary" /> */}
                      <div>
                        <CardTitle className="text-lg">{pub.title}</CardTitle>
                        {/* <p className="text-sm text-muted-foreground">{pub.type} • {pub.year}</p> */}
                      </div>
                    </div>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                      PDF
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='pb-6'>
                    <p className="text-muted-foreground mb-4">{pub.subtitle}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm mb-8">
                      {/* <div className="text-center">
                        <div className="font-semibold text-heritage-gradient">{pub.pages}</div>
                        <div className="text-muted-foreground">Halaman</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-heritage-gradient">{pub.size}</div>
                        <div className="text-muted-foreground">Ukuran</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-heritage-gradient">{pub.downloadCount}</div>
                        <div className="text-muted-foreground">Download</div>
                      </div> */}
                    </div>
                    <div className='p-6 absolute left-0 bottom-0 right-0'>
                      <Button className="w-full" onClick={() => downloadFromUrl(pub.file_url)}>
                        <Download size={16} className="mr-2" />
                        Unduh Dokumen
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublicationSection;
import { useParams, useLocation } from 'react-router-dom';
import { Calendar, User, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mediaService } from '@/lib/api-services';
// Utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
}
import { useEffect, useState } from 'react';
// Utility to fix broken HTML tags like < p > to <p>

const newsImages = import.meta.glob('../assets/news/*', { eager: true });

function getNewsImageUrl(filename: string) {
  if (
    typeof filename === 'string' &&
    (filename.startsWith('http://') ||
    filename.startsWith('https://') ||
    filename.startsWith('/assets/'))
  ) {
    return filename;
  }
  const justFile = filename?.split('/').pop() || filename;
  const match = Object.entries(newsImages).find(([path]) => path.endsWith(justFile));
  if (match) {
    return (match[1] as { default: string }).default;
  }
  // Fallback: try public/assets/news/ for production
  if (justFile) {
    return `/assets/news/${justFile}`;
  }
  return undefined;
}
const NewsDetail = () => {
  const { pathname } = useLocation();
  const { id } = useParams();
  interface MediaArticle {
    id: string;
    title: string;
    image_url?: string;
    file_url?: string;
    categories?: string;
    subtitle?: string;
    description?: string;
    source?: string;
    author?: string[] | string;
    published_date?: string;
    is_active?: boolean;
    is_approved?: boolean;
    created_at?: string;
    updated_at?: string;
    created_by?: string;
    updated_by?: string;
    is_published?: boolean;
    is_rejected?: boolean;
    reason_rejected?: string;
    excerpt?: string;
    content?: string;
    image?: string;
    category?: string;
    date?: string;
  }
  const [article, setArticle] = useState<MediaArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    if (id) {
      mediaService.getById(id)
        .then((response) => {
          if (mounted) {
            if (response.error) {
              setArticle(null);
            } else {
              // Only show if active and approved
              const data = response.data as MediaArticle;
              if (data && data.is_active === true && data.is_approved === true) {
                setArticle(data);
              } else {
                setArticle(null);
              }
            }
          }
        })
        .catch(() => {
          if (mounted) { setArticle(null); }
        })
        .finally(() => {
          if (mounted) { setLoading(false); }
        });
    }
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-lg text-muted-foreground">Memuat artikel...</span>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Artikel tidak ditemukan</h1>
            {/* <Link to="/beranda">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Beranda
              </Button>
            </Link> */}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <article className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-8">
            {/* <Link to="/beranda" className="text-primary hover:underline"> */}
            <span className="text-muted-foreground">Tentang Kami</span>
            {/* </Link> */}
            {' > '}
            <span className="text-muted-foreground">Berita & Publikasi</span>
            {' > '}
            <span className="text-foreground">{article.title}</span>
          </div>

          {/* Back button */}
          {/* <div className="mb-8">
            <Link to="/beranda">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
            </Link>
          </div> */}

          {/* Article header */}
          <div className="mb-8">
            <div className="mb-4">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                {article.categories}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-4xl font-bold text-foreground mb-6">
              <span
                dangerouslySetInnerHTML={{
                  __html: fixBrokenHtmlTags(article.title)
                }}
              />
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              <span
                dangerouslySetInnerHTML={{
                  __html: fixBrokenHtmlTags(article.excerpt)
                }}
              />
            </p>
            
            <div className="flex items-center justify-between border-t border-b border-border py-4">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{new Date(article.published_date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <div className='flex gap-3'>
                    {Array.isArray(article.author)
                      ? article.author.map((author: string, index: number) => (
                          <span className="underline" key={index}>{author}</span>
                        ))
                      : article.author && <span className="underline">{article.author}</span>
                    }
                  </div>
                </div>
              </div>
              
              {/* <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Bagikan
              </Button> */}
            </div>
          </div>

          {/* Featured image */}
          <div className="mb-8">
            <div className="aspect-video relative overflow-hidden rounded-lg shadow-lg">
              <img 
                src={getNewsImageUrl(article.image_url)} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Description under image */}
          {article.description && (
            <div className="mb-8">
              <div className="prose prose-lg max-w-none">
                <div
                  className="text-muted-foreground leading-relaxed italic"
                  dangerouslySetInnerHTML={{ __html: fixBrokenHtmlTags(article.description) }}
                />
              </div>
            </div>
          )}

          {/* Article content */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: fixBrokenHtmlTags(article.content || '') }}
            />
          </div>

          {/* Share section */}
          <Card className="mt-12">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Bagikan artikel ini</h3>
                  <p className="text-muted-foreground">
                    Bantu sebarkan informasi penting tentang pelestarian warisan budaya Indonesia
                  </p>
                </div>
                <Button>
                  <Share2 className="mr-2 h-4 w-4" />
                  Bagikan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default NewsDetail;
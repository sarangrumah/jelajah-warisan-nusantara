import { useParams, Link, useLocation } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { newsService } from '@/lib/api-services';

const NewsDetail = () => {
  const { pathname } = useLocation();
  const [news, setNews] = useState([]);
        
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const { id } = useParams();

  useEffect(() => {
      const fetchNews = async () => {
        try {
          const response = await newsService.getAll();
          if (response.error) {
            console.error('Error fetching news:', response.error);
          } else {
            setNews(response.data);
          }
        } catch (error) {
          console.error('Error fetching news:', error);
        }
      };
      fetchNews();
    }, []);

  // const article = id && news[id as keyof typeof news] ? news[id as keyof typeof news] : null;
  const article = news.find((item) => item.id.toString() === id );

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Artikel tidak ditemukan</h1>
            <Link to="/beranda">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Beranda
              </Button>
            </Link>
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
            <Link to="/beranda" className="text-primary hover:underline">
              Beranda
            </Link>
            {' > '}
            <span className="text-muted-foreground">Berita & Artikel</span>
            {' > '}
            <span className="text-foreground">{article.title}</span>
          </div>

          {/* Back button */}
          <div className="mb-8">
            <Link to="/beranda">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
            </Link>
          </div>

          {/* Article header */}
          <div className="mb-8">
            <div className="mb-4">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                {article.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-4xl font-bold text-foreground mb-6">
              {article.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {article.excerpt}
            </p>
            
            <div className="flex items-center justify-between border-t border-b border-border py-4">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{new Date(article.date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{article.author}</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Bagikan
              </Button>
            </div>
          </div>

          {/* Featured image */}
          <div className="mb-8">
            <div className="aspect-video relative overflow-hidden rounded-lg shadow-lg">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Article content */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
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
      <FloatingButtons />
    </div>
  );
};

export default NewsDetail;
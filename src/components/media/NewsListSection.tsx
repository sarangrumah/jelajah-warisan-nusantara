import { useState, useEffect } from 'react';
import { Search, Calendar, User, ArrowRight, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mediaService } from '@/lib/api-services';
import { Link } from 'react-router-dom';

const newsImages = import.meta.glob('../../assets/news/*', { eager: true });
const newsFiles = import.meta.glob('../../assets/berita/*', { eager: true });

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

function getNewsFileUrl(filename: string) {
  if (
    typeof filename === 'string' &&
    (filename.startsWith('http://') ||
      filename.startsWith('https://') ||
      filename.startsWith('/assets/'))
  ) {
    return filename;
  }
  const justFile = filename?.split('/').pop() || filename;
  const match = Object.entries(newsFiles).find(([path]) => path.endsWith(justFile));
  if (match) {
    return (match[1] as { default: string }).default;
  }
  // Fallback: try public/assets/news/ for production
  if (justFile) {
    return `/assets/berita/${justFile}`;
  }
  return undefined;
}

const NewsListSection = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('semua');

  const categories = [
    { id: 'semua', name: 'Semua' },
    { id: 'berita', name: 'Berita' },
    { id: 'kemitraan', name: 'Kemitraan' },
    { id: 'artikel', name: 'Artikel' },
    { id: 'pengumuman', name: 'Pengumuman' },
  ];

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
          }) => (
            article.is_active === true
            && article.is_approved === true
            && article.is_rejected === false
            && new Date(article.published_date) <= new Date()
          ));
          setArticles(filteredArticles);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(article => {
    if (activeCategory === 'semua') {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    } else {
      const matchesSearch = article.categories.toLowerCase() === activeCategory.toLocaleLowerCase() 
          && (article.title.toLowerCase().includes(searchTerm.toLowerCase()) 
          || article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    }
  });

  const handleOpenFile = (filename: string) => {
    return getNewsFileUrl(filename);
  };

  // const handleReadMoreClick = (article) => {
  //   const link = document.createElement('a');
  //   link.href = article;
  //   link.target = '_blank';
  //   link.rel = 'noopener noreferrer';
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-4xl font-bold mb-6 text-heritage-gradient">
            Berita & Publikasi
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Temukan berita terbaru, artikel, dan publikasi resmi tentang museum 
            dan cagar budaya Indonesia.
          </p>
        </div>

        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari berita atau artikel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className="text-sm"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <Card key={index} className="overflow-hidden heritage-glow hover:scale-105 transition-bounce">
              {article.featured_image_url && (
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={getNewsImageUrl(article.featured_image_url)}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>
                      {article.published_at 
                        ? new Date(article.published_at).toLocaleDateString('id-ID')
                        : new Date(article.created_at).toLocaleDateString('id-ID')
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={14} />
                    <span>Admin</span>
                  </div>
                </div>
                {article.file_url && (
                  <a href={handleOpenFile(article.file_url)} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-glow transition-colors">
                    <button className="py-5 flex items-center gap-2 text-primary hover:text-primary-glow transition-colors">
                      <Download size={16} />
                      <span>Unduh Dokumen</span>
                    </button>
                  </a>
                )}
                <Link to={`/news/${article.id}`} className="text-sm text-primary hover:text-primary-glow transition-colors">
                  <button className="flex items-center gap-2 text-primary hover:text-primary-glow transition-colors">
                    Baca Selengkapnya
                    <ArrowRight size={16} />
                  </button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <Search size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Tidak ada artikel ditemukan</h3>
            <p className="text-muted-foreground">
              Coba ubah kata kunci pencarian atau filter kategori
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsListSection;
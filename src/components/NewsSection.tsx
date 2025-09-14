import { Calendar, User, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { news } from '@/../database/default-data';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';

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
    return (match[1] as any).default;
  }
  // Fallback: try public/assets/news/ for production
  if (justFile) {
    return `/assets/news/${justFile}`;
  }
  return undefined;
}

const NewsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-heritage-gradient">
            Berita & Artikel
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ikuti perkembangan terbaru seputar museum, cagar budaya, dan kegiatan pelestarian 
            warisan budaya Indonesia.
          </p>
        </div>

        <div className="relative mb-12">
          <Carousel>
            <CarouselPrevious />
            <CarouselNext />
            <CarouselContent>
              {news.map((article) => (
                <CarouselItem
                  key={article.id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="overflow-hidden scroll-reveal heritage-glow hover:scale-105 transition-bounce h-full flex flex-col">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={getNewsImageUrl(article.image)}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>{new Date(article.date).toLocaleDateString('id-ID')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User size={14} />
                          <span>{article.author}</span>
                        </div>
                      </div>
                      <Link to={`/news/${article.id}`} className="flex items-center gap-2 text-primary hover:text-primary-glow transition-colors mt-auto">
                        Baca Selengkapnya
                        <ArrowRight size={16} />
                      </Link>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="text-center scroll-reveal">
          <Link to={'/media-publikasi'}>
            <button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-bounce heritage-glow">
              Lihat Semua Berita
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
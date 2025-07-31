import { Calendar, User, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const NewsSection = () => {
  const news = [
    {
      id: 1,
      title: 'Peluncuran Program Digitalisasi Koleksi Museum Nasional',
      excerpt: 'Program ambisius untuk mendigitalkan seluruh koleksi museum nasional dimulai tahun ini.',
      image: '/src/assets/museum-interior.jpg',
      date: '2024-01-15',
      author: 'Tim Redaksi',
      category: 'Berita'
    },
    {
      id: 2,
      title: 'Kerjasama Internasional Pelestarian Cagar Budaya',
      excerpt: 'Indonesia menandatangani MoU dengan UNESCO untuk program pelestarian.',
      image: '/src/assets/heritage-sites.jpg',
      date: '2024-01-12',
      author: 'Tim Redaksi',
      category: 'Kemitraan'
    },
    {
      id: 3,
      title: 'Workshop Konservasi Artefak untuk Kurator Museum',
      excerpt: 'Pelatihan teknik konservasi modern untuk meningkatkan kualitas perawatan koleksi.',
      image: '/src/assets/hero-borobudur.jpg',
      date: '2024-01-10',
      author: 'Tim Redaksi',
      category: 'Artikel'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-heritage-gradient">
            Berita & Artikel
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ikuti perkembangan terbaru seputar museum, cagar budaya, dan kegiatan pelestarian 
            warisan budaya Indonesia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {news.map((article, index) => (
            <Card key={article.id} className="overflow-hidden scroll-reveal heritage-glow hover:scale-105 transition-bounce">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                </div>
              </div>
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
                    <span>{new Date(article.date).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={14} />
                    <span>{article.author}</span>
                  </div>
                </div>
                <Link to={`/news/${article.id}`} className="flex items-center gap-2 text-primary hover:text-primary-glow transition-colors">
                  Baca Selengkapnya
                  <ArrowRight size={16} />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center scroll-reveal">
          <button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-bounce heritage-glow">
            Lihat Semua Berita
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
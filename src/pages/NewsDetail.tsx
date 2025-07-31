import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const NewsDetail = () => {
  const { id } = useParams();

  // Mock data - in real app, fetch from API/database
  const newsData = {
    "1": {
      title: 'Peluncuran Program Digitalisasi Koleksi Museum Nasional',
      excerpt: 'Program ambisius untuk mendigitalkan seluruh koleksi museum nasional dimulai tahun ini.',
      content: `
        <p>Jakarta - Direktorat Museum dan Cagar Budaya meluncurkan program digitalisasi koleksi museum nasional yang akan berlangsung selama tiga tahun ke depan. Program ini bertujuan untuk melestarikan warisan budaya Indonesia melalui teknologi digital.</p>
        
        <p>Direktur Museum dan Cagar Budaya, Dr. Ahmad Mahendra, menjelaskan bahwa program ini akan mencakup digitalisasi lebih dari 500.000 artefak dan koleksi museum yang tersebar di seluruh Indonesia. "Ini adalah langkah strategis untuk memastikan warisan budaya kita dapat diakses oleh generasi mendatang," ujarnya.</p>
        
        <h3>Tahapan Program</h3>
        <p>Program digitalisasi akan dilaksanakan dalam tiga tahap:</p>
        <ul>
          <li>Tahap 1: Digitalisasi koleksi museum nasional utama (2024)</li>
          <li>Tahap 2: Digitalisasi museum regional (2025)</li>
          <li>Tahap 3: Integrasi platform digital nasional (2026)</li>
        </ul>
        
        <p>Setiap artefak akan difoto dengan teknologi resolusi tinggi dan dilengkapi dengan metadata lengkap termasuk sejarah, asal daerah, dan nilai kulturalnya.</p>
        
        <h3>Manfaat untuk Masyarakat</h3>
        <p>Platform digital ini akan memungkinkan masyarakat untuk:</p>
        <ul>
          <li>Mengakses koleksi museum secara virtual</li>
          <li>Melakukan penelitian budaya dan sejarah</li>
          <li>Mendukung pendidikan dan pembelajaran</li>
          <li>Mempromosikan pariwisata budaya</li>
        </ul>
        
        <p>Program ini juga akan didukung oleh teknologi Virtual Reality (VR) dan Augmented Reality (AR) untuk memberikan pengalaman yang lebih imersif bagi pengunjung virtual.</p>
      `,
      image: '/src/assets/museum-interior.jpg',
      date: '2024-01-15',
      author: 'Tim Redaksi',
      category: 'Berita'
    },
    "2": {
      title: 'Kerjasama Internasional Pelestarian Cagar Budaya',
      excerpt: 'Indonesia menandatangani MoU dengan UNESCO untuk program pelestarian.',
      content: `
        <p>Paris - Indonesia resmi menandatangani Memorandum of Understanding (MoU) dengan UNESCO untuk memperkuat program pelestarian cagar budaya. Penandatanganan dilakukan oleh Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Republik Indonesia bersama Direktur Jenderal UNESCO.</p>
        
        <p>Kerjasama ini mencakup berbagai aspek pelestarian warisan budaya, termasuk peningkatan kapasitas sumber daya manusia, transfer teknologi konservasi, dan pengembangan standar internasional pelestarian cagar budaya.</p>
        
        <h3>Fokus Kerjasama</h3>
        <p>Program kerjasama akan berfokus pada:</p>
        <ul>
          <li>Pelatihan konservasionis Indonesia di pusat-pusat UNESCO</li>
          <li>Pertukaran teknologi konservasi modern</li>
          <li>Penelitian bersama tentang teknik pelestarian</li>
          <li>Pengembangan standar dokumentasi cagar budaya</li>
        </ul>
        
        <p>"Kerjasama ini akan memperkuat kapabilitas Indonesia dalam melindungi warisan budaya yang sangat kaya dan beragam," kata Direktur Jenderal UNESCO dalam sambutannya.</p>
        
        <h3>Target dan Rencana</h3>
        <p>Dalam lima tahun ke depan, program ini menargetkan:</p>
        <ul>
          <li>Pelatihan 500 tenaga ahli konservasi</li>
          <li>Restorasi 50 situs cagar budaya prioritas</li>
          <li>Pengembangan 10 pusat konservasi regional</li>
          <li>Publikasi pedoman teknis pelestarian</li>
        </ul>
      `,
      image: '/src/assets/heritage-sites.jpg',
      date: '2024-01-12',
      author: 'Tim Redaksi',
      category: 'Kemitraan'
    },
    "3": {
      title: 'Workshop Konservasi Artefak untuk Kurator Museum',
      excerpt: 'Pelatihan teknik konservasi modern untuk meningkatkan kualitas perawatan koleksi.',
      content: `
        <p>Yogyakarta - Direktorat Museum dan Cagar Budaya menyelenggarakan workshop konservasi artefak yang diikuti oleh 100 kurator museum dari seluruh Indonesia. Workshop ini bertujuan untuk meningkatkan kompetensi dalam perawatan dan pelestarian koleksi museum.</p>
        
        <p>Workshop selama tiga hari ini menghadirkan narasumber ahli konservasi dari dalam dan luar negeri, termasuk spesialis dari Museum Nasional Thailand dan Museum Victoria & Albert London.</p>
        
        <h3>Materi Workshop</h3>
        <p>Peserta mendapatkan pelatihan komprehensif tentang:</p>
        <ul>
          <li>Teknik konservasi preventif dan kuratif</li>
          <li>Analisis kondisi artefak</li>
          <li>Penggunaan peralatan konservasi modern</li>
          <li>Dokumentasi proses konservasi</li>
          <li>Penanganan koleksi sensitif</li>
        </ul>
        
        <p>Dr. Sarah Williams dari Museum Victoria & Albert menyampaikan, "Konservasi bukan hanya tentang memperbaiki yang rusak, tetapi lebih kepada mencegah kerusakan sejak dini."</p>
        
        <h3>Praktik Lapangan</h3>
        <p>Selain teori, peserta juga melakukan praktik langsung konservasi berbagai jenis artefak:</p>
        <ul>
          <li>Tekstil tradisional</li>
          <li>Keramik dan tembikar</li>
          <li>Logam dan perhiasan</li>
          <li>Naskah dan dokumen bersejarah</li>
          <li>Lukisan dan karya seni</li>
        </ul>
        
        <p>Workshop ini merupakan bagian dari program pengembangan kapasitas museum yang akan berlanjut dengan sertifikasi kompetensi konservasi tingkat nasional.</p>
      `,
      image: '/src/assets/hero-borobudur.jpg',
      date: '2024-01-10',
      author: 'Tim Redaksi',
      category: 'Artikel'
    }
  };

  const article = id && newsData[id as keyof typeof newsData] ? newsData[id as keyof typeof newsData] : null;

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
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
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
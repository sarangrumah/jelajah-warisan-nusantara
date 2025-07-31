import Header from '@/components/Header';
import NewsListSection from '@/components/media/NewsListSection';
import PublikationSection from '@/components/media/PublikationSection';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

const MediaPublikasi = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NewsListSection />
      <PublikationSection />
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default MediaPublikasi;
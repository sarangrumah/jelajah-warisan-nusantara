import Header from '@/components/Header';
import NewsListSection from '@/components/media/NewsListSection';
import PublikationSection from '@/components/media/PublikationSection';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { useEffect } from 'react';

const MediaPublikasi = () => {
  useEffect(() => {
    // Scroll reveal animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    scrollRevealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
  
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
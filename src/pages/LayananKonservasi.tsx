import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { useEffect } from 'react';
import ConservationSection from '@/components/layanan-konservasi/ConservationSection';
import { useLocation } from 'react-router-dom';
import BannerSection from '@/components/layanan-konservasi/BannerSection';
import { Card, CardContent } from '@/components/ui/card';
import conservation1 from '@/assets/conservation/conservation1.png';
import conservation2 from '@/assets/conservation/conservation2.png';
import GalleryCollection from '@/components/museum/GalleryCollection';

const LayananKonservasi = () => {
  const { pathname } = useLocation();
      
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
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

  const collections = [conservation1, conservation2];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BannerSection />
      <ConservationSection />
      <Card className='outline-none border-none rounded-none flex justify-center scroll-reveal'>
        <CardContent className='w-[80%]'>
          <div className="flexx flex-wrapx p-5">
            <GalleryCollection collections={collections} />
          </div>
        </CardContent>
      </Card>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default LayananKonservasi;
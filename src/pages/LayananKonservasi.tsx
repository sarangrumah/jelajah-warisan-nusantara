import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { useEffect } from 'react';
import ConservationSection from '@/components/layanan-konservasi/ConservationSection';
import { useLocation } from 'react-router-dom';
import ContactSection from '@/components/contact/ContactSection';
import BannerSection from '@/components/layanan-konservasi/BannerSection';

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
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BannerSection />
      <ConservationSection />
      <ContactSection />
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default LayananKonservasi;
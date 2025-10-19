import { useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProfileSection from '@/components/ProfileSection';
import ManagementSection from '@/components/ManagementSection';
import AgendaSection from '@/components/AgendaSection';
import DistributionSection from '@/components/DistributionSection';
import NewsSection from '@/components/NewsSection';
import Footer from '@/components/Footer';
import SectionWrapper from '@/components/SectionWrapper';
import { useLocation } from 'react-router-dom';

const Beranda = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  // Scroll reveal animation
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

    // Function to observe elements with retry logic
    const observeElements = (retryCount = 0) => {
      const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
      console.log('🔍 Beranda: Found scroll-reveal elements:', scrollRevealElements.length, 'retry:', retryCount);

      if (scrollRevealElements.length > 0) {
        scrollRevealElements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const inView = rect.top < window.innerHeight && rect.bottom > 0;
          console.log('🔍 Beranda: Element in view:', inView, 'classes:', el.className.substring(0, 50) + '...');

          if (inView) {
            el.classList.add('revealed');
            console.log('🔍 Beranda: Added revealed class to element');
          } else {
            observer.observe(el);
          }
        });
      } else if (retryCount < 10) {
        // Retry after a short delay if no elements found (max 10 retries)
        setTimeout(() => observeElements(retryCount + 1), 200);
      } else {
        console.log('🔍 Beranda: Max retries reached, stopping scroll-reveal observer');
      }
    };

    // Initial attempt with small delay to ensure DOM is ready
    setTimeout(observeElements, 50);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <SectionWrapper id="hero-section" nextId="profile-section">
        <HeroSection />
      </SectionWrapper>
      <SectionWrapper id="profile-section" prevId="hero-section" nextId="management-section">
        <ProfileSection />
      </SectionWrapper>
      <SectionWrapper id="management-section" prevId="profile-section" nextId="agenda-section">
        <ManagementSection />
      </SectionWrapper>
      <SectionWrapper id="agenda-section" prevId="management-section" nextId="distribution-section">
        <AgendaSection />
      </SectionWrapper>
      <SectionWrapper id="distribution-section" prevId="agenda-section" nextId="news-section">
        <DistributionSection />
      </SectionWrapper>
      <SectionWrapper id="news-section" prevId="distribution-section">
        <NewsSection />
      </SectionWrapper>
      <Footer />
    </div>
  );
};

export default Beranda;
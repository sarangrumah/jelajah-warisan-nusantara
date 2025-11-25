import Header from '@/components/Header';
import PPIDSection from '@/components/ppid/PPIDSection';
import Footer from '@/components/Footer';
import { useEffect, useRef } from 'react';

import { useLocation } from 'react-router-dom';

const PPID = () => {
  const ref = useRef<HTMLDivElement>(null);
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
    <div ref={ref as React.RefObject<HTMLDivElement>} className="min-h-screen bg-background">
      <Header />
      <PPIDSection />
      <Footer />
    </div>
  );
};

export default PPID;
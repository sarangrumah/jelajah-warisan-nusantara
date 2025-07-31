import { useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProfileSection from '@/components/ProfileSection';
import ManagementSection from '@/components/ManagementSection';
import AgendaSection from '@/components/AgendaSection';
import FloatingButtons from '@/components/FloatingButtons';

const Index = () => {
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
      <HeroSection />
      <ProfileSection />
      <ManagementSection />
      <AgendaSection />
      <FloatingButtons />
    </div>
  );
};

export default Index;

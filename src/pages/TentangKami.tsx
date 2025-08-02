import Header from '@/components/Header';
import CompanyProfile from '@/components/about/CompanyProfile';
import Services from '@/components/about/Services';
import RulesAndSOP from '@/components/about/RulesAndSOP';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { useEffect } from 'react';

const TentangKami = () => {
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
      <CompanyProfile />
      <Services />
      <RulesAndSOP />
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default TentangKami;
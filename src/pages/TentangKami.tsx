import Header from '@/components/Header';
import CompanyProfile from '@/components/about/CompanyProfile';
import Services from '@/components/about/Services';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RulesAndSOP from '@/components/about/RulesAndSOP';

const TentangKami = () => {
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
      <div className='py-10 px-5 bg-background'>
        <CompanyProfile />
        <Services />
        <RulesAndSOP />
      </div>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default TentangKami;
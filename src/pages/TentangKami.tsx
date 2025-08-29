import Header from '@/components/Header';
import CompanyProfile from '@/components/about/CompanyProfile';
import Services from '@/components/about/Services';
// import RulesAndSOP from '@/components/about/RulesAndSOP';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { useEffect } from 'react';

import { MapPin, Users, Building, Award} from 'lucide-react';
// import { Card, CardContent} from '@/components/ui/card';
import { useLocation } from 'react-router-dom';

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

    const companyStats = [
      { icon: Building, label: 'Museum Terkelola', value: '19', color: 'text-blue-600' },
      { icon: Award, label: 'Cagar Budaya', value: '34', color: 'text-green-600' },
      { icon: Users, label: 'Pengunjung per Tahun', value: '5.2 Juta', color: 'text-purple-600' },
      { icon: MapPin, label: 'Provinsi', value: '34', color: 'text-orange-600' },
    ];

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
        {/* <RulesAndSOP /> */}
      </div>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default TentangKami;
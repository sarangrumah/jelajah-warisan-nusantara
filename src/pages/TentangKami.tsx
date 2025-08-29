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

      {/* Company Stats */}
      {/* <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyStats.map((stat, index) => (
              <Card key={index} className="text-center border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <stat.icon className={`h-12 w-12 ${stat.color}`} />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}
      <CompanyProfile />
      <Services />
      {/* <RulesAndSOP /> */}
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default TentangKami;
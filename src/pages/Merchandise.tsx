import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MerchandiseBanner from '@/components/MerchandiseBanner';
import MerchandiseProductList from '@/components/MerchandiseProductList';
import SectionWrapper from '@/components/SectionWrapper';

const Merchandise = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleScrollToProducts = () => {
    const productsSection = document.getElementById('merchandise-products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      
      {/* Banner Section */}
      <SectionWrapper id="merchandise-banner" nextId="merchandise-products">
        <MerchandiseBanner onScrollToNextSection={handleScrollToProducts} />
      </SectionWrapper>

      {/* Products Section */}
      <SectionWrapper id="merchandise-products" prevId="merchandise-banner">
        <div className="container mx-auto px-4 py-16">
          <MerchandiseProductList />
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
};

export default Merchandise;
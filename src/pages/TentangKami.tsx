import Header from '@/components/Header';
import CompanyProfile from '@/components/about/CompanyProfile';
import Services from '@/components/about/Services';
import RulesAndSOP from '@/components/about/RulesAndSOP';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

const TentangKami = () => {
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
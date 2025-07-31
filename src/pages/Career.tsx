import Header from '@/components/Header';
import InternshipSection from '@/components/career/InternshipSection';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

const Career = () => {
  // Updated with detailed internship positions
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <InternshipSection />
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Career;
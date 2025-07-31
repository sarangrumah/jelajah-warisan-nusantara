import Header from '@/components/Header';
import PPIDSection from '@/components/ppid/PPIDSection';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

const PPID = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PPIDSection />
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default PPID;
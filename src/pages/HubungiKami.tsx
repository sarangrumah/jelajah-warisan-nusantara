import Header from '@/components/Header';
import ContactSection from '@/components/contact/ContactSection';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

const HubungiKami = () => {
  // Updated with FAQ and enhanced contact form
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ContactSection />
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default HubungiKami;
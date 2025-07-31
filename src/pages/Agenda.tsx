import Header from '@/components/Header';
import AgendaBanner from '@/components/agenda/AgendaBanner';
import AgendaList from '@/components/agenda/AgendaList';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

const Agenda = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AgendaBanner />
      <AgendaList />
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Agenda;
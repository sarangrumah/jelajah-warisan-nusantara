import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import ConservationSection from '@/components/layanan-konservasi/ConservationSection';
import { useLocation } from 'react-router-dom';
import BannerSection from '@/components/layanan-konservasi/BannerSection';
import { Card, CardContent } from '@/components/ui/card';
import GalleryConservation from '@/components/layanan-konservasi/GalleryConservation';
import { conservationService } from '@/lib/api-services';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ConservationData {
  id?: string;
  title: string;
  description: string;
  banner_title: string;
  banner_subtitle: string;
  banner_image: string;
  gallery_images: string[] | string;
  is_active: boolean;
}

const LayananKonservasi = () => {
  const { pathname } = useLocation();
  const [data, setData] = useState<ConservationData | null>(null);
  const [loading, setLoading] = useState(true);
      
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await conservationService.getAll();
        if (!response.error && response.data && Array.isArray(response.data) && response.data.length > 0) {
          setData(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching conservation data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (loading) return;

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
  }, [loading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BannerSection 
        title={data?.banner_title} 
        subtitle={data?.banner_subtitle} 
        image={data?.banner_image} 
      />
      <ConservationSection 
        title={data?.title} 
        description={data?.description} 
      />
      <Card className='outline-none border-none rounded-none flex justify-center scroll-reveal'>
        <CardContent className='w-[80%]'>
          <div className="flexx flex-wrapx p-5">
            <GalleryConservation images={data?.gallery_images} />
          </div>
        </CardContent>
      </Card>
      <Footer />
    </div>
  );
};

export default LayananKonservasi;
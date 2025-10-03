import Header from '@/components/Header'
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { defaultAssets } from '@/../database/default-data';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const museumImages = import.meta.glob('../assets/images/*', { eager: true });
const PLACEHOLDER_IMAGE = '/placeholder.svg';
function getMuseumImageUrl(filename: string | undefined | null) {
  if (!filename) { return PLACEHOLDER_IMAGE };
  if (
    typeof filename === 'string' &&
    (filename.startsWith('http://') ||
      filename.startsWith('https://') ||
      filename.startsWith('/assets/')) ||
      filename.startsWith('/src/assets/images/')
  ) {
    return filename;
  }
  // Try to resolve using Vite's import
  const match = Object.entries(museumImages).find(([path]) => path.endsWith(filename));
  return match ? (match[1] as { default: string }).default : PLACEHOLDER_IMAGE;
}

const PemanfaatanAsetDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const filteredAssets = defaultAssets.filter((asset) => asset.id.toString() === id);
    setAssets(filteredAssets);
  }, [id]);

  if (assets.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('Museum not found')}</h1>
          <p className="text-muted-foreground">{t('The requested museum could not be found.')}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {assets.map((asset) => (
        <div key={asset.id} className="container mx-auto px-4 py-16 text-center">
          <section className="relative h-96 overflow-hidden">
            <img
              src={getMuseumImageUrl(asset.imageUrl?.split('/').pop() || asset.imageUrl)}
              alt={asset.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </section>
          <section className="container mx-auto px-4 py-2">
            <div className='flex mx-auto justify-center'>
              <MapPin className="mb-2" />
              {asset.shortLocation}
            </div>
            <div className="grid grid-cols-1 py-10">
              <div className="lg:col-span-2">
                <Card>
                <CardHeader>
                  <CardTitle className='text-start'>{'Detail Acara'}</CardTitle>
                </CardHeader>
                <CardContent className='text-start'>
                  <p className="text-muted-foreground leading-relaxed">
                    {asset.description}
                  </p>
                </CardContent>
                <CardHeader>
                  <CardTitle className='text-start'>{'Ketentuan Umum'}</CardTitle>
                </CardHeader>
                <CardContent className='text-start'>
                  <p className="text-muted-foreground leading-relaxed ps-8">
                    {asset.ketentuanUmum.length > 0 ? 
                      asset.ketentuanUmum.map((item, index) => <li key={index}>{item}</li>)
                    : 'Tidak ada ketentuan umum'}
                  </p>
                </CardContent>
                <CardContent className='flex text-start'>
                  <p className="text-white leading-relaxed">
                    {'Tarif : '}
                  </p>
                  <p className="text-muted-foreground leading-relaxed ps-1">
                    {asset.tarif}
                  </p>
                </CardContent>
                <CardContent className='flex text-start'>
                  <p className="text-white leading-relaxed">
                    {'Biaya Overtime : '}
                  </p>
                  <p className="text-muted-foreground leading-relaxed ps-1">
                    {asset.overtime}
                  </p>
                </CardContent>
                <CardContent className='text-start'>
                  <p className="text-white leading-relaxed">
                    {'Fasilitas : '}
                  </p>
                  <p className="text-muted-foreground leading-relaxed ps-8">
                    {asset.facilities.length > 0 ? 
                      asset.facilities.map((item, index) => <li key={index}>{item}</li>)
                    : ''}
                  </p>
                </CardContent>
                <CardContent className='text-start'>
                  <p className="text-white leading-relaxed">
                    {'Fasilitas Tambahan : '}
                  </p>
                  <p className="text-muted-foreground leading-relaxed ps-8">
                    {asset.fasilitasTambahan.length > 0 ? 
                      asset.fasilitasTambahan.map((item, index) => <li key={index}>{item}</li>)
                    : ''}
                  </p>
                </CardContent>
              </Card>
              <Card className='mt-4 pb-8'>
                <CardHeader>
                  <CardTitle className='text-start flex'>
                    <div className='py-2'>
                    {'Detail'}
                    </div>
                    <div className='bg-muted-foreground text-background ms-5 p-2 rounded-md'>{asset.area}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex text-start'>
                  <p className="text-white leading-relaxed">
                    {'Kapasitas : '}
                  </p>
                  <p className="text-muted-foreground leading-relaxed ps-1">
                    {asset.kapasitas}
                  </p>
                </CardContent>
                <CardContent className='flex text-start'>
                  <p className="text-white leading-relaxed">
                    {'Ukuran : '}
                  </p>
                  <p className="text-muted-foreground leading-relaxed ps-1">
                    {asset.ukuran}
                  </p>
                </CardContent>
                <CardContent className='flex text-start'>
                  <p className="text-white leading-relaxed">
                    {'Harga : '}
                  </p>
                  <p className="text-muted-foreground leading-relaxed ps-1">
                    {asset.tarif}
                  </p>
                </CardContent>
                <CardContent className='flex text-start'>
                  <Button 
                    className="w-[15rem] bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:scale-105 transition-bounce"
                  >
                    Booking
                  </Button>
                </CardContent>
              </Card>
              </div>
            </div>
          </section>
        </div>
      ))}
      <Footer />
    </div>
  )
}

export default PemanfaatanAsetDetail
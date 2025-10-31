import Header from '@/components/Header'
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
// import { defaultAssets } from '@/../database/default-data';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { pemanfaatanAssetService } from '@/lib/api-services';
import { ImageCarousel } from '@/components/ui/image-carousel';

import { assetUrl } from '@/lib/asset-url';
const PLACEHOLDER_IMAGE = '/placeholder.svg';

function extractImagePaths(imageData: any): string[] {
  if (!imageData) return [PLACEHOLDER_IMAGE];
  
  // If it's already a string URL, return as array
  if (typeof imageData === 'string') {
    // Check if it's a UUID filename (no slashes, contains UUID pattern)
    if (!imageData.includes('/') && imageData.includes('-')) {
      return [`/uploads/images/${imageData}`];
    }
    return [imageData.startsWith('/uploads/') ? imageData : assetUrl(imageData) || PLACEHOLDER_IMAGE];
  }
  
  // If it's an array, process all images
  if (Array.isArray(imageData)) {
    return imageData.map(item => {
      if (typeof item === 'string') {
        // Check if it's a UUID filename (no slashes, contains UUID pattern)
        if (!item.includes('/') && item.includes('-')) {
          return `/uploads/images/${item}`;
        }
        return item.startsWith('/uploads/') ? item : assetUrl(item) || PLACEHOLDER_IMAGE;
      }
      if (item && typeof item === 'object' && item.path) {
        const path = item.path;
        // Check if it's a UUID filename (no slashes, contains UUID pattern)
        if (!path.includes('/') && path.includes('-')) {
          return `/uploads/images/${path}`;
        }
        return path.startsWith('/uploads/') ? path : assetUrl(path) || PLACEHOLDER_IMAGE;
      }
      return PLACEHOLDER_IMAGE;
    }).filter(Boolean);
  }
  
  // If it's an object with path property
  if (imageData && typeof imageData === 'object' && imageData.path) {
    const path = imageData.path;
    // Check if it's a UUID filename (no slashes, contains UUID pattern)
    if (!path.includes('/') && path.includes('-')) {
      return [`/uploads/images/${path}`];
    }
    return [path.startsWith('/uploads/') ? path : assetUrl(path) || PLACEHOLDER_IMAGE];
  }
  
  return [PLACEHOLDER_IMAGE];
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
    const fetchAssets = async () => {
      try {
        const response = await pemanfaatanAssetService.getAll();
        if(response.error || response.data.length === 0) {
          console.error('Error fetching assets:', response.error);
        } else {
          const filteredAssets = response.data.filter((asset: { id: string }) => asset.id.toString() === id);
          setAssets(filteredAssets);
        }
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    }
    fetchAssets();
  }, [id]);

  if (assets.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('Data pemanfaatan asset tidak ditemukan')}</h1>
          <p className="text-muted-foreground">{t('Permintaan data tidak ditemukan.')}</p>
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
          <section className="relative h-96 overflow-hidden pt-10">
            <ImageCarousel
              images={extractImagePaths(asset.image_url)}
              autoSlide={false}
              showControls={true}
              showDots={true}
              className="h-full"
            />
            <div className="absolute inset-0 bg-black/30" />
          </section>
          <section className="container mx-auto px-4 py-5">
            <div className='flex mx-auto justify-center'>
              <MapPin className="mb-2 mx-1" />
              {asset.short_location}
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
                    {Array.isArray(asset.ketentuan_umum) && asset.ketentuan_umum.length > 0 ?
                      asset.ketentuan_umum.map((item, index) => <li key={index}>{item}</li>)
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
                    {Array.isArray(asset.fasilitas) && asset.fasilitas.length > 0 ?
                      asset.fasilitas.map((item, index) => <li key={index}>{item}</li>)
                    : ''}
                  </p>
                </CardContent>
                <CardContent className='text-start'>
                  <p className="text-white leading-relaxed">
                    {'Fasilitas Tambahan : '}
                  </p>
                  <p className="text-muted-foreground leading-relaxed ps-8">
                    {Array.isArray(asset.fasilitas_tambahan) && asset.fasilitas_tambahan.length > 0 ?
                      asset.fasilitas_tambahan.map((item, index) => <li key={index}>{item}</li>)
                    : ''}
                  </p>
                </CardContent>
              </Card>
              <Card className='mt-4 pb-8'>
                <CardHeader>
                  <CardTitle className='text-start flex text-sm'>
                    <span className='py-2'>{'Detail'}</span>
                    <Badge className='bg-muted-foreground text-background ms-5'>{asset.area}</Badge>
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
                    onClick={() => window.open('https://wa.me/6281295953929', '_blank')}
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
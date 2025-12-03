import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { memoryOfWorldGalleryService } from '@/lib/api-services';
import logo from '@/assets/MCB-Logo.png';

const collectionImages = import.meta.glob('../../assets/museums/*', { eager: true });
const PLACEHOLDER_IMAGE = '/placeholder.svg';

function getMowImageUrl(filename: string | undefined | null) {
  if (!filename) { return PLACEHOLDER_IMAGE };
  if (
    typeof filename === 'string' &&
    (filename.startsWith('http://') ||
    filename.startsWith('https://') ||
    filename.startsWith('/assets/') ||
    filename.startsWith('/uploads/'))
  ) {
    return filename;
  }
  // Try to resolve using Vite's import
  const match = Object.entries(collectionImages).find(([path]) => path.endsWith(filename));
  return match ? (match[1] as { default : string }).default : PLACEHOLDER_IMAGE;
}

interface GalleryItem {
  upload_file: string;
  caption?: string;
}

interface MemoryOfWorldGalleryProps {
  mowId: string;
  images?: (string | GalleryItem)[];
}

const MemoryOfWorldGallery = ({ mowId, images: propImages }: MemoryOfWorldGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<{ url: string; caption?: string } | null>(null);
  const [mowGalleries, setMowGalleries] = useState<any[]>([]);

  useEffect(() => {
    // Only fetch if images are not provided via props
    // If propImages is an empty array, we consider it as "provided but empty" and do not fetch
    if (propImages !== undefined) return;

    const fetchMemories = async () => {
      try {
        const response = await memoryOfWorldGalleryService.getAll();
        if (response.error || response.data.length === 0) {
          console.error('Error fetching memories:', response.error);
        } else {
          const filteredGalleries = response.data.filter((gallery: {
            is_active: boolean;
            is_approved: boolean;
            is_rejected: boolean;
          }) => (
            gallery.is_active === true &&
            gallery.is_approved === true &&
            gallery.is_rejected === false
          ));
          setMowGalleries(filteredGalleries);
        }
      } catch (error) {
        console.error('Error fetching memories:', error);
      }
    };
    fetchMemories();
  }, [propImages]);

  const galleries = mowGalleries.filter(gallery => gallery.id_memoryoftheworld === mowId);
  const fetchedImages = galleries.map((gallery) => ({
    upload_file: gallery.upload_file,
    caption: gallery.caption
  }));
  
  // Use prop images if available, otherwise use fetched images
  const rawImages = (propImages && propImages.length > 0) ? propImages : fetchedImages;

  // Normalize images to objects
  const images = rawImages.map(img => {
    if (typeof img === 'string') {
      return { upload_file: img, caption: '' };
    }
    return img;
  });

  useEffect(() => {
    if (selectedImage === null && images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedImage, images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const getImageIndex = (offset) => {
    return (currentIndex + offset + images.length) % images.length;
  };

  return (
    <Card className="w-full relative overflow-hidden">
      <CardContent className="flex flex-col items-center">
        {/* Carousel */}
        <div className="relative flex items-center justify-center w-full h-[320px] overflow-hidden pt-5">
          {images.length === 1 ? (
            <div className="relative h-full w-full flex items-center justify-center">
              <img
                src={getMowImageUrl(images[0].upload_file)}
                alt="gallery"
                onClick={() => setSelectedImage({ url: getMowImageUrl(images[0].upload_file), caption: images[0].caption })}
                className="rounded-2xl object-contain cursor-pointer max-h-full max-w-full opacity-100 z-10"
              />
              {/* Blurred background for single image */}
              <div
                className="absolute inset-0 blur-xl opacity-30 z-0"
                style={{
                  backgroundImage: `url(${getMowImageUrl(images[0].upload_file)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              {images[0].caption && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 text-center rounded-full text-sm z-20 max-w-[90%]">
                  {images[0].caption}
                </div>
              )}
            </div>
          ) : (
            images.length > 1 ?
              (images.length <= 3 ? [-1, 0, 1] : [-2, -1, 0, 1, 2]).map((offset) => {
                const index = getImageIndex(offset);
                const isCenter = offset === 0;
                const isSide = Math.abs(offset) === 1;
                const isFar = Math.abs(offset) === 2;
                const item = images[index];

                return (
                  <div
                    key={`${index}-${offset}`}
                    className={`absolute transition-all duration-500 flex flex-col items-center justify-center ${
                      isCenter
                        ? "w-[80%] h-[95%] z-20 opacity-100"
                        : isSide
                        ? "w-[60%] h-[85%] z-10 opacity-80"
                        : isFar
                        ? "w-[50%] h-[80%] z-0 opacity-65"
                        : "hidden"
                      }
                      ${isSide ? "blur-[2px]" : ""}`
                    }
                    style={{
                      transform: `translateX(${offset * 60}%) scale(${
                        isCenter ? 1 : 0.9
                      })`,
                    }}
                    onClick={() => isCenter && setSelectedImage({ url: getMowImageUrl(item.upload_file), caption: item.caption })}
                  >
                    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black/5">
                      <img
                        src={getMowImageUrl(item.upload_file)}
                        alt={`gallery-${index}`}
                        className={`w-full h-full cursor-pointer ${isCenter ? 'object-contain' : 'object-cover'}`}
                      />
                      {isCenter && (
                        <div
                          className="absolute inset-0 blur-xl opacity-20 -z-10"
                          style={{
                            backgroundImage: `url(${getMowImageUrl(item.upload_file)})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                      )}
                    </div>
                    {isCenter && item.caption && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 text-center rounded-full text-xs max-w-[90%]">
                        {item.caption}
                      </div>
                    )}
                  </div>
                );
              }
            ) : (
              <img
                src={logo}
                alt="gallery"
                className="w-full h-full object-contain"
              />
            )
          )
        }
        </div>

        {images.length > 1 && (
          <>
            {/* Tombol navigasi */}
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow-md hover:bg-white z-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow-md hover:bg-white z-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicator */}
            <div className="flex justify-center mt-3 space-x-2">
              {images.map((_, i) => (
                <div
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    i === currentIndex ? 'bg-primary heritage-glow w-4' : 'bg-foreground/30 hover:bg-foreground/50'
                  }`}
                />
              ))}
            </div>
          </>     
        )}        

        {/* Modal Fullscreen */}
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="[&>button]:hidden outline-none p-0 bg-transparent border-0 shadow-none flex flex-col justify-center items-center max-w-[90vw]">
            <img
              src={selectedImage?.url || ""}
              alt="fullscreen"
              className="rounded-xl max-h-[85vh] max-w-[90vw] object-contain"
            />
            {selectedImage?.caption && (
              <div className="mt-4 text-white text-center bg-black/50 p-2 rounded-md">
                {selectedImage.caption}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default MemoryOfWorldGallery
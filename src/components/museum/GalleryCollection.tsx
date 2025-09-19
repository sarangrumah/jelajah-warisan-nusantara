import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { defaultCollections } from '@/../database/default-data';
import { collectionService } from '@/lib/api-services';
import logo from '@/assets/MCB-Logo.png';

const collectionImages = import.meta.glob('@/assets/collections/*', { eager: true });

function getCollectionImageUrl(filename: string) {
  if (
    typeof filename === 'string' &&
    (filename.startsWith('http://') ||
      filename.startsWith('https://') ||
      filename.startsWith('/assets/'))
  ) {
    return filename;
  }
  // Try to resolve using Vite's import
  const match = Object.entries(collectionImages).find(([path]) => path.endsWith(filename));
  return match ? (match[1] as any).default : filename;
}

const GalleryCollection = ({museum}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [collections, setCollections] = useState([]);

  const fetchCollections = async () => {
    try {
      const response = await collectionService.getAll();

      if (response.error) {
        console.error('Error fetching collections:', response.error);
        setCollections(defaultCollections);
      }

      if(response.data.length === 0) {
        setCollections(defaultCollections);
      } else {
        setCollections(response.data);
      }

    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const galleries = collections.filter(collection => collection.museum === museum);
  const images = galleries.map(gallery => getCollectionImageUrl(gallery.image_url?.split('/').pop() || gallery.image_url || ""));

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
            <img
              src={images[0] || ""}
              alt="gallery"
              onClick={() => setSelectedImage(images[0])}
              className="absolute rounded-2xl object-cover cursor-pointer max-h-[90%] max-w-[90%] opacity-100"
            />
          ) : (
            images.length > 1 ? 
              (images.length <= 3 ? [-1, 0, 1] : [-2, -1, 0, 1, 2]).map((offset) => {
                const index = getImageIndex(offset);
                const isCenter = offset === 0;
                const isSide = Math.abs(offset) === 1;
                const isFar = Math.abs(offset) === 2;

                return (
                  <img
                    key={index}
                    src={images[index] || ""}
                    alt={`gallery-${index}`}
                    onClick={() => isCenter && setSelectedImage(images[index])}
                    className={`absolute rounded-2xl object-cover cursor-pointer transition-all duration-500 ${
                      isCenter
                        ? "max-w-[80%] max-h-[95%] z-20 opacity-100"
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
                  />
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
          <DialogContent className="[&>button]:hidden outline-none p-0 bg-transparent border-0 shadow-none flex justify-center items-center">
            <img
              src={selectedImage || ""}
              alt="fullscreen"
              className="rounded-xl max-h-[90vh] max-w-[90vw]x object-cover"
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default GalleryCollection;
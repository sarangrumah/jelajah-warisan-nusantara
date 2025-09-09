import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { defaultCollections } from '@/../database/default-data';
import { collectionService } from '@/lib/api-services';

// const imagesx = [
//   "https://picsum.photos/id/1015/600/400",
//   "https://picsum.photos/id/1016/600/400",
//   "https://picsum.photos/id/1018/600/400",
//   "https://picsum.photos/id/1020/600/400",
//   "https://picsum.photos/id/1024/600/400",
// ];

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

const GalleryCollection = () => {
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

  const galleries = collections.filter(collection => collection.museum === museumName);
  const images = galleries.map(gallery => getCollectionImageUrl(gallery.image_url?.split('/').pop() || gallery.image_url || ""));

  useEffect(() => {
    if (selectedImage === null && images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedImage]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleScroll = () => {
    if (!containerRef.current) { return }
    const scrollLeft = containerRef.current.scrollLeft;
    const width = containerRef.current.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    if (containerRef.current && images.length > 1) {
      const width = containerRef.current.offsetWidth;
      containerRef.current.scrollTo({
        left: width * currentIndex,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  // Jika hanya ada 1 foto
  if (images.length === 1) {
    return (
      <Card className="w-full relative pt-5">
        <CardContent className="flex justify-center">
          <img
            src={images[0]}
            alt="single"
            className="rounded-2xl cursor-pointer object-cover w-[70%] max-h-[300px]"
            onClick={() => setSelectedImage(images[0])}
          />

          {/* Modal Fullscreen */}
          <Dialog
            open={!!selectedImage}
            onOpenChange={() => setSelectedImage(null)}
          >
            <DialogContent className="p-0 bg-transparent border-0 shadow-none flex justify-center items-center">
              <img
                src={selectedImage || ""}
                alt="fullscreen"
                className="rounded-xl max-h-[90vh] max-w-[90vw] object-contain"
              />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  // Jika foto lebih dari 1
  return (
    <Card className="w-full relative">
      <CardContent>
        {/* Gallery */}
        <div
          ref={containerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
          onScroll={handleScroll}
        >
          {images.map((img, index) => {
            const distance = Math.abs(currentIndex - index);
            const isActive = currentIndex === index;

            let scale = 1;
            let opacity = 1;
            let zIndex = 10;

            if (distance === 1) {
              scale = 0.9;
              opacity = 0.7;
              zIndex = 5;
            } else if (distance === 2) {
              scale = 0.8;
              opacity = 0.5;
              zIndex = 1;
            } else if (!isActive) {
              scale = 0.7;
              opacity = 0.3;
              zIndex = 0;
            }

            return (
              <div
                key={index}
                src={images[index] || ""}
                alt={`gallery-${index}`}
                onClick={() => isCenter && setSelectedImage(images[index])}
                className={`absolute rounded-2xl object-cover cursor-pointer transition-all duration-500 ${
                  isCenter
                    ? "w-[70%] h-[90%] z-20 opacity-100"
                    : isSide
                    ? "w-[60%] h-[80%] z-10 opacity-70"
                    : isFar
                    ? "w-[50%] h-[70%] z-0 opacity-50"
                    : "hidden"
                }`}
                style={{
                  transform: `translateX(${offset * 60}%) scale(${
                    isCenter ? 1 : 0.9
                  })`,
                }}
              />
            );
          })}
        </div>

                {/* Tombol navigasi overlay */}
                {isActive && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow-md hover:bg-white"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow-md hover:bg-white"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Indicator (klikable) */}
        <div className="flex justify-center mt-3 space-x-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 w-2 rounded-full transition-all ${
                i === currentIndex ? "bg-blue-600 w-4" : "bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Modal Fullscreen */}
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="p-0 bg-transparent border-0 shadow-none flex justify-center items-center">
            <img
              src={selectedImage || ""}
              alt="fullscreen"
              className="rounded-xl max-h-[90vh] max-w-[90vw] object-contain"
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default GalleryCollection;

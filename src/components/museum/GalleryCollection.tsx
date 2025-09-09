import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  // Ubah jumlah foto untuk tes
  "https://picsum.photos/id/1015/600/400",
];

const GalleryCollection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const containerRef = useRef(null);

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
                className="min-w-full snap-center flex justify-center relative"
              >
                <img
                  src={img}
                  alt={`gallery-${index}`}
                  onClick={() => isActive && setSelectedImage(img)}
                  className="rounded-2xl cursor-pointer object-cover transition-all duration-500"
                  style={{
                    transform: `scale(${scale})`,
                    opacity,
                    zIndex,
                    width: "70%",
                    maxHeight: "300px",
                  }}
                />

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

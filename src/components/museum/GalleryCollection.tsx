import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/components/helper";
import { motion, AnimatePresence, MotionProps } from "framer-motion";
import logo from "@/assets/images/logo/MCB Logo_Putih_notext.png";

type Collection = {
  museum?: string;
  image_url: string;
};

interface GalleryCollectionProps {
  collections: Collection[] | string[];
  museumId?: string;
}

const transitionEase = {
  duration: 1.5,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};
const GalleryCollection: React.FC<GalleryCollectionProps> = ({ collections, museumId = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Filter koleksi berdasarkan museumId
  const images = useMemo(() => {
    if (!museumId) { return collections as string[]; }
    const galleries = (collections as Collection[]).filter((c) => c.museum === museumId);
    return galleries.map((g) => g.image_url);
  }, [collections, museumId]);

  // Auto-slide jika tidak sedang fullscreen
  useEffect(() => {
    if (!selectedImage && images.length > 0) {
      const interval = setInterval(
        () => setCurrentIndex((prev) => (prev + 1) % images.length),
        5000
      );
      return () => clearInterval(interval);
    }
  }, [selectedImage, images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToSlide = (index: number) => setCurrentIndex(index);

  // Index kiri & kanan
  const leftIndex = (currentIndex - 1 + images.length) % images.length;
  const rightIndex = (currentIndex + 1) % images.length;

  type MotionTarget = MotionProps["initial"];
  type MotionAnimate = MotionProps["animate"];
  type MotionExit = MotionProps["exit"];
  const renderImage = (
    key: string,
    src: string,
    customClass: string,
    animate: MotionAnimate,
    initial: MotionTarget,
    exit: MotionExit,
    zIndex: number
  ) => (
    <motion.img
      key={key}
      src={getImageUrl(src)}
      alt={key}
      className={`absolute rounded-2xl object-cover cursor-pointer ${customClass}`}
      style={{ zIndex }}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transitionEase}
      onClick={() => setSelectedImage(src)}
    />
  );

  return (
    <Card className="w-full relative overflow-hidden">
      <CardContent className="flex flex-col items-center">
        {/* Carousel */}
        <div
          className={`relative flex items-center justify-center scrollbar-hide w-full ${
            museumId ? "h-[320px]" : "h-[420px]"
          }`}
        >
          {images.length > 0 ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence>
                {images.length === 1 &&
                  renderImage(
                    `center-${currentIndex}`,
                    images[currentIndex],
                    "w-[70%] h-[90%] shadow-2xl",
                    { opacity: 1, scale: 1 },
                    { opacity: 0, scale: 0.95 },
                    { opacity: 0, scale: 0.95 },
                    20
                  )}

                {images.length > 1 && (
                  <>
                    {/* Kiri */}
                    {renderImage(
                      `left-${leftIndex}`,
                      images[leftIndex],
                      "w-[55%] h-[95%]",
                      {
                        opacity: 0.4,
                        x: "-35%",
                        scale: 0.85,
                        rotateY: 25,
                        filter: "blur(1px) brightness(70%)",
                      },
                      { opacity: 0, x: "-120%", rotateY: 60 },
                      { opacity: 0, x: "-120%", rotateY: 60 },
                      10
                    )}
                    {/* Tengah */}
                    {renderImage(
                      `center-${currentIndex}`,
                      images[currentIndex],
                      "w-[70%] h-[95%] shadow-2xl",
                      {
                        opacity: 1,
                        scale: 1,
                        rotateY: 0,
                        filter: "blur(0px) brightness(100%)",
                      },
                      { opacity: 0, scale: 0.95 },
                      { opacity: 0, scale: 0.95 },
                      20
                    )}
                    {/* Kanan */}
                    {renderImage(
                      `right-${rightIndex}`,
                      images[rightIndex],
                      "w-[55%] h-[95%]",
                      {
                        opacity: 0.4,
                        x: "35%",
                        scale: 0.85,
                        rotateY: -25,
                        filter: "blur(1px) brightness(70%)",
                      },
                      { opacity: 0, x: "120%", rotateY: -60 },
                      { opacity: 0, x: "120%", rotateY: -60 },
                      10
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <img
              src={logo}
              alt="logo"
              className="w-[20%] object-cover z-20 opacity-100"
            />
          )}
        </div>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute text-primary left-3 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow-md hover:bg-white z-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute text-primary right-3 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow-md hover:bg-white z-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicator */}
            <div className="flex justify-center mt-3 space-x-2">
              {images.map((_, i) => (
                <div
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`h-2 w-2 rounded-full transition-all cursor-pointer ${
                    i === currentIndex
                      ? "bg-primary heritage-glow w-4"
                      : "bg-foreground/30 hover:bg-foreground/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Fullscreen Modal */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent
            className="[&>button]:hidden outline-none p-0 bg-transparent border-0 shadow-none flex justify-center items-center"
            aria-describedby={undefined}
          >
            <DialogTitle className="sr-only">Image Preview</DialogTitle>
            <DialogDescription className="sr-only">
              Fullscreen preview of selected image
            </DialogDescription>
            {selectedImage && (
              <img
                src={getImageUrl(selectedImage)}
                alt="fullscreen"
                className="rounded-xl max-h-[90vh] max-w-[90vw] object-contain"
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
export default GalleryCollection;

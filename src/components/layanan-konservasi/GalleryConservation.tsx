import React, { useEffect, useState } from 'react'
import conservation1 from '@/assets/conservation/conservation1.png';
import conservation2 from '@/assets/conservation/conservation2.png';
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import logo from '@/assets/MCB-Logo.png';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { assetUrl } from '@/lib/asset-url';

interface GalleryConservationProps {
  images?: string[] | string;
}

const GalleryConservation = ({ images: propImages }: GalleryConservationProps) => {
    const [images, setImages] = useState<string[]>([conservation1, conservation2]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        if (propImages) {
            let parsedImages: string[] = [];
            if (Array.isArray(propImages)) {
                parsedImages = propImages;
            } else if (typeof propImages === 'string') {
                try {
                    parsedImages = JSON.parse(propImages);
                } catch (e) {
                    // If not JSON, treat as single image if it's a path, or ignore
                    if (propImages.trim().length > 0) {
                        parsedImages = [propImages];
                    }
                }
            }

            if (parsedImages.length > 0) {
                // Map to full URLs
                const fullUrls = parsedImages.map(img => {
                    // If it's a simple filename (no slashes), assume it's an upload in conservation bucket
                    // This handles legacy data where only filename was saved
                    if (img && !img.includes('/') && !img.startsWith('http')) {
                        return `/uploads/conservation/${img}`;
                    }
                    return assetUrl(img);
                });
                setImages(fullUrls);
            }
        }
    }, [propImages]);

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
    const getImageIndex = (offset: number) => {
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
                        key={`gallery-${index}-${offset}`}
                        src={images[index] || ""}
                        alt={`gallery-${index}`}
                        onClick={() => isCenter && setSelectedImage(images[index])}
                        className={`absolute rounded-2xl object-cover cursor-pointer transition-all duration-500 ${
                            isCenter
                                ? "w-[80%] h-[95%] z-20 opacity-100"
                                : isSide
                                ? "w-[60%] h-[90%] z-10 opacity-80"
                                : isFar
                                ? "w-[50%] h-[80%] z-0 opacity-65"
                                : "hidden"
                            }
                            ${isSide ? "blur-[2px]" : ""}`
                        }
                        style={{
                            transform: `translateX(${offset * 60}%) scale(${
                                isCenter ? 1 : isSide ? 0.9 : 0.8
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
            <DialogContent className="[&>button]:hidden outline-none p-0 bg-transparent border-0 shadow-none flex justify-center items-center" aria-describedby={undefined}>
                <img
                src={selectedImage || ""}
                alt="Museum dan Cagar Budaya"
                className="rounded-xl max-h-[90vh] max-w-[90vw]x object-cover"
                />
            </DialogContent>
            </Dialog>
        </CardContent>
        </Card>
    )
}

export default GalleryConservation
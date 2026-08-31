"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
    images: string[];
    alt: string;
    className?: string;
    onImageClick?: () => void;
}

export default function ImageCarousel({ images, alt, className = "", onImageClick }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const showControls = images.length > 1;

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div className={`relative overflow-hidden group ${className}`}>
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt={`${alt} - Image ${currentIndex + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={onImageClick}
                />
            </AnimatePresence>

            {showControls && (
                <>
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "bg-white w-4" : "bg-white/40"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

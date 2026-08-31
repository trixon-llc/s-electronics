"use client";

import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 40;

export default function MachineScroll() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Bind scroll to the container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Map scroll progress (0-1) to frame index (0-39)
    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

    // Preload images
    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let loadCount = 0;

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            // Assuming images are in public/sequence/
            // Naming convention: ezgif-frame-001.jpg
            const frameNumber = (i + 1).toString().padStart(3, "0");
            img.src = `/sequence/ezgif-frame-${frameNumber}.jpg`;

            img.onload = () => {
                loadCount++;
                if (loadCount === FRAME_COUNT) {
                    setImagesLoaded(true);
                }
            };
            loadedImages.push(img);
        }
        setImages(loadedImages);
    }, []);

    // Render to canvas
    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx || !imagesLoaded || !images[index]) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const img = images[index];

        // Calculate "contain" fit
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    // Listen to scroll changes and update canvas
    useMotionValueEvent(frameIndex, "change", (latest) => {
        const index = Math.round(latest);
        if (index >= 0 && index < FRAME_COUNT) {
            requestAnimationFrame(() => renderFrame(index));
        }
    });

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                // We want the canvas to be full width of its container (which is 100% of left col on desktop)
                const parent = canvasRef.current.parentElement;
                if (parent) {
                    canvasRef.current.width = parent.clientWidth;
                    canvasRef.current.height = parent.clientHeight;
                }
                // Re-render current frame
                renderFrame(Math.round(frameIndex.get()));
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initial size

        return () => window.removeEventListener("resize", handleResize);
    }, [imagesLoaded, frameIndex]);

    return (
        <div ref={containerRef} className="relative h-[400vh] w-full bg-transparent">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                {!imagesLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center text-white/50 animate-pulse font-mono text-xs tracking-widest uppercase">
                        Loading Sequence...
                    </div>
                )}
                <canvas
                    ref={canvasRef}
                    className="block w-full h-full object-contain"
                />
            </div>
        </div>
    );
}
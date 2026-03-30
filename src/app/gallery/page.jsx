"use client";

import { Hero } from "@/components/layout/Hero";
import dynamic from "next/dynamic";
const TourSection = dynamic(() => import("@/components/layout/TourSection").then(mod => mod.TourSection));
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const galleryImages = [
  { id: 1,  src: "/assets/image 778.png",  title: "Resort Exterior",   category: "Exterior" },
  { id: 2,  src: "/assets/image 779.png",  title: "Lush Greenery",     category: "Nature"   },
  { id: 3,  src: "/assets/image 780.png",  title: "Garden Cottage",    category: "Rooms"    },
  { id: 4,  src: "/assets/image 781.png",  title: "Outdoor Seating",   category: "Exterior" },
  { id: 5,  src: "/assets/image 782.png",  title: "Resort Entrance",   category: "Exterior" },
];

const CATEGORIES = ["All", "Rooms", "Exterior", "Beach", "Nature"];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered = activeCategory === "All"
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeCategory);

  const openLightbox = (idx) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  const nextImage = () => setLightboxIndex((prev) => (prev + 1) % filtered.length);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (lightboxIndex === null) return;
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "Escape") closeLightbox();
  };

  return (
    <main className="bg-[#f8f9fa]" onKeyDown={handleKeyDown} tabIndex={-1}>
      <Hero 
        title="Gallery" 
        backgroundImage="/assets/image 778.png"
        showBookingWidget={false}
      />

      <section className="py-20 px-6 max-w-6xl mx-auto">


        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <AnimatePresence>
            {filtered.slice(0, 5).map((img, idx) => {
              // Custom span logic to match the 5-image masonry layout precisely.
              // Top row: 2 images (one larger, one smaller)
              // Bottom row: 3 images (equal size or approx)
              let colSpanClass = "md:col-span-4";
              if (idx === 0) colSpanClass = "md:col-span-7 h-64 md:h-[400px]";
              else if (idx === 1) colSpanClass = "md:col-span-5 h-64 md:h-[400px]";
              else if (idx === 2 || idx === 3 || idx === 4) colSpanClass = "md:col-span-4 h-64 md:h-[300px]";
              
              return (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className={`relative group rounded-[1.5rem] overflow-hidden shadow-md cursor-pointer ${colSpanClass}`}
                  onClick={() => openLightbox(idx)}
                >
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white font-bold text-sm drop-shadow">{img.title}</span>
                      <span className="text-white/70 text-[11px] font-semibold uppercase tracking-widest">{img.category}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-11 h-11 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-all z-10"
            >
              <X size={20} />
            </button>

            {/* Prev Button */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 md:left-10 w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-all z-10"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl w-full max-h-[80vh] flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative max-h-[72vh] w-auto h-[600px] aspect-video">
                <Image
                  src={filtered[lightboxIndex]?.src || "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80"}
                  alt={filtered[lightboxIndex]?.title || "Gallery Image"}
                  fill
                  className="rounded-2xl object-contain shadow-2xl"
                />
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-lg">{filtered[lightboxIndex]?.title}</p>
                <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mt-1">
                  {filtered[lightboxIndex]?.category} · {lightboxIndex + 1} / {filtered.length}
                </p>
              </div>
            </motion.div>

            {/* Next Button */}
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 md:right-10 w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-all z-10"
            >
              <ChevronRight size={24} />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {filtered.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                  className={`rounded-full transition-all duration-300 ${
                    i === lightboxIndex ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <TourSection />
    </main>
  );
}

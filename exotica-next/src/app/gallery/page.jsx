"use client";

import { Hero } from "@/components/layout/Hero";
import { TourSection } from "@/components/layout/TourSection";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { api } from "@/lib/apiClient";

const fallbackGalleryImages = [
  { id: 1,  src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80",  title: "Resort Exterior",   category: "Exterior" },
  { id: 2,  src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",  title: "Lush Greenery",     category: "Nature"   },
  { id: 3,  src: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80",  title: "Garden Cottage",    category: "Rooms"    },
  { id: 4,  src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80",  title: "Outdoor Seating",   category: "Exterior" },
  { id: 5,  src: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80",  title: "Deluxe Room",       category: "Rooms"    },
  { id: 6,  src: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80",  title: "Premium Suite",     category: "Rooms"    },
  { id: 7,  src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80",  title: "Agonda Beach",      category: "Beach"    },
  { id: 8,  src: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80",  title: "Beach Sunset",      category: "Beach"    },
  { id: 9,  src: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80",  title: "Tropical View",     category: "Nature"   },
  { id: 10, src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80",  title: "Garden View",       category: "Exterior" },
  { id: 11, src: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80",  title: "Ocean Terrace",     category: "Beach"    },
  { id: 12, src: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80",  title: "Forest Walk",       category: "Nature"   },
];

const CATEGORIES = ["All", "Rooms", "Interior", "Exterior", "Beach", "Nature"];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [galleryImages, setGalleryImages] = useState(fallbackGalleryImages);

  useEffect(() => {
    api.getGallery()
      .then(res => {
        const data = res?.data || res;
        if (data && data.length > 0) {
          // Map DB models to frontend format
          const mapped = data.map(img => ({
            id: img.id,
            src: img.imageUrl,
            title: img.title,
            category: img.category
          }));
          setGalleryImages(mapped);
        }
      })
      .catch(err => console.error("Failed to fetch gallery:", err));
  }, []);

  const filtered = activeCategory === "All"
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeCategory);

  const openLightbox = (idx) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  const nextImage = () => setLightboxIndex((prev) => (prev + 1) % filtered.length);

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
        backgroundImage="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80"
        showBookingWidget={false}
      />

      <section className="py-20 px-6 max-w-7xl mx-auto">

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-3 mb-14 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border-2 ${
                activeCategory === cat
                  ? "bg-[#1e81b0] text-white border-[#1e81b0] shadow-lg shadow-[#1e81b0]/20"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#1e81b0] hover:text-[#1e81b0]"
              }`}
            >
              {cat}
              <span className={`ml-2 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeCategory === cat ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {cat === "All" ? galleryImages.length : galleryImages.filter(i => i.category === cat).length}
              </span>
            </button>
          ))}
        </div>

        {/* Gallery Grid — Masonry Layout */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filtered.map((img, idx) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="relative group rounded-[2.5rem] overflow-hidden shadow-lg cursor-pointer aspect-[4/3] bg-white border border-gray-100"
                onClick={() => openLightbox(idx)}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-bold text-sm drop-shadow">{img.title}</span>
                    <span className="text-white/70 text-[11px] font-semibold uppercase tracking-widest">{img.category}</span>
                  </div>
                </div>
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-[#1e81b0] text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                    {img.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="font-medium">No images in this category.</p>
          </div>
        )}
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
              <img
                src={filtered[lightboxIndex]?.src}
                alt={filtered[lightboxIndex]?.title}
                className="max-h-[72vh] w-auto rounded-2xl object-contain shadow-2xl"
              />
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

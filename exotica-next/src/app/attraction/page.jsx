"use client";

import { Hero } from "@/components/layout/Hero";
import { TourSection } from "@/components/layout/TourSection";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, ExternalLink, Camera } from "lucide-react";

const attractions = [
  { 
    name: "Agonda Beach", 
    img: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80", 
    desc: "A quiet, spectacular beach ideal for relaxation, turtle nesting, and long sunset walks. Known as one of the most beautiful beaches in Asia.",
    distance: "1 min walk",
    tags: ["Nature", "Beach", "Peaceful"]
  },
  { 
    name: "Palolem Beach", 
    img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80", 
    desc: "Famous for its crescent shape and colorful beach shacks. A vibrant spot for kayaking and dolphin spotting trips.",
    distance: "15 min drive",
    tags: ["Kayaking", "Vibrant", "Dining"]
  },
  { 
    name: "Butterfly Beach", 
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80", 
    desc: "A hidden cove accessible only by boat or a forest trek. Perfect for privacy, spotting butterflies and playful dolphins.",
    distance: "Boat trip required",
    tags: ["Hidden Gem", "Wildlife", "Adventure"]
  },
  { 
    name: "Cabo de Rama Fort", 
    img: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80", 
    desc: "Ancient ruins steeped in mythology, offering panoramic views of the coast. A must-visit for history buffs and photographers.",
    distance: "30 min drive",
    tags: ["History", "Views", "Heritage"]
  },
  { 
    name: "Cola Beach", 
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800", 
    desc: "Features a stunning freshwater lagoon separated from the ocean by a narrow sandbar. A unique landscape in South Goa.",
    distance: "20 min drive",
    tags: ["Lagoon", "Unique", "Scenic"]
  },
  { 
    name: "Cotigao Wildlife Sanctuary", 
    img: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80", 
    desc: "Multi-layered forest canopy where you can observe exotic birds, monkeys, and the elusive forest wildlife from observation towers.",
    distance: "45 min drive",
    tags: ["Nature", "Trekking", "Birds"]
  }
];

export default function AttractionPage() {
  return (
    <main className="bg-[#f4f7f9]">
      <Hero 
        title="Attractions" 
        backgroundImage="https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80"
        showBookingWidget={false}
      />

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#1e81b0] font-black uppercase tracking-[0.2em] text-xs mb-3 block"
            >
              Beyond the Resort
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-[#1e293b] tracking-tight"
            >
              Local Attractions
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 font-medium max-w-md text-sm leading-relaxed"
          >
            Discover the vibrant culture, hidden beaches, and historical landmarks that make Agonda one of the most beloved destinations in South Goa.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {attractions.map((attraction, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500 border border-gray-50 group flex flex-col h-full"
            >
              <div className="aspect-[5/4] relative overflow-hidden">
                <img 
                  src={attraction.img} 
                  alt={attraction.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                  {attraction.tags.map(tag => (
                    <span key={tag} className="bg-white/90 backdrop-blur-md text-[#1e81b0] text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white font-bold text-xs flex items-center gap-2">
                    <Camera size={14} /> View Photos
                  </span>
                  <ArrowRight size={18} className="text-white" />
                </div>
              </div>

              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center gap-2 text-[#1e81b0]/60 mb-3">
                  <MapPin size={14} />
                  <span className="text-[11px] font-black uppercase tracking-widest">{attraction.distance}</span>
                </div>
                
                <h3 className="font-black text-2xl mb-4 text-[#1e293b] group-hover:text-[#1e81b0] transition-colors">
                  {attraction.name}
                </h3>
                
                <p className="text-gray-500 text-[15px] leading-relaxed font-medium mb-8 flex-grow">
                  {attraction.desc}
                </p>

                <button className="flex items-center gap-3 text-[#1e81b0] font-black text-xs uppercase tracking-[0.15em] hover:gap-5 transition-all w-fit">
                  Explore More <ExternalLink size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <TourSection />
    </main>
  );
}

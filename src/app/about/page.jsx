"use client";

import { Hero } from "@/components/layout/Hero";
import { TourSection } from "@/components/layout/TourSection";
import { Play, MapPin, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

export default function AboutPage() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <main className="bg-[#f9f7f2]">
      <Hero 
        title="About Us" 
        backgroundImage="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80" 
        showBookingWidget={false}
      />



      {/* Story Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Image with Blue Border */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              className="relative px-4"
            >
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-[#1e81b0] aspect-[1.4/1] relative z-10 transition-transform hover:scale-[1.02] duration-500">
                <Image 
                  src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80" 
                  alt="Resort View" 
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Right Column: Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              className="flex flex-col gap-6"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-[#f59e0b] leading-tight">
                The Exotica Agonda
              </h2>
              
              <div className="space-y-6 text-gray-700 leading-relaxed text-lg font-medium">
                <p>
                  Nestled in the heart of the serene village of Agonda, Goa, The Exotica Agonda stands as a testament to the exquisite beauty and tranquility of this coastal paradise. This boutique resort offers a sublime retreat for travelers seeking a harmonious blend of modern luxury and natural splendor. Its prime location places it in close proximity to Agonda Beach. <span className="text-[#1e81b0] font-bold">The beach is just a 1-minute walk away,</span> where the soft sands meet the gentle waves of the Arabian Sea, providing guests with a picture-perfect setting for relaxation and rejuvenation.
                </p>

                <p>
                  Accommodations at The Exotica Agonda are a true testament to the resort&apos;s commitment to providing guests with a comfortable and immersive experience. The resort offers a range of options, including Garden AC Cottages and Garden View Cottages, each thoughtfully designed with a touch of rustic charm and equipped with modern amenities. Guests can wake up to the sounds of nature, take leisurely strolls on the pristine beach, or unwind amidst the lush tropical gardens that surround the resort.
                </p>
              </div>

              <button className="bg-[#1a81b0] hover:bg-[#15648a] text-white px-10 py-4 rounded-full font-bold shadow-lg transition-all w-fit mt-4">
                View More
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Tour Section */}
      <section className="py-24 bg-[#1e293b] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#1e81b0]/10 rounded-l-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Virtual Video Tour</h2>
            <p className="text-gray-400 font-medium max-w-2xl mx-auto">Experience a day in the life at The Exotica Agonda without leaving your home.</p>
          </div>

          <div className="relative aspect-video rounded-[40px] overflow-hidden shadow-2xl group border-8 border-[#334155] bg-black">
            {!isPlaying ? (
              <>
                <Image 
                  src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1200" 
                  alt="Video Thumbnail"
                  fill
                  sizes="100vw"
                  className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    onClick={() => setIsPlaying(true)}
                    className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#1e81b0] shadow-2xl transform transition hover:scale-110 active:scale-95 group"
                  >
                    <Play size={32} fill="currentColor" className="ml-2" />
                  </button>
                </div>
              </>
            ) : (
              <iframe 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="Exotica Agonda Video Tour"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>
      </section>

      {/* Location & Maps */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-10">
              <div>
                <h2 className="text-4xl font-black text-[#1e293b] mb-6 leading-tight">Where to Find Us</h2>
                <p className="text-gray-500 font-medium">Located in the most peaceful part of South Goa, Agonda.</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-4 p-6 bg-[#f4f7f9] rounded-3xl border border-gray-100">
                  <MapPin className="text-[#1e81b0]" />
                  <span className="font-bold text-gray-700">Near Agonda Beach, Agonda, Canacona, Goa 403702</span>
                </div>
                <div className="flex items-center gap-4 p-6 bg-[#f4f7f9] rounded-3xl border border-gray-100">
                  <Phone className="text-[#1e81b0]" />
                  <span className="font-bold text-gray-700">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-4 p-6 bg-[#f4f7f9] rounded-3xl border border-gray-100">
                  <Mail className="text-[#1e81b0]" />
                  <span className="font-bold text-gray-700">info@exoticaagonda.com</span>
                </div>
              </div>
            </div>

            <div className="h-[500px] rounded-[40px] overflow-hidden shadow-2xl border-2 border-gray-100 relative group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15410.22234057636!2d73.9845344!3d15.035417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbe49735d555555%3A0x6a053f3e5b3068e!2sAgonda%20Beach!5e0!3m2!1sen!2sin!4v1710180000000!5m2!1sen!2sin" 
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700" 
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <TourSection />
    </main>
  );
}

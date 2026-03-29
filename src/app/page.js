"use client";

import { Hero } from "@/components/layout/Hero";
import { TourSection } from "@/components/layout/TourSection";
import { DestinationsSection } from "@/components/layout/DestinationsSection";
import { TestimonialCarousel } from "@/components/layout/TestimonialCarousel";
import { useRouter } from "next/navigation";
import { rooms } from "@/lib/rooms";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { RoomSkeleton } from "@/components/ui/Skeleton";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleBook = (roomId) => {
    router.push(`/booking?roomId=${roomId}`);
  };

  return (
    <>
      <Hero />
      
      <div className="bg-[#f4f7f9] pt-1">

        {/* Discover Our Rooms Section */}
        <section className="pb-24 px-6 pt-2">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#2a303c] tracking-tight">Discover Our Rooms (Limited)</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {isLoading ? (
              [...Array(6)].map((_, i) => <RoomSkeleton key={i} />)
            ) : (
              rooms.slice(0, 6).map((room) => (
                <div key={room.id} className="bg-white rounded-[40px] p-[22px] flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-50 transition-transform duration-300 hover:-translate-y-1">
                  
                  {/* Title */}
                  <h3 className="text-[17px] sm:text-[18px] font-bold text-[#334155] text-center mb-4 mt-2 tracking-tight">{room.title}</h3>
                  
                  {/* Image */}
                  <div className="w-full aspect-[4/3] rounded-[32px] overflow-hidden mb-5 relative drop-shadow-sm">
                    <Image 
                      src={room.img} 
                      alt={room.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 hover:scale-105" 
                    />
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-[14px] px-2 mb-4">
                    <span className={`${room.id % 2 === 0 ? 'bg-[#fce7f3] text-[#db2777]' : 'bg-[#d1fae5] text-[#059669]'} text-[10px] font-bold px-[12px] py-[4px] rounded-full uppercase tracking-wider`}>
                      {room.type}
                    </span>
                    <span className="text-[#94a3b8] text-[11px] font-medium tracking-wide">
                      {room.category}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between px-2 pb-2 mt-auto">
                    <span className="text-[19px] sm:text-[20px] font-bold text-[#1e293b] tracking-tight">₹{room.price}/-</span>
                    <button 
                      onClick={() => handleBook(room.id)}
                      aria-label={`Book ${room.title}`}
                      className="bg-[#147fb3] hover:bg-[#106794] text-white text-[11px] sm:text-[12px] font-bold px-5 py-[8px] rounded-full shadow-sm transition-colors tracking-wide"
                    >
                      Book Now
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      </section>
      </div>

      {/* The Exotica Agonda Description */}
      <section className="py-20 px-6 bg-[#f8f6f0] overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="rounded-[40px] overflow-hidden shadow-lg border-4 border-[#1e81b0] w-[90%] mx-auto lg:w-full relative drop-shadow-sm aspect-[4/3]">
            <Image 
              src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80" 
              alt="The Exotica Agonda Resort View" 
              fill
              sizes="(max-width: 1024px) 90vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col items-start gap-6 pt-2">
            <h2 className="text-[32px] md:text-[38px] font-bold text-[#1e81b0] leading-tight mb-2">The Exotica Agonda</h2>
            <p className="text-[#374151] leading-[1.8] text-[15px] md:text-[16px] font-medium">
              Nestled in the heart of the serene village of Agonda, Goa, The Exotica Agonda stands as a testament to the exquisite beauty and tranquility of this coastal paradise. This boutique resort offers a sublime retreat for travelers seeking a harmonious blend of modern luxury and natural splendor. Its prime location places it in close proximity to Agonda Beach.
            </p>
            <Link href="/about">
              <button className="bg-[#1e81b0] hover:bg-[#15648a] text-white px-8 py-[12px] mt-2 rounded-full font-bold shadow-sm transition-colors text-[15px]">
                View More
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Destinations You Shouldn't Miss */}
      <DestinationsSection />

      {/* Read Before You Book */}
      <section className="py-24 px-6 bg-[#f4f6f7]">
        <h2 className="text-[32px] md:text-[40px] font-bold text-[#1e81b0] text-center mb-16 tracking-tight">Read Before You Book</h2>
        
        <div className="max-w-[1000px] mx-auto flex flex-col gap-24">
          
          {/* Row 1 */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-center">
            <div className="w-full md:w-[55%] rounded-[40px] overflow-hidden shadow-lg aspect-[1.4/1] relative flex-shrink-0">
              <Image 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80" 
                alt="Garden AC Cottage Interior" 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover" 
              />
            </div>
            <div className="w-full md:w-[45%] flex flex-col gap-5 max-w-[420px]">
              <h3 className="text-[28px] md:text-[32px] font-bold text-[#0a0a0a] leading-tight">Garden AC Cottage</h3>
              <p className="text-[17px] text-[#4a5568] leading-[1.6]">
                The Exotica Agonda&apos;s Garden AC Cottage room is a sanctuary of serenity nestled amidst the lush greenery of Agonda.
              </p>
              <div className="mt-1">
                <Link href="/room/2" className="flex items-center w-fit text-[15px] font-bold text-[#2a303c] hover:text-[#1e81b0] transition-colors group">
                    <svg className="w-[18px] h-[18px] mr-2 text-[#2a303c] group-hover:text-[#1e81b0] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <rect width="24" height="24" rx="4" />
                      <path d="M10 17l5-5-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                    Read More
                </Link>
              </div>
            </div>
          </div>
          
          {/* Row 2 */}
          <div className="flex flex-col-reverse md:flex-row gap-10 md:gap-14 items-center">
            <div className="w-full md:w-[45%] flex flex-col gap-5 max-w-[420px] md:ml-auto">
              <h3 className="text-[28px] md:text-[32px] font-bold text-[#0a0a0a] leading-tight">Beach View</h3>
              <p className="text-[17px] text-[#4a5568] leading-[1.6]">
                As you step into the Garden AC Cottage room at The Exotica Agonda, you are greeted by a sense of tranquility. The room is thoughtfully designed with a fusion of contemporary elegance and rustic charm.
              </p>
              <div className="mt-1">
                <Link href="/room/3" className="flex items-center w-fit text-[15px] font-bold text-[#2a303c] hover:text-[#1e81b0] transition-colors group">
                    <svg className="w-[18px] h-[18px] mr-2 text-[#2a303c] group-hover:text-[#1e81b0] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <rect width="24" height="24" rx="4" />
                      <path d="M10 17l5-5-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                    Read More
                </Link>
              </div>
            </div>
            <div className="w-full md:w-[55%] rounded-[40px] overflow-hidden shadow-lg aspect-[1.4/1] relative flex-shrink-0">
              <Image 
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80" 
                alt="Agonda Beach View from Resort" 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover" 
              />
            </div>
          </div>
          
        </div>
      </section>

      <TestimonialCarousel />

      <TourSection />
    </>
  );
}

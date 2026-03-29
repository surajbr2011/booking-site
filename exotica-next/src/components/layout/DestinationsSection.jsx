import Image from "next/image";
import { useRef } from "react";

export function DestinationsSection() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="py-24 bg-[#f8f9fa] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-center lg:items-stretch">
          
          {/* Left Content */}
          <div className="w-full lg:w-1/3 flex flex-col justify-center py-8">
            <div>
              <h2 className="text-4xl lg:text-[44px] font-extrabold text-[#2a303c] leading-[1.2] mb-6">
                Destinations You <br className="hidden lg:block" />
                Shouldn&apos;t Miss
              </h2>
              <p className="text-gray-600 text-[17px] leading-relaxed mb-10 max-w-[280px]">
                Choose Your Destination and Contact Our Experts for the Best Deals!
              </p>
            </div>
            <div className="flex gap-3 justify-end sm:justify-start lg:justify-end w-full max-w-[340px]">
              <button 
                suppressHydrationWarning
                onClick={() => scroll("left")}
                className="w-11 h-11 rounded-lg flex items-center justify-center bg-[#9ca3af] text-white hover:bg-[#1f73b7] transition-colors shadow-sm"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button 
                suppressHydrationWarning
                onClick={() => scroll("right")}
                className="w-11 h-11 rounded-lg flex items-center justify-center bg-[#9ca3af] text-white hover:bg-[#1f73b7] transition-colors shadow-sm"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          {/* Right Cards */}
          <div 
            ref={scrollRef}
            className="w-full lg:w-2/3 flex gap-6 overflow-x-auto pb-6 pt-4 snap-x no-scrollbar scroll-smooth"
          >
            {[
              { name: "Agonda Beach", textColor: "text-black", img: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80" },
              { name: "Palelom Beach", textColor: "text-white", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80" },
              { name: "Butterfly Beach", textColor: "text-white", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80" },
              { name: "Cola Beach", textColor: "text-white", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80" }
            ].map((dest, i) => (
              <div key={i} className="min-w-[220px] lg:min-w-[240px] w-1/3 shrink-0 aspect-[1/1.55] rounded-[48px] overflow-hidden relative group cursor-pointer shadow-lg snap-start">
                <Image 
                  src={dest.img} 
                  alt={dest.name} 
                  fill
                  sizes="(max-width: 1024px) 220px, 240px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-x-0 bottom-0 p-8 flex justify-center bg-gradient-to-t from-black/20 via-transparent to-transparent">
                  <h3 className={`font-bold text-xl whitespace-nowrap ${dest.textColor} drop-shadow-md`}>{dest.name}</h3>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

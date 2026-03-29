import Image from "next/image";

export function TourSection() {
  return (
    <section className="relative py-28 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80" 
          alt="Exotica Agonda Resort Tour Background"
          fill
          className="object-cover"
        />
      </div>
      
      {/* Very light overlay to simulate the brightness of the ocean water in the image */}
      <div className="absolute inset-0 bg-white/20 z-10" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center gap-6 mt-8">
        <h2 className="text-[32px] md:text-[40px] font-bold text-[#2a303c] tracking-tight drop-shadow-sm">
          Take a Tour of The Exotica Agonda!
        </h2>
        <button className="bg-[#1e81b0] hover:bg-[#155a7a] text-white px-10 py-3 rounded-full text-[15px] font-medium transition-all shadow-md">
          Watch Now
        </button>
      </div>
    </section>
  );
}

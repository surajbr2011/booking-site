import Image from "next/image";
import { BookingWidget } from "@/components/layout/BookingWidget";

export function Hero({ 
  showBookingWidget = true, 
  compact = false,
  title = "Explore, Dream, Travel",
  backgroundImage = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80"
}) {
  return (
    <>
      <section className={`relative ${compact ? 'h-[40vh] min-h-[280px]' : 'h-[92vh] min-h-[600px]'} flex flex-col items-center justify-center pt-24 pb-32`}>
        {/* Background Image Setup */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={backgroundImage} 
            alt="Hero Background"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50/20 via-transparent to-black/40 z-20" />
        
        <div className="relative z-30 text-center px-4 w-full max-w-[1400px] mx-auto flex flex-col items-center mt-[-8vh]">
          <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] xl:text-[5.5rem] md:whitespace-nowrap font-black text-white mb-6 font-serif tracking-tight drop-shadow-2xl">
            {title}
          </h1>
        </div>
      </section>
      
      {/* Unifying the Booking Widget and its solid background structure internally across all pages */}
      {showBookingWidget && (
        <div className="bg-[#f4f7f9] pt-1">
          <BookingWidget />
        </div>
      )}
    </>
  );
}

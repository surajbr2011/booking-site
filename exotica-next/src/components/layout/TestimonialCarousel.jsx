"use client";
import { useState } from "react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "John",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
    text: "A wonderful place with a\npremium feel"
  },
  {
    id: 2,
    name: "Reema",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
    text: "A very premium stay, thankyou the\nexotica agonda."
  },
  {
    id: 3,
    name: "Sarah",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80",
    text: "Greenary surrounding is\nvery relaxing."
  },
  {
    id: 4,
    name: "Alex",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
    text: "A truly unforgettable\nexperience here."
  }
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(1);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const getLeftIndex = () => {
    return (currentIndex - 1 + testimonials.length) % testimonials.length;
  };

  const getRightIndex = () => {
    return (currentIndex + 1) % testimonials.length;
  };

  return (
    <section className="py-24 px-6 bg-[#f8f9fa] overflow-hidden relative">
      <h2 className="text-3xl md:text-[40px] font-bold text-[#1a7ca3] text-center mb-28 tracking-tight">What Customers Say About Us</h2>
      
      <div className="flex justify-center items-center w-full max-w-[1200px] mx-auto relative h-[280px]">
        
        {/* Left Hidden / Clipped Card */}
        <div 
          className="hidden md:flex absolute left-0 md:left-[5%] -translate-x-[40%] bg-white w-[400px] rounded-[36px] p-10 h-[220px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex-col items-center justify-center text-center z-0 cursor-pointer transition-all duration-500 ease-in-out hover:opacity-80"
          onClick={() => handleDotClick(getLeftIndex())}
        >
          <h4 className="font-bold text-[18px] mb-4 text-gray-900">{testimonials[getLeftIndex()].name}</h4>
          <p className="text-[#334155] text-[17px] font-medium leading-[1.6] whitespace-pre-line">
            {testimonials[getLeftIndex()].text}
          </p>
        </div>
        
        {/* Center Main Card */}
        <div className="bg-white rounded-[40px] px-8 pt-16 pb-12 shadow-[0_16px_40px_rgba(0,0,0,0.08)] flex flex-col items-center text-center relative w-[90%] md:w-[640px] md:h-[260px] flex-shrink-0 z-10 transition-all duration-500 ease-in-out">
          <div className="absolute -top-[45px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] rounded-full overflow-hidden shadow-lg z-20 transition-all duration-500">
            <Image 
              src={testimonials[currentIndex].image} 
              alt={testimonials[currentIndex].name} 
              fill
              sizes="90px"
              className="object-cover" 
            />
          </div>
          <h4 className="font-bold text-[18px] mb-6 text-[#1e293b]">{testimonials[currentIndex].name}</h4>
          <p className="text-[#1e293b] text-[18px] md:text-[21px] font-medium leading-[1.5] whitespace-pre-line transition-all duration-500">
            {testimonials[currentIndex].text}
          </p>
        </div>
        
        {/* Right Hidden / Clipped Card */}
        <div 
          className="hidden md:flex absolute right-0 md:right-[5%] translate-x-[40%] bg-white w-[400px] rounded-[36px] p-10 h-[220px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex-col items-center justify-center text-center z-0 cursor-pointer transition-all duration-500 ease-in-out hover:opacity-80"
          onClick={() => handleDotClick(getRightIndex())}
        >
          <h4 className="font-bold text-[18px] mb-4 text-gray-900">{testimonials[getRightIndex()].name}</h4>
          <p className="text-[#334155] text-[17px] font-medium leading-[1.6] whitespace-pre-line">
            {testimonials[getRightIndex()].text}
          </p>
        </div>
        
      </div>
      
      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-[10px] mt-16 pb-4">
        {testimonials.map((_, index) => (
          <button
            suppressHydrationWarning
            key={index}
            onClick={() => handleDotClick(index)}
            className={`rounded-full transition-all duration-300 ${
              currentIndex === index 
                ? "w-[28px] h-[10px] bg-[#1a7ca3]" 
                : "w-[10px] h-[10px] bg-[#1e293b]"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

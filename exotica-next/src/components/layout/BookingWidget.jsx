"use client";

import { Calendar, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

export function BookingWidget() {
  const router = useRouter();
  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);
  const [dates, setDates] = useState({
    checkIn: "",
    checkOut: ""
  });

  const handleBook = () => {
    const { checkIn, checkOut } = dates;
    const query = new URLSearchParams();
    if (checkIn) query.set("checkIn", checkIn);
    if (checkOut) query.set("checkOut", checkOut);
    
    router.push(`/booking?${query.toString()}`);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDates(prev => ({ ...prev, [name]: value }));
    
    // Auto-open check-out after check-in is selected
    if (name === "checkIn" && value) {
      setTimeout(() => {
        if (checkOutRef.current) {
          if (typeof checkOutRef.current.showPicker === 'function') {
            checkOutRef.current.showPicker();
          } else {
            checkOutRef.current.click();
          }
        }
      }, 100);
    }
  };

  const handleCenterIconClick = () => {
    if (checkInRef.current) {
      if (typeof checkInRef.current.showPicker === 'function') {
        checkInRef.current.showPicker();
      } else {
        checkInRef.current.click();
      }
    }
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="relative -mt-24 md:-mt-[176px] z-30 max-w-[940px] mx-auto px-4 sm:px-6 mb-16 drop-shadow-[0_16px_32px_rgba(0,0,0,0.15)] font-sans">
      <div className="flex flex-col">

        {/* Top Tab Fragment */}
        <div className="flex items-end relative z-10 w-fit">
          <div className="bg-white/35 backdrop-blur-[24px] rounded-t-[28px] px-[28px] pt-[22px] pb-[30px] border border-b-0 border-white/50 translate-y-[1px]">
            <div className="bg-[#0b7fb5] text-white px-6 py-[9px] rounded-full font-semibold flex items-center justify-center gap-[6px] text-[15px] shadow-sm tracking-wide">
              <Building2 className="w-[18px] h-[18px]" strokeWidth={2} /> Hotel
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/35 backdrop-blur-[24px] rounded-[36px] rounded-tl-none p-[26px] sm:p-[22px] flex flex-col md:flex-row gap-6 lg:gap-8 items-center border border-white/50 relative z-20 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">

          {/* White Input Section (Split Background) */}
          <div 
            className="relative flex-1 w-full rounded-[24px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-gray-100/50 flex flex-row h-[100px] sm:h-[110px] group"
          >

            {/* Check In Side */}
            <label className="flex-1 flex flex-col relative w-1/2 cursor-pointer">
              <div className="absolute inset-x-0 top-0 h-1/2 bg-[#f4f7f9]" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white" />
              <div className="relative z-10 flex flex-col h-full pl-[30px] lg:pl-[44px] justify-center">
                <div className="h-1/2 flex items-end pb-[4px]">
                  <span className="text-[#64748b] font-medium text-[13.5px] tracking-wide">Check In</span>
                </div>
                <div className="h-1/2 flex items-start pt-[6px] relative min-h-[30px]">
                  {/* Native input is invisible but covers the area */}
                  <input 
                    ref={checkInRef}
                    type="date"
                    name="checkIn"
                    value={dates.checkIn}
                    onChange={handleDateChange}
                    onClick={(e) => typeof e.target.showPicker === 'function' && e.target.showPicker()}
                    className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                  />
                  {/* Display layer */}
                  <span className="text-[#1e293b] font-bold text-[18px] sm:text-[20px] pointer-events-none z-10 whitespace-nowrap">
                    {formatDisplayDate(dates.checkIn) || "Select Date"}
                  </span>
                </div>
              </div>
            </label>

            {/* Check Out Side */}
            <label className="flex-1 flex flex-col relative w-1/2 cursor-pointer border-l border-gray-100">
              <div className="absolute inset-x-0 top-0 h-1/2 bg-[#f4f7f9]" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white" />
              <div className="relative z-10 flex flex-col h-full pl-[46px] lg:pl-[64px] justify-center">
                <div className="h-1/2 flex items-end pb-[4px]">
                  <span className="text-[#64748b] font-medium text-[13.5px] tracking-wide">Check Out</span>
                </div>
                <div className="h-1/2 flex items-start pt-[6px] relative min-h-[30px]">
                  <input 
                    ref={checkOutRef}
                    type="date"
                    name="checkOut"
                    value={dates.checkOut}
                    onChange={handleDateChange}
                    onClick={(e) => typeof e.target.showPicker === 'function' && e.target.showPicker()}
                    min={dates.checkIn ? new Date(new Date(dates.checkIn).getTime() + 86400000).toISOString().split('T')[0] : ""}
                    className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                  />
                  <span className="text-[#1e293b] font-bold text-[18px] sm:text-[20px] pointer-events-none z-10 whitespace-nowrap">
                    {formatDisplayDate(dates.checkOut) || "Select Date"}
                  </span>
                </div>
              </div>
            </label>

            {/* Middle Divider */}
            <div 
              onClick={handleCenterIconClick}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center cursor-pointer"
            >
              <div className="w-[62px] h-[62px] sm:w-[68px] sm:h-[68px] rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="w-[44px] h-[44px] sm:w-[46px] sm:h-[46px] rounded-full border border-[1.5px] border-gray-200 flex items-center justify-center text-[#8e9faf] bg-white group-hover:text-[#0b7fb5] group-hover:border-[#0b7fb5] transition-colors">
                  <Calendar className="w-5 h-5 sm:w-[20px] sm:h-[20px]" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>

          {/* Book Button */}
          <button 
            onClick={handleBook}
            disabled={!dates.checkIn || !dates.checkOut}
            className={cn(
              "w-full md:w-[150px] lg:w-[170px] whitespace-nowrap shrink-0 border-[2px] rounded-full text-[17px] sm:text-[18px] font-bold h-[56px] sm:h-[64px] transition-all shadow-sm tracking-wide",
              (!dates.checkIn || !dates.checkOut) 
                ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed opacity-70" 
                : "border-[#0b7fb5] text-[#0b7fb5] bg-white hover:bg-[#0b7fb5] hover:text-white active:scale-95"
            )}
          >
            Book
          </button>

        </div>
      </div>
    </div>
  );
}


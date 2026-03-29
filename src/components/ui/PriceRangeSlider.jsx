"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function PriceRangeSlider({ min = 3000, max = 6000, onChange, className }) {
  const [value, setValue] = useState(min);

  const handleChange = (e) => {
    const val = Number(e.target.value);
    setValue(val);
    if (onChange) onChange(val);
  };

  return (
    <div className={cn("w-full max-w-[300px] flex flex-col gap-5", className)}>
      <h4 className="text-[#8492a6] text-[14px] font-[900] uppercase tracking-[0.15em] mb-1">
        Price Range
      </h4>
      
      <div className="relative w-full flex items-center">
        <input 
          type="range" 
          min={min} 
          max={max} 
          step={100}
          value={value}
          onChange={handleChange}
          style={{ background: `linear-gradient(to right, #1e81b0 ${((value - min) / (max - min)) * 100}%, #f4f5f7 ${((value - min) / (max - min)) * 100}%)` }}
          className="w-full h-[10px] rounded-full appearance-none cursor-pointer border border-[#cbd5e1]
                     outline-none
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-[22px] 
                     [&::-webkit-slider-thumb]:h-[22px] 
                     [&::-webkit-slider-thumb]:bg-[#1e81b0] 
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:shadow-md
                     [&::-moz-range-thumb]:w-[22px] 
                     [&::-moz-range-thumb]:h-[22px] 
                     [&::-moz-range-thumb]:bg-[#1e81b0] 
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:border-none"
        />
      </div>

      <div className="flex justify-between items-center text-[#8492a6] font-[800] text-[15px]">
        <span>₹{min}</span>
        <span>₹{max}</span>
      </div>
      
      {/* Selected Value Helper (Uncomment if needed) */}
      {/* <div className="text-center text-[#1e81b0] font-bold text-sm">Selected: ₹{value}</div> */}
    </div>
  );
}

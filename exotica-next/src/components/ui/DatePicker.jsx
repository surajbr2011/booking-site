"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const DatePicker = forwardRef(({ className, label, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm text-gray-500 font-semibold px-2">{label}</label>}
      <div className="relative">
        <input
          type="date"
          className={cn(
            "flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e81b0] focus-visible:border-transparent transition-colors shadow-sm cursor-pointer hover:border-[#1e81b0]",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    </div>
  );
});

DatePicker.displayName = "DatePicker";

export { DatePicker };

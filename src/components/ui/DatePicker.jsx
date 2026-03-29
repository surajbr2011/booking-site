"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

const DatePicker = forwardRef(({ className, label, error, ...props }, ref) => {
  const id = useId();
  const errorId = `${id}-error`;
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col gap-1 w-full relative">
      {label && <label htmlFor={id} className="text-sm text-gray-500 font-semibold px-2">{label}</label>}
      <div className="relative">
        <input
          id={id}
          type="date"
          min={props.min || today}
          className={cn(
            "flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e81b0] focus-visible:border-transparent transition-colors shadow-sm cursor-pointer hover:border-[#1e81b0]",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
          ref={ref}
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} className="text-red-500 text-xs mt-1 lg:absolute lg:-bottom-5 flex items-center gap-1 px-2 whitespace-nowrap">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
});

DatePicker.displayName = "DatePicker";

export { DatePicker };

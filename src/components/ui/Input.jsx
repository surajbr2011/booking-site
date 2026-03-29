import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

const Input = forwardRef(({ className, type, label, error, ...props }, ref) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1 w-full relative">
      {label && <label htmlFor={id} className="text-sm text-gray-500 font-semibold px-2">{label}</label>}
      <input
        id={id}
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e81b0] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        ref={ref}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-red-500 text-xs mt-1 lg:absolute lg:-bottom-5 flex items-center gap-1 px-2 whitespace-nowrap">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };

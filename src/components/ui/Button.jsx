import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Button = forwardRef(({ className, variant = "primary", size = "default", ...props }, ref) => {
  const variants = {
    primary: "bg-[#1e81b0] text-white hover:bg-[#063970]",
    outline: "bg-transparent border-2 border-[#1e81b0] text-[#1e81b0] hover:bg-[#1e81b0] hover:text-white",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  };

  const sizes = {
    default: "py-3 px-6",
    sm: "py-2 px-4 text-sm",
    lg: "py-4 px-8 text-lg",
    icon: "p-2",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };

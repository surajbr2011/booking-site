"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [isOpen, setIsOpen] = useState(false);
  const isLightPage = pathname === "/booking";

  if (isAdmin) return null;

  return (
    <header suppressHydrationWarning className={cn(
      "absolute top-0 w-full z-50 px-6 py-6 flex justify-between items-center transition-colors duration-300",
      isLightPage ? "text-[#1e293b]" : "text-white"
    )}>

      <div className="flex items-center gap-2">
        <Logo variant={isLightPage ? "dark" : "light"} />
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6 lg:gap-8 mr-12 mt-2">
        <Link href="/" className={cn("hover:text-[#1e81b0] transition-colors font-bold text-[14px] tracking-wide", isLightPage ? "text-[#1e293b]" : "text-white")}>Home</Link>
        <Link href="/about" className={cn("hover:text-[#1e81b0] transition-colors font-medium text-[14px] tracking-wide", isLightPage ? "text-[#1e293b]" : "text-white")}>About us</Link>
        <Link href="/room" className={cn("hover:text-[#1e81b0] transition-colors font-medium text-[14px] tracking-wide", isLightPage ? "text-[#1e293b]" : "text-white")}>Room</Link>
        <Link href="/gallery" className={cn("hover:text-[#1e81b0] transition-colors font-medium text-[14px] tracking-wide", isLightPage ? "text-[#1e293b]" : "text-white")}>Gallery</Link>
        <Link href="/attraction" className={cn("hover:text-[#1e81b0] transition-colors font-medium text-[14px] tracking-wide", isLightPage ? "text-[#1e293b]" : "text-white")}>Attraction</Link>
        <Link href="/contact" className={cn("hover:text-[#1e81b0] transition-colors font-medium text-[14px] tracking-wide whitespace-nowrap", isLightPage ? "text-[#1e293b]" : "text-white")}>Contact Us</Link>
      </nav>

      {/* Mobile Menu Button */}
      <button 
        suppressHydrationWarning
        className={cn("md:hidden z-50", isLightPage ? "text-[#1e293b]" : "text-white")}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 w-full h-screen bg-black/95 flex flex-col items-center justify-center gap-8 -z-10"
          >
            <Link href="/" onClick={() => setIsOpen(false)} className="text-2xl hover:text-[#1e81b0] transition-colors">Home</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="text-2xl hover:text-[#1e81b0] transition-colors">About Us</Link>
            <Link href="/room" onClick={() => setIsOpen(false)} className="text-2xl hover:text-[#1e81b0] transition-colors">Room</Link>
            <Link href="/gallery" onClick={() => setIsOpen(false)} className="text-2xl hover:text-[#1e81b0] transition-colors">Gallery</Link>
            <Link href="/attraction" onClick={() => setIsOpen(false)} className="text-2xl hover:text-[#1e81b0] transition-colors">Attraction</Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} className="text-2xl hover:text-[#1e81b0] transition-colors">Contact Us</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

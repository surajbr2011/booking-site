"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Twitter, Facebook, Youtube, Chrome } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [enquiry, setEnquiry] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!enquiry.trim()) return;

    // Create new inquiry object
    const newInquiry = {
      id: Date.now(),
      name: "Anonymous (Footer)",
      email: "N/A",
      phone: "N/A",
      subject: "Quick Footer Enquiry",
      message: enquiry,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    // Save to localStorage
    const existingInquiries = JSON.parse(localStorage.getItem("inquiries") || "[]");
    localStorage.setItem("inquiries", JSON.stringify([newInquiry, ...existingInquiries]));

    alert("Message sent successfully!");
    setEnquiry("");
  };

  if (isAdmin) return null;

  return (
    <footer className="bg-[#f4f6f7]">

      <div className="max-w-[1400px] mx-auto px-6 py-20 flex flex-col lg:flex-row gap-12 lg:gap-8 justify-between">
        
        {/* Stay Connected */}
        <div className="flex flex-col gap-5 max-w-xs">
          <h4 className="text-xl font-bold text-[#2a303c] mb-1">Stay Connected</h4>
          <p className="text-[15px] text-[#4a5568] leading-snug">
            Val 101/5 - Agonda Beach Rd, Agonda,<br />
            Goa 403702.
          </p>
          <p className="text-[15px] text-[#4a5568]">
            Phone: +91-8088369946
          </p>
          
          <div className="mt-4">
            <h5 className="font-bold text-[15px] mb-3 text-[#2a303c]">Follow us on social media</h5>
            <div className="flex gap-2.5">
              {[
                { icon: <Instagram key="insta" className="w-4 h-4 text-white" />, href: "https://www.instagram.com" },
                { icon: <Twitter key="twit" className="w-4 h-4 text-white" />, href: "https://twitter.com" },
                { icon: <Facebook key="fb" className="w-4 h-4 text-white" />, href: "https://www.facebook.com" },
                { icon: <Youtube key="yt" className="w-4 h-4 text-white" />, href: "https://www.youtube.com" },
                { icon: <Chrome key="google" className="w-4 h-4 text-white" />, href: "https://www.google.com" }
              ].map((item, idx) => (
                <Link key={idx} href={item.href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-[#2a303c] rounded-[6px] flex items-center justify-center hover:bg-[#1e81b0] transition-colors">
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xl font-bold text-[#2a303c] mb-2">Quick Links</h4>
          <nav className="flex flex-col gap-3.5 mt-1">
            <Link href="#about" className="text-[15px] text-[#4a5568] hover:text-[#1e81b0] transition-colors">About Us</Link>
            <Link href="#room" className="text-[15px] text-[#4a5568] hover:text-[#1e81b0] transition-colors">Rooms</Link>
            <Link href="#attractions" className="text-[15px] text-[#4a5568] hover:text-[#1e81b0] transition-colors">Attractions</Link>
            <Link href="#gallery" className="text-[15px] text-[#4a5568] hover:text-[#1e81b0] transition-colors">Gallery</Link>
            <Link href="#policies" className="text-[15px] text-[#4a5568] hover:text-[#1e81b0] transition-colors">Policies</Link>
          </nav>
        </div>

        {/* On Instagram */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xl font-bold text-[#2a303c] mb-2">On Instagram</h4>
          <div className="grid grid-cols-3 gap-3 mt-1">
            {[
              "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80"
            ].map((imgUrl, i) => (
              <div key={i} className="w-[60px] h-[60px] md:w-[68px] md:h-[68px] rounded-full overflow-hidden shadow-sm">
                <img src={imgUrl} alt="Instagram post" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Enquiry */}
        <div className="flex flex-col gap-4 w-full md:max-w-xs">
          <h4 className="text-xl font-bold text-[#2a303c] mb-2">Enquiry</h4>
          <div className="mt-1 flex flex-col gap-4">
            <p className="text-[15px] text-[#4a5568]">Get Response Within 24hrs.</p>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Type Here..!" 
                value={enquiry}
                onChange={(e) => setEnquiry(e.target.value)}
                className="w-full px-5 py-3 rounded-full border border-gray-300 bg-white placeholder:italic placeholder:text-gray-300 text-[15px] focus:outline-none focus:border-[#1e81b0] focus:ring-1 focus:ring-[#1e81b0]"
                required
              />
              <button 
                type="submit" 
                className="w-full bg-[#1e81b0] text-white text-[15px] font-medium py-3 rounded-full hover:bg-[#155a7a] transition-colors focus:outline-none"
              >
                Send
              </button>
            </form>
          </div>
        </div>

      </div>
      
      {/* Copyright Bar */}
      <div className="bg-[#2a303c] text-gray-300 text-center py-3 text-[13px] border-t border-[#3a4150]">
        <p>Copyright © The Exotica Agonda 2026 . All rights reserved.</p>
      </div>
    </footer>
  );
}


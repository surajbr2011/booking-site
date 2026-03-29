"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Hero } from "@/components/layout/Hero";
import Image from "next/image";

export default function ContactPage() {
  const searchParams = useSearchParams();
  const roomName = searchParams.get("room");
  const inquiryType = searchParams.get("type"); // "book" | "inquire" | null

  const defaultInterest = roomName
    ? inquiryType === "book"
      ? `I'd like to book the ${roomName}`
      : `I'd like to inquire about the ${roomName}`
    : "";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    interest: defaultInterest,
  });
  const [phoneError, setPhoneError] = useState(false);

  // Sync with URL params if they change while the component is mounted
  useEffect(() => {
    if (roomName) {
      const interest = inquiryType === "book"
        ? `I'd like to book the ${roomName}`
        : `I'd like to inquire about the ${roomName}`;
      setFormData(prev => ({ ...prev, interest }));
    }
  }, [roomName, inquiryType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "phone") {
      setPhoneError(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const phoneRegex = /^[+]?[\d\s\-().]{7,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      setPhoneError(true);
      return;
    }
    // Create new inquiry object
    const newInquiry = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: "New Website Inquiry",
      message: formData.interest,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    // Save to localStorage for demo purposes
    const existingInquiries = JSON.parse(localStorage.getItem("inquiries") || "[]");
    localStorage.setItem("inquiries", JSON.stringify([newInquiry, ...existingInquiries]));

    alert("Message sent successfully!");
    setFormData({
      name: "",
      phone: "",
      email: "",
      interest: "",
    });
  };

  return (
    <>
      <Hero 
        title="Contact Us" 
        backgroundImage="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=2000"
        showBookingWidget={false}
      />

      <section className="relative flex items-center justify-center px-4 py-24 min-h-[700px]">
        {/* Optimized Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=2000" 
            alt="Contact Us Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/10 z-0" />

        {/* Contact Card */}
        <div className="relative z-10 w-full max-w-[420px] mx-auto">
          <div
            className="rounded-3xl p-8 shadow-2xl text-white"
            style={{ backgroundColor: "rgba(14, 120, 170, 0.92)" }}
          >
            <h2 className="text-[28px] font-bold mb-1">
              {inquiryType === "book" ? "Book Your Stay" : inquiryType === "inquire" ? "Inquire Now" : "Contact Us"}
            </h2>
            <p className="text-sm mb-7 opacity-90">
              {roomName
                ? `You're enquiring about: ${roomName}`
                : "Break the ice! Let us help you out"}
            </p>

            <form className="flex flex-col gap-0" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="border-b border-white/40 pb-3 mb-5">
                <label className="block text-[13.5px] font-medium opacity-90 mb-1">
                  What's your name?*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent focus:outline-none text-white placeholder:text-white/40 text-[15px]"
                  required
                />
              </div>

              {/* Phone */}
              <div className="border-b border-white/40 pb-3 mb-1">
                <label className="block text-[13.5px] font-medium opacity-90 mb-1">
                  What's your phone number?*
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-transparent focus:outline-none text-white placeholder:text-white/40 text-[15px]"
                  required
                />
              </div>
              {phoneError && (
                <p className="text-[11px] opacity-80 mb-4 mt-1">
                  Please enter a valid phone number.
                </p>
              )}
              {!phoneError && <div className="mb-4" />}

              {/* Email */}
              <div className="border-b border-white/40 pb-3 mb-5">
                <label className="block text-[13.5px] font-medium opacity-90 mb-1">
                  Whats your email?
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent focus:outline-none text-white placeholder:text-white/40 text-[15px]"
                />
              </div>

              {/* Interest */}
              <div className="border-b border-white/40 pb-3 mb-8">
                <label className="block text-[13.5px] font-medium opacity-90 mb-1">
                  Describe your interest
                </label>
                <input
                  type="text"
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className="w-full bg-transparent focus:outline-none text-white placeholder:text-white/40 text-[15px]"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-white text-gray-800 font-semibold py-4 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all text-[16px] tracking-wide"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Hero } from "@/components/layout/Hero";
import Image from "next/image";
import { api } from "@/lib/apiClient";
import { Loader2, CheckCircle2 } from "lucide-react";

function ContactFormContent({ roomName, inquiryType }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    interest: roomName
      ? inquiryType === "book"
        ? `I'd like to book the ${roomName}`
        : `I'd like to inquire about the ${roomName}`
      : "",
  });
  const [phoneError, setPhoneError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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
    if (name === "phone") setPhoneError(false);
    setSubmitError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneRegex = /^[+]?[\d\s\-().]{7,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      setPhoneError(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await api.submitContact({
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone,
        message: formData.interest || "General inquiry from website",
      });

      const newId = res?.data?.id;
      if (newId) {
        let existing = [];
        try { existing = JSON.parse(localStorage.getItem('exotica_inquiries') || '[]'); } catch (e) {}
        existing.push(newId);
        localStorage.setItem('exotica_inquiries', JSON.stringify(existing));
      }

      setIsSuccess(true);
      setFormData({ name: "", phone: "", email: "", interest: "" });

      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setSubmitError("Failed to send your message. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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

      {isSuccess ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
          <p className="text-white/80 text-sm">
            We&apos;ve received your inquiry and will get back to you shortly.
          </p>
        </div>
      ) : (
        <form className="flex flex-col gap-0" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="border-b border-white/40 pb-3 mb-5">
            <label className="block text-[13.5px] font-medium opacity-90 mb-1">
              What&apos;s your name?*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-white placeholder:text-white/40 text-[15px]"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Phone */}
          <div className="border-b border-white/40 pb-3 mb-1">
            <label className="block text-[13.5px] font-medium opacity-90 mb-1">
              What&apos;s your phone number?*
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-white placeholder:text-white/40 text-[15px]"
              required
              disabled={isSubmitting}
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
              What&apos;s your email?
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-white placeholder:text-white/40 text-[15px]"
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>

          {submitError && (
            <p className="text-red-200 text-xs mb-4 bg-red-500/20 p-3 rounded-xl">
              {submitError}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-gray-800 font-semibold py-4 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all text-[16px] tracking-wide disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Sending...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      )}
    </div>
  );
}

function ContactParamsWrapper() {
  const searchParams = useSearchParams();
  const roomName = searchParams.get("room");
  const inquiryType = searchParams.get("type");
  
  return <ContactFormContent roomName={roomName} inquiryType={inquiryType} />;
}

export default function ContactPage() {
  return (
    <>
      <Hero
        title="Contact Us"
        backgroundImage="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=2000"
        showBookingWidget={false}
      />

      <section className="relative flex items-center justify-center px-4 py-24 min-h-[700px]">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=2000"
            alt="Contact Us Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/10 z-0" />

        <div className="relative z-10 w-full max-w-[420px] mx-auto">
          <Suspense fallback={<div className="bg-sky-700/80 p-12 rounded-3xl h-[600px] flex items-center justify-center"><Loader2 className="animate-spin text-white" size={40} /></div>}>
            <ContactParamsWrapper />
          </Suspense>
        </div>
      </section>
    </>
  );
}

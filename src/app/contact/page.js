import { Suspense } from "react";
import { Hero } from "@/components/layout/Hero";
import Image from "next/image";
import ContactForm from "@/components/contact/ContactForm"; // We will create this

export const dynamic = 'force-dynamic';

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
          <Suspense fallback={<div className="text-white p-10 bg-black/20 rounded-3xl">Loading contact form...</div>}>
            <ContactForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}

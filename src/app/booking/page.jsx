"use client";

import { BookingWizard } from "@/components/booking/BookingWizard";

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-[#f4f7f9] pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-[#1e293b] mb-4">Book Your Stay</h1>
          <p className="text-gray-500 font-medium">Complete the steps below to confirm your reservation at The Exotica Agonda.</p>
        </div>
        
        <BookingWizard />
      </div>
    </main>
  );
}

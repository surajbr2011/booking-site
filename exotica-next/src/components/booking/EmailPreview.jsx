"use client";

import { Mail, Calendar, MapPin, Phone, ShieldCheck, Printer } from "lucide-react";
import { motion } from "framer-motion";

export function EmailPreview({ data, room, nights, totalPrice }) {
  return (
    <div className="bg-white border rounded-[32px] overflow-hidden shadow-sm max-w-2xl mx-auto font-sans text-left">
      {/* Email Header */}
      <div className="bg-[#1e81b0] p-8 text-white text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
          <Mail size={32} />
        </div>
        <h1 className="text-2xl font-black mb-2">Booking Confirmed!</h1>
        <p className="text-white/80 font-medium">Reservation ID: EXO-3948572</p>
      </div>

      {/* Email Body */}
      <div className="p-8 space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-800">Hi {data.firstName},</h2>
          <p className="text-gray-500 leading-relaxed font-medium">
            Your stay at The Exotica Agonda is confirmed. We&apos;re getting everything ready for your arrival. Here&apos;s a summary of your reservation.
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#f8fafc] p-5 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2 text-[#1e81b0] mb-2">
              <Calendar size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Check In</span>
            </div>
            <p className="font-black text-gray-700">{data.checkIn}</p>
            <p className="text-xs text-gray-400 font-medium">After 2:00 PM</p>
          </div>
          <div className="bg-[#f8fafc] p-5 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2 text-[#1e81b0] mb-2">
              <Calendar size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Check Out</span>
            </div>
            <p className="font-black text-gray-700">{data.checkOut}</p>
            <p className="text-xs text-gray-400 font-medium1">Before 11:00 AM</p>
          </div>
        </div>

        {/* Room Info */}
        <div className="flex gap-4 p-5 bg-[#f8fafc] rounded-2xl border border-gray-100">
          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 border-white shadow-sm">
            <img src={room?.img} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="font-black text-gray-800">{room?.title}</h3>
            <p className="text-sm text-gray-500 font-medium">{nights} Nights • {data.guests} Guest(s)</p>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 pt-4 border-t border-dashed border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Total Paid</span>
            <span className="font-black text-[#1e81b0] text-lg">₹{totalPrice}</span>
          </div>
          <div className="bg-blue-50/50 p-3 rounded-xl flex items-center gap-3 text-blue-700">
            <ShieldCheck size={18} />
            <span className="text-[11px] font-bold">Paid securely via Razorpay</span>
          </div>
        </div>

        {/* Footer Info */}
        <div className="pt-8 space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Location</h4>
              <p className="text-xs font-bold text-gray-600 flex items-start gap-2">
                <MapPin size={12} className="shrink-0 mt-0.5" />
                Agonda Beach, Canacona, Goa 403702
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Contact</h4>
              <p className="text-xs font-bold text-gray-600 flex items-start gap-2">
                <Phone size={12} className="shrink-0 mt-0.5" />
                +91 98765 43210
              </p>
            </div>
          </div>
          
          <div className="text-center pt-8">
            <button className="text-[#1e81b0] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 mx-auto hover:gap-4 transition-all">
              <Printer size={14} /> Download PDF Receipt
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-[#f1f5f9] p-6 text-center">
        <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Questions about your stay?</p>
        <div className="flex justify-center gap-4">
          <a href="#" className="text-[10px] font-black text-[#1e81b0] uppercase tracking-widest underline">Manage Booking</a>
          <a href="#" className="text-[10px] font-black text-[#1e81b0] uppercase tracking-widest underline">Help Center</a>
        </div>
      </div>
    </div>
  );
}

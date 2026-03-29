import { useState } from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { EmailPreview } from "@/components/booking/EmailPreview";

export function BookingSuccess({ formData, selectedRoom, nights, totalPrice }) {
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-[40px] p-10 md:p-16 text-center shadow-xl border border-gray-100 mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-sm">
          <Check className="w-10 h-10 text-green-500" strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-black text-[#1e293b] mb-4">You&apos;re All Set!</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto font-medium">
          Your booking at The Exotica Agonda has been confirmed. You will receive an email shortly with your full itinerary.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button 
            onClick={() => setShowEmailPreview(false)}
            className={cn(
              "flex-1 py-4 rounded-3xl font-bold transition-all border-2",
              !showEmailPreview ? "bg-[#1e81b0] text-white border-[#1e81b0]" : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
            )}
          >
            View Receipt
          </button>
          <button 
            onClick={() => setShowEmailPreview(true)}
            className={cn(
              "flex-1 py-4 rounded-3xl font-bold transition-all border-2",
              showEmailPreview ? "bg-[#1e81b0] text-white border-[#1e81b0]" : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
            )}
          >
            Preview Confirmation Email
          </button>
        </div>

        {!showEmailPreview ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#f8fafc] rounded-3xl p-8 text-left border border-gray-100/50"
          >
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200/50">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Booking Receipt</span>
              <span className="text-lg font-black text-[#1e81b0]">Ref: EXO-39485</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Guest Name</span>
                <span className="text-gray-800 font-bold">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Room Type</span>
                <span className="text-gray-800 font-bold">{selectedRoom?.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Guests</span>
                <span className="text-gray-800 font-bold">{formData.guests} {formData.guests === 1 ? 'Guest' : 'Guests'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Stay Duration</span>
                <span className="text-gray-800 font-bold">{nights} Nights</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-lg font-black text-[#1e293b]">Total Amount Paid</span>
                <span className="text-2xl font-black text-[#1e81b0]">₹{totalPrice}</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <EmailPreview data={formData} room={selectedRoom} nights={nights} totalPrice={totalPrice} />
          </motion.div>
        )}
      </div>
      
      <Button onClick={() => window.location.href = '/'} className="w-full bg-[#1e81b0] py-5 text-lg shadow-xl shadow-[#1e81b0]/20 rounded-3xl">
        Return to Home
      </Button>
    </motion.div>
  );
}

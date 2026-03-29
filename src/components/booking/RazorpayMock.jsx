"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export function RazorpayMock({ amount, isOpen, onClose, onSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#1e1e2e] p-6 text-white flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-[10px] font-bold italic">R</span>
                </div>
                <span className="text-sm font-bold opacity-80 uppercase tracking-widest text-[10px]">Razorpay Checkout</span>
              </div>
              <h2 className="text-xl font-bold">The Exotica Agonda</h2>
              <p className="text-xs opacity-60">Booking Reference: EXO-39485</p>
            </div>
            <button onClick={onClose} className="hover:bg-white/10 p-1 rounded transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Amount to Pay</span>
              <span className="text-2xl font-black text-gray-900">₹{amount}</span>
            </div>

            <div className="space-y-4 mb-8">
              <div className="p-4 border-2 border-blue-600 rounded-xl bg-blue-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCardIcon />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-900">Cards, UPI & More</p>
                    <p className="text-[10px] text-blue-600 font-medium tracking-wide">Select your preferred method</p>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full border-4 border-blue-600" />
              </div>
            </div>

            <button 
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full bg-[#339af0] hover:bg-[#228be6] text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Pay ₹{amount}</span>
              )}
            </button>
            
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 grayscale brightness-150 opacity-40">
              <ShieldCheck size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">PCI DSS Compliant Secure Checkout</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function CreditCardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-blue-600" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
  );
}
